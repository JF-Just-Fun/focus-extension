import type { PlasmoCSConfig } from "plasmo";

import { ActionType } from "../background/constant";

export const config: PlasmoCSConfig = {
  matches: ["https://*/*", "http://*/*"],
  all_frames: true,
  run_at: "document_start"
};

function urlChange() {
  const currentUrl = window.location.href;
  // 向背景脚本发送消息
  chrome.runtime.sendMessage(
    {
      action: ActionType.URL_MATCH_RULE,
      url: currentUrl
    },
    (response) => {
      if (response.matched) {
        chrome.runtime.sendMessage({
          action: ActionType.REDIRECT_BLOCKED_PAGE
        });
      }
    }
  );
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
