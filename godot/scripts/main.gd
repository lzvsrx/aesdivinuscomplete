extends Control

const DATA_PATH := "res://data/aes_divinus_data.json"

var data: Dictionary = {}
var state: Dictionary = {}
var selected_mission_index := 0

var root: GridContainer
var left_column: VBoxContainer
var center_column: VBoxContainer
var right_column: VBoxContainer
var mission_list: ItemList
var mission_backdrop: Control
var mission_arena: Control
var mission_overlay: PanelContainer
var mission_overlay_title: Label
var mission_overlay_status: RichTextLabel
var mission_overlay_arena: Control
var detail_title: Label
var detail_text: RichTextLabel
var resource_text: RichTextLabel
var log_text: RichTextLabel
var account_name: LineEdit
var account_email: LineEdit
var character_name: LineEdit
var pronoun: OptionButton
var origin: OptionButton
var eye_color: OptionButton
var eye_shape: OptionButton
var face_shape: OptionButton
var hair_style: OptionButton
var hair_color: OptionButton
var beard: OptionButton
var body_type: OptionButton
var body_shape: OptionButton
var palette: OptionButton
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
	_update_responsive_layout()

func _notification(what: int) -> void:
	if what == NOTIFICATION_RESIZED:
		_update_responsive_layout()

func _load_data() -> Dictionary:
	var file := FileAccess.open(DATA_PATH, FileAccess.READ)
	if file == null:
		push_error("Dados do jogo nao encontrados: " + DATA_PATH)
		return {}
	var parsed = JSON.parse_string(file.get_as_text())
	return parsed if typeof(parsed) == TYPE_DICTIONARY else {}

func _default_state() -> Dictionary:
	return {
		"mode": "auth",
		"account": {"name": "Jogador", "email": "local@aesdivinus", "guest": true, "remember": true},
		"compliance": {"termsAccepted": true, "privacyAccepted": true, "ageConfirmed": true, "policyVersion": "2026-08-24"},
		"player_character": {
			"name": "William",
			"pronoun": "Livre",
			"origin": "abakorum",
			"originLabel": "Abakorum",
			"face": "Oval",
			"eyeShape": "Amendoados",
			"eyeColor": "Castanho",
			"hair": "Ondulado 2B",
			"hairColor": "Preto natural",
			"beard": "Barba curta",
			"body": "Atletico",
			"bodyShape": "Trapezio",
			"palette": "iron_gold",
			"weapon": "iron_sword",
			"createdAt": Time.get_datetime_string_from_system(true)
		},
		"campaign": {"day": 1, "completed": [], "journal": ["Campanha Godot iniciada."]},
		"principality": data.get("initialPrincipality", {}),
		"economy": {"currency": data.get("gameCurrency", {}).get("id", "aes_crowns"), "balance": 72, "transactions": []},
		"inventory": {
			"owned": ["iron_sword", "bow", "spear", "cloth", "light", "medium", "heavy", "field_kit", "survey_tools"],
			"equipped": {
				"william": {"weapon": "iron_sword", "armor": "medium", "tool": "field_kit"},
				"ethan": {"weapon": "bow", "armor": "light", "tool": "survey_tools"},
				"albert": {"weapon": "spear", "armor": "heavy", "tool": "field_kit"}
			}
		},
		"audio": {"enabled": true, "masterVolume": 0.7},
		"githubSync": {"enabled": false, "owner": "lzvsrx", "repo": "aesdivinuscomplete", "branch": "main", "path": "saves/aes-divinus-save.json", "systemPath": "saves/systems"},
		"settings": {
			"quality": "medium",
			"autosave": true,
			"fontScale": 1.0,
			"interfaceScale": 1.0,
			"screenWidth": "auto",
			"layoutDensity": "normal",
			"contrast": "normal",
			"colorBlindMode": "off",
			"motion": "auto",
			"textSpacing": "normal",
			"combatSpeed": 1.0,
			"targetSize": "auto",
			"privacyMode": false
		}
	}

func _build_ui() -> void:
	var bg := ColorRect.new()
	bg.color = Color(0.025, 0.030, 0.030)
	bg.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(bg)

	root = GridContainer.new()
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	root.columns = 3
	root.add_theme_constant_override("separation", 12)
	root.offset_left = 14
	root.offset_top = 14
	root.offset_right = -14
	root.offset_bottom = -14
	add_child(root)

	var left := _panel("campaign", 300)
	left_column = left
	left.add_child(_title("Aes Divinus"))
	left.add_child(_subtitle("Godot 3D single-player completo"))
	var logo := TextureRect.new()
	logo.texture = load("res://assets/aes-divinus-logo.png")
	logo.expand_mode = TextureRect.EXPAND_FIT_WIDTH_PROPORTIONAL
	logo.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	logo.custom_minimum_size = Vector2(220, 76)
	left.add_child(logo)
	mission_list = ItemList.new()
	mission_list.custom_minimum_size = Vector2(0, 360)
	mission_list.size_flags_vertical = Control.SIZE_EXPAND_FILL
	mission_list.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	mission_list.item_selected.connect(func(index: int) -> void:
		selected_mission_index = index
		_refresh_mission_detail()
		_autosave("Missao selecionada.")
	)
	left.add_child(mission_list)

	var center := _panel("content", 520)
	center_column = center
	mission_backdrop = MissionBackdrop.new()
	mission_backdrop.custom_minimum_size = Vector2(0, 150)
	mission_backdrop.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	center.add_child(mission_backdrop)
	mission_arena = MissionArena.new()
	mission_arena.custom_minimum_size = Vector2(0, 360)
	mission_arena.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	mission_arena.size_flags_vertical = Control.SIZE_EXPAND_FILL
	mission_arena.visible = false
	mission_arena.set("player_data", state.get("player_character", {}))
	mission_arena.connect("action_performed", _on_arena_action)
	center.add_child(mission_arena)
	detail_title = _title("")
	center.add_child(detail_title)
	detail_text = RichTextLabel.new()
	detail_text.bbcode_enabled = true
	detail_text.fit_content = true
	detail_text.custom_minimum_size = Vector2(0, 300)
	detail_text.size_flags_vertical = Control.SIZE_EXPAND_FILL
	detail_text.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	center.add_child(detail_text)
	var actions := _button_grid(4)
	actions.add_theme_constant_override("separation", 8)
	center.add_child(actions)
	actions.add_child(_button("Jogar cena/missao", _play_scene_and_mission))
	actions.add_child(_button("Concluir missao", _complete_mission))
	actions.add_child(_button("Salvar", func() -> void: _autosave("Save manual.")))
	actions.add_child(_button("Galeria 3D", func() -> void: get_tree().change_scene_to_file("res://scenes/model_gallery.tscn")))
	var system_actions := _button_grid(4)
	system_actions.add_theme_constant_override("separation", 8)
	center.add_child(system_actions)
	system_actions.add_child(_button("Conta", _show_account))
	system_actions.add_child(_button("Titulo", _show_title))
	system_actions.add_child(_button("Telas", _show_screens))
	system_actions.add_child(_button("Arsenal", _show_inventory))
	system_actions.add_child(_button("Audio", _show_audio))
	system_actions.add_child(_button("Mundo", _show_world))
	system_actions.add_child(_button("Movimento", _show_movement))
	system_actions.add_child(_button("Config", _show_settings))
	system_actions.add_child(_button("Indie", _show_indie_identity))
	system_actions.add_child(_button("Seguranca", _show_security))
	system_actions.add_child(_button("Builds", _show_builds))
	system_actions.add_child(_button("Codex", _show_codex))
	system_actions.add_child(_button("Completo", _show_parity))
	resource_text = RichTextLabel.new()
	resource_text.bbcode_enabled = true
	resource_text.fit_content = true
	resource_text.custom_minimum_size = Vector2(0, 86)
	resource_text.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	center.add_child(resource_text)

	var right := _panel("profile", 320)
	right_column = right
	right.add_child(_title("Conta"))
	account_name = LineEdit.new()
	account_name.placeholder_text = "Nome da conta"
	account_name.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	account_name.text_changed.connect(func(value: String) -> void:
		state["account"]["name"] = value
		_autosave("Cadastro atualizado.")
	)
	right.add_child(_field("Nome da conta", account_name))
	account_email = LineEdit.new()
	account_email.placeholder_text = "Email"
	account_email.virtual_keyboard_type = LineEdit.KEYBOARD_TYPE_EMAIL_ADDRESS
	account_email.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	account_email.text_changed.connect(func(value: String) -> void:
		state["account"]["email"] = value
		_autosave("Login lembrado no dispositivo.")
	)
	right.add_child(_field("Email lembrado", account_email))
	right.add_child(_title("Personagem"))
	character_name = LineEdit.new()
	character_name.placeholder_text = "Nome"
	character_name.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	character_name.text_changed.connect(func(value: String) -> void:
		state["player_character"]["name"] = value
		_refresh_avatar()
		_autosave("Nome do personagem atualizado.")
	)
	right.add_child(_field("Nome", character_name))
	pronoun = _option("Tratamento", ["Livre", "Ele", "Ela", "Neutro"], _character_option_changed)
	origin = _option("Origem", _origin_labels(), _character_option_changed)
	body_type = _option("Corpo", data.get("characterOptions", {}).get("bodies", []), _character_option_changed)
	body_shape = _option("Forma do corpo", data.get("characterOptions", {}).get("bodyShapes", []), _character_option_changed)
	face_shape = _option("Rosto", data.get("characterOptions", {}).get("faces", []), _character_option_changed)
	eye_shape = _option("Formato dos olhos", data.get("characterOptions", {}).get("eyeShapes", []), _character_option_changed)
	eye_color = _option("Olhos", data.get("characterOptions", {}).get("eyeColors", []), _character_option_changed)
	hair_style = _option("Cabelo", data.get("characterOptions", {}).get("hair", []), _character_option_changed)
	hair_color = _option("Cabelo", data.get("characterOptions", {}).get("hairColors", []), _character_option_changed)
	beard = _option("Barba", data.get("characterOptions", {}).get("beards", []), _character_option_changed)
	palette = _option("Paleta", _palette_labels(), _character_option_changed)
	weapon = _option("Arma", _weapon_ids(), _character_option_changed)
	right.add_child(_field("Tratamento", pronoun))
	right.add_child(_field("Origem", origin))
	right.add_child(_field("Corpo", body_type))
	right.add_child(_field("Forma do corpo", body_shape))
	right.add_child(_field("Rosto", face_shape))
	right.add_child(_field("Formato dos olhos", eye_shape))
	right.add_child(_field("Cor dos olhos", eye_color))
	right.add_child(_field("Tipo de cabelo", hair_style))
	right.add_child(_field("Cor do cabelo", hair_color))
	right.add_child(_field("Barba", beard))
	right.add_child(_field("Paleta", palette))
	right.add_child(_field("Arma", weapon))
	avatar = AvatarPreview.new()
	avatar.custom_minimum_size = Vector2(320, 260)
	avatar.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	right.add_child(avatar)
	log_text = RichTextLabel.new()
	log_text.bbcode_enabled = true
	log_text.fit_content = true
	log_text.custom_minimum_size = Vector2(0, 180)
	log_text.size_flags_vertical = Control.SIZE_EXPAND_FILL
	log_text.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	right.add_child(log_text)
	_build_mission_play_screen()

