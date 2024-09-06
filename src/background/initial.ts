import { Storage } from "@plasmohq/storage";

import { StorageKeys, type TStorage } from "../utils/constant";

export const MENU_ID = "focus-menu:block-this-domain";

export default function () {
  const storage = new Storage();
  console.log("=> bg sw initiated!");

  chrome.runtime.onInstalled.addListener(async () => {
    const id = await storage.get<TStorage[StorageKeys.ID]>(StorageKeys.ID);
    if (!id) {
      storage.set(StorageKeys.ID, 1);
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
