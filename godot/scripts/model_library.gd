class_name ModelLibrary
extends RefCounted

static func make_material(color: Color, metallic := 0.0, roughness := 0.78, emission := Color.TRANSPARENT) -> StandardMaterial3D:
	var material := StandardMaterial3D.new()
	material.albedo_color = color
	material.metallic = metallic
	material.roughness = roughness
	if emission.a > 0.0:
		material.emission_enabled = true
		material.emission = emission
		material.emission_energy_multiplier = 1.8
	return material

static func color_from_hex(value: String, fallback: Color) -> Color:
	if value.begins_with("#") and value.length() in [7, 9]:
		return Color.html(value)
	return fallback

static func make_character(spec: Dictionary) -> Node3D:
	if str(spec.get("body", "")) == "Bestial" or str(spec.get("role", "")).contains("Criatura"):
		return make_creature(spec)
	var root := Node3D.new()
	root.name = str(spec.get("id", "character"))
	var height := float(spec.get("height", 1.82))
	var body := str(spec.get("body", "Atletico"))
	var armor := str(spec.get("armor", "medium"))
	var weapon := str(spec.get("weapon", "iron_sword"))
	var width := _body_width(body)
	var skin := make_material(Color(0.72, 0.54, 0.40))
	var leather := make_material(Color(0.25, 0.14, 0.08))
	var cloth := make_material(Color(0.10, 0.12, 0.12))
	var metal := make_material(_armor_color(armor), 0.25, 0.52)
	var gold := make_material(Color(0.82, 0.66, 0.32), 0.35, 0.42)
	var violet := make_material(Color(0.56, 0.40, 0.79), 0.0, 0.45, Color(0.56, 0.25, 1.0, 1.0))
	var hair := _hair_material(spec)
	var eye := make_material(_eye_color(spec), 0.0, 0.35, _eye_color(spec))

	_add_capsule(root, "body", Vector3(0, height * 0.5, 0), Vector3(width, height * 0.44, width * 0.54), metal)
	_add_capsule(root, "head", Vector3(0, height * 0.84, 0), Vector3(0.24, 0.30, 0.22), skin)
	_add_capsule(root, "hair", Vector3(0, height * 0.91, -0.01), Vector3(0.26, 0.10, 0.22), hair)
	_add_sphere(root, "eye_l", Vector3(-0.075, height * 0.85, -0.19), Vector3(0.035, 0.018, 0.018), eye)
	_add_sphere(root, "eye_r", Vector3(0.075, height * 0.85, -0.19), Vector3(0.035, 0.018, 0.018), eye)
	_add_capsule(root, "mouth", Vector3(0, height * 0.79, -0.205), Vector3(0.025, 0.075, 0.012), make_material(Color(0.16, 0.06, 0.05)), Vector3(0, 0, 90))
	_add_capsule(root, "cape", Vector3(0, height * 0.48, 0.09), Vector3(width * 1.16, height * 0.46, 0.08), cloth)
	_add_capsule(root, "arm_l", Vector3(-width * 0.68, height * 0.53, 0), Vector3(0.10, height * 0.36, 0.10), leather, Vector3(0, 0, -8))
	_add_capsule(root, "arm_r", Vector3(width * 0.68, height * 0.53, 0), Vector3(0.10, height * 0.36, 0.10), leather, Vector3(0, 0, 8))
	_add_sphere(root, "shoulder_l", Vector3(-width * 0.58, height * 0.67, -0.02), Vector3(0.12, 0.08, 0.10), metal)
	_add_sphere(root, "shoulder_r", Vector3(width * 0.58, height * 0.67, -0.02), Vector3(0.12, 0.08, 0.10), metal)
	_add_capsule(root, "leg_l", Vector3(-width * 0.22, height * 0.18, 0), Vector3(0.11, height * 0.34, 0.11), cloth)
	_add_capsule(root, "leg_r", Vector3(width * 0.22, height * 0.18, 0), Vector3(0.11, height * 0.34, 0.11), cloth)
	_add_capsule(root, "boot_l", Vector3(-width * 0.22, 0.02, -0.03), Vector3(0.08, 0.05, 0.13), leather, Vector3(90, 0, 0))
	_add_capsule(root, "boot_r", Vector3(width * 0.22, 0.02, -0.03), Vector3(0.08, 0.05, 0.13), leather, Vector3(90, 0, 0))
	_add_capsule(root, "belt", Vector3(0, height * 0.39, -0.01), Vector3(0.035, width * 0.64, 0.06), leather, Vector3(0, 0, 90))
	_add_sphere(root, "stone", Vector3(0, height * 0.56, -0.15), Vector3(0.09, 0.12, 0.04), violet)
	_add_capsule(root, "trim", Vector3(0, height * 0.65, -0.16), Vector3(0.018, width * 0.45, 0.018), gold, Vector3(0, 0, 90))
	if str(spec.get("role", "")) == "Defensor":
		_add_capsule(root, "shield_l", Vector3(-width * 0.92, height * 0.47, -0.12), Vector3(0.18, 0.32, 0.045), metal)
	if str(spec.get("role", "")) == "Arqueiro":
		_add_cylinder(root, "quiver", Vector3(-width * 0.42, height * 0.54, 0.22), 0.07, 0.48, leather)
		for i in range(3):
			_add_cylinder(root, "arrow_back_%s" % i, Vector3(-width * 0.44 + i * 0.04, height * 0.69, 0.25), 0.008, 0.42, make_material(Color(0.78, 0.74, 0.58)), Vector3(12, 0, 0))
	var model_weapon := make_weapon(weapon)
	model_weapon.name = "socket_weapon_r"
	model_weapon.position = Vector3(width * 0.88, height * 0.42, -0.02)
	model_weapon.rotation_degrees = Vector3(0, 0, -12)
	root.add_child(model_weapon)
	return root