func _build_mission_play_screen() -> void:
	mission_overlay = PanelContainer.new()
	mission_overlay.visible = false
	mission_overlay.set_anchors_preset(Control.PRESET_FULL_RECT)
	mission_overlay.offset_left = 18
	mission_overlay.offset_top = 18
	mission_overlay.offset_right = -18
	mission_overlay.offset_bottom = -18
	mission_overlay.add_theme_stylebox_override("panel", _mission_overlay_style())
	add_child(mission_overlay)

	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 14)
	margin.add_theme_constant_override("margin_top", 12)
	margin.add_theme_constant_override("margin_right", 14)
	margin.add_theme_constant_override("margin_bottom", 12)
	mission_overlay.add_child(margin)

	var wrap := VBoxContainer.new()
	wrap.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	wrap.size_flags_vertical = Control.SIZE_EXPAND_FILL
	wrap.add_theme_constant_override("separation", 10)
	margin.add_child(wrap)

	var header := HBoxContainer.new()
	header.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	header.add_theme_constant_override("separation", 10)
	wrap.add_child(header)

	mission_overlay_title = _title("Missao jogavel")
	mission_overlay_title.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	header.add_child(mission_overlay_title)
	header.add_child(_button("Voltar painel", _hide_mission_arena))
	header.add_child(_button("Concluir missao", _complete_mission))

	mission_overlay_status = RichTextLabel.new()
	mission_overlay_status.bbcode_enabled = true
	mission_overlay_status.fit_content = true
	mission_overlay_status.custom_minimum_size = Vector2(0, 52)
	mission_overlay_status.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	wrap.add_child(mission_overlay_status)

	mission_overlay_arena = MissionArena.new()
	mission_overlay_arena.custom_minimum_size = Vector2(0, 480)
	mission_overlay_arena.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	mission_overlay_arena.size_flags_vertical = Control.SIZE_EXPAND_FILL
	mission_overlay_arena.set("player_data", state.get("player_character", {}))
	mission_overlay_arena.connect("action_performed", _on_arena_action)
	wrap.add_child(mission_overlay_arena)

	var controls := _button_grid(4)
	controls.add_theme_constant_override("separation", 8)
	wrap.add_child(controls)
	controls.add_child(_button("Subir", func() -> void: mission_overlay_arena.call("command_move", Vector2i(0, -1))))
	controls.add_child(_button("Voltar", func() -> void: mission_overlay_arena.call("command_move", Vector2i(-1, 0))))
	controls.add_child(_button("Acao", func() -> void: mission_overlay_arena.call("command_interact")))
	controls.add_child(_button("Avancar", func() -> void: mission_overlay_arena.call("command_move", Vector2i(1, 0))))
	controls.add_child(_button("Descer", func() -> void: mission_overlay_arena.call("command_move", Vector2i(0, 1))))
	controls.add_child(_button("Atacar", func() -> void: mission_overlay_arena.call("command_attack")))
	controls.add_child(_button("Defender", func() -> void: mission_overlay_arena.call("command_defend")))
	controls.add_child(_button("Objetivo", func() -> void: mission_overlay_arena.call("command_objective")))
	controls.add_child(_button("Rodada", func() -> void: mission_overlay_arena.call("command_new_turn")))
	controls.add_child(_button("Salvar", func() -> void: _autosave("Save manual na missao.")))
	controls.add_child(_button("Fechar", _hide_mission_arena))

func _panel(name: String, width: int) -> VBoxContainer:
	var shell := PanelContainer.new()
	shell.name = "%s_panel" % name
	shell.custom_minimum_size = Vector2(width, 0)
	shell.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	shell.size_flags_vertical = Control.SIZE_EXPAND_FILL
	shell.add_theme_stylebox_override("panel", _panel_style())
	root.add_child(shell)

	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 12)
	margin.add_theme_constant_override("margin_top", 12)
	margin.add_theme_constant_override("margin_right", 12)
	margin.add_theme_constant_override("margin_bottom", 12)
	shell.add_child(margin)

	var scroll := ScrollContainer.new()
	scroll.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	margin.add_child(scroll)

	var panel := VBoxContainer.new()
	panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	panel.size_flags_vertical = Control.SIZE_EXPAND_FILL
	panel.add_theme_constant_override("separation", 10)
	scroll.add_child(panel)
	return panel

func _panel_style() -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = Color(0.055, 0.060, 0.058, 0.92)
	style.border_color = Color(0.82, 0.66, 0.32, 0.26)
	style.set_border_width_all(1)
	style.corner_radius_top_left = 8
	style.corner_radius_top_right = 8
	style.corner_radius_bottom_left = 8
	style.corner_radius_bottom_right = 8
	return style

func _mission_overlay_style() -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = Color(0.025, 0.028, 0.027, 0.98)
	style.border_color = Color(0.82, 0.66, 0.32, 0.50)
	style.set_border_width_all(2)
	style.corner_radius_top_left = 8
	style.corner_radius_top_right = 8
	style.corner_radius_bottom_left = 8
	style.corner_radius_bottom_right = 8
	style.shadow_color = Color(0, 0, 0, 0.50)
	style.shadow_size = 12
	return style

func _title(text: String) -> Label:
	var label := Label.new()
	label.text = text
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	label.add_theme_font_size_override("font_size", 24)
	label.add_theme_color_override("font_color", Color(0.82, 0.66, 0.32))
	return label

func _subtitle(text: String) -> Label:
	var label := Label.new()
	label.text = text
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	label.add_theme_color_override("font_color", Color(0.72, 0.72, 0.68))
	return label

func _field(label_text: String, control: Control) -> VBoxContainer:
	var wrap := VBoxContainer.new()
	wrap.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	wrap.add_theme_constant_override("separation", 4)
	var label := Label.new()
	label.text = label_text
	label.add_theme_font_size_override("font_size", 12)
	label.add_theme_color_override("font_color", Color(0.66, 0.66, 0.62))
	control.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	wrap.add_child(label)
	wrap.add_child(control)
	return wrap

func _button_grid(columns: int) -> GridContainer:
	var grid := GridContainer.new()
	grid.columns = columns
	grid.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	grid.add_theme_constant_override("h_separation", 8)
	grid.add_theme_constant_override("v_separation", 8)
	return grid

func _origin_labels() -> Array[String]:
	var result: Array[String] = []
	for item in data.get("characterOptions", {}).get("origins", []):
		result.append("%s - %s" % [item.get("label", ""), item.get("bonus", "")])
	return result

func _palette_labels() -> Array[String]:
	var result: Array[String] = []
	for item in data.get("characterOptions", {}).get("palettes", []):
		result.append(str(item.get("label", item.get("id", ""))))
	return result

func _weapon_ids() -> Array[String]:
	var result: Array[String] = []
	for item_id in data.get("itemCatalog", {}).keys():
		if data["itemCatalog"][item_id].get("type", "") == "weapon":
			result.append(str(item_id))
	return result

func _button(text: String, callback: Callable) -> Button:
	var button := Button.new()
	button.text = text
	button.custom_minimum_size = Vector2(118, 38)
	button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	button.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	button.pressed.connect(callback)
	return button

func _option(label: String, values: Array, callback: Callable) -> OptionButton:
	var option := OptionButton.new()
	option.tooltip_text = label
	option.custom_minimum_size = Vector2(0, 38)
	option.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	option.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	for value in values:
		option.add_item(str(value))
	option.item_selected.connect(callback)
	return option

func _update_responsive_layout() -> void:
	if root == null:
		return
	var viewport_width := get_viewport_rect().size.x
	var viewport_height := get_viewport_rect().size.y
	if viewport_width < 820:
		root.columns = 1
		_set_panel_widths(260, 260, 260)
		_set_button_columns(2)
	elif viewport_width < 1280:
		root.columns = 2
		_set_panel_widths(280, 420, 280)
		_set_button_columns(3)
	else:
		root.columns = 3
		_set_panel_widths(300, 520, 320)
		_set_button_columns(4)
	if mission_overlay:
		var margin := 8 if viewport_width < 820 else 18
		mission_overlay.offset_left = margin
		mission_overlay.offset_top = margin
		mission_overlay.offset_right = -margin
		mission_overlay.offset_bottom = -margin
	if mission_overlay_arena:
		var reserved := 188.0 if viewport_width >= 820 else 232.0
		mission_overlay_arena.custom_minimum_size = Vector2(0, max(320.0, viewport_height - reserved))

func _set_panel_widths(left_width: int, center_width: int, right_width: int) -> void:
	var widths := [left_width, center_width, right_width]
	var index := 0
	for child in root.get_children():
		if child is Control and index < widths.size():
			child.custom_minimum_size = Vector2(widths[index], 0)
			index += 1
	if avatar:
		avatar.custom_minimum_size = Vector2(min(320, right_width - 24), 260)

func _set_button_columns(columns: int) -> void:
	for grid in center_column.get_children():
		if grid is GridContainer:
			grid.columns = columns

func _refresh_all() -> void:
	var missions: Array = data.get("missions", [])
	mission_list.clear()
	for mission in missions:
		mission_list.add_item("%s. %s" % [mission.get("order", 0), mission.get("title", "")])
	if missions.size() > 0:
		mission_list.select(clamp(selected_mission_index, 0, missions.size() - 1))
	_refresh_account_controls()
	_refresh_character_controls()
	_refresh_mission_detail()
	_refresh_resources()
	_refresh_log()
	_refresh_avatar()

func _refresh_account_controls() -> void:
	var account: Dictionary = state.get("account", {})
	account_name.text = account.get("name", "Jogador")
	account_email.text = account.get("email", "local@aesdivinus")

func _refresh_character_controls() -> void:
	var pc: Dictionary = state.get("player_character", {})
	character_name.text = pc.get("name", "William")
	_select_option_text(pronoun, pc.get("pronoun", "Livre"))
	_select_option_prefix(origin, pc.get("originLabel", "Abakorum"))
	_select_option_text(body_type, pc.get("body", "Atletico"))
	_select_option_text(body_shape, pc.get("bodyShape", "Trapezio"))
	_select_option_text(face_shape, pc.get("face", "Oval"))
	_select_option_text(eye_shape, pc.get("eyeShape", "Amendoados"))
	_select_option_text(eye_color, pc.get("eyeColor", "Castanho"))
	_select_option_text(hair_style, pc.get("hair", "Ondulado 2B"))
	_select_option_text(hair_color, pc.get("hairColor", "Preto natural"))
	_select_option_text(beard, pc.get("beard", "Barba curta"))
	_select_option_prefix(palette, _palette_label_from_id(pc.get("palette", "iron_gold")))
	_select_option_text(weapon, pc.get("weapon", "iron_sword"))

func _select_option_text(option: OptionButton, value: String) -> void:
	for index in option.item_count:
		if option.get_item_text(index) == value:
			option.select(index)
			return

func _select_option_prefix(option: OptionButton, value: String) -> void:
	for index in option.item_count:
		if option.get_item_text(index).begins_with(value):
			option.select(index)
			return

func _palette_label_from_id(id: String) -> String:
	for item in data.get("characterOptions", {}).get("palettes", []):
		if item.get("id", "") == id:
			return str(item.get("label", id))
	return id

func _refresh_mission_detail() -> void:
	var mission := _selected_mission()
	_refresh_backdrop(mission)
	_hide_mission_arena()
	detail_title.text = "%s. %s" % [mission.get("order", 0), mission.get("title", "")]
	var presentation := _mission_presentation(mission)
	var background: Dictionary = presentation.get("background", {})
	detail_text.text = "[b]%s[/b]\nTipo: %s\n\n[b]Fundo proprio[/b]\n%s - %s\nProps: %s\n\nObjetivo: %s\nImpacto: %s\n\nOpcionais:\n- %s" % [
		mission.get("act", ""),
		mission.get("type", ""),
		background.get("name", "Campo de Missao"),
		background.get("mood", ""),
		", ".join(_string_array(background.get("props", []))),
		mission.get("objective", ""),
		mission.get("impact", ""),
		"\n- ".join(mission.get("optional", []))
	]

func _show_inventory() -> void:
	detail_title.text = "Arsenal, lojas e economia"
	var currency: Dictionary = data.get("gameCurrency", {})
	var economy: Dictionary = state.get("economy", {})
	var lines: Array[String] = [
		"[b]%s (%s)[/b]" % [currency.get("name", "Coroas de Aes"), currency.get("symbol", "CA")],
		"Saldo atual: %s %s" % [economy.get("balance", 0), currency.get("symbol", "CA")],
		"Moeda interna singleplayer para compra, venda e progressao.",
		"",
		"[b]Lojas[/b]"
	]
	for shop in data.get("shopAreas", []):
		lines.append("- %s: %s" % [shop.get("name", ""), shop.get("specialty", "")])
	lines.append("")
	lines.append("[b]Itens com pedra vinculada[/b]")
	for item_id in data.get("itemCatalog", {}).keys():
		var item: Dictionary = data["itemCatalog"][item_id]
		lines.append("- %s / %s / Pedra: %s / Compra %s / Venda %s" % [
			item.get("name", item_id),
			item.get("type", ""),
			item.get("stone", ""),
			item.get("price", 0),
			item.get("sellPrice", 0)
		])
	lines.append("")
	lines.append("[b]Inventario salvo[/b]")
	for item_id in state.get("inventory", {}).get("owned", []):
		var item: Dictionary = data.get("itemCatalog", {}).get(item_id, {})
		lines.append("- %s / %s / Pedra: %s" % [item.get("name", item_id), item.get("type", ""), item.get("stone", "")])
	detail_text.text = "\n".join(lines)

