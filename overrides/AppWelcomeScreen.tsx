import { WelcomeScreen } from "@excalidraw/excalidraw/index";
import React from "react";

export const AppWelcomeScreen: React.FC<{
  onCollabDialogOpen: () => any;
  isCollabEnabled: boolean;
}> = React.memo(() => {
  return (
    <WelcomeScreen>
      <WelcomeScreen.Hints.MenuHint />
      <WelcomeScreen.Hints.ToolbarHint />
      <WelcomeScreen.Hints.HelpHint />
      <WelcomeScreen.Center>
        <div
          style={{
            fontSize: "30px",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: "8px",
          }}
        >
          ITJK Draw
          <span
            style={{
              display: "block",
              marginTop: "2px",
              fontSize: "13px",
              fontWeight: 600,
              opacity: 0.55,
              letterSpacing: "0.02em",
            }}
          >
            draw.itjk.com
          </span>
        </div>
        <WelcomeScreen.Center.Heading>
          在线画图 · 流程图 · 架构图 · 白板
        </WelcomeScreen.Center.Heading>
        <WelcomeScreen.Center.Menu>
          <WelcomeScreen.Center.MenuItemLoadScene />
          <WelcomeScreen.Center.MenuItemHelp />
        </WelcomeScreen.Center.Menu>
      </WelcomeScreen.Center>
    </WelcomeScreen>
  );
});
