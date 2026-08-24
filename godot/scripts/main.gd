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
	detail_title.text = "%s. %s" % [mission.get("order", 0), mission.get("title", "")]
	detail_text.text = "[b]%s[/b]\nTipo: %s\n\nObjetivo: %s\nImpacto: %s\n\nOpcionais:\n- %s" % [
		mission.get("act", ""),
		mission.get("type", ""),
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
	var rewards: Dictionary = mission.get("rewards", {})
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
		"[b]Jogabilidade acontecendo[/b]",
		"- A cena abre a situacao.",
		"- A missao entra no mesmo fluxo.",
		"- Turnos, PA, movimento, cobertura, medo, coragem e lideranca ficam representados neste encontro.",
		"- Ao concluir, recompensas e consequencias sao aplicadas e o jogo avanca.",
		"",
		"[b]Ameacas no encontro[/b]"
	]
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
	var enemies := _mission_enemies(mission)
	var rewards: Dictionary = mission.get("rewards", {})
	var lines: Array[String] = [
		"[b]Missao ativa[/b]",
		"%s - %s" % [mission.get("act", ""), mission.get("title", "")],
		"Tipo: %s" % mission.get("type", ""),
		"",
		"[b]Objetivo jogavel[/b]",
		mission.get("objective", ""),
		"",
		"[b]Regras em uso[/b]",
		"- Turnos com 2 PA",
		"- Movimento, ataque, cobertura, medo, coragem e lideranca",
		"- Autosave ao iniciar e concluir",
		"",
		"[b]Inimigos/ameacas previstas[/b]"
	]
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

func _mission_enemies(mission: Dictionary) -> Array:
	var sets: Dictionary = data.get("enemySets", {})
	var set_id := str(mission.get("enemySet", ""))
	if set_id == "" or not sets.has(set_id):
		if str(mission.get("type", "")).contains("Chefe"):
			set_id = "manifestation"
		else:
			set_id = "forest_first_contact"
	return sets.get(set_id, [])

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