func _show_account() -> void:
	detail_title.text = "Conta, login lembrado e autosave"
	var account: Dictionary = state.get("account", {})
	var sync: Dictionary = state.get("githubSync", {})
	detail_text.text = "\n".join([
		"[b]Perfil local[/b]",
		"Nome: %s" % account.get("name", "Jogador"),
		"Email: %s" % account.get("email", "local@aesdivinus"),
		"Lembrar neste dispositivo: %s" % ("sim" if account.get("remember", true) else "nao"),
		"",
		"[b]Autosave obrigatorio[/b]",
		"- conta, login e personagem chamam autosave automaticamente",
		"- estado fica em user://aes_divinus_save.json",
		"- senha nao e salva no estado do Godot",
		"",
		"[b]GitHub preparado[/b]",
		"Repositorio: %s/%s" % [sync.get("owner", ""), sync.get("repo", "")],
		"Branch: %s" % sync.get("branch", "main"),
		"Caminho: %s" % sync.get("path", "saves/aes-divinus-save.json"),
		"Status: configuracao local sem token embutido"
	])

func _show_title() -> void:
	detail_title.text = "Tela de titulo"
	var pc: Dictionary = state.get("player_character", {})
	var lines: Array[String] = [
		"[b]Aes Divinus[/b]",
		"%s carrega a coroa antes de merecer o reino." % pc.get("name", "William"),
		"",
		"[b]Menu principal migrado[/b]",
		"- Continuar campanha",
		"- Iniciar prologo na Floresta de Sangue",
		"- Abrir codex",
		"- Ajustar configuracoes",
		"- Conferir build e plataformas"
	]
	detail_text.text = "\n".join(lines)

func _show_screens() -> void:
	detail_title.text = "Telas e fluxo sequencial"
	var lines: Array[String] = ["[b]Cada tela tem template proprio e ordem de fluxo[/b]"]
	var index := 1
	for screen in data.get("screenFlow", []):
		lines.append("%02d. %s / %s: %s" % [
			index,
			screen.get("label", ""),
			screen.get("template", ""),
			screen.get("purpose", "")
		])
		index += 1
	detail_text.text = "\n".join(lines)

func _show_settings() -> void:
	detail_title.text = "Configuracoes e hardware"
	var settings: Dictionary = state.get("settings", {})
	var quality: Dictionary = data.get("qualityPresets", {}).get(settings.get("quality", "medium"), {})
	var lines: Array[String] = [
		"[b]Perfil aplicado automaticamente[/b]",
		"Qualidade: %s" % quality.get("label", settings.get("quality", "medium")),
		"FPS alvo: %s" % quality.get("fps", 60),
		"Escala de render: %s" % quality.get("renderScale", 1.0),
		"Textura: %s" % quality.get("texture", "alta"),
		"Sombras: %s" % ("ativas" if quality.get("shadows", false) else "reduzidas"),
		"",
		"[b]Acessibilidade e tela[/b]",
		"Fonte: %s | Interface: %s" % [settings.get("fontScale", 1.0), settings.get("interfaceScale", 1.0)],
		"Tamanho de tela: %s | Densidade: %s" % [settings.get("screenWidth", "auto"), settings.get("layoutDensity", "normal")],
		"Contraste: %s | Cores: %s" % [settings.get("contrast", "normal"), settings.get("colorBlindMode", "off")],
		"Movimento: %s | Botoes: %s" % [settings.get("motion", "auto"), settings.get("targetSize", "auto")],
		"",
		"[b]Perfis disponiveis[/b]"
	]
	for key in data.get("qualityPresets", {}).keys():
		var preset_data: Dictionary = data["qualityPresets"][key]
		lines.append("- %s: %s FPS, textura %s" % [preset_data.get("label", key), preset_data.get("fps", 60), preset_data.get("texture", "")])
	detail_text.text = "\n".join(lines)

func _show_indie_identity() -> void:
	_hide_mission_arena()
	detail_title.text = "Identidade indie"
	var indie: Dictionary = data.get("indieGameIdentity", {})
	var lines: Array[String] = [
		"[b]%s[/b]" % indie.get("label", "Indie"),
		indie.get("positioning", "Aes Divinus como RPG tatico indie autoral."),
		"",
		"[b]Tags de loja/Steam sugeridas[/b]",
		"- %s" % "\n- ".join(_string_array(indie.get("steamTags", []))),
		"",
		"[b]Pilares indie dentro do jogo[/b]",
		"- %s" % "\n- ".join(_string_array(indie.get("pillars", []))),
		"",
		"[b]Como junta com o RPG tatico[/b]",
		"- %s" % "\n- ".join(_string_array(indie.get("gameplayBlend", []))),
		"",
		"[b]Obrigatorio para polimento indie[/b]",
		"- %s" % "\n- ".join(_string_array(indie.get("accessibilityMustHave", []))),
		"",
		"[b]Cuidados de publicacao[/b]",
		"- %s" % "\n- ".join(_string_array(indie.get("compliance", [])))
	]
	detail_text.text = "\n".join(lines)

func _show_audio() -> void:
	detail_title.text = "Audio e sons por contexto"
	var lines: Array[String] = ["[b]Catalogo de audio importado da versao anterior[/b]"]
	for key in data.get("audioCatalog", {}).keys():
		var item: Dictionary = data["audioCatalog"][key]
		var file_names: Array[String] = []
		for file in item.get("files", []):
			file_names.append(str(file))
		lines.append("- %s: %s | arquivos: %s" % [key, item.get("label", ""), ", ".join(file_names)])
	lines.append("")
	lines.append("Os MP3 locais ficam em godot/assets/audio e podem ser ligados a AudioStreamPlayer no Godot.")
	detail_text.text = "\n".join(lines)

func _show_world() -> void:
	detail_title.text = "Mundo, personagens e bestiario"
	var lore: Dictionary = data.get("worldLore", {})
	var lines: Array[String] = [
		"[b]Inicio[/b]",
		"%s - %s" % [lore.get("startingDate", ""), lore.get("startingRegion", "")],
		"",
		"[b]Aes Divinus[/b]",
		lore.get("aesDivinus", ""),
		lore.get("aesWeapons", ""),
		"",
		"[b]Ducados de Gradron[/b]"
	]
	for duchy in data.get("duchies", []):
		lines.append("- %s: %s | Emblema: %s" % [duchy.get("name", ""), duchy.get("specialty", ""), duchy.get("emblem", "")])
	lines.append("")
	lines.append("[b]Personagens[/b]")
	for character in data.get("characterDatabase", []):
		lines.append("- %s (%s): %s" % [character.get("name", ""), character.get("role", ""), character.get("description", "")])
	lines.append("")
	lines.append("[b]Bestiario[/b]")
	for creature in data.get("bestiary", []):
		lines.append("- %s / %s: %s" % [creature.get("name", ""), creature.get("act", ""), creature.get("combat", "")])
	lines.append("")
	lines.append("[b]Marcas[/b]")
	for mark in data.get("divineMarks", []):
		lines.append("- %s (%s): %s" % [mark.get("name", ""), mark.get("domain", ""), mark.get("gameplay", "")])
	detail_text.text = "\n".join(lines)

func _show_movement() -> void:
	detail_title.text = "Exploracao 3D e sistemas Godot"
	var structure: Dictionary = data.get("godotGameStructure", {})
	var lines: Array[String] = [
		"[b]Estilo Godot[/b]",
		structure.get("targetStyle", ""),
		structure.get("note", ""),
		"",
		"[b]Loop principal[/b]",
		" -> ".join(_string_array(data.get("coreGameLoop", []))),
		"",
		"[b]Pilares[/b]"
	]
	for pillar in data.get("designPillars", []):
		lines.append("- " + str(pillar))
	lines.append("")
	lines.append("[b]Exploracao 3D[/b]")
	for system in data.get("exploration3DSystems", []):
		lines.append("- %s: %s" % [system.get("name", ""), system.get("function", "")])
	lines.append("")
	lines.append("[b]Combate tatico 3D[/b]")
	for system in data.get("tactical3DSystems", []):
		lines.append("- %s: %s" % [system.get("name", ""), system.get("rule", "")])
	lines.append("")
	lines.append("[b]Camera 3D[/b]")
	for profile in data.get("camera3DProfiles", []):
		lines.append("- %s: %s" % [profile.get("context", ""), profile.get("camera", "")])
	lines.append("")
	lines.append("[b]Estados do jogador[/b]")
	for action in data.get("sideScrollerActions", []):
		lines.append("- %s / %s / %s: %s" % [
			action.get("state", ""),
			action.get("animation", ""),
			action.get("input", ""),
			action.get("gameplay", "")
		])
	lines.append("")
	lines.append("[b]Comandos de lideranca[/b]")
	for command in data.get("leadershipCommands", []):
		lines.append("- %s: %s" % [command.get("name", ""), command.get("effect", "")])
	lines.append("")
	lines.append("[b]IA[/b]")
	for archetype in data.get("aiArchetypes", []):
		lines.append("- %s: %s" % [archetype.get("name", ""), archetype.get("behavior", "")])
	lines.append("")
	lines.append("[b]HUD[/b]")
	for hud in data.get("hudSpecs", []):
		lines.append("- %s: %s" % [hud.get("context", ""), hud.get("layout", "")])
	lines.append("")
	lines.append("[b]Arquitetura Godot[/b]")
	for tech in data.get("godotTechnicalArchitecture", []):
		lines.append("- %s: %s" % [tech.get("system", ""), tech.get("responsibility", "")])
	lines.append("")
	lines.append("[b]Performance e modo seguro[/b]")
	for profile in data.get("performanceProfiles3D", []):
		lines.append("- %s: %s" % [profile.get("target", ""), profile.get("graphics", "")])
	for item in data.get("safeModeRecovery", []):
		lines.append("- " + str(item))
	lines.append("")
	lines.append("[b]Rotas de William[/b]")
	for route in data.get("williamRoutes", []):
		lines.append("- %s: %s | Defeitos: %s | Marcas: %s" % [
			route.get("name", ""),
			route.get("personality", ""),
			route.get("flaws", ""),
			", ".join(_string_array(route.get("markBias", [])))
		])
	lines.append("")
	lines.append("[b]Decisoes de conversao[/b]")
	for decision in structure.get("conversionDecisions", []):
		lines.append("- " + str(decision))
	lines.append("")
	lines.append("[b]Pastas/cenas planejadas[/b]")
	for scene_path in structure.get("sceneFolders", []):
		lines.append("- " + str(scene_path))
	detail_text.text = "\n".join(lines)

func _string_array(values: Array) -> Array[String]:
	var result: Array[String] = []
	for value in values:
		result.append(str(value))
	return result

func _show_legacy_movement() -> void:
	detail_title.text = "Movimentos legados"
	var structure: Dictionary = data.get("godotGameStructure", {})
	var lines: Array[String] = [
		"[b]Referencia anterior convertida[/b]",
		structure.get("note", ""),
		"",
		"[b]Estados do jogador[/b]"
	]
	for action in data.get("sideScrollerActions", []):
		lines.append("- %s / %s / %s: %s" % [
			action.get("state", ""),
			action.get("animation", ""),
			action.get("input", ""),
			action.get("gameplay", "")
		])
	lines.append("")
	lines.append("[b]Rotas de William[/b]")
	for route in data.get("williamRoutes", []):
		lines.append("- %s: %s | Defeitos: %s | Marcas: %s" % [
			route.get("name", ""),
			route.get("personality", ""),
			route.get("flaws", ""),
			", ".join(_string_array(route.get("markBias", [])))
		])
	lines.append("")
	lines.append("[b]Pastas/cenas planejadas[/b]")
	for scene_path in structure.get("sceneFolders", []):
		lines.append("- " + str(scene_path))
	detail_text.text = "\n".join(lines)

