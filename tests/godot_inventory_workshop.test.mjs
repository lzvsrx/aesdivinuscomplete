import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Godot arsenal has purchase, sale, crafting and equipment screens", async () => {
  const main = await readFile(new URL("../godot/scripts/main.gd", import.meta.url), "utf8");

  for (const symbol of [
    "_build_inventory_screen",
    "_show_inventory_screen",
    "_populate_shop_items",
    "_populate_owned_items",
    "_populate_craft_items",
    "_buy_item",
    "_sell_item",
    "_equip_item",
    "_craft_item",
    "_craft_recipe",
    "_record_transaction"
  ]) {
    assert.ok(main.includes(symbol), `${symbol} missing from Godot arsenal`);
  }

  assert.ok(main.includes("Comprar nas lojas"));
  assert.ok(main.includes("Vender e equipar"));
  assert.ok(main.includes("Criar itens"));
  assert.ok(main.includes("Ouro %s | Ferro %s | Madeira %s"));
  assert.ok(main.includes("_autosave(\"Criacao de item.\")"));
});
