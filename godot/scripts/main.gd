extends Control

const DATA_PATH := "res://data/aes_divinus_data.json"

var data: Dictionary = {}
var state: Dictionary = {}
var selected_mission_index := 0

var root: HBoxContainer
var mission_list: ItemList
var detail_title: Label
var detail_text: RichTextLabel
var resource_text: RichTextLabel
var log_text: RichTextLabel
var character_name: LineEdit
var eye_color: OptionButton
var hair_color: OptionButton
var body_type: OptionButton
var weapon: OptionButton
var avatar: Control

func _ready() -> void:
	data = _load_data()
	state = _default_state()
	var loaded := _load_saved_state()
	if not loaded.is_empty():
		state.merge(loaded, true)
	_build_ui()
	_apply_hardware_profile()
	_refresh_all()

func _load_data() -> Dictionary:
	var file := FileAccess.open(DATA_PATH, FileAccess.READ)
	if file == null:
		push_error("Dados do jogo nao encontrados: " + DATA_PATH)
		return {}
	var parsed = JSON.parse_string(file.get_as_text())
	return parsed if typeof(parsed) == TYPE_DICTIONARY else {}

func _default_state() -> Dictionary:
	return {
		"account": {"name": "Jogador", "email": "local@aesdivinus", "guest": true},
		"player_character": {
			"name": "William",
			"eyeColor": "Castanho",
			"hairColor": "Preto natural",
			"body": "Atletico",
			"weapon": "iron_sword"
		},
		"campaign": {"day": 1, "completed": [], "journal": ["Campanha Godot iniciada."]},
		"principality": data.get("initialPrincipality", {}),
		"inventory": {"owned": ["iron_sword", "bow", "spear", "cloth", "light", "medium"], "gold": 72},
		"settings": {"quality": "medium", "autosave": true}
	}

func _build_ui() -> void:
	var bg := ColorRect.new()
	bg.color = Color(0.035, 0.04, 0.04)
	bg.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(bg)

	root = HBoxContainer.new()
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	root.add_theme_constant_override("separation", 12)
	root.offset_left = 14
	root.offset_top = 14
	root.offset_right = -14
	root.offset_bottom = -14
	add_child(root)

	var left := _panel(320)
	root.add_child(left)
	left.add_child(_title("Aes Divinus"))
	left.add_child(_subtitle("Godot/C++ migration build"))
	mission_list = ItemList.new()
	mission_list.size_flags_vertical = Control.SIZE_EXPAND_FILL
	mission_list.item_selected.connect(func(index: int) -> void:
		selected_mission_index = index
		_refresh_mission_detail()
		_autosave("Missao selecionada.")
	)
	left.add_child(mission_list)

	var center := _panel(520)
	root.add_child(center)
	detail_title = _title("")
	center.add_child(detail_title)
	detail_text = RichTextLabel.new()
	detail_text.bbcode_enabled = true
	detail_text.fit_content = true
	detail_text.size_flags_vertical = Control.SIZE_EXPAND_FILL
	center.add_child(detail_text)
	var actions := HBoxContainer.new()
	actions.add_theme_constant_override("separation", 8)
	center.add_child(actions)
	actions.add_child(_button("Iniciar cena", _start_scene))
	actions.add_child(_button("Resolver missao", _complete_mission))
	actions.add_child(_button("Salvar", func() -> void: _autosave("Save manual.")))
	resource_text = RichTextLabel.new()
	resource_text.bbcode_enabled = true
	resource_text.fit_content = true
	center.add_child(resource_text)

	var right := _panel(360)
	root.add_child(right)
	right.add_child(_title("Personagem"))
	character_name = LineEdit.new()
	character_name.placeholder_text = "Nome"
	character_name.text_changed.connect(func(value: String) -> void:
		state["player_character"]["name"] = value
		_refresh_avatar()
		_autosave("Nome do personagem atualizado.")
	)
	right.add_child(character_name)
	eye_color = _option("Olhos", data.get("characterOptions", {}).get("eyeColors", []), _character_option_changed)
	hair_color = _option("Cabelo", data.get("characterOptions", {}).get("hairColors", []), _character_option_changed)
	body_type = _option("Corpo", data.get("characterOptions", {}).get("bodies", []), _character_option_changed)
	weapon = _option("Arma", ["iron_sword", "spear", "bow"], _character_option_changed)
	right.add_child(eye_color)
	right.add_child(hair_color)
	right.add_child(body_type)
	right.add_child(weapon)
	avatar = AvatarPreview.new()
	avatar.custom_minimum_size = Vector2(320, 260)
	right.add_child(avatar)
	log_text = RichTextLabel.new()
	log_text.bbcode_enabled = true
	log_text.fit_content = true
	log_text.size_flags_vertical = Control.SIZE_EXPAND_FILL
	right.add_child(log_text)

