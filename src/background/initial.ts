import { getStorage, setStorage } from "~utils/storage";

export const MENU_ID = "focus-menu:block-this-domain";

export default function () {
  chrome.runtime.onInstalled.addListener(async () => {
    // initial rule id
    const id = await getStorage("current-id");
    if (!id) {
      setStorage("current-id", 1);
    }

    // create context menu
    chrome.contextMenus.create({
      id: MENU_ID,
      title: "Block this shit",
      contexts: ["page"],
      documentUrlPatterns: ["http://*/*", "https://*/*"]
    });
  });
}
