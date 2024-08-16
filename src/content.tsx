import type { PlasmoCSConfig } from "plasmo";
import { useEffect } from "react";

import { ActionType } from "./background";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
  run_at: "document_start"
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
