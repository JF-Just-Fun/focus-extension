import { urlInEffect } from "~background/rules";

import { ActionType, type IActionParams } from "../utils/constant";
import {
  blockThisTab,
  checkRuleUrlExist,
  getRule,
  removeRule,
  setRule
} from "./store";

export default function () {
  chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
      switch (message.action) {
        case ActionType.BLOCK_THIS_DOMAIN:
          try {
            await blockThisTab();
            sendResponse({ blocked: true });
          } catch (error: unknown) {
            sendResponse({
              message: error instanceof Error ? error.message : error
            });
          }
          break;
        case ActionType.URL_IN_EFFECT:
          const { url } = message;
          const matched = await urlInEffect(url);
          sendResponse({ matched });
          break;
        case ActionType.REDIRECT_BLOCKED_PAGE:
          const tabId =
            sender.tab?.id ||
            (
              await chrome.tabs.query({
                active: true,
                currentWindow: true
              })
            )[0].id;
          chrome.tabs.update(tabId, {
            url: chrome.runtime.getURL("tabs/blocked.html")
          });
          break;
        case ActionType.STORAGE_RULES:
          const storageRules = await getRule();
          sendResponse({ storageRules: storageRules });
          break;
        case ActionType.STORAGE_REMOVE_RULES:
          const removeMessage =
            message as IActionParams[ActionType.STORAGE_REMOVE_RULES];
          try {
            const restRule = await removeRule(removeMessage.id);
            sendResponse({ rules: restRule });
          } catch (error: unknown) {
            sendResponse({
              message: error instanceof Error ? error.message : error
            });
          }
          break;
        case ActionType.STORAGE_SET_RULES:
          const { rule } =
            message as IActionParams[ActionType.STORAGE_SET_RULES];
          try {
            const currentRule = await setRule(rule);
            sendResponse({ rule: currentRule });
          } catch (error: unknown) {
            sendResponse({
              message: error instanceof Error ? error.message : error
            });
          }
          break;
        case ActionType.STORAGE_CHECK_RULE_URL_EXIST:
          sendResponse({ exist: await checkRuleUrlExist(message.url) });
          break;
        default:
          break;
      }
    }
  );
}