func _panel(width: int) -> VBoxContainer:
	var panel := VBoxContainer.new()
	panel.custom_minimum_size = Vector2(width, 0)
	panel.size_flags_vertical = Control.SIZE_EXPAND_FILL
	panel.add_theme_constant_override("separation", 10)
	return panel

func _title(text: String) -> Label:
	var label := Label.new()
	label.text = text
	label.add_theme_font_size_override("font_size", 28)
	label.add_theme_color_override("font_color", Color(0.82, 0.66, 0.32))
	return label

func _subtitle(text: String) -> Label:
	var label := Label.new()
	label.text = text
	label.add_theme_color_override("font_color", Color(0.72, 0.72, 0.68))
	return label

func _button(text: String, callback: Callable) -> Button:
	var button := Button.new()
	button.text = text
	button.pressed.connect(callback)
	return button

func _option(label: String, values: Array, callback: Callable) -> OptionButton:
	var option := OptionButton.new()
	option.tooltip_text = label
	for value in values:
		option.add_item(str(value))
	option.item_selected.connect(callback)
	return option

func _refresh_all() -> void:
	var missions: Array = data.get("missions", [])
	mission_list.clear()
	for mission in missions:
		mission_list.add_item("%s. %s" % [mission.get("order", 0), mission.get("title", "")])
	if missions.size() > 0:
		mission_list.select(clamp(selected_mission_index, 0, missions.size() - 1))
	_refresh_character_controls()
	_refresh_mission_detail()
	_refresh_resources()
	_refresh_log()
	_refresh_avatar()

func _refresh_character_controls() -> void:
	var pc: Dictionary = state.get("player_character", {})
	character_name.text = pc.get("name", "William")
	_select_option_text(eye_color, pc.get("eyeColor", "Castanho"))
	_select_option_text(hair_color, pc.get("hairColor", "Preto natural"))
	_select_option_text(body_type, pc.get("body", "Atletico"))
	_select_option_text(weapon, pc.get("weapon", "iron_sword"))

func _select_option_text(option: OptionButton, value: String) -> void:
	for index in option.item_count:
		if option.get_item_text(index) == value:
			option.select(index)
			return

func _refresh_mission_detail() -> void:
	var mission := _selected_mission()
	detail_title.text = "%s. %s" % [mission.get("order", 0), mission.get("title", "")]
	detail_text.text = "[b]%s[/b]\nTipo: %s\n\nObjetivo: %s\nImpacto: %s\n\nOpcionais:\n- %s" % [
		mission.get("act", ""),
		mission.get("type", ""),
		mission.get("objective", ""),
		mission.get("impact", ""),
		"\n- ".join(mission.get("optional", []))
	]

func _refresh_resources() -> void:
	var p: Dictionary = state.get("principality", {})
	resource_text.text = "[b]Principado[/b]\nComida %s | Madeira %s | Ferro %s | Ouro %s | Tropas %s | Infra %s" % [
		p.get("food", 0),
		p.get("wood", 0),
		p.get("iron", 0),
		p.get("gold", 0),
		p.get("troops", 0),
		p.get("infrastructure", 0)
	]

func _refresh_log() -> void:
	var journal: Array = state.get("campaign", {}).get("journal", [])
	log_text.text = "[b]Diario[/b]\n" + "\n".join(journal.slice(max(0, journal.size() - 6), journal.size()))

func _refresh_avatar() -> void:
	avatar.set("character_data", state.get("player_character", {}))
	avatar.queue_redraw()

func _character_option_changed(_index: int) -> void:
	state["player_character"]["eyeColor"] = eye_color.get_item_text(eye_color.selected)
	state["player_character"]["hairColor"] = hair_color.get_item_text(hair_color.selected)
	state["player_character"]["body"] = body_type.get_item_text(body_type.selected)
	state["player_character"]["weapon"] = weapon.get_item_text(weapon.selected)
	_refresh_avatar()
	_autosave("Personagem atualizado.")