static func make_creature(spec: Dictionary) -> Node3D:
	var root := Node3D.new()
	root.name = str(spec.get("id", "creature"))
	var hide := make_material(Color(0.11, 0.10, 0.09))
	var bone := make_material(Color(0.70, 0.64, 0.48), 0.0, 0.72)
	var blood := make_material(Color(0.46, 0.08, 0.08), 0.0, 0.55, Color(0.72, 0.05, 0.05, 1.0))
	var violet := make_material(Color(0.56, 0.40, 0.79), 0.0, 0.34, Color(0.70, 0.22, 1.0, 1.0))
	_add_capsule(root, "torso_hunched", Vector3(0, 0.92, 0), Vector3(0.58, 0.58, 0.38), hide, Vector3(12, 0, 0))
	_add_capsule(root, "spine_ridge", Vector3(0, 1.16, 0.16), Vector3(0.12, 0.58, 0.08), blood, Vector3(18, 0, 0))
	_add_capsule(root, "head_long", Vector3(0, 1.52, -0.20), Vector3(0.28, 0.24, 0.38), hide, Vector3(-12, 0, 0))
	_add_cone(root, "horn_l", Vector3(-0.16, 1.72, -0.24), 0.055, 0.28, bone)
	_add_cone(root, "horn_r", Vector3(0.16, 1.72, -0.24), 0.055, 0.28, bone)
	_add_sphere(root, "eye_l", Vector3(-0.09, 1.55, -0.54), Vector3(0.04, 0.025, 0.02), violet)
	_add_sphere(root, "eye_r", Vector3(0.09, 1.55, -0.54), Vector3(0.04, 0.025, 0.02), violet)
	_add_capsule(root, "arm_l", Vector3(-0.55, 0.78, -0.05), Vector3(0.12, 0.62, 0.12), hide, Vector3(0, 0, -24))
	_add_capsule(root, "arm_r", Vector3(0.55, 0.78, -0.05), Vector3(0.12, 0.62, 0.12), hide, Vector3(0, 0, 24))
	_add_cone(root, "claw_l", Vector3(-0.80, 0.36, -0.12), 0.05, 0.22, bone)
	_add_cone(root, "claw_r", Vector3(0.80, 0.36, -0.12), 0.05, 0.22, bone)
	_add_capsule(root, "leg_l", Vector3(-0.22, 0.30, 0.05), Vector3(0.13, 0.48, 0.13), hide, Vector3(-6, 0, -6))
	_add_capsule(root, "leg_r", Vector3(0.22, 0.30, 0.05), Vector3(0.13, 0.48, 0.13), hide, Vector3(-6, 0, 6))
	_add_cylinder(root, "tail", Vector3(0, 0.72, 0.55), 0.07, 0.82, hide, Vector3(75, 0, 0))
	return root

