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

const packageJsonPath = path.join(root, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
if (packageJson.scripts?.prepare) {
  delete packageJson.scripts.prepare;
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

update("excalidraw-app/index.html", (html) =>
  html
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
    .replace(/content="https:\/\/excalidraw\.com\/og-image-3\.png"/g, 'content="https://draw.itjk.com/apple-touch-icon.png"')
    .replace('<link rel="canonical" href="https://excalidraw.com" />', '<link rel="canonical" href="https://draw.itjk.com" />')
    .replace('document.cookie.includes("excplus-autoredirect=true")', 'false /* ITJK Draw: disable upstream auto redirect */')
    .replace('window.name = "_excalidraw";', 'window.name = "_itjk_draw";'),
);

update("excalidraw-app/app-language/language-detector.ts", () => `import type { Language } from "@excalidraw/excalidraw/i18n";
import LanguageDetector from "i18next-browser-languagedetector";

export const languageDetector = new LanguageDetector();

languageDetector.init({
  languageUtils: {},
});

export const getPreferredLanguage = (): Language["code"] => "zh-CN";
`);

update("excalidraw-app/components/AppMainMenu.tsx", () => `import { eyeIcon } from "@excalidraw/excalidraw/components/icons";
import { MainMenu } from "@excalidraw/excalidraw/index";
import React from "react";

import { isDevEnv } from "@excalidraw/common";

import type { Theme } from "@excalidraw/element/types";

import { LanguageList } from "../app-language/LanguageList";
import { saveDebugState } from "./DebugCanvas";

export const AppMainMenu: React.FC<{
  onCollabDialogOpen: () => any;
  isCollaborating: boolean;
  isCollabEnabled: boolean;
  theme: Theme | "system";
  refresh: () => void;
}> = React.memo((props) => {
  return (
    <MainMenu>
      <MainMenu.DefaultItems.LoadScene />
      <MainMenu.DefaultItems.SaveToActiveFile />
      <MainMenu.DefaultItems.Export />
      <MainMenu.DefaultItems.SaveAsImage />
      {props.isCollabEnabled && (
        <MainMenu.DefaultItems.LiveCollaborationTrigger
          isCollaborating={props.isCollaborating}
          onSelect={() => props.onCollabDialogOpen()}
        />
      )}
      <MainMenu.DefaultItems.CommandPalette className="highlighted" />
      <MainMenu.DefaultItems.SearchMenu />
      <MainMenu.DefaultItems.Help />
      <MainMenu.DefaultItems.ClearCanvas />
      {isDevEnv() && (
        <MainMenu.Item
          icon={eyeIcon}
          onSelect={() => {
            if (window.visualDebug) {
              delete window.visualDebug;
              saveDebugState({ enabled: false });
            } else {
              window.visualDebug = { data: [] };
              saveDebugState({ enabled: true });
            }
            props?.refresh();
          }}
        >
          Visual Debug
        </MainMenu.Item>
      )}
      <MainMenu.Separator />
      <MainMenu.DefaultItems.Preferences />
      <MainMenu.DefaultItems.ToggleTheme allowSystemTheme theme={props.theme} />
      <MainMenu.ItemCustom>
        <LanguageList style={{ width: "100%" }} />
      </MainMenu.ItemCustom>
      <MainMenu.DefaultItems.ChangeCanvasBackground />
    </MainMenu>
  );
});
`);

update("packages/excalidraw/components/HelpDialog.tsx", (source) => {
  source = source.replace(
    'import { ExternalLinkIcon, GithubIcon, youtubeIcon } from "./icons";',
    'import { ExternalLinkIcon } from "./icons";',
  );

  const start = source.indexOf("const Header = () => (");
  const end = source.indexOf("const Section", start);
  if (start === -1 || end === -1) return source;

  const header = `const Header = () => (\n  <div className="HelpDialog__header">\n    <a\n      className="HelpDialog__btn"\n      href="https://itjk.com"\n      target="_blank"\n      rel="noopener noreferrer"\n    >\n      <div className="HelpDialog__link-icon">{ExternalLinkIcon}</div>\n      ITJK.com\n    </a>\n  </div>\n);\n\n`;

  return source.slice(0, start) + header + source.slice(end);
});

update("excalidraw-app/components/AppFooter.tsx", () => `import { Footer } from "@excalidraw/excalidraw/index";
import React from "react";

import { DebugFooter, isVisualDebuggerEnabled } from "./DebugCanvas";

export const AppFooter = React.memo(
  ({ onChange }: { onChange: () => void }) => {
    return (
      <Footer>
        {isVisualDebuggerEnabled() && <DebugFooter onChange={onChange} />}
      </Footer>
    );
  },
);
`);

update("excalidraw-app/App.tsx", (source) => {
  source = source.replace(
    "const isCollabDisabled = isRunningInIframe();",
    "const isCollabDisabled = true; // ITJK Draw: collaboration server is intentionally disabled",
  );

  // Hide the upstream cloud export button from the export dialog.
  const exportStart = source.indexOf("              renderCustomUI: excalidrawAPI");
  if (exportStart !== -1) {
    const exportEndMarker = "                : undefined,\n";
    const exportEnd = source.indexOf(exportEndMarker, exportStart);
    if (exportEnd !== -1) {
      source =
        source.slice(0, exportStart) +
        "              renderCustomUI: undefined,\n" +
        source.slice(exportEnd + exportEndMarker.length);
    }
  }

  // Remove the upstream cloud action from overwrite confirmation.
  const overwriteStartMarker = `          {excalidrawAPI && (\n            <OverwriteConfirmDialog.Action\n              title={t("overwriteConfirm.action.excalidrawPlus.title")}`;
  const overwriteStart = source.indexOf(overwriteStartMarker);
  if (overwriteStart !== -1) {
    const overwriteEndMarker = "          )}\n";
    const overwriteEnd = source.indexOf(overwriteEndMarker, overwriteStart);
    if (overwriteEnd !== -1) {
      source = source.slice(0, overwriteStart) + source.slice(overwriteEnd + overwriteEndMarker.length);
    }
  }

  // Remove upstream GitHub/X/Discord/YouTube/Excalidraw+ entries from the command palette.
  const linksStart = source.indexOf(`            {\n              label: "GitHub",`);
  const linksEnd = source.indexOf(`            {\n              label: t("labels.installPWA"),`, linksStart);
  if (linksStart !== -1 && linksEnd !== -1) {
    source = source.slice(0, linksStart) + source.slice(linksEnd);
  }

  return source;
});

// Redirect any remaining user-facing references to upstream project/social/help
// pages. String replacement is deliberately used instead of broad URL regexes
// so source code cannot be consumed across line boundaries.
const runtimeRoots = [
  path.join(root, "excalidraw-app"),
  path.join(root, "packages", "excalidraw", "components"),
];
const upstreamLinkReplacements = [
  ["https://github.com/excalidraw/excalidraw/", "https://itjk.com/"],
  ["https://docs.excalidraw.com", "https://itjk.com"],
  ["https://plus.excalidraw.com", "https://itjk.com"],
  ["https://app.excalidraw.com", "https://itjk.com"],
  ["https://x.com/excalidraw", "https://itjk.com"],
  ["https://youtube.com/@excalidraw", "https://itjk.com"],
  ["https://discord.gg/UexuTaE", "https://itjk.com"],
];

const rewriteRuntimeLinks = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      rewriteRuntimeLinks(full);
      continue;
    }
    if (!/\.(?:ts|tsx|js|jsx|html)$/.test(entry.name)) continue;
    let content = fs.readFileSync(full, "utf8");
    const before = content;
    for (const [from, to] of upstreamLinkReplacements) {
      content = content.replaceAll(from, to);
    }
    if (content !== before) fs.writeFileSync(full, content);
  }
};

for (const dir of runtimeRoots) rewriteRuntimeLinks(dir);

console.log("[ITJK Draw] Branding patches applied; upstream UI links removed.");