func _show_security() -> void:
	detail_title.text = "Seguranca, privacidade e leis"
	detail_text.text = "\n".join([
		"[b]Protecoes obrigatorias mantidas na migracao[/b]",
		"- save local no Godot em user://aes_divinus_save.json",
		"- senha nao entra no estado do jogo",
		"- dados remotos devem redigir email bruto, token e identificador do dispositivo",
		"- sincronizacao GitHub fica preparada, mas sem token embutido",
		"- comunicacoes oficiais exigem avaliacao humana, juridica e tecnica",
		"- incidentes seguem plano de resposta e preservacao de evidencias",
		"",
		"[b]Documentos incluidos[/b]",
		"- Politica de Privacidade",
		"- Termos de Uso",
		"- Checklist Legal e de Plataforma",
		"- Plano de Resposta a Incidentes Ciberneticos",
		"- Contatos Globais de Autoridades",
		"- Direitos/Publicacao Steam/Regras",
		"- Pipeline de Modelagem Godot/Blender"
	])

func _show_builds() -> void:
	detail_title.text = "Plataformas e builds"
	detail_text.text = "\n".join([
		"[b]Alvos preservados[/b]",
		"- Windows",
		"- Linux",
		"- Android",
		"- iOS",
		"- Steam",
		"",
		"[b]Godot[/b]",
		"- projeto base em godot/project.godot",
		"- C++ preparado em godot/native",
		"- GDExtension depende de compilador C++, SCons/CMake e godot-cpp",
		"- export presets finais devem ser configurados quando certificados/SDKs oficiais estiverem prontos"
	])

func _show_codex() -> void:
	detail_title.text = "Codex e sistemas"
	var lines: Array[String] = []
	for entry in data.get("codex", []):
		lines.append("[b]%s[/b]\n%s\n" % [entry.get("title", ""), entry.get("text", "")])
	lines.append("[b]Modelagem[/b]\nGaleria 3D, specs JSON e pipeline Blender/glTF estao dentro do projeto Godot.")
	detail_text.text = "\n".join(lines)

func _show_parity() -> void:
	detail_title.text = "Nada pode faltar"
	var manifest: Dictionary = data.get("parityManifest", {})
	var lines: Array[String] = [
		"[b]Regra[/b]",
		manifest.get("requiredStatus", ""),
		"",
		"[b]Sistemas obrigatorios representados[/b]"
	]
	for item in manifest.get("gameplaySystems", []):
		lines.append("- " + str(item))
	lines.append("")
	lines.append("[b]Documentos obrigatorios[/b]")
	for doc in manifest.get("documents", []):
		lines.append("- " + str(doc))
	lines.append("")
	lines.append("[b]Plataformas[/b]")
	for target in manifest.get("buildTargets", []):
		lines.append("- " + str(target))
	detail_text.text = "\n".join(lines)

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
	state["player_character"]["pronoun"] = pronoun.get_item_text(pronoun.selected)
	var origin_text := origin.get_item_text(origin.selected)
	state["player_character"]["originLabel"] = origin_text.split(" - ")[0]
	state["player_character"]["origin"] = _origin_id_from_label(state["player_character"]["originLabel"])
	state["player_character"]["body"] = body_type.get_item_text(body_type.selected)
	state["player_character"]["bodyShape"] = body_shape.get_item_text(body_shape.selected)
	state["player_character"]["face"] = face_shape.get_item_text(face_shape.selected)
	state["player_character"]["eyeShape"] = eye_shape.get_item_text(eye_shape.selected)
	state["player_character"]["eyeColor"] = eye_color.get_item_text(eye_color.selected)
	state["player_character"]["hair"] = hair_style.get_item_text(hair_style.selected)
	state["player_character"]["hairColor"] = hair_color.get_item_text(hair_color.selected)
	state["player_character"]["beard"] = beard.get_item_text(beard.selected)
	state["player_character"]["palette"] = _palette_id_from_label(palette.get_item_text(palette.selected))
	state["player_character"]["weapon"] = weapon.get_item_text(weapon.selected)
	_refresh_avatar()
	_autosave("Personagem atualizado.")

func _origin_id_from_label(label: String) -> String:
	for item in data.get("characterOptions", {}).get("origins", []):
		if item.get("label", "") == label:
			return str(item.get("id", label))
	return label

func _palette_id_from_label(label: String) -> String:
	for item in data.get("characterOptions", {}).get("palettes", []):
		if item.get("label", "") == label:
			return str(item.get("id", label))
	return label

func _selected_mission() -> Dictionary:
	var missions: Array = data.get("missions", [])
	if missions.is_empty():
		return {}
	return missions[clamp(selected_mission_index, 0, missions.size() - 1)]

func _start_scene() -> void:
	var mission := _selected_mission()
	var scenes: Array = data.get("missionScenes", {}).get(mission.get("id", ""), [])
	state["mode"] = "mission_scene"
	state["currentSceneIndex"] = 0
	_show_scene_screen(mission, scenes)
	_add_journal_once("Cena iniciada: %s." % mission.get("title", "Missao"))
	_autosave("Cena iniciada.")

func _play_scene_and_mission() -> void:
	var mission := _selected_mission()
	var scenes: Array = data.get("missionScenes", {}).get(mission.get("id", ""), [])
	state["mode"] = "mission"
	state["currentSceneIndex"] = 0
	_show_playable_mission_flow(mission, scenes)
	_add_journal_once("Cena e missao iniciadas: %s." % mission.get("title", "Missao"))
	_autosave("Cena e missao iniciadas.")

func _start_mission() -> void:
	var mission := _selected_mission()
	state["mode"] = "mission"
	_show_mission_screen(mission)
	_add_journal_once("Missao iniciada: %s." % mission.get("title", "Missao"))
	_autosave("Missao iniciada.")

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
	state["mode"] = "mission_result"
	_add_journal_once("Missao resolvida: %s." % mission.get("title", ""))
	_show_mission_result(mission)
	selected_mission_index = min(selected_mission_index + 1, data.get("missions", []).size() - 1)
	mission_list.select(selected_mission_index)
	_refresh_resources()
	_autosave("Missao resolvida.")

func _show_scene_screen(mission: Dictionary, scenes: Array) -> void:
	_refresh_backdrop(mission)
	var scene: Dictionary = {}
	if scenes.is_empty():
		scene = {
			"title": mission.get("title", "Cena"),
			"camera": "Camera cinematica focada no objetivo principal.",
			"text": mission.get("objective", ""),
			"choice": "Prosseguir",
			"effect": mission.get("impact", "")
		}
	else:
		scene = scenes[0]
	detail_title.text = "Cena - %s" % scene.get("title", mission.get("title", ""))
	detail_text.text = "\n".join([
		"[b]Cena ativa[/b]",
		scene.get("text", ""),
		"",
		"[b]Camera[/b]",
		scene.get("camera", ""),
		"",
		"[b]Escolha[/b]",
		scene.get("choice", "Prosseguir"),
		"",
		"[b]Consequencia[/b]",
		scene.get("effect", mission.get("impact", "")),
		"",
		"[b]Proximo passo[/b]",
		"Use Jogar cena/missao para abrir a narrativa e o encontro jogavel juntos."
	])

func _show_playable_mission_flow(mission: Dictionary, scenes: Array) -> void:
	_refresh_backdrop(mission)
	var scene: Dictionary = {}
	if scenes.is_empty():
		scene = {
			"title": mission.get("title", "Cena"),
			"camera": "Camera cinematica focada no objetivo principal.",
			"text": mission.get("objective", ""),
			"choice": "Prosseguir",
			"effect": mission.get("impact", "")
		}
	else:
		scene = scenes[0]
	var enemies := _mission_enemies(mission)
	var presentation := _mission_presentation(mission)
	var background: Dictionary = presentation.get("background", {})
	var gameplay: Dictionary = presentation.get("gameplay", {})
	var mission_actions: Array = presentation.get("actions", [])
	var rewards: Dictionary = mission.get("rewards", {})
	_show_mission_arena(mission, presentation, enemies)
	var lines: Array[String] = [
		"[b]Cena em execucao[/b]",
		scene.get("text", ""),
		"",
		"[b]Camera[/b]",
		scene.get("camera", ""),
		"",
		"[b]Escolha da cena[/b]",
		scene.get("choice", "Prosseguir"),
		"",
		"[b]Missao jogavel ativa[/b]",
		"%s - %s" % [mission.get("act", ""), mission.get("title", "")],
		"Tipo: %s" % mission.get("type", ""),
		"Objetivo: %s" % mission.get("objective", ""),
		"",
		"[b]Fundo da missao[/b]",
		"%s: %s" % [background.get("name", "Campo de Missao"), background.get("mood", "")],
		"Camera: %s" % background.get("camera", ""),
		"Props: %s" % ", ".join(_string_array(background.get("props", []))),
		"",
		"[b]Arquetipo tatico[/b]",
		"%s" % gameplay.get("label", "Encontro tatico"),
		"Pressao: %s" % gameplay.get("pressure", ""),
		"",
		"[b]Vitoria[/b]",
		"- %s" % "\n- ".join(_string_array(gameplay.get("victory", []))),
		"",
		"[b]Falha[/b]",
		"- %s" % "\n- ".join(_string_array(gameplay.get("failure", []))),
		"",
		"[b]Interacoes de ambiente[/b]",
		"- %s" % "\n- ".join(_string_array(gameplay.get("interactions", []))),
		"",
		"[b]Jogabilidade acontecendo[/b]",
		"- A cena abre a situacao.",
		"- A missao entra no mesmo fluxo.",
		"- Turnos, PA, movimento, cobertura, medo, coragem e lideranca ficam representados neste encontro.",
		"- Ao concluir, recompensas e consequencias sao aplicadas e o jogo avanca.",
		"",
		"[b]Acoes proprias desta missao[/b]"
	]
	for action in mission_actions:
		lines.append("- %s [%s]: %s" % [
			action.get("label", ""),
			action.get("cost", ""),
			action.get("effect", "")
		])
	lines.append("")
	lines.append_array([
		"[b]Ameacas no encontro[/b]"
	])
	for enemy in enemies:
		lines.append("- %s / %s / HP %s / arma %s" % [
			enemy.get("name", ""),
			enemy.get("role", ""),
			enemy.get("maxHp", enemy.get("hp", 0)),
			enemy.get("weapon", "")
		])
	lines.append("")
	lines.append("[b]Recompensas previstas[/b]")
	lines.append("Comida %s | Madeira %s | Ferro %s | Ouro %s | Tropas %s" % [
		rewards.get("food", 0),
		rewards.get("wood", 0),
		rewards.get("iron", 0),
		rewards.get("gold", 0),
		rewards.get("troops", 0)
	])
	lines.append("")
	lines.append("[b]Comando[/b]")
	lines.append("Use Concluir missao para resolver o encontro, salvar resultado e avancar.")
	detail_title.text = "Jogando - %s" % mission.get("title", "")
	detail_text.text = "\n".join(lines)

func _show_mission_screen(mission: Dictionary) -> void:
	_refresh_backdrop(mission)
	var enemies := _mission_enemies(mission)
	var presentation := _mission_presentation(mission)
	var background: Dictionary = presentation.get("background", {})
	var gameplay: Dictionary = presentation.get("gameplay", {})
	var mission_actions: Array = presentation.get("actions", [])
	var rewards: Dictionary = mission.get("rewards", {})
	_show_mission_arena(mission, presentation, enemies)
	var lines: Array[String] = [
		"[b]Missao ativa[/b]",
		"%s - %s" % [mission.get("act", ""), mission.get("title", "")],
		"Tipo: %s" % mission.get("type", ""),
		"",
		"[b]Objetivo jogavel[/b]",
		mission.get("objective", ""),
		"",
		"[b]Fundo da missao[/b]",
		"%s: %s" % [background.get("name", "Campo de Missao"), background.get("mood", "")],
		"Camera: %s" % background.get("camera", ""),
		"",
		"[b]Arquetipo tatico[/b]",
		"%s" % gameplay.get("label", "Encontro tatico"),
		"Pressao: %s" % gameplay.get("pressure", ""),
		"Vitoria: %s" % " / ".join(_string_array(gameplay.get("victory", []))),
		"Falha: %s" % " / ".join(_string_array(gameplay.get("failure", []))),
		"Interacoes: %s" % " / ".join(_string_array(gameplay.get("interactions", []))),
		"",
		"[b]Regras em uso[/b]",
		"- Turnos com 2 PA",
		"- Movimento, ataque, cobertura, medo, coragem e lideranca",
		"- Autosave ao iniciar e concluir",
		"",
		"[b]Acoes proprias[/b]"
	]
	for action in mission_actions:
		lines.append("- %s [%s]: %s" % [
			action.get("label", ""),
			action.get("cost", ""),
			action.get("effect", "")
		])
	lines.append("")
	lines.append("[b]Inimigos/ameacas previstas[/b]")
	for enemy in enemies:
		lines.append("- %s / %s / HP %s / arma %s" % [
			enemy.get("name", ""),
			enemy.get("role", ""),
			enemy.get("maxHp", enemy.get("hp", 0)),
			enemy.get("weapon", "")
		])
	lines.append("")
	lines.append("[b]Recompensas e impacto[/b]")
	lines.append("Comida %s | Madeira %s | Ferro %s | Ouro %s | Tropas %s" % [
		rewards.get("food", 0),
		rewards.get("wood", 0),
		rewards.get("iron", 0),
		rewards.get("gold", 0),
		rewards.get("troops", 0)
	])
	lines.append(mission.get("impact", ""))
	lines.append("")
	lines.append("[b]Comando[/b]")
	lines.append("Use Concluir missao para registrar resultado, aplicar recompensas e avancar.")
	detail_title.text = "Missao - %s" % mission.get("title", "")
	detail_text.text = "\n".join(lines)