static func make_weapon(id: String) -> Node3D:
	var root := Node3D.new()
	root.name = id
	var metal := make_material(Color(0.65, 0.68, 0.66), 0.42, 0.38)
	var wood := make_material(Color(0.31, 0.18, 0.10))
	var gold := make_material(Color(0.82, 0.66, 0.32), 0.35, 0.42)
	var violet := make_material(Color(0.56, 0.40, 0.79), 0.0, 0.4, Color(0.56, 0.25, 1.0, 1.0))
	if id == "bow":
		_add_torus_arc(root, "bow_frame", Vector3.ZERO, Color(0.45, 0.25, 0.10))
		_add_cylinder(root, "string", Vector3(0, 0.48, 0), 0.01, 0.95, make_material(Color(0.86, 0.82, 0.66)), Vector3(0, 0, 0))
		_add_cylinder(root, "arrow", Vector3(0.10, 0.48, 0), 0.015, 0.86, metal, Vector3(90, 0, 0))
	elif id == "iron_axe":
		_add_cylinder(root, "grip", Vector3(0, 0.42, 0), 0.04, 0.92, wood)
		_add_sphere(root, "axe_head", Vector3(0.07, 0.88, 0), Vector3(0.16, 0.11, 0.035), metal)
		_add_cone(root, "axe_spike", Vector3(-0.12, 0.88, 0), 0.07, 0.18, metal)
		_add_sphere(root, "blood_stone", Vector3(0, 0.78, -0.04), Vector3(0.05, 0.05, 0.03), make_material(Color(0.72, 0.12, 0.10), 0.0, 0.4, Color(0.72, 0.05, 0.05, 1.0)))
	elif id in ["spear", "aes_spear"]:
		_add_cylinder(root, "shaft", Vector3(0, 0.62, 0), 0.025, 1.35, wood)
		_add_cone(root, "tip", Vector3(0, 1.34, 0), 0.10, 0.28, violet if id == "aes_spear" else metal)
		_add_cylinder(root, "ring", Vector3(0, 1.16, 0), 0.045, 0.04, gold)
	else:
		_add_capsule(root, "blade", Vector3(0, 0.62, 0), Vector3(0.045, 0.46, 0.018), metal)
		_add_capsule(root, "guard", Vector3(0, 0.18, 0), Vector3(0.025, 0.17, 0.025), gold, Vector3(0, 0, 90))
		_add_cylinder(root, "grip", Vector3(0, -0.04, 0), 0.035, 0.34, wood)
		_add_sphere(root, "pommel", Vector3(0, -0.24, 0), Vector3(0.06, 0.06, 0.06), gold)
	return root

static func make_tool(id: String) -> Node3D:
	var root := Node3D.new()
	root.name = id
	var leather := make_material(Color(0.31, 0.18, 0.10))
	var metal := make_material(Color(0.62, 0.56, 0.42), 0.25, 0.55)
	var green := make_material(Color(0.34, 0.49, 0.39), 0.0, 0.55, Color(0.20, 0.55, 0.34, 1.0))
	var blue := make_material(Color(0.36, 0.64, 0.85), 0.0, 0.45, Color(0.24, 0.45, 1.0, 1.0))
	if id == "aes_compass":
		_add_cylinder(root, "compass_body", Vector3.ZERO, 0.22, 0.06, metal, Vector3(90, 0, 0))
		_add_capsule(root, "needle", Vector3(0, 0.035, 0), Vector3(0.012, 0.17, 0.012), blue, Vector3(0, 0, 90))
		_add_sphere(root, "stone", Vector3(0, 0.075, 0), Vector3(0.06, 0.03, 0.06), blue)
	elif id == "survey_tools":
		_add_cylinder(root, "lens", Vector3(-0.08, 0, 0), 0.14, 0.035, green, Vector3(90, 0, 0))
		_add_cylinder(root, "handle", Vector3(0.10, -0.15, 0), 0.025, 0.38, metal, Vector3(0, 0, -35))
		_add_capsule(root, "chalk", Vector3(0.18, 0.08, 0), Vector3(0.035, 0.14, 0.035), make_material(Color(0.86, 0.82, 0.65)))
	else:
		_add_capsule(root, "bag", Vector3.ZERO, Vector3(0.24, 0.20, 0.12), leather, Vector3(0, 0, 90))
		_add_capsule(root, "flap", Vector3(0, 0.08, -0.095), Vector3(0.055, 0.20, 0.018), make_material(Color(0.18, 0.10, 0.05)), Vector3(0, 0, 90))
		_add_sphere(root, "healing_stone", Vector3(0.15, 0.02, -0.12), Vector3(0.05, 0.05, 0.025), green)
	return root

static func make_environment_piece(id: String) -> Node3D:
	var root := Node3D.new()
	root.name = id
	var wood := make_material(Color(0.24, 0.16, 0.08))
	var stone := make_material(Color(0.25, 0.25, 0.24))
	var blood := make_material(Color(0.46, 0.12, 0.10), 0.0, 0.6, Color(0.55, 0.08, 0.06, 1.0))
	if id == "blood_tree":
		_add_cylinder(root, "trunk", Vector3(0, 0.65, 0), 0.12, 1.3, wood)
		_add_sphere(root, "crown", Vector3(0, 1.42, 0), Vector3(0.62, 0.42, 0.62), make_material(Color(0.06, 0.12, 0.07)))
		_add_capsule(root, "blood_mark", Vector3(0, 0.76, -0.13), Vector3(0.022, 0.19, 0.010), blood)
	elif id == "stone_table":
		_add_capsule(root, "slab", Vector3(0, 0.62, 0), Vector3(0.42, 0.86, 0.08), stone, Vector3(0, 0, 90))
		_add_capsule(root, "base", Vector3(0, 0.28, 0), Vector3(0.26, 0.52, 0.22), stone, Vector3(0, 0, 90))
	elif id == "wooden_gate":
		for i in range(5):
			_add_capsule(root, "log_%s" % i, Vector3(-0.48 + i * 0.24, 0.8, 0), Vector3(0.08, 0.82, 0.055), wood)
		_add_capsule(root, "brace", Vector3(0, 0.8, -0.08), Vector3(0.06, 0.68, 0.04), wood, Vector3(0, 0, 90))
	else:
		_add_capsule(root, "supply_bundle", Vector3(0, 0.25, 0), Vector3(0.28, 0.26, 0.22), wood, Vector3(0, 0, 90))
	return root

