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
	camera.position = Vector3(0, 3.6, 9.4)
	camera.rotation_degrees = Vector3(-20, 0, 0)
	add_child(camera)
	var world := WorldEnvironment.new()
	world.name = "WorldEnvironment"
	var env := Environment.new()
	env.background_mode = Environment.BG_COLOR
	env.background_color = Color(0.025, 0.028, 0.030)
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = Color(0.22, 0.20, 0.18)
	env.ambient_light_energy = 0.55
	world.environment = env
	add_child(world)
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
	var rim := OmniLight3D.new()
	rim.name = "GoldRimLight"
	rim.position = Vector3(-3.8, 2.6, -1.8)
	rim.light_color = Color(0.82, 0.66, 0.32)
	rim.light_energy = 0.9
	add_child(rim)
	var ground := MeshInstance3D.new()
	ground.name = "Ground"
	var mesh := PlaneMesh.new()
	mesh.size = Vector2(16, 10)
	ground.mesh = mesh
	ground.set_surface_override_material(0, ModelLibraryScript.make_material(Color(0.07, 0.075, 0.075)))
	add_child(ground)
	_add_display_band(Vector3(0, 0.01, -0.8), Vector2(13.5, 2.4), Color(0.10, 0.09, 0.07))
	_add_display_band(Vector3(0, 0.012, 2.35), Vector2(13.5, 1.55), Color(0.07, 0.08, 0.08))
	_add_display_band(Vector3(0, 0.014, 3.9), Vector2(10.5, 1.25), Color(0.06, 0.07, 0.06))

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

func _add_display_band(position: Vector3, size: Vector2, color: Color) -> void:
	var band := MeshInstance3D.new()
	band.name = "display_band"
	var mesh := PlaneMesh.new()
	mesh.size = size
	band.mesh = mesh
	band.position = position
	band.set_surface_override_material(0, ModelLibraryScript.make_material(color))
	add_child(band)
