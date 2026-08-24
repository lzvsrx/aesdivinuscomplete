# Pipeline de Modelagem 3D - Aes Divinus para Godot

Versao: 2026-08-24

Este documento orienta o modelador a transformar os modelos proxy do Godot em assets finais para o jogo.

## Ferramenta recomendada

Use Blender ou qualquer modelador que exporte glTF 2.0 binario `.glb`. O Godot 4 importa `.glb` nativamente e preserva malhas, materiais PBR, armature, animacoes, sockets e colisores quando nomeados corretamente.

## Projeto Godot

- Projeto: `godot/project.godot`
- Galeria 3D: `godot/scenes/model_gallery.tscn`
- Gerador procedural: `godot/scripts/model_library.gd`
- Especificacoes de modelagem: `godot/data/modeling_specs.json`
- Dados de gameplay: `godot/data/aes_divinus_data.json`

Para abrir:

```powershell
npm run godot:run
```

Para validar:

```powershell
npm run godot:check
```

## Escala e orientacao

- 1 unidade = 1 metro.
- Eixo Y = cima.
- Frente do personagem = -Z.
- William deve ter cerca de 1.84 m.
- Ethan deve parecer mais leve e agil.
- Albert deve ser mais largo, pesado e defensivo.
- Criaturas sobrenaturais podem quebrar a silhueta humana, mas precisam manter leitura clara de hitbox.

## Nomenclatura obrigatoria

Use estes nomes para facilitar troca runtime:

- `body`
- `head`
- `hair`
- `cape`
- `arm_l`
- `arm_r`
- `leg_l`
- `leg_r`
- `belt`
- `stone`
- `socket_weapon_r`
- `socket_shield_l`
- `socket_back`
- `socket_tool_belt`

Colisores devem terminar com `_col`, por exemplo:

- `william_body_col`
- `iron_sword_col`
- `wooden_gate_col`

LODs devem usar:

- `_lod0`
- `_lod1`
- `_lod2`

## Personagens

### William

- Corpo atletico.
- Armadura de malha media escura.
- Detalhe dourado de lideranca.
- Pedra Hematita no peito/cinto.
- Capa curta que nao bloqueia leitura da arma.
- Rig humanoide modular.

### Ethan

- Corpo definido e mais leve.
- Couro leve, tecido cinza azulado e arco recurvo.
- Silhueta de batedor, com mochila/bolsa pequena.
- Pedra Olho de Cedro perto do arco ou bracelete.

### Albert

- Corpo forte e largo.
- Brigantina pesada com ombreiras altas.
- Lanca longa e postura defensiva.
- Pedra Onix Real no peitoral ou pomo.

### Manifestacao

- Criatura maior que humano.
- Costas altas, bracos longos e garras.
- Rachaduras rubras/violetas emissivas.
- Olhos violetas.
- Deve parecer sobrenatural sem perder leitura de gameplay.

## Armas

- Espada de ferro: lamina reta, guarda curta, pomo circular, Granito Jurado.
- Lanca de ferro: haste longa, ponta em folha, Quartzo de Vigia.
- Arco de batedor: recurvo, corda clara, flechas de penas escuras, Olho de Cedro.
- Lanca Aes: ponta longa, runa vertical, brilho violeta, Ametista Aes.

## Armaduras

- Roupa reforcada: tecido em camadas, Argila Selada.
- Couro leve: tiras diagonais e bolso, Jaspe Verde.
- Malha media: placas no peito, Hematita.
- Brigantina pesada: rebites largos, Onix Real.

## Ferramentas

- Kit de campo: bolsa, bandagens, frascos e Agata de Cura.
- Ferramentas de percepcao: lente, giz, corda e Fluorita de Pista.
- Bussola Aes: aro com runas, agulha suspensa e Safira de Norte.

## Ambientes

- Floresta de Sangue: troncos altos, lama, estrada velha, marcas rubras e pontos de cobertura.
- Mesa de Guerra: pedra, mapa, tokens de faccao, velas e estandartes.
- Portao do Principado: madeira, pedra, barricadas, plataforma de arqueiros e setores defensivos.

## Exportacao Blender

1. Trabalhe em metros.
2. Aplique transformacoes antes de exportar: `Ctrl+A > Rotation & Scale`.
3. Nomeie objetos e sockets conforme esta pipeline.
4. Exporte `.glb` com:
   - Selected Objects
   - Apply Modifiers
   - Include Animations quando houver rig
   - +Y Up / glTF padrao
5. Coloque arquivos finais em `godot/assets/models/`.
6. Substitua os proxies do `model_library.gd` por instancias `.glb`.

## Performance

- Proxy: ate 1.500 triangulos por personagem.
- Final gameplay: 8k a 18k triangulos por personagem principal.
- Inimigos comuns: 4k a 10k triangulos.
- Armas/ferramentas: 300 a 2k triangulos.
- Texturas finais: 1k ou 2k conforme importancia.
- Mobile: gerar LOD1/LOD2 e atlas sempre que possivel.

## Checklist de entrega

- Abre no Godot sem erro.
- Escala correta em relacao ao grid.
- Origem/pivot no pe ou no centro logico do item.
- Materiais PBR nomeados.
- Pedra especifica do item visivel.
- Sockets presentes.
- Colisor simples presente.
- LODs quando asset for pesado.
- Licenca/autoria registrada.