func _show_mission_result(mission: Dictionary) -> void:
	_refresh_backdrop(mission)
	_hide_mission_arena()
	var completed: Array = state.get("campaign", {}).get("completed", [])
	detail_title.text = "Resultado - %s" % mission.get("title", "")
	detail_text.text = "\n".join([
		"[b]Missao concluida[/b]",
		"Registro salvo no banco local e no estado da campanha.",
		"",
		"[b]Total concluido[/b]",
		"%s missoes/cenas." % completed.size(),
		"",
		"[b]Impacto aplicado[/b]",
		mission.get("impact", ""),
		"",
		"[b]Proxima missao selecionada[/b]",
		"A lista avanca automaticamente para o proximo ponto da campanha."
	])

func _show_mission_arena(mission: Dictionary, presentation: Dictionary, enemies: Array) -> void:
	if mission_overlay == null or mission_overlay_arena == null:
		return
	if mission_arena:
		mission_arena.visible = false
	if mission_backdrop:
		mission_backdrop.visible = false
	var gameplay: Dictionary = presentation.get("gameplay", {})
	mission_overlay.visible = true
	mission_overlay_title.text = "Jogando - %s" % mission.get("title", "Missao")
	mission_overlay_status.text = "[b]%s[/b] | %s\nObjetivo: %s" % [
		gameplay.get("label", mission.get("type", "Encontro tatico")),
		gameplay.get("pressure", mission.get("impact", "")),
		mission.get("objective", "")
	]
	mission_overlay_arena.set("player_data", state.get("player_character", {}))
	mission_overlay_arena.call("setup", mission, presentation, enemies)
	mission_overlay_arena.grab_focus()
	_update_responsive_layout()

func _hide_mission_arena() -> void:
	if mission_overlay:
		mission_overlay.visible = false
	if mission_arena:
		mission_arena.visible = false
	if mission_backdrop:
		mission_backdrop.visible = true

func _on_arena_action(message: String) -> void:
	_add_journal_once(message)
	var mission := _selected_mission()
	var campaign: Dictionary = state.get("campaign", {})
	campaign["activeMission"] = {
		"id": mission.get("id", ""),
		"title": mission.get("title", ""),
		"message": message,
		"at": Time.get_datetime_string_from_system(true)
	}
	state["campaign"] = campaign
	_autosave("Acao jogavel da missao.")

func _mission_enemies(mission: Dictionary) -> Array:
	var sets: Dictionary = data.get("enemySets", {})
	var set_id := str(mission.get("enemySet", ""))
	if set_id == "" or not sets.has(set_id):
		if str(mission.get("type", "")).contains("Chefe"):
			set_id = "manifestation"
		else:
			set_id = "forest_first_contact"
	return sets.get(set_id, [])

func _mission_presentation(mission: Dictionary) -> Dictionary:
	return data.get("missionPresentation", {}).get(mission.get("id", ""), {})

func _refresh_backdrop(mission: Dictionary) -> void:
	if mission_backdrop == null:
		return
	var presentation := _mission_presentation(mission)
	mission_backdrop.set("mission_data", mission)
	mission_backdrop.set("presentation_data", presentation)
	mission_backdrop.queue_redraw()

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

func _add_journal_once(line: String) -> void:
	var journal: Array = state.get("campaign", {}).get("journal", [])
	if journal.is_empty() or journal.back() != line:
		_add_journal(line)

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

