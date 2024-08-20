import type { PlasmoCSConfig } from "plasmo";
import { useEffect } from "react";

import { ActionType } from "./background";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
  run_at: "document_start"
};

function checkUrl() {
  const currentUrl = window.location.href;
  // 向背景脚本发送消息
  chrome.runtime.sendMessage(
    {
      action: ActionType.URL_MATCH_RULE,
      url: currentUrl
    },
    (response) => {
      console.log("=> checkUrl", response);

      // if (response.matched) {
      //   window.location.reload();
      // }
    }
  );
}

const originHistory = window.history;
window.history.pushState = function (...args) {
  const result = originHistory.pushState.apply(originHistory, args);
  checkUrl();
  return result;
};

window.history.replaceState = function (...args) {
  const result = originHistory.replaceState.apply(originHistory, args);
  checkUrl();
  return result;
};

function content() {
  useEffect(() => {
    console.log("this is my content");
    // chrome.runtime.sendMessage(
    //   {
    //     action: ActionType.CHECK_BLOCKED
    //   },
    //   (response) => {
    //     console.error("=> response", response);
    //   }
    // );
  }, []);
  return null;
}

export default content;
