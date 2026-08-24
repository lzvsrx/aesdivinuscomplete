const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { pathToFileURL } = require("node:url");
const { spawnSync } = require("node:child_process");

const [, , inputArg, outputArg] = process.argv;

if (!inputArg || !outputArg) {
  console.error("Uso: node scripts/markdown-to-pdf.cjs entrada.md saida.pdf");
  process.exit(1);
}

const inputPath = path.resolve(process.cwd(), inputArg);
const outputPath = path.resolve(process.cwd(), outputArg);

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>');
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let listOpen = false;
  let quoteOpen = false;

  function closeBlocks() {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
    if (quoteOpen) {
      html.push("</blockquote>");
      quoteOpen = false;
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      closeBlocks();
      continue;
    }

    const heading = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (heading) {
      closeBlocks();
      const level = heading[1].length;
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    if (trimmed.startsWith(">")) {
      if (listOpen) {
        html.push("</ul>");
        listOpen = false;
      }
      if (!quoteOpen) {
        html.push("<blockquote>");
        quoteOpen = true;
      }
      html.push(`<p>${inlineMarkdown(trimmed.replace(/^>\s?/, ""))}</p>`);
      continue;
    }

    const bullet = /^-\s+(.+)$/.exec(trimmed);
    if (bullet) {
      if (quoteOpen) {
        html.push("</blockquote>");
        quoteOpen = false;
      }
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${inlineMarkdown(bullet[1])}</li>`);
      continue;
    }

    closeBlocks();
    html.push(`<p>${inlineMarkdown(trimmed)}</p>`);
  }

  closeBlocks();
  return html.join("\n");
}

function buildDocument(content) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Direitos do Jogo, Publicacao na Steam e Regras</title>
  <style>
    @page { size: A4; margin: 18mm 16mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: #191b1b;
      background: white;
      font-family: "Segoe UI", Arial, sans-serif;
      font-size: 11.5pt;
      line-height: 1.55;
    }
    h1, h2, h3 {
      color: #1b1718;
      line-height: 1.18;
      page-break-after: avoid;
    }
    h1 {
      margin: 0 0 16px;
      padding-bottom: 12px;
      border-bottom: 3px solid #d0a951;
      font-size: 25pt;
    }
    h2 {
      margin: 22px 0 8px;
      padding-top: 8px;
      border-top: 1px solid #ded7c5;
      font-size: 16pt;
    }
    h3 { margin: 16px 0 6px; font-size: 13pt; }
    p { margin: 0 0 9px; }
    ul { margin: 5px 0 12px 18px; padding: 0; }
    li { margin: 2px 0 4px; }
    blockquote {
      margin: 10px 0 16px;
      padding: 10px 12px;
      border-left: 4px solid #b84b42;
      background: #f8f4ea;
      color: #3a302a;
    }
    code {
      padding: 1px 4px;
      border-radius: 3px;
      background: #f0eadb;
      color: #5a342f;
      font-family: Consolas, monospace;
      font-size: .92em;
    }
    a { color: #375f83; text-decoration: none; overflow-wrap: anywhere; }
    .cover {
      margin-bottom: 18px;
      padding: 12px 0 14px;
      border-bottom: 1px solid #ded7c5;
      color: #6b6254;
      font-size: 10pt;
    }
  </style>
</head>
<body>
  <div class="cover">Aes Divinus / LZASANTOSWORLDSGAMES / Documento gerado a partir de Markdown</div>
  ${content}
</body>
</html>`;
}

async function main() {
  const markdown = fs.readFileSync(inputPath, "utf8");
  const html = buildDocument(markdownToHtml(markdown));
  const tempHtmlPath = path.join(os.tmpdir(), `aes-divinus-doc-${Date.now()}.html`);
  const browserCandidates = [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
  ];
  const browserPath = browserCandidates.find((candidate) => fs.existsSync(candidate));

  if (!browserPath) {
    throw new Error("Microsoft Edge ou Google Chrome nao foi encontrado para gerar o PDF.");
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(tempHtmlPath, html);

  try {
    const result = spawnSync(browserPath, [
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--no-pdf-header-footer",
      `--print-to-pdf=${outputPath}`,
      pathToFileURL(tempHtmlPath).href
    ], {
      encoding: "utf8"
    });

    if (result.status !== 0) {
      throw new Error(result.stderr || result.stdout || "Falha ao imprimir PDF.");
    }
  } finally {
    fs.rmSync(tempHtmlPath, { force: true });
  }

  console.log(`PDF gerado em: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
