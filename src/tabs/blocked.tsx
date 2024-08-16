import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import Button from "@mui/material/Button";

const styleElement = document.createElement("style");
window.document.body.appendChild(styleElement);

const styleCache = createCache({
  key: "plasmo-mui-cache",
  prepend: true,
  container: styleElement
});

export default function () {
  const desc = chrome.runtime.getManifest();
  const handleSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <CacheProvider value={styleCache}>
      <div
        style={{
          width: "90vw",
          height: "90vh",
          overflow: "hidden",
          margin: "auto",
          userSelect: "none"
        }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "48px",
            fontWeight: "bold",
            background: "linear-gradient(to right, #3F5EFB 15%, #FC466B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
          {desc.description}
        </div>
      </div>
      <Button
        variant="text"
        onClick={handleSettings}
        style={{
          fontSize: "12px",
          position: "fixed",
          right: "10px",
          bottom: "10px"
        }}>
        SETTINGS
      </Button>
    </CacheProvider>
  );
}
