import {
  addRules,
  blockThisTab,
  getRules,
  removeRules,
  urlMatch
} from "~background/rules";

import { ActionType } from "./constant";
import { getRule, setRule } from "./store";

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

export default function () {
  chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
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
        case ActionType.STORAGE_RULES:
          const storageRules = await getRule();
          sendResponse({ storageRules: storageRules });
          break;
        case ActionType.STORAGE_SET_RULES:
          const { rule } = message;
          try {
            const currentRule = await setRule(rule);
            sendResponse({ rule: currentRule });
          } catch (error) {
            sendResponse({ rule: null, message: error?.message });
          }
          break;
        default:
          break;
      }
    }
  );
}
