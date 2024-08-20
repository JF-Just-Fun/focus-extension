import iconDisabled from "url:~assets/icon-disabled.png";
import icon from "url:~assets/icon.png";

import initial from "~/helper/initial";
import {
  addRules,
  blockThisTab,
  getRules,
  removeRules,
  urlMatch
} from "~/helper/rules";
import { isHttpPage } from "~utils/url";

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

export enum ActionType {
  UPDATE_RULES = "update_rules",
  GET_RULES = "get_rules",
  SET_RULES_ALARM = "set_rules_alarm",
  URL_MATCH_RULE = "url_match_rule"
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.action) {
    case ActionType.UPDATE_RULES:
      const { addList, removeList } = message;
      const res = await handleUpdateRules(addList, removeList);
      sendResponse({ success: res });
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
      console.log("=> matched", matched);
      sendResponse({ matched });
      break;
    default:
      break;
  }
});

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "focus-menu:block-this-domain") {
    blockThisTab(tab);
  }
});

// 监听插件是否可用
function updateAction(tabId, changeInfo, tab) {
  console.log("=> tab", tab.url);

  if (isHttpPage(tab.url)) {
    // 设置 popup
    chrome.action.setPopup({ tabId: tabId, popup: "popup.html" });
    chrome.action.setIcon({ path: icon });
  } else {
    // 移除 popup
    chrome.action.setPopup({
      tabId: tabId,
      popup: "tabs/invalidate-popup.html"
    });
    chrome.action.setIcon({ path: iconDisabled });
  }
}
chrome.tabs.onUpdated.addListener(updateAction);
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    updateAction(tab.id, {}, tab);
  });
});
