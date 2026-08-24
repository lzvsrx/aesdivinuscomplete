#include "aes_divinus_core.hpp"

namespace aes_divinus {

namespace {
int clamp_int(int value, int min_value, int max_value) {
  return std::max(min_value, std::min(max_value, value));
}
}  // namespace

Rng::Rng(uint32_t seed) : seed_(seed) {}

double Rng::next() {
  seed_ = (1664525u * seed_) + 1013904223u;
  return static_cast<double>(seed_) / 4294967296.0;
}

int Rng::integer(int min, int max) {
  return static_cast<int>(next() * (max - min + 1)) + min;
}

const Weapon* CombatRules::weapon_for(const std::string& id) const {
  auto it = weapons.find(id);
  return it == weapons.end() ? nullptr : &it->second;
}

const Armor* CombatRules::armor_for(const std::string& id) const {
  auto it = armors.find(id);
  return it == armors.end() ? nullptr : &it->second;
}

const FearState* CombatRules::fear_for(const std::string& id) const {
  auto it = fear_states.find(id);
  if (it != fear_states.end()) return &it->second;
  auto steady = fear_states.find("steady");
  return steady == fear_states.end() ? nullptr : &steady->second;
}

int CombatRules::courage_modifier(const Unit& unit) const {
  if (unit.courage >= 80) return 3;
  if (unit.courage >= 65) return 2;
  if (unit.courage >= 50) return 0;
  if (unit.courage >= 35) return -2;
  return -4;
}

int CombatRules::distance(const Unit& attacker, const Unit& target) const {
  const int lane_distance = std::abs(attacker.position - target.position);
  const int side_gap = attacker.side == target.side ? 0 : 1;
  return lane_distance + side_gap;
}

int CombatRules::initiative(const Unit& unit) const {
  const Armor* armor = armor_for(unit.armor);
  const FearState* fear = fear_for(unit.fear);
  const int strength_penalty = armor && unit.strength < armor->strength_req ? -2 : 0;
  return unit.agility + courage_modifier(unit) + (armor ? armor->initiative : 0) +
         (fear ? fear->initiative : 0) + strength_penalty + (unit.inspired ? 2 : 0);
}

int CombatRules::hit_chance(const Unit& attacker, const Unit& target) const {
  const Weapon* weapon = weapon_for(attacker.weapon);
  const Armor* target_armor = armor_for(target.armor);
  const FearState* fear = fear_for(attacker.fear);
  if (!weapon) return 8;
  const int range_penalty = std::max(0, distance(attacker, target) - weapon->range) * 12;
  const int base = 68 + attacker.agility * 2 + weapon->accuracy + (fear ? fear->accuracy : 0) -
                   target.agility - target.defense - (target_armor ? target_armor->defense : 0) -
                   range_penalty;
  return clamp_int(base, 8, 95);
}

int CombatRules::damage_roll(const Unit& attacker, const Unit& target, Rng& rng) const {
  const Weapon* weapon = weapon_for(attacker.weapon);
  const Armor* armor = armor_for(target.armor);
  if (!weapon) return 1;
  int mitigation = 0;
  if (armor) {
    auto it = armor->mitigation.find(weapon->type);
    mitigation = it == armor->mitigation.end() ? 0 : it->second;
  }
  const int guard_mitigation = target.guard ? 3 : 0;
  const int raw = rng.integer(weapon->min_damage, weapon->max_damage) +
                  static_cast<int>(attacker.strength * weapon->strength_scale) +
                  (attacker.inspired ? 2 : 0);
  return std::max(1, raw - mitigation - guard_mitigation);
}

AttackResult CombatRules::attack(Unit& attacker, Unit& target, Rng& rng) const {
  AttackResult result;
  const Weapon* weapon = weapon_for(attacker.weapon);
  if (!weapon || attacker.hp <= 0 || target.hp <= 0 || attacker.side == target.side || attacker.ap < 1) {
    result.reason = "Acao invalida.";
    return result;
  }
  if (distance(attacker, target) > weapon->range + 2) {
    result.reason = "Alvo fora de alcance.";
    return result;
  }

  attacker.ap -= 1;
  result.ok = true;
  result.chance = hit_chance(attacker, target);
  result.roll = rng.integer(1, 100);
  if (result.roll > result.chance) {
    result.hit = false;
    return result;
  }

  result.hit = true;
  result.critical = rng.next() < (0.06 + (attacker.agility - target.agility) * 0.004);
  result.damage = damage_roll(attacker, target, rng);
  if (result.critical) result.damage = (result.damage * 3 + 1) / 2;
  target.hp = std::max(0, target.hp - result.damage);
  return result;
}

std::string CombatRules::test_fear(Unit& unit, int threat, int leadership, Rng& rng) const {
  if (unit.hp <= 0) return "steady";
  const int roll = rng.integer(1, 20) + (unit.courage / 10) + leadership;
  const int severity = threat - roll;
  std::string fear = "steady";
  if (severity >= 18) fear = "paralyzed";
  else if (severity >= 13) fear = "terrified";
  else if (severity >= 8) fear = "afraid";
  else if (severity >= 4) fear = "nervous";
  unit.fear = fear;
  return fear;
}

CombatRules create_default_rules() {
  CombatRules rules;
  rules.fear_states = {
      {"steady", {"steady", "Firme", 0, 0, 0, 0}},
      {"nervous", {"nervous", "Nervoso", -1, -4, 0, 0}},
      {"afraid", {"afraid", "Assustado", -3, -9, -2, 0}},
      {"terrified", {"terrified", "Apavorado", -5, -14, -4, 0.24}},
      {"paralyzed", {"paralyzed", "Paralisado", -99, -99, -8, 1}},
      {"desperate", {"desperate", "Desesperado", -7, -18, -6, 0.34}},
  };
  rules.weapons = {
      {"iron_sword", {"iron_sword", "Espada de ferro", 5, 10, "cut", 5, 1, 0.55, 0, 0}},
      {"iron_axe", {"iron_axe", "Machado de ferro", 6, 12, "cut", 0, 1, 0.70, 0, 0}},
      {"spear", {"spear", "Lanca de ferro", 5, 10, "pierce", 3, 2, 0.45, 0, 0}},
      {"bow", {"bow", "Arco", 3, 8, "pierce", 2, 5, 0.25, 0, 0}},
      {"fire_bow", {"fire_bow", "Flecha de fogo", 3, 8, "fire", 0, 5, 0.20, 0, 0}},
      {"aes_spear", {"aes_spear", "Lanca Aes", 10, 15, "pierce", 7, 2, 0.55, 6, 0}},
      {"claws", {"claws", "Garras", 5, 12, "cut", 4, 1, 0.55, 0, 10}},
      {"dread", {"dread", "Uivo sobrenatural", 0, 2, "supernatural", 10, 6, 0, 14, 18}},
  };
  rules.armors = {
      {"cloth", {"cloth", "Roupa reforcada", {{"cut", 1}, {"pierce", 1}, {"impact", 0}, {"fire", 0}, {"supernatural", 0}}, 1, 1, 0}},
      {"light", {"light", "Couro leve", {{"cut", 2}, {"pierce", 1}, {"impact", 1}, {"fire", 0}, {"supernatural", 0}}, 2, 1, 0}},
      {"medium", {"medium", "Malha media", {{"cut", 4}, {"pierce", 3}, {"impact", 2}, {"fire", 0}, {"supernatural", 0}}, 4, -1, 8}},
      {"heavy", {"heavy", "Brigantina pesada", {{"cut", 7}, {"pierce", 5}, {"impact", 3}, {"fire", 1}, {"supernatural", 0}}, 6, -3, 12}},
  };
  return rules;
}

}  // namespace aes_divinus

