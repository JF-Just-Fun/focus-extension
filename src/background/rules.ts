import {
  getDomain,
  getUrl,
  isHttpPage,
  openOptionsPageWithParams
} from "~utils/url";

import { getStorage, setStorage } from "../utils/storage";

export const addRules = async (urls: string[]) => {
  const id = await getStorage("current-id");
  const ruleAdd = urls.map((url, index) => {
    const domain = getDomain(url);
    if (!domain) throw Error("url is not valid");
    const urlFilter = `||${getUrl(url)}*`;
    return {
      id: id + index,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
        redirect: {
          extensionPath: "/tabs/blocked.html"
        }
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
  } catch (error) {
    console.error(chrome.runtime.lastError, error);
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

export const urlMatch = async (url: string) => {
  const rules = await getRules();
  return rules.some((rule) => {
    const regex = new RegExp(
      rule.condition.urlFilter.replace(/^\|\|/, "").replace(/\/\*$/, ".*")
    );
    return regex.test(url);
  });
};

export const blockThisTab = async (tab?: chrome.tabs.Tab) => {
  if (!tab) {
    const currentTab = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });
    tab = currentTab[0];
  }
  const httpPage = isHttpPage(tab.url);
  if (httpPage) {
    await addRules([tab.url]);
    chrome.tabs.update(tab.id, {
      url: chrome.runtime.getURL("tabs/blocked.html")
    });
    return true;
  }
  return false;
};
