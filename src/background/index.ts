import iconGray from "url:~assets/icon-gray.png";
import icon from "url:~assets/icon-origin.png";

import initial from "~background/initial";
import {
  addRules,
  blockThisTab,
  getRules,
  removeRules,
  urlMatch
} from "~background/rules";
import { isHttpPage } from "~utils/url";

import { ActionType } from "./types";

console.log("=> background sw");

initial();

const handleUpdateRules = async (addList: string[], removeList: number[]) => {
  console.log("=> handleUpdateRules", addList, removeList);
  try {
    if (addList?.length) await addRules(addList);
    if (removeList?.length) await removeRules(removeList);
  } catch {
    console.error("=> rule update error!!!", chrome.runtime.lastError);
    return false;
  }
  return true;
};

const handleSetRulesAlarm = async (
  id: number,
  range: [{ start: number; end: number }]
) => {
  chrome.alarms.create("demo-default-alarm", {
    delayInMinutes: 1,
    periodInMinutes: 1
  });
};

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.action) {
    case ActionType.UPDATE_RULES:
      const { addList, removeList } = message;
      const res = await handleUpdateRules(addList, removeList);
      sendResponse({ success: res });
      break;
    case ActionType.BLOCK_THIS_DOMAIN:
      const blocked = await blockThisTab();
      sendResponse({ blocked });
      break;
    case ActionType.GET_RULES:
      const rules = await getRules();
      sendResponse({ rules });
      break;
    case ActionType.SET_RULES_ALARM:
      const { id, range } = message;
      await handleSetRulesAlarm(id, range);
      sendResponse({ success: true });
      break;
    case ActionType.URL_MATCH_RULE:
      const { url } = message;
      const matched = await urlMatch(url);
      sendResponse({ matched });
      break;
    case ActionType.REDIRECT_BLOCKED_PAGE:
      chrome.tabs.update(sender.tab.id, {
        url: chrome.runtime.getURL("tabs/blocked.html")
      });
      break;
    default:
      break;
  }
});

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "focus-menu:block-this-domain") blockThisTab(tab);
});

// popup and icon
function updateAction(tabId, changeInfo, tab) {
  if (isHttpPage(tab.url)) {
    chrome.action.setPopup({ tabId: tabId, popup: "popup.html" });
    chrome.action.setIcon({ path: icon });
  } else {
    chrome.action.setPopup({
      tabId: tabId,
      popup: "tabs/invalidate-popup.html"
    });
    chrome.action.setIcon({ path: iconGray });
  }
}
chrome.tabs.onUpdated.addListener(updateAction);
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    updateAction(tab.id, {}, tab);
  });
});