class MissionArena:
	extends Control

	signal action_performed(message: String)

	const GRID_W := 8
	const GRID_H := 6

	var mission_data: Dictionary = {}
	var presentation_data: Dictionary = {}
	var player_data: Dictionary = {}
	var enemy_data: Array = []
	var enemy_cells: Array[Vector2i] = []
	var cover_cells: Array[Vector2i] = []
	var player_cell := Vector2i(1, 4)
	var visual_player_cell := Vector2(1, 4)
	var objective_cell := Vector2i(6, 1)
	var turn := 1
	var action_points := 2
	var guarded := false
	var action_fx_timer := 0.0
	var action_fx_kind := ""
	var action_fx_cell := Vector2i.ZERO
	var action_fx_origin := Vector2i.ZERO
	var last_message := "Use WASD, setas, clique ou toque para mover William."

	func _ready() -> void:
		focus_mode = Control.FOCUS_ALL
		mouse_filter = Control.MOUSE_FILTER_STOP
		set_process(true)

	func setup(mission: Dictionary, presentation: Dictionary, enemies: Array) -> void:
		mission_data = mission
		presentation_data = presentation
		enemy_data = enemies
		player_cell = Vector2i(1, 4)
		visual_player_cell = Vector2(player_cell)
		objective_cell = _objective_for_mission()
		enemy_cells = []
		var base_cells := [Vector2i(5, 2), Vector2i(6, 4), Vector2i(4, 1), Vector2i(7, 3)]
		for index in enemy_data.size():
			enemy_cells.append(base_cells[index % base_cells.size()])
		cover_cells = _cover_for_mission()
		turn = 1
		action_points = 2
		guarded = false
		action_fx_timer = 0.0
		action_fx_kind = "start"
		action_fx_cell = player_cell
		action_fx_origin = player_cell
		last_message = "Missao jogavel aberta: mova William ate o objetivo e interaja com ameacas."
		queue_redraw()

	func _process(delta: float) -> void:
		var target := Vector2(player_cell)
		visual_player_cell = visual_player_cell.lerp(target, min(1.0, delta * 9.0))
		if action_fx_timer > 0.0:
			action_fx_timer = max(0.0, action_fx_timer - delta)
		if visual_player_cell.distance_to(target) > 0.01 or action_fx_timer > 0.0:
			queue_redraw()

	func _gui_input(event: InputEvent) -> void:
		if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
			_move_or_interact(_cell_from_position(event.position))
			accept_event()
		elif event is InputEventScreenTouch and event.pressed:
			_move_or_interact(_cell_from_position(event.position))
			accept_event()
		elif event is InputEventKey and event.pressed and not event.echo:
			var handled := true
			if event.keycode in [KEY_W, KEY_UP]:
				_step(Vector2i(0, -1))
			elif event.keycode in [KEY_S, KEY_DOWN]:
				_step(Vector2i(0, 1))
			elif event.keycode in [KEY_A, KEY_LEFT]:
				_step(Vector2i(-1, 0))
			elif event.keycode in [KEY_D, KEY_RIGHT]:
				_step(Vector2i(1, 0))
			elif event.keycode in [KEY_SPACE, KEY_ENTER]:
				_interact_current()
			elif event.keycode == KEY_Q:
				_attack_nearest()
			elif event.keycode == KEY_E:
				_defend()
			elif event.keycode == KEY_F:
				_interact_current()
			elif event.keycode == KEY_R:
				_new_turn()
			else:
				handled = false
			if handled:
				accept_event()

	func _draw() -> void:
		var rect := Rect2(Vector2.ZERO, size)
		var background: Dictionary = presentation_data.get("background", {})
		var palette: Array = background.get("palette", ["#101414", "#242827", "#6e8fa4", "#d0a951"])
		var base := _color(palette[0], Color(0.04, 0.05, 0.05))
		var mid := _color(palette[min(1, palette.size() - 1)], Color(0.14, 0.15, 0.15))
		var accent := _color(palette[min(2, palette.size() - 1)], Color(0.43, 0.56, 0.64))
		var gold := _color(palette[min(3, palette.size() - 1)], Color(0.82, 0.66, 0.32))
		draw_rect(rect, base, true)
		draw_rect(rect.grow(-1), Color(gold.r, gold.g, gold.b, 0.35), false, 1.0)

		var board := _board_rect()
		draw_rect(board.grow(16), Color(0, 0, 0, 0.24), true)
		draw_rect(board, mid.darkened(0.20), true)
		_draw_environment(board, str(background.get("id", "battlefield")), accent, gold, mid)
		_draw_path_overlay(board, gold)
		_draw_cover(board, accent, gold)
		_draw_objective(board, gold)
		_draw_enemies(board)
		_draw_action_fx(board, gold, accent)
		_draw_player(board, gold)
		_draw_hud(board, gold)

	func _board_rect() -> Rect2:
		var pad := 20.0
		var top_h := 44.0
		var hud_h := 84.0
		var available := Vector2(max(80.0, size.x - pad * 2.0), max(80.0, size.y - pad * 2.0 - top_h - hud_h))
		var target_ratio := float(GRID_W) / float(GRID_H)
		var board_w := available.x
		var board_h := board_w / target_ratio
		if board_h > available.y:
			board_h = available.y
			board_w = board_h * target_ratio
		var x := (size.x - board_w) * 0.5
		var y := pad + top_h + (available.y - board_h) * 0.5
		return Rect2(Vector2(x, y), Vector2(board_w, board_h))

	func _cell_size(board: Rect2) -> Vector2:
		return Vector2(board.size.x / float(GRID_W), board.size.y / float(GRID_H))

	func _cell_center(board: Rect2, cell: Vector2i) -> Vector2:
		var cs := _cell_size(board)
		return board.position + Vector2((float(cell.x) + 0.5) * cs.x, (float(cell.y) + 0.5) * cs.y)

	func _cell_from_position(pos: Vector2) -> Vector2i:
		var board := _board_rect()
		var cs := _cell_size(board)
		var local := pos - board.position
		return Vector2i(clamp(int(floor(local.x / cs.x)), 0, GRID_W - 1), clamp(int(floor(local.y / cs.y)), 0, GRID_H - 1))

	func _move_or_interact(target: Vector2i) -> void:
		if not _inside(target):
			return
		if target == player_cell:
			_interact_current()
			return
		var enemy_index := enemy_cells.find(target)
		if enemy_index >= 0:
			if _distance(player_cell, target) <= 1:
				_attack(enemy_index)
			else:
				_try_move_toward(target)
			return
		if target == objective_cell and _distance(player_cell, objective_cell) <= 1:
			_interact_objective()
			return
		_try_move_toward(target)

	func _try_move_toward(target: Vector2i) -> void:
		if action_points <= 0:
			_new_turn()
			return
		var next := player_cell
		if abs(target.x - player_cell.x) > abs(target.y - player_cell.y):
			next.x += signi(target.x - player_cell.x)
		elif target.y != player_cell.y:
			next.y += signi(target.y - player_cell.y)
		elif target.x != player_cell.x:
			next.x += signi(target.x - player_cell.x)
		_move_to(next)

	func _step(delta: Vector2i) -> void:
		_move_to(player_cell + delta)

	func _move_to(cell: Vector2i) -> void:
		if action_points <= 0:
			_new_turn()
			return
		if not _inside(cell) or enemy_cells.has(cell):
			last_message = "Caminho bloqueado. Escolha outra rota."
			queue_redraw()
			return
		player_cell = cell
		action_points -= 1
		guarded = false
		_start_fx("move", player_cell, player_cell)
		var cover_note := " em cobertura" if cover_cells.has(player_cell) else ""
		last_message = "William moveu para setor %s,%s%s. PA restante: %s." % [player_cell.x + 1, player_cell.y + 1, cover_note, action_points]
		action_performed.emit(last_message)
		if player_cell == objective_cell or _distance(player_cell, objective_cell) <= 1:
			last_message = "Objetivo ao alcance. Use Espaco/Enter ou toque no objetivo para interagir."
		queue_redraw()

	func _interact_current() -> void:
		if _distance(player_cell, objective_cell) <= 1:
			_interact_objective()
			return
		for index in enemy_cells.size():
			if _distance(player_cell, enemy_cells[index]) <= 1:
				_attack(index)
				return
		last_message = "Nada ao alcance. Mova ate objetivo, cobertura ou inimigo."
		queue_redraw()

	func _attack(index: int) -> void:
		if action_points <= 0:
			_new_turn()
			return
		if index < 0 or index >= enemy_cells.size():
			return
		var enemy_name := str(enemy_data[index].get("name", "Ameaca"))
		var target_cell := enemy_cells[index]
		enemy_cells.remove_at(index)
		enemy_data.remove_at(index)
		action_points -= 1
		guarded = false
		_start_fx("attack", target_cell, player_cell)
		last_message = "William atacou %s. Ameacas restantes: %s." % [enemy_name, enemy_cells.size()]
		action_performed.emit(last_message)
		queue_redraw()

	func _attack_nearest() -> void:
		var nearest := -1
		var nearest_distance := 999
		for index in enemy_cells.size():
			var d := _distance(player_cell, enemy_cells[index])
			if d < nearest_distance:
				nearest = index
				nearest_distance = d
		if nearest == -1:
			last_message = "Nao ha ameacas visiveis para atacar."
			queue_redraw()
			return
		if nearest_distance > 1:
			last_message = "Ameaca fora de alcance. Aproxime William ou use cobertura."
			_start_fx("warn", enemy_cells[nearest], player_cell)
			queue_redraw()
			return
		_attack(nearest)

	func _defend() -> void:
		if action_points <= 0:
			_new_turn()
			return
		action_points -= 1
		guarded = true
		_start_fx("defend", player_cell, player_cell)
		var cover_note := " com bonus de cobertura" if cover_cells.has(player_cell) else ""
		last_message = "William assumiu defesa%s. Proximo ataque sofre penalidade." % cover_note
		action_performed.emit(last_message)
		queue_redraw()

	func _interact_objective() -> void:
		if action_points <= 0:
			_new_turn()
			return
		action_points -= 1
		guarded = false
		_start_fx("objective", objective_cell, player_cell)
		var gameplay: Dictionary = presentation_data.get("gameplay", {})
		last_message = "Objetivo executado: %s" % str(mission_data.get("objective", "missao"))
		if gameplay.has("pressure"):
			last_message += " | Pressao: %s" % gameplay.get("pressure", "")
		action_performed.emit(last_message)
		queue_redraw()

	func _new_turn() -> void:
		turn += 1
		action_points = 2
		guarded = false
		_start_fx("turn", player_cell, player_cell)
		last_message = "Rodada %s iniciada. PA restaurados." % turn
		action_performed.emit(last_message)
		queue_redraw()

	func _start_fx(kind: String, target: Vector2i, origin: Vector2i) -> void:
		action_fx_kind = kind
		action_fx_cell = target
		action_fx_origin = origin
		action_fx_timer = 0.45

	func _objective_for_mission() -> Vector2i:
		var archetype := str(presentation_data.get("archetype", "investigate"))
		if archetype == "defense":
			return Vector2i(2, 2)
		if archetype == "escort":
			return Vector2i(7, 4)
		if archetype == "boss" or archetype == "final":
			return Vector2i(6, 2)
		if archetype == "horror":
			return Vector2i(6, 1)
		return Vector2i(6, 3)

	func _cover_for_mission() -> Array[Vector2i]:
		var archetype := str(presentation_data.get("archetype", "investigate"))
		if archetype == "defense":
			return [Vector2i(1, 2), Vector2i(2, 3), Vector2i(3, 2), Vector2i(4, 4), Vector2i(5, 3)]
		if archetype == "escort":
			return [Vector2i(2, 4), Vector2i(3, 4), Vector2i(4, 3), Vector2i(5, 4)]
		if archetype == "horror":
			return [Vector2i(2, 2), Vector2i(3, 1), Vector2i(5, 3), Vector2i(6, 4)]
		if archetype == "boss" or archetype == "final":
			return [Vector2i(2, 1), Vector2i(2, 4), Vector2i(5, 1), Vector2i(5, 4)]
		return [Vector2i(2, 3), Vector2i(3, 2), Vector2i(4, 4), Vector2i(5, 2)]

	func _draw_environment(board: Rect2, id: String, accent: Color, gold: Color, mid: Color) -> void:
		for i in range(8):
			var alpha := 0.05 + float(i) * 0.018
			draw_rect(Rect2(board.position.x, board.position.y + board.size.y * float(i) / 8.0, board.size.x, board.size.y / 8.0), Color(accent.r, accent.g, accent.b, alpha), true)
		for i in range(18):
			var p := Vector2(
				board.position.x + board.size.x * fmod(float(i) * 0.173, 0.92) + board.size.x * 0.04,
				board.position.y + board.size.y * fmod(float(i) * 0.271, 0.86) + board.size.y * 0.06
			)
			draw_circle(p, 2.5 + float(i % 3), Color(gold.r, gold.g, gold.b, 0.08))
		if id == "blood_forest":
			for i in range(7):
				var x := board.position.x + board.size.x * (0.12 + i * 0.12)
				draw_line(Vector2(x, board.position.y + board.size.y * 0.15), Vector2(x - 10, board.end.y), mid.lightened(0.06), 9)
				draw_circle(Vector2(x - 3, board.position.y + board.size.y * 0.13), 25, accent.darkened(0.38))
				draw_circle(Vector2(x + 12, board.position.y + board.size.y * 0.19), 18, accent.darkened(0.32))
			draw_polyline(PackedVector2Array([
				Vector2(board.position.x + board.size.x * 0.06, board.position.y + board.size.y * 0.76),
				Vector2(board.position.x + board.size.x * 0.28, board.position.y + board.size.y * 0.68),
				Vector2(board.position.x + board.size.x * 0.52, board.position.y + board.size.y * 0.61),
				Vector2(board.position.x + board.size.x * 0.74, board.position.y + board.size.y * 0.54),
				Vector2(board.position.x + board.size.x * 0.92, board.position.y + board.size.y * 0.50)
			]), Color(gold.r, gold.g, gold.b, 0.35), 9)
		elif id == "war_council":
			draw_circle(board.position + board.size * 0.5, min(board.size.x, board.size.y) * 0.23, mid.lightened(0.12))
			draw_circle(board.position + board.size * 0.5, min(board.size.x, board.size.y) * 0.31, Color(gold.r, gold.g, gold.b, 0.12))
			for i in range(6):
				draw_circle(board.position + Vector2(board.size.x * (0.20 + i * 0.12), board.size.y * 0.48), 7, Color(gold.r, gold.g, gold.b, 0.42))
			draw_line(Vector2(board.position.x + board.size.x * 0.18, board.position.y + board.size.y * 0.50), Vector2(board.end.x - board.size.x * 0.18, board.position.y + board.size.y * 0.50), Color(gold.r, gold.g, gold.b, 0.20), 4)
		elif id == "siege_line":
			draw_rect(Rect2(board.position.x, board.position.y + board.size.y * 0.58, board.size.x, board.size.y * 0.16), accent.darkened(0.15), true)
			for i in range(6):
				var x := board.position.x + board.size.x * (0.08 + i * 0.16)
				draw_line(Vector2(x, board.position.y + board.size.y * 0.82), Vector2(x + 34, board.position.y + board.size.y * 0.56), mid.lightened(0.10), 8)
			for i in range(4):
				draw_circle(Vector2(board.position.x + board.size.x * (0.18 + i * 0.22), board.position.y + board.size.y * 0.35), 10, Color(0.82, 0.34, 0.12, 0.20))
		elif id == "corrupted_ritual":
			draw_circle(board.position + board.size * 0.5, min(board.size.x, board.size.y) * 0.22, Color(accent.r, accent.g, accent.b, 0.35))
			for i in range(8):
				var angle := TAU * float(i) / 8.0
				draw_line(board.position + board.size * 0.5, board.position + board.size * 0.5 + Vector2(cos(angle), sin(angle)) * min(board.size.x, board.size.y) * 0.28, Color(gold.r, gold.g, gold.b, 0.25), 2)
			draw_circle(board.position + board.size * 0.5, min(board.size.x, board.size.y) * 0.07, Color(0.50, 0.24, 0.86, 0.30))
		elif id == "search_zone":
			for i in range(5):
				draw_circle(board.position + Vector2(board.size.x * (0.16 + i * 0.16), board.size.y * (0.34 + float(i % 2) * 0.22)), 10, Color(gold.r, gold.g, gold.b, 0.42))
			draw_polyline(PackedVector2Array([
				Vector2(board.position.x + board.size.x * 0.12, board.position.y + board.size.y * 0.72),
				Vector2(board.position.x + board.size.x * 0.28, board.position.y + board.size.y * 0.58),
				Vector2(board.position.x + board.size.x * 0.48, board.position.y + board.size.y * 0.64),
				Vector2(board.position.x + board.size.x * 0.70, board.position.y + board.size.y * 0.46)
			]), Color(accent.r, accent.g, accent.b, 0.30), 5)
		else:
			draw_line(board.position + Vector2(board.size.x * 0.10, board.size.y * 0.72), board.position + Vector2(board.size.x * 0.90, board.size.y * 0.44), Color(gold.r, gold.g, gold.b, 0.22), 5)

	func _draw_path_overlay(board: Rect2, gold: Color) -> void:
		var cs := _cell_size(board)
		for x in range(GRID_W):
			for y in range(GRID_H):
				var center := _cell_center(board, Vector2i(x, y))
				var radius: float = min(cs.x, cs.y) * 0.035
				draw_circle(center, radius, Color(gold.r, gold.g, gold.b, 0.13))
		var route := PackedVector2Array([
			_cell_center(board, Vector2i(1, 4)),
			_cell_center(board, Vector2i(2, 4)),
			_cell_center(board, Vector2i(3, 3)),
			_cell_center(board, Vector2i(4, 3)),
			_cell_center(board, Vector2i(5, 3)),
			_cell_center(board, objective_cell)
		])
		draw_polyline(route, Color(gold.r, gold.g, gold.b, 0.32), max(3.0, min(cs.x, cs.y) * 0.045))

	func _draw_cover(board: Rect2, accent: Color, gold: Color) -> void:
		var cs := _cell_size(board)
		for cell in cover_cells:
			var top_left := board.position + Vector2(float(cell.x) * cs.x, float(cell.y) * cs.y)
			var cover_rect := Rect2(top_left + cs * 0.20, cs * 0.60)
			_draw_soft_rect(cover_rect, 10, Color(0.08, 0.09, 0.08, 0.72))
			_draw_soft_rect(cover_rect.grow(-2), 8, Color(accent.r, accent.g, accent.b, 0.14))
			draw_line(cover_rect.position + Vector2(8, cover_rect.size.y - 8), cover_rect.end - Vector2(8, 8), Color(gold.r, gold.g, gold.b, 0.22), 3)

	func _draw_player(board: Rect2, gold: Color) -> void:
		var pos := _cell_center_visual(board, visual_player_cell)
		var scale: float = clamp(min(_cell_size(board).x, _cell_size(board).y) / 76.0, 0.78, 1.35)
		var body := Color(0.74, 0.56, 0.24)
		if guarded:
			draw_circle(pos, 34 * scale, Color(gold.r, gold.g, gold.b, 0.18))
			draw_arc(pos, 31 * scale, -PI * 0.86, PI * 0.86, 28, Color(gold.r, gold.g, gold.b, 0.62), 4 * scale)
		draw_circle(pos + Vector2(0, 23) * scale, 20 * scale, Color(0, 0, 0, 0.28))
		draw_polygon([
			pos + Vector2(-24, -1) * scale,
			pos + Vector2(24, -1) * scale,
			pos + Vector2(16, 29) * scale,
			pos + Vector2(-16, 29) * scale
		], [
			body.lightened(0.06),
			body,
			body.darkened(0.20),
			body.darkened(0.08)
		])
		draw_circle(pos + Vector2(0, 8) * scale, 19 * scale, body)
		draw_circle(pos + Vector2(0, -15) * scale, 14 * scale, Color(0.72, 0.53, 0.38))
		draw_line(pos + Vector2(-21, 14) * scale, pos + Vector2(21, 14) * scale, Color(0.08, 0.06, 0.04), 4 * scale)
		draw_circle(pos + Vector2(-6, -17) * scale, 2.2 * scale, Color.BLACK)
		draw_circle(pos + Vector2(6, -17) * scale, 2.2 * scale, Color.BLACK)
		draw_rect(Rect2(pos.x - 24 * scale, pos.y - 30 * scale, 48 * scale, 62 * scale), Color(gold.r, gold.g, gold.b, 0.24), false, max(2.0, 2.0 * scale))
		draw_string(ThemeDB.fallback_font, pos + Vector2(-38, 43) * scale, player_data.get("name", "William"), HORIZONTAL_ALIGNMENT_CENTER, 76 * scale, 13 * scale, gold)

	func _cell_center_visual(board: Rect2, cell: Vector2) -> Vector2:
		var cs := _cell_size(board)
		return board.position + Vector2((cell.x + 0.5) * cs.x, (cell.y + 0.5) * cs.y)

	func _draw_enemies(board: Rect2) -> void:
		for index in enemy_cells.size():
			var pos := _cell_center(board, enemy_cells[index])
			var scale: float = clamp(min(_cell_size(board).x, _cell_size(board).y) / 76.0, 0.78, 1.30)
			draw_circle(pos + Vector2(0, 19) * scale, 18 * scale, Color(0, 0, 0, 0.25))
			draw_polygon([
				pos + Vector2(-20, 2) * scale,
				pos + Vector2(20, 2) * scale,
				pos + Vector2(14, 24) * scale,
				pos + Vector2(-14, 24) * scale
			], [
				Color(0.34, 0.06, 0.06),
				Color(0.42, 0.08, 0.08),
				Color(0.22, 0.03, 0.03),
				Color(0.28, 0.04, 0.04)
			])
			draw_circle(pos, 17 * scale, Color(0.42, 0.08, 0.08))
			draw_circle(pos + Vector2(-6, -5) * scale, 2.2 * scale, Color(0.92, 0.80, 0.58))
			draw_circle(pos + Vector2(6, -5) * scale, 2.2 * scale, Color(0.92, 0.80, 0.58))
			draw_line(pos + Vector2(-9, 8) * scale, pos + Vector2(9, 8) * scale, Color(0.12, 0, 0), 3 * scale)
			draw_string(ThemeDB.fallback_font, pos + Vector2(-30, 34) * scale, str(enemy_data[index].get("role", "Ameaca")), HORIZONTAL_ALIGNMENT_CENTER, 60 * scale, 11 * scale, Color(0.96, 0.72, 0.68))

	func _draw_objective(board: Rect2, gold: Color) -> void:
		var pos := _cell_center(board, objective_cell)
		var scale: float = clamp(min(_cell_size(board).x, _cell_size(board).y) / 76.0, 0.78, 1.30)
		var pulse: float = 1.0 + 0.08 * sin(float(Time.get_ticks_msec()) * 0.006)
		draw_polygon([
			pos + Vector2(0, -25) * scale * pulse,
			pos + Vector2(23, 0) * scale * pulse,
			pos + Vector2(0, 25) * scale * pulse,
			pos + Vector2(-23, 0) * scale * pulse
		], [
			gold.lightened(0.18),
			gold,
			gold.darkened(0.35),
			gold.darkened(0.12)
		])
		draw_circle(pos, 8 * scale, Color(0.15, 0.12, 0.06))
		draw_string(ThemeDB.fallback_font, pos + Vector2(-34, 39) * scale, "OBJETIVO", HORIZONTAL_ALIGNMENT_CENTER, 68 * scale, 11 * scale, gold.lightened(0.2))

	func _draw_action_fx(board: Rect2, gold: Color, accent: Color) -> void:
		if action_fx_timer <= 0.0:
			return
		var t: float = action_fx_timer / 0.45
		var target := _cell_center(board, action_fx_cell)
		var origin := _cell_center(board, action_fx_origin)
		var alpha: float = clamp(t, 0.0, 1.0)
		if action_fx_kind == "attack":
			draw_line(origin, target, Color(gold.r, gold.g, gold.b, 0.72 * alpha), 5)
			draw_arc(target, 28.0 * (1.25 - t * 0.25), -PI * 0.25, PI * 1.25, 24, Color(0.96, 0.82, 0.48, 0.82 * alpha), 4)
			draw_circle(target, 18.0 * (1.15 - t * 0.15), Color(0.70, 0.08, 0.04, 0.22 * alpha))
		elif action_fx_kind == "objective":
			draw_circle(target, 42.0 * (1.2 - t * 0.2), Color(gold.r, gold.g, gold.b, 0.18 * alpha))
			draw_arc(target, 34.0, 0, TAU, 40, Color(gold.r, gold.g, gold.b, 0.70 * alpha), 4)
		elif action_fx_kind == "defend":
			draw_arc(target, 39.0 * (1.12 - t * 0.12), -PI, TAU, 42, Color(accent.r, accent.g, accent.b, 0.72 * alpha), 5)
		elif action_fx_kind == "turn" or action_fx_kind == "start":
			draw_circle(target, 38.0 * (1.3 - t * 0.3), Color(accent.r, accent.g, accent.b, 0.16 * alpha))
		elif action_fx_kind == "warn":
			draw_arc(target, 32.0, 0, TAU, 30, Color(0.95, 0.20, 0.14, 0.85 * alpha), 4)

	func _draw_hud(board: Rect2, gold: Color) -> void:
		var y := board.end.y + 28
		var gameplay: Dictionary = presentation_data.get("gameplay", {})
		draw_string(ThemeDB.fallback_font, Vector2(18, 28), "Missao em campo - %s" % mission_data.get("title", "Missao"), HORIZONTAL_ALIGNMENT_LEFT, size.x - 36, 20, gold)
		draw_string(ThemeDB.fallback_font, Vector2(18, y), "Rodada %s | PA %s | WASD/setas, clique, toque ou botoes inferiores" % [turn, action_points], HORIZONTAL_ALIGNMENT_LEFT, size.x - 36, 14, Color(0.90, 0.88, 0.80))
		draw_string(ThemeDB.fallback_font, Vector2(18, y + 24), "Objetivo: %s" % mission_data.get("objective", ""), HORIZONTAL_ALIGNMENT_LEFT, size.x - 36, 13, Color(0.82, 0.82, 0.76))
		draw_string(ThemeDB.fallback_font, Vector2(18, y + 48), "Acao: %s" % last_message, HORIZONTAL_ALIGNMENT_LEFT, size.x - 36, 13, Color(0.78, 0.86, 0.78))
		if gameplay.has("label"):
			draw_string(ThemeDB.fallback_font, Vector2(size.x - 310, 28), str(gameplay.get("label", "")), HORIZONTAL_ALIGNMENT_RIGHT, 292, 14, Color(0.80, 0.80, 0.72))

	func command_move(delta: Vector2i) -> void:
		_step(delta)

	func command_interact() -> void:
		_interact_current()

	func command_attack() -> void:
		_attack_nearest()

	func command_defend() -> void:
		_defend()

	func command_objective() -> void:
		if _distance(player_cell, objective_cell) <= 1:
			_interact_objective()
		else:
			last_message = "Objetivo fora de alcance. Avance pela rota dourada."
			_start_fx("warn", objective_cell, player_cell)
			queue_redraw()

	func command_new_turn() -> void:
		_new_turn()

	func _inside(cell: Vector2i) -> bool:
		return cell.x >= 0 and cell.y >= 0 and cell.x < GRID_W and cell.y < GRID_H

	func _distance(a: Vector2i, b: Vector2i) -> int:
		return abs(a.x - b.x) + abs(a.y - b.y)

	func signi(value: int) -> int:
		if value > 0:
			return 1
		if value < 0:
			return -1
		return 0

	func _color(value: Variant, fallback: Color) -> Color:
		var text := str(value)
		if text.begins_with("#"):
			return Color.html(text)
		return fallback

	func _draw_soft_rect(r: Rect2, radius: float, color: Color) -> void:
		var d: float = min(radius * 2.0, min(r.size.x, r.size.y))
		var rr: float = d * 0.5
		draw_rect(Rect2(r.position + Vector2(rr, 0), Vector2(max(0.0, r.size.x - d), r.size.y)), color, true)
		draw_rect(Rect2(r.position + Vector2(0, rr), Vector2(r.size.x, max(0.0, r.size.y - d))), color, true)
		draw_circle(r.position + Vector2(rr, rr), rr, color)
		draw_circle(r.position + Vector2(r.size.x - rr, rr), rr, color)
		draw_circle(r.position + Vector2(rr, r.size.y - rr), rr, color)
		draw_circle(r.position + Vector2(r.size.x - rr, r.size.y - rr), rr, color)

