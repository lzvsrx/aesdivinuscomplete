#include "aes_divinus_core.hpp"

// Este arquivo e o ponto reservado para o binding GDExtension do Godot.
// Ele permanece pequeno de proposito enquanto o computador nao tem godot-cpp,
// SCons/CMake e compilador C++ instalados no PATH.
//
// Quando o toolchain estiver pronto, exporte uma classe Godot como:
// - AesDivinusCore : public godot::Object
// - metodos: load_data, default_state, attack, test_fear, save_state
// - registro via GDExtensionBinding::InitObject.

namespace aes_divinus {

CombatRules make_runtime_rules_for_godot() {
  return create_default_rules();
}

}  // namespace aes_divinus