func _selected_mission() -> Dictionary:
	var missions: Array = data.get("missions", [])
	if missions.is_empty():
		return {}
	return missions[clamp(selected_mission_index, 0, missions.size() - 1)]

func _start_scene() -> void:
	var mission := _selected_mission()
	var scenes: Array = data.get("missionScenes", {}).get(mission.get("id", ""), [])
	if scenes.is_empty():
		_add_journal("Cena aberta: %s." % mission.get("title", "Missao"))
	else:
		_add_journal("%s: %s" % [scenes[0].get("title", mission.get("title", "")), scenes[0].get("text", "")])
	_autosave("Cena iniciada.")

func _complete_mission() -> void:
	var mission := _selected_mission()
	var campaign: Dictionary = state.get("campaign", {})
	var completed: Array = campaign.get("completed", [])
	if not completed.has(mission.get("id", "")):
		completed.append(mission.get("id", ""))
	campaign["completed"] = completed
	campaign["day"] = int(campaign.get("day", 1)) + 1
	state["campaign"] = campaign
	_apply_rewards(mission.get("rewards", {}))
	_add_journal("Missao resolvida: %s." % mission.get("title", ""))
	selected_mission_index = min(selected_mission_index + 1, data.get("missions", []).size() - 1)
	mission_list.select(selected_mission_index)
	_refresh_mission_detail()
	_refresh_resources()
	_autosave("Missao resolvida.")

func _apply_rewards(rewards: Dictionary) -> void:
	var p: Dictionary = state.get("principality", {})
	for key in ["food", "wood", "iron", "gold", "troops", "infrastructure"]:
		p[key] = int(p.get(key, 0)) + int(rewards.get(key, 0))
	state["principality"] = p

func _add_journal(line: String) -> void:
	var campaign: Dictionary = state.get("campaign", {})
	var journal: Array = campaign.get("journal", [])
	journal.append(line)
	campaign["journal"] = journal
	state["campaign"] = campaign
	_refresh_log()

func _autosave(message: String) -> void:
	state["last_event"] = {"message": message, "at": Time.get_datetime_string_from_system(true)}
	if state.get("settings", {}).get("autosave", true):
		var save_system := get_node_or_null("/root/SaveSystem")
		if save_system:
			save_system.save_state(state)

func _load_saved_state() -> Dictionary:
	var save_system := get_node_or_null("/root/SaveSystem")
	if save_system:
		return save_system.load_state()
	return {}

func _apply_hardware_profile() -> void:
	var cores := OS.get_processor_count()
	var quality := "medium"
	if cores <= 4:
		quality = "low"
	elif cores >= 12:
		quality = "high"
	state["settings"]["quality"] = quality

