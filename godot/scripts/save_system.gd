extends Node

const SAVE_PATH := "user://aes_divinus_save.json"

var last_error := ""

func save_state(state: Dictionary) -> bool:
	var payload := state.duplicate(true)
	payload["saved_at"] = Time.get_datetime_string_from_system(true)
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file == null:
		last_error = "Nao foi possivel abrir o arquivo de save."
		return false
	file.store_string(JSON.stringify(payload, "\t"))
	last_error = ""
	return true

func load_state() -> Dictionary:
	if not FileAccess.file_exists(SAVE_PATH):
		return {}
	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file == null:
		last_error = "Nao foi possivel ler o arquivo de save."
		return {}
	var parsed = JSON.parse_string(file.get_as_text())
	if typeof(parsed) != TYPE_DICTIONARY:
		last_error = "Save invalido ou corrompido."
		return {}
	last_error = ""
	return parsed

func reset_state() -> void:
	if FileAccess.file_exists(SAVE_PATH):
		DirAccess.remove_absolute(ProjectSettings.globalize_path(SAVE_PATH))

