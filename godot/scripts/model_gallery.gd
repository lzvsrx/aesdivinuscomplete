extends Node3D

const SPECS_PATH := "res://data/modeling_specs.json"
const ModelLibraryScript := preload("res://scripts/model_library.gd")

var specs: Dictionary = {}

func _ready() -> void:
	specs = _load_specs()
	_build_world()
	_build_gallery()

func _load_specs() -> Dictionary:
	var file := FileAccess.open(SPECS_PATH, FileAccess.READ)
	if file == null:
		push_error("Modeling specs missing: " + SPECS_PATH)
		return {}
	var parsed = JSON.parse_string(file.get_as_text())
	return parsed if typeof(parsed) == TYPE_DICTIONARY else {}

func _build_world() -> void:
	var camera := Camera3D.new()
	camera.name = "Camera3D"
	camera.position = Vector3(0, 3.1, 8.5)
	camera.rotation_degrees = Vector3(-18, 0, 0)
	add_child(camera)
	var light := DirectionalLight3D.new()
	light.name = "KeyLight"
	light.position = Vector3(0, 4, 4)
	light.rotation_degrees = Vector3(-45, 35, 0)
	light.light_energy = 2.2
	add_child(light)
	var fill := OmniLight3D.new()
	fill.name = "AesFillLight"
	fill.position = Vector3(0, 2.2, 1.6)
	fill.light_color = Color(0.56, 0.40, 0.79)
	fill.light_energy = 1.4
	add_child(fill)
	var ground := MeshInstance3D.new()
	ground.name = "Ground"
	var mesh := PlaneMesh.new()
	mesh.size = Vector2(16, 10)
	ground.mesh = mesh
	ground.set_surface_override_material(0, ModelLibraryScript.make_material(Color(0.07, 0.075, 0.075)))
	add_child(ground)

func _build_gallery() -> void:
	var x := -4.8
	for character in specs.get("characters", []):
		var model: Node3D = ModelLibraryScript.make_character(character)
		model.position = Vector3(x, 0, -0.8)
		add_child(model)
		_add_label(character.get("name", "Personagem"), Vector3(x - 0.48, 0.08, 1.0))
		x += 2.25
	x = -5.2
	for weapon in specs.get("weapons", []):
		var model: Node3D = ModelLibraryScript.make_weapon(str(weapon.get("id", "")))
		model.position = Vector3(x, 0.15, 2.2)
		model.scale = Vector3.ONE * 0.8
		add_child(model)
		_add_label(weapon.get("name", "Arma"), Vector3(x - 0.42, 0.04, 2.9))
		x += 1.65
	x = -4.3
	for tool in specs.get("tools", []):
		var model: Node3D = ModelLibraryScript.make_tool(str(tool.get("id", "")))
		model.position = Vector3(x, 0.45, 3.7)
		model.scale = Vector3.ONE * 1.3
		add_child(model)
		_add_label(tool.get("name", "Ferramenta"), Vector3(x - 0.44, 0.04, 4.35))
		x += 2.3
	x = 2.6
	for piece_id in ["blood_tree", "stone_table", "wooden_gate"]:
		var model: Node3D = ModelLibraryScript.make_environment_piece(piece_id)
		model.position = Vector3(x, 0, 3.75)
		add_child(model)
		_add_label(piece_id, Vector3(x - 0.35, 0.04, 4.55))
		x += 1.7

func _add_label(text: String, position: Vector3) -> void:
	var label := Label3D.new()
	label.text = text
	label.position = position
	label.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	label.font_size = 26
	label.modulate = Color(0.82, 0.66, 0.32)
	add_child(label)