class AvatarPreview:
	extends Control

	var character_data: Dictionary = {}

	func _draw() -> void:
		var rect := Rect2(Vector2.ZERO, size)
		draw_rect(rect, Color(0.06, 0.065, 0.065), true)
		draw_rect(rect.grow(-1), Color(0.82, 0.66, 0.32, 0.25), false, 1.0)
		var center := Vector2(size.x * 0.5, size.y * 0.58)
		var body_width := _body_width(character_data.get("body", "Atletico"))
		var hair := _hair_color(character_data.get("hairColor", "Preto natural"))
		var eye := _eye_color(character_data.get("eyeColor", "Castanho"))
		var weapon: String = str(character_data.get("weapon", "iron_sword"))

		draw_ellipse(Vector2(center.x, center.y + 93), 80, 11, Color(0, 0, 0, 0.35))
		draw_polygon([Vector2(center.x - 76, 86), Vector2(center.x + 76, 86), Vector2(center.x + 92, 230), Vector2(center.x - 92, 230)], [Color(0.05, 0.055, 0.055), Color(0.12, 0.12, 0.13), Color(0.02, 0.02, 0.02), Color(0.08, 0.08, 0.09)])
		draw_rounded_rect(Rect2(center.x - body_width * 0.5, 104, body_width, 118), 28, Color(0.24, 0.25, 0.24))
		draw_rounded_rect(Rect2(center.x - body_width * 0.36, 116, body_width * 0.72, 88), 12, Color(0.72, 0.61, 0.34))
		draw_rect(Rect2(center.x - body_width * 0.34, 176, body_width * 0.68, 9), Color(0.10, 0.08, 0.06))
		draw_circle(Vector2(center.x, 151), 10, eye)
		draw_rounded_rect(Rect2(center.x - 76, 112, 28, 102), 14, Color(0.18, 0.18, 0.18))
		draw_rounded_rect(Rect2(center.x + 48, 112, 28, 102), 14, Color(0.18, 0.18, 0.18))
		draw_rounded_rect(Rect2(center.x - 36, 40, 72, 78), 36, Color(0.72, 0.53, 0.38))
		draw_arc(Vector2(center.x, 76), 39, PI, TAU, 24, hair, 14)
		draw_circle(Vector2(center.x - 14, 78), 5, eye)
		draw_circle(Vector2(center.x + 14, 78), 5, eye)
		draw_line(Vector2(center.x - 12, 102), Vector2(center.x + 12, 102), Color(0.18, 0.08, 0.06), 2)
		if weapon == "bow":
			draw_arc(Vector2(center.x + 88, 150), 58, -PI / 2, PI / 2, 28, Color(0.48, 0.28, 0.12), 5)
			draw_line(Vector2(center.x + 88, 92), Vector2(center.x + 88, 208), Color(0.88, 0.82, 0.62), 2)
		elif weapon == "spear":
			draw_line(Vector2(center.x + 92, 36), Vector2(center.x + 92, 232), Color(0.75, 0.61, 0.28), 7)
			draw_polygon([Vector2(center.x + 92, 16), Vector2(center.x + 108, 48), Vector2(center.x + 92, 68), Vector2(center.x + 76, 48)], [Color(0.9, 0.88, 0.78), Color(0.52, 0.56, 0.56), Color(0.24, 0.26, 0.26), Color(0.78, 0.78, 0.72)])
		else:
			draw_line(Vector2(center.x + 88, 72), Vector2(center.x + 88, 226), Color(0.45, 0.27, 0.16), 8)
			draw_polygon([Vector2(center.x + 88, 24), Vector2(center.x + 103, 88), Vector2(center.x + 88, 126), Vector2(center.x + 73, 88)], [Color(0.9, 0.9, 0.84), Color(0.58, 0.62, 0.62), Color(0.25, 0.28, 0.28), Color(0.78, 0.78, 0.72)])
		draw_string(ThemeDB.fallback_font, Vector2(18, size.y - 18), character_data.get("name", "William"), HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color(0.82, 0.66, 0.32))

	func _body_width(body: String) -> float:
		if body == "Magro":
			return 88
		if body in ["Definido", "Fit"]:
			return 108
		if body in ["Forte", "Musculoso"]:
			return 142
		if body in ["Corpulento", "Gordinho"]:
			return 164
		return 128

	func _eye_color(value: String) -> Color:
		var key := value.to_lower()
		if key.contains("violeta") or key.contains("ametista"):
			return Color(0.56, 0.40, 0.79)
		if key.contains("azul") or key.contains("safira"):
			return Color(0.36, 0.64, 0.85)
		if key.contains("verde"):
			return Color(0.43, 0.64, 0.37)
		if key.contains("cinza"):
			return Color(0.66, 0.69, 0.68)
		if key.contains("onix") or key.contains("preto"):
			return Color(0.04, 0.04, 0.04)
		return Color(0.44, 0.26, 0.11)

	func _hair_color(value: String) -> Color:
		var key := value.to_lower()
		if key.contains("violeta"):
			return Color(0.48, 0.30, 0.70)
		if key.contains("vermelho") or key.contains("acaju"):
			return Color(0.56, 0.19, 0.18)
		if key.contains("cobre"):
			return Color(0.72, 0.37, 0.15)
		if key.contains("loiro"):
			return Color(0.79, 0.65, 0.29)
		if key.contains("acinzentado"):
			return Color(0.55, 0.56, 0.55)
		if key.contains("castanho") or key.contains("marrom"):
			return Color(0.31, 0.18, 0.10)
		return Color(0.03, 0.03, 0.03)

	func draw_rounded_rect(r: Rect2, radius: float, color: Color) -> void:
		draw_rect(r, color, true)