static func _add_box(parent: Node3D, name: String, position: Vector3, size: Vector3, material: Material) -> MeshInstance3D:
	var node := MeshInstance3D.new()
	node.name = name
	var mesh := BoxMesh.new()
	mesh.size = size
	node.mesh = mesh
	node.position = position
	node.set_surface_override_material(0, material)
	parent.add_child(node)
	return node

static func _add_sphere(parent: Node3D, name: String, position: Vector3, scale: Vector3, material: Material) -> MeshInstance3D:
	var node := MeshInstance3D.new()
	node.name = name
	node.mesh = SphereMesh.new()
	node.position = position
	node.scale = scale
	node.set_surface_override_material(0, material)
	parent.add_child(node)
	return node

static func _add_capsule(parent: Node3D, name: String, position: Vector3, scale: Vector3, material: Material, rotation := Vector3.ZERO) -> MeshInstance3D:
	var node := MeshInstance3D.new()
	node.name = name
	node.mesh = CapsuleMesh.new()
	node.position = position
	node.scale = scale
	node.rotation_degrees = rotation
	node.set_surface_override_material(0, material)
	parent.add_child(node)
	return node

static func _add_cylinder(parent: Node3D, name: String, position: Vector3, radius: float, height: float, material: Material, rotation := Vector3.ZERO) -> MeshInstance3D:
	var node := MeshInstance3D.new()
	node.name = name
	var mesh := CylinderMesh.new()
	mesh.top_radius = radius
	mesh.bottom_radius = radius
	mesh.height = height
	node.mesh = mesh
	node.position = position
	node.rotation_degrees = rotation
	node.set_surface_override_material(0, material)
	parent.add_child(node)
	return node

static func _add_cone(parent: Node3D, name: String, position: Vector3, radius: float, height: float, material: Material) -> MeshInstance3D:
	var node := MeshInstance3D.new()
	node.name = name
	var mesh := CylinderMesh.new()
	mesh.top_radius = 0.0
	mesh.bottom_radius = radius
	mesh.height = height
	node.mesh = mesh
	node.position = position
	node.set_surface_override_material(0, material)
	parent.add_child(node)
	return node

static func _add_torus_arc(parent: Node3D, name: String, position: Vector3, color: Color) -> MeshInstance3D:
	var node := MeshInstance3D.new()
	node.name = name
	var mesh := TorusMesh.new()
	mesh.inner_radius = 0.36
	mesh.outer_radius = 0.39
	node.mesh = mesh
	node.position = position
	node.scale = Vector3(0.42, 1.0, 0.08)
	node.set_surface_override_material(0, make_material(color))
	parent.add_child(node)
	return node

static func _body_width(body: String) -> float:
	if body == "Magro":
		return 0.34
	if body in ["Definido", "Fit"]:
		return 0.42
	if body in ["Forte", "Musculoso"]:
		return 0.54
	if body in ["Corpulento", "Gordinho"]:
		return 0.62
	return 0.48

static func _armor_color(armor: String) -> Color:
	if armor == "light":
		return Color(0.32, 0.20, 0.11)
	if armor == "heavy":
		return Color(0.12, 0.13, 0.14)
	if armor == "cloth":
		return Color(0.18, 0.20, 0.18)
	return Color(0.28, 0.30, 0.30)

static func _hair_material(spec: Dictionary) -> Material:
	var role := str(spec.get("role", ""))
	if role == "Arqueiro":
		return make_material(Color(0.31, 0.18, 0.10))
	if role == "Defensor":
		return make_material(Color(0.05, 0.05, 0.05))
	return make_material(Color(0.08, 0.07, 0.06))

static func _eye_color(spec: Dictionary) -> Color:
	var id := str(spec.get("id", ""))
	if id == "ethan":
		return Color(0.36, 0.64, 0.85)
	if id == "albert":
		return Color(0.43, 0.64, 0.37)
	if str(spec.get("role", "")).contains("Criatura"):
		return Color(0.70, 0.22, 1.0)
	return Color(0.82, 0.66, 0.32)