class MissionBackdrop:
	extends Control

	var mission_data: Dictionary = {}
	var presentation_data: Dictionary = {}

	func _draw() -> void:
		var rect := Rect2(Vector2.ZERO, size)
		var background: Dictionary = presentation_data.get("background", {})
		var palette: Array = background.get("palette", ["#0c0f0f", "#272b2a", "#6e8fa4", "#d0a951"])
		var base := _color(palette[0], Color(0.04, 0.05, 0.05))
		var mid := _color(palette[min(1, palette.size() - 1)], Color(0.13, 0.15, 0.14))
		var accent := _color(palette[min(2, palette.size() - 1)], Color(0.43, 0.56, 0.64))
		var gold := _color(palette[min(3, palette.size() - 1)], Color(0.82, 0.66, 0.32))
		draw_rect(rect, base, true)
		draw_rect(Rect2(Vector2(0, size.y * 0.58), Vector2(size.x, size.y * 0.42)), mid.darkened(0.28), true)
		_draw_sky_band(accent)
		_draw_environment(str(background.get("id", "battlefield")), accent, gold, mid)
		draw_rect(rect.grow(-1), _alpha(gold, 0.28), false, 1.0)
		var title := str(mission_data.get("title", "Missao"))
		var bg_name := str(background.get("name", "Campo de Missao"))
		draw_string(ThemeDB.fallback_font, Vector2(16, 28), bg_name, HORIZONTAL_ALIGNMENT_LEFT, size.x - 32, 18, gold)
		draw_string(ThemeDB.fallback_font, Vector2(16, size.y - 18), title, HORIZONTAL_ALIGNMENT_LEFT, size.x - 32, 16, Color(0.90, 0.88, 0.78))

	func _draw_sky_band(accent: Color) -> void:
		for i in range(5):
			var alpha := 0.05 + float(i) * 0.025
			draw_rect(Rect2(0, i * size.y * 0.10, size.x, size.y * 0.10), _alpha(accent, alpha), true)

	func _draw_environment(id: String, accent: Color, gold: Color, mid: Color) -> void:
		var w := size.x
		var h := size.y
		if id == "blood_forest":
			for i in range(7):
				var x := w * (0.10 + i * 0.13)
				draw_line(Vector2(x, h * 0.30), Vector2(x - 12, h * 0.88), mid.lightened(0.10), 6)
				draw_circle(Vector2(x - 6, h * 0.26), 24, accent.darkened(0.25))
			draw_line(Vector2(w * 0.18, h * 0.72), Vector2(w * 0.82, h * 0.64), _alpha(gold, 0.50), 3)
		elif id == "war_council":
			draw_circle(Vector2(w * 0.5, h * 0.68), min(w, h) * 0.28, mid.lightened(0.12))
			for i in range(5):
				draw_circle(Vector2(w * (0.22 + i * 0.14), h * 0.42), 7, _alpha(gold, 0.75))
			draw_line(Vector2(w * 0.18, h * 0.68), Vector2(w * 0.82, h * 0.68), _alpha(gold, 0.50), 2)
		elif id == "siege_line":
			for i in range(6):
				draw_line(Vector2(w * (0.10 + i * 0.16), h * 0.82), Vector2(w * (0.18 + i * 0.16), h * 0.52), mid.lightened(0.18), 9)
			draw_rect(Rect2(w * 0.18, h * 0.56, w * 0.64, h * 0.12), accent.darkened(0.1), true)
			draw_circle(Vector2(w * 0.80, h * 0.32), 16, _alpha(gold, 0.35))
		elif id == "corrupted_ritual":
			draw_circle(Vector2(w * 0.5, h * 0.62), min(w, h) * 0.30, _alpha(accent, 0.35))
			for i in range(6):
				var angle := TAU * float(i) / 6.0
				draw_line(Vector2(w * 0.5, h * 0.62), Vector2(w * 0.5 + cos(angle) * 120.0, h * 0.62 + sin(angle) * 44.0), accent.lightened(0.2), 2)
			draw_circle(Vector2(w * 0.5, h * 0.62), 18, _alpha(gold, 0.65))
		elif id == "search_zone":
			for i in range(4):
				draw_circle(Vector2(w * (0.20 + i * 0.18), h * (0.42 + (i % 2) * 0.18)), 10, _alpha(gold, 0.65))
				draw_line(Vector2(w * (0.20 + i * 0.18), h * (0.42 + (i % 2) * 0.18)), Vector2(w * (0.28 + i * 0.16), h * 0.78), _alpha(accent, 0.45), 2)
			draw_rect(Rect2(w * 0.10, h * 0.70, w * 0.80, 4), mid.lightened(0.18), true)
		else:
			for i in range(6):
				draw_circle(Vector2(w * (0.16 + i * 0.13), h * 0.68), 12, _alpha(accent, 0.42))
			draw_line(Vector2(w * 0.16, h * 0.58), Vector2(w * 0.84, h * 0.58), _alpha(gold, 0.45), 2)

	func _color(value: Variant, fallback: Color) -> Color:
		var text := str(value)
		if text.begins_with("#"):
			return Color.html(text)
		return fallback

	func _alpha(color: Color, value: float) -> Color:
		return Color(color.r, color.g, color.b, value)

