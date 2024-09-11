import type { url } from "inspector";
import type { PlasmoCSConfig } from "plasmo";

import { sendToBackground } from "@plasmohq/messaging";

export const config: PlasmoCSConfig = {
  matches: ["https://*/*", "http://*/*"],
  all_frames: true,
  run_at: "document_start"
};

async function urlChange() {
  const currentUrl = window.location.href;
  // 向背景脚本发送消息
  const res = await sendToBackground({
    name: "url-in-effect",
    body: {
      url: currentUrl
    }
  });

  if (res.Ok) {
    res.data.effect &&
      sendToBackground({
        name: "redirect-blocked-page"
      });
  } else {
    console.log("=> error: window url change", res.message);
  }
}

let lastUrl = window.location.href;
new MutationObserver(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    urlChange();
  }
}).observe(window.document, { subtree: true, childList: true });

urlChange();
