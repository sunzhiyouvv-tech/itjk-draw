import fs from "node:fs";
import path from "node:path";

const root = process.argv[2];
if (!root) throw new Error("Missing upstream source directory");

const update = (file, transform) => {
  const full = path.join(root, file);
  const before = fs.readFileSync(full, "utf8");
  const after = transform(before);
  if (before === after) {
    console.warn(`[ITJK Draw] No changes applied to ${file}`);
  }
  fs.writeFileSync(full, after);
};

// The upstream source archive does not contain .git, so its Husky prepare hook
// would fail during yarn install. It is a development-only hook and is not
// needed for production builds.
const packageJsonPath = path.join(root, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
if (packageJson.scripts?.prepare) {
  delete packageJson.scripts.prepare;
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

update("excalidraw-app/index.html", (html) => {
  return html
    .replace('<html lang="en">', '<html lang="zh-CN">')
    .replace("<title>Excalidraw Whiteboard</title>", "<title>ITJK Draw · 在线画图、流程图与架构图 | itjk.com</title>")
    .replace(/content="Free, collaborative whiteboard[^\"]*\| Excalidraw"/, 'content="ITJK Draw · 在线画图、流程图、架构图与白板 | itjk.com"')
    .replace(/content="Excalidraw is a virtual collaborative whiteboard tool that lets you easily sketch diagrams that have a hand-drawn feel to them\."/g, 'content="ITJK Draw 是一个免费在线画图、流程图、架构图和白板工具，数据优先在浏览器本地处理。"')
    .replace('<meta name="image" content="https://excalidraw.com/og-image-3.png" />', '<meta name="image" content="https://draw.itjk.com/apple-touch-icon.png" />')
    .replace('<meta property="og:site_name" content="Excalidraw" />', '<meta property="og:site_name" content="ITJK Draw" />')
    .replace('<meta property="og:url" content="https://excalidraw.com" />', '<meta property="og:url" content="https://draw.itjk.com" />')
    .replace(/content="Excalidraw — Collaborative whiteboarding made easy"/g, 'content="ITJK Draw · 在线画图、流程图与架构图"')
    .replace('<meta property="og:image:alt" content="Excalidraw logo" />', '<meta property="og:image:alt" content="ITJK Draw" />')
    .replace('<meta property="og:image" content="https://excalidraw.com/og-image-3.png" />', '<meta property="og:image" content="https://draw.itjk.com/apple-touch-icon.png" />')
    .replace('<meta property="twitter:site" content="@excalidraw" />', '<meta property="twitter:site" content="" />')
    .replace('<meta property="twitter:url" content="https://excalidraw.com" />', '<meta property="twitter:url" content="https://draw.itjk.com" />')
    .replace(/content="Excalidraw — Collaborative whiteboarding made easy"/g, 'content="ITJK Draw · 在线画图、流程图与架构图"')
    .replace(/content="https:\/\/excalidraw\.com\/og-image-3\.png"/g, 'content="https://draw.itjk.com/apple-touch-icon.png"')
    .replace('<link rel="canonical" href="https://excalidraw.com" />', '<link rel="canonical" href="https://draw.itjk.com" />')
    .replace('document.cookie.includes("excplus-autoredirect=true")', 'false /* ITJK Draw: disable upstream auto redirect */')
    .replace('window.name = "_excalidraw";', 'window.name = "_itjk_draw";');
});

update("excalidraw-app/app-language/language-detector.ts", () => `import LanguageDetector from "i18next-browser-languagedetector";

export const languageDetector = new LanguageDetector();

languageDetector.init({
  languageUtils: {},
});

export const getPreferredLanguage = () => "zh-CN" as const;
`);

update("excalidraw-app/App.tsx", (source) =>
  source.replace(
    "const isCollabDisabled = isRunningInIframe();",
    "const isCollabDisabled = true; // ITJK Draw: collaboration server is intentionally disabled",
  ),
);

console.log("[ITJK Draw] Branding patches applied.");
