import "@plasmohq/messaging/background";

import iconGray from "url:~assets/icon-gray.png";
import icon from "url:~assets/icon-origin.png";

import { isHttpPage } from "~utils/url";

import { alarmInit } from "./alarms";
import initial from "./initial";
import { blockThisTab } from "./messages/block-this-tab";

initial();
alarmInit();

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
