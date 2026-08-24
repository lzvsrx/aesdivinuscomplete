#pragma once

#include <algorithm>
#include <cstdint>
#include <map>
#include <optional>
#include <string>
#include <vector>

namespace aes_divinus {

struct Weapon {
  std::string id;
  std::string name;
  int min_damage = 0;
  int max_damage = 0;
  std::string type;
  int accuracy = 0;
  int range = 1;
  double strength_scale = 0.0;
  int courage_damage = 0;
  int threat = 0;
};

struct Armor {
  std::string id;
  std::string name;
  std::map<std::string, int> mitigation;
  int defense = 0;
  int initiative = 0;
  int strength_req = 0;
};

struct FearState {
  std::string id;
  std::string label;
  int initiative = 0;
  int accuracy = 0;
  int defense = 0;
  double skip_chance = 0.0;
};

struct Unit {
  std::string id;
  std::string name;
  std::string side;
  int max_hp = 1;
  int hp = 1;
  int strength = 1;
  int agility = 1;
  int perception = 1;
  int courage = 50;
  int loyalty = 50;
  int inspiration = 0;
  int defense = 0;
  std::string weapon = "iron_sword";
  std::string armor = "cloth";
  std::string fear = "steady";
  int position = 0;
  int ap = 2;
  bool guard = false;
  bool inspired = false;
};

struct AttackResult {
  bool ok = false;
  bool hit = false;
  bool critical = false;
  int chance = 0;
  int roll = 0;
  int damage = 0;
  std::string reason;
};

class Rng {
 public:
  explicit Rng(uint32_t seed = 73129);
  double next();
  int integer(int min, int max);

 private:
  uint32_t seed_;
};

class CombatRules {
 public:
  std::map<std::string, Weapon> weapons;
  std::map<std::string, Armor> armors;
  std::map<std::string, FearState> fear_states;

  int initiative(const Unit& unit) const;
  int hit_chance(const Unit& attacker, const Unit& target) const;
  int damage_roll(const Unit& attacker, const Unit& target, Rng& rng) const;
  AttackResult attack(Unit& attacker, Unit& target, Rng& rng) const;
  std::string test_fear(Unit& unit, int threat, int leadership, Rng& rng) const;

 private:
  const Weapon* weapon_for(const std::string& id) const;
  const Armor* armor_for(const std::string& id) const;
  const FearState* fear_for(const std::string& id) const;
  int courage_modifier(const Unit& unit) const;
  int distance(const Unit& attacker, const Unit& target) const;
};

CombatRules create_default_rules();

}  // namespace aes_divinus

