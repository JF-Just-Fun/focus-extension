import { getDomain, getUrl } from "~utils/url";

import { getStorage, setStorage } from "../utils/storage";

export const addRules = async (urls: string[]) => {
  const id = await getStorage("current-id");
  console.log("=> id", id);
  const ruleAdd = urls.map((url, index) => {
    const domain = getDomain(url);
    const urlFilter = `||${getUrl(url)}*`;
    return {
      id: id + index,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
        redirect: { url: chrome.runtime.getURL("tabs/blocked.html") }
      },
      condition: {
        urlFilter,
        requestDomains: [domain],
        requestMethods: [chrome.declarativeNetRequest.RequestMethod.GET],
        resourceTypes: [
          chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
          chrome.declarativeNetRequest.ResourceType.SUB_FRAME
        ]
      }
    } satisfies chrome.declarativeNetRequest.Rule;
  });

  setStorage("current-id", id + ruleAdd.length);

  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: ruleAdd
    });
    return true;
  } catch (error: unknown) {
    console.error(error);
    return false;
  }
};

export const removeRules = async (ids: number[]) => {
  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ids
    });
  } catch (error: unknown) {
    console.log(error);
    return false;
  }
  return true;
};

export const getRules = async () => {
  const rules = await chrome.declarativeNetRequest.getDynamicRules();
  return rules;
};