class AvatarPreview:
	extends Control

	var character_data: Dictionary = {}

	func _draw() -> void:
		var rect := Rect2(Vector2.ZERO, size)
		draw_rect(rect, Color(0.06, 0.065, 0.065), true)
		draw_rect(rect.grow(-1), Color(0.82, 0.66, 0.32, 0.25), false, 1.0)
		var center := Vector2(size.x * 0.5, size.y * 0.58)
		var body_width := _body_width(character_data.get("body", "Atletico"))
		var body_shape := str(character_data.get("bodyShape", "Trapezio"))
		var face := str(character_data.get("face", "Oval"))
		var eye_shape := str(character_data.get("eyeShape", "Amendoados"))
		var hair_style := str(character_data.get("hair", "Ondulado 2B"))
		var beard := str(character_data.get("beard", "Barba curta"))
		var palette := _palette(character_data.get("palette", "iron_gold"))
		var hair := _hair_color(character_data.get("hairColor", "Preto natural"))
		var eye := _eye_color(character_data.get("eyeColor", "Castanho"))
		var weapon: String = str(character_data.get("weapon", "iron_sword"))

		draw_ellipse(Vector2(center.x, center.y + 93), 72, 9, Color(0, 0, 0, 0.30))
		_draw_cloak(center, palette)
		_draw_body(center, body_width, body_shape, palette)
		draw_rounded_rect(Rect2(center.x - body_width * 0.34, 176, body_width * 0.68, 9), 4, Color(0.10, 0.08, 0.06))
		draw_circle(Vector2(center.x, 151), 11, palette.primary)
		_draw_vertical_capsule(Vector2(center.x - 66, 160), 18, 94, Color(0.18, 0.18, 0.18))
		_draw_vertical_capsule(Vector2(center.x + 66, 160), 18, 94, Color(0.18, 0.18, 0.18))
		_draw_head(center, face)
		_draw_hair(center, hair, hair_style)
		_draw_eye(Vector2(center.x - 14, 78), eye, eye_shape, -1)
		_draw_eye(Vector2(center.x + 14, 78), eye, eye_shape, 1)
		draw_line(Vector2(center.x - 12, 102), Vector2(center.x + 12, 102), Color(0.18, 0.08, 0.06), 2)
		_draw_beard(center, hair, beard)
		if weapon == "bow":
			draw_arc(Vector2(center.x + 88, 150), 58, -PI / 2, PI / 2, 28, Color(0.48, 0.28, 0.12), 5)
			draw_line(Vector2(center.x + 88, 92), Vector2(center.x + 88, 208), Color(0.88, 0.82, 0.62), 2)
		elif weapon == "spear":
			draw_line(Vector2(center.x + 92, 36), Vector2(center.x + 92, 232), Color(0.75, 0.61, 0.28), 6)
			draw_polygon([Vector2(center.x + 92, 16), Vector2(center.x + 108, 48), Vector2(center.x + 92, 68), Vector2(center.x + 76, 48)], [Color(0.9, 0.88, 0.78), Color(0.52, 0.56, 0.56), Color(0.24, 0.26, 0.26), Color(0.78, 0.78, 0.72)])
		else:
			draw_line(Vector2(center.x + 88, 72), Vector2(center.x + 88, 226), Color(0.45, 0.27, 0.16), 6)
			draw_polygon([Vector2(center.x + 88, 24), Vector2(center.x + 103, 88), Vector2(center.x + 88, 126), Vector2(center.x + 73, 88)], [Color(0.9, 0.9, 0.84), Color(0.58, 0.62, 0.62), Color(0.25, 0.28, 0.28), Color(0.78, 0.78, 0.72)])
		draw_string(ThemeDB.fallback_font, Vector2(18, size.y - 18), character_data.get("name", "William"), HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color(0.82, 0.66, 0.32))

	func _draw_cloak(center: Vector2, palette: Dictionary) -> void:
		var points := PackedVector2Array([
			Vector2(center.x - 72, 94),
			Vector2(center.x + 72, 94),
			Vector2(center.x + 88, 220),
			Vector2(center.x + 58, 232),
			Vector2(center.x - 58, 232),
			Vector2(center.x - 88, 220)
		])
		var colors := PackedColorArray([
			palette.secondary.lightened(0.05),
			palette.secondary,
			palette.secondary.darkened(0.32),
			Color(0.025, 0.028, 0.028),
			Color(0.025, 0.028, 0.028),
			palette.secondary.darkened(0.18)
		])
		draw_polygon(points, colors)
		draw_arc(Vector2(center.x, 102), 73, PI, TAU, 40, palette.secondary.lightened(0.08), 4)

	func _draw_body(center: Vector2, body_width: float, body_shape: String, palette: Dictionary) -> void:
		var shoulder := body_width * 0.5
		var waist := body_width * 0.42
		if body_shape == "Triangular":
			shoulder = body_width * 0.34
			waist = body_width * 0.55
		elif body_shape == "Oval":
			shoulder = body_width * 0.48
			waist = body_width * 0.55
		elif body_shape == "Retangular":
			shoulder = body_width * 0.45
			waist = body_width * 0.45
		elif body_shape == "Triangulo invertido":
			shoulder = body_width * 0.58
			waist = body_width * 0.32
		draw_polygon([
			Vector2(center.x - shoulder, 104),
			Vector2(center.x + shoulder, 104),
			Vector2(center.x + waist * 0.92, 216),
			Vector2(center.x + waist * 0.74, 224),
			Vector2(center.x - waist * 0.74, 224),
			Vector2(center.x - waist * 0.92, 216)
		], [
			Color(0.22, 0.23, 0.23),
			Color(0.30, 0.31, 0.31),
			Color(0.14, 0.14, 0.14),
			Color(0.10, 0.10, 0.10),
			Color(0.12, 0.12, 0.12),
			Color(0.18, 0.19, 0.19)
		])
		draw_polygon([
			Vector2(center.x - shoulder * 0.68, 118),
			Vector2(center.x + shoulder * 0.68, 118),
			Vector2(center.x + waist * 0.50, 204),
			Vector2(center.x + waist * 0.40, 214),
			Vector2(center.x - waist * 0.40, 214),
			Vector2(center.x - waist * 0.50, 204)
		], [
			palette.primary.lightened(0.08),
			palette.primary,
			palette.primary.darkened(0.24),
			palette.primary.darkened(0.36),
			palette.primary.darkened(0.28),
			palette.primary.darkened(0.12)
		])

	func _draw_head(center: Vector2, face: String) -> void:
		var head_rect := Rect2(center.x - 36, 40, 72, 78)
		if face == "Longo":
			head_rect = Rect2(center.x - 32, 34, 64, 88)
		elif face == "Redondo":
			head_rect = Rect2(center.x - 39, 43, 78, 74)
		elif face in ["Quadrado", "Hexagonal"]:
			head_rect = Rect2(center.x - 38, 43, 76, 74)
		draw_rounded_rect(head_rect, 34, Color(0.72, 0.53, 0.38))
		if face in ["Triangular", "Coracao", "Diamante"]:
			draw_polygon([Vector2(center.x - 35, 72), Vector2(center.x + 35, 72), Vector2(center.x, 121)], [Color(0.72, 0.53, 0.38), Color(0.64, 0.45, 0.32), Color(0.58, 0.39, 0.28)])

	func _draw_hair(center: Vector2, hair: Color, hair_style: String) -> void:
		if hair_style == "Raspado":
			draw_arc(Vector2(center.x, 69), 36, PI, TAU, 24, hair, 7)
			return
		var thickness := 14
		if hair_style.contains("Cacheado") or hair_style.contains("Crespo"):
			thickness = 24
		elif hair_style.contains("Liso"):
			thickness = 18
		draw_arc(Vector2(center.x, 76), 39, PI, TAU, 24, hair, thickness)
		if hair_style.contains("Cacheado") or hair_style.contains("Crespo"):
			for offset in [-25, -10, 8, 23]:
				draw_circle(Vector2(center.x + offset, 51 + abs(offset) * 0.18), 9, hair.lightened(0.05))

	func _draw_eye(pos: Vector2, eye: Color, eye_shape: String, side: int) -> void:
		var width := 13.0
		var height := 6.0
		if eye_shape.contains("Redondos"):
			height = 9.0
		if eye_shape.contains("finos") or eye_shape.contains("Orientais"):
			height = 4.0
			width = 15.0
		var tilt := 0.0
		if eye_shape.contains("Caidos"):
			tilt = side * 3.0
		draw_line(Vector2(pos.x - width * 0.5, pos.y + tilt), Vector2(pos.x + width * 0.5, pos.y - tilt), Color(0.03, 0.03, 0.03), 3)
		draw_circle(pos, height * 0.65, eye)
		draw_circle(pos, height * 0.25, Color(0.02, 0.02, 0.02))

	func _draw_beard(center: Vector2, hair: Color, beard: String) -> void:
		if beard == "Sem barba":
			return
		if beard == "Bigode nobre":
			draw_line(Vector2(center.x - 17, 95), Vector2(center.x + 17, 95), hair, 5)
		elif beard == "Cavanhaque":
			_draw_vertical_capsule(Vector2(center.x, 111), 10, 16, hair)
		elif beard == "Barba cheia":
			draw_arc(Vector2(center.x, 91), 30, 0.1, PI - 0.1, 24, hair, 13)
		else:
			draw_arc(Vector2(center.x, 94), 24, 0.2, PI - 0.2, 18, hair, 7)

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

	func _palette(id: String) -> Dictionary:
		if id == "blood_oath":
			return {"primary": Color(0.72, 0.30, 0.26), "secondary": Color(0.16, 0.10, 0.09)}
		if id == "ash_blue":
			return {"primary": Color(0.43, 0.56, 0.64), "secondary": Color(0.14, 0.17, 0.18)}
		return {"primary": Color(0.82, 0.66, 0.32), "secondary": Color(0.19, 0.21, 0.21)}

	func draw_rounded_rect(r: Rect2, radius: float, color: Color) -> void:
		var d: float = min(radius * 2.0, min(r.size.x, r.size.y))
		var rr: float = d * 0.5
		draw_rect(Rect2(r.position + Vector2(rr, 0), Vector2(max(0.0, r.size.x - d), r.size.y)), color, true)
		draw_rect(Rect2(r.position + Vector2(0, rr), Vector2(r.size.x, max(0.0, r.size.y - d))), color, true)
		draw_circle(r.position + Vector2(rr, rr), rr, color)
		draw_circle(r.position + Vector2(r.size.x - rr, rr), rr, color)
		draw_circle(r.position + Vector2(rr, r.size.y - rr), rr, color)
		draw_circle(r.position + Vector2(r.size.x - rr, r.size.y - rr), rr, color)

	func _draw_vertical_capsule(center: Vector2, radius: float, height: float, color: Color) -> void:
		var body_height: float = max(0.0, height - radius * 2.0)
		draw_rect(Rect2(center.x - radius, center.y - body_height * 0.5, radius * 2.0, body_height), color, true)
		draw_circle(Vector2(center.x, center.y - body_height * 0.5), radius, color)
		draw_circle(Vector2(center.x, center.y + body_height * 0.5), radius, color)
