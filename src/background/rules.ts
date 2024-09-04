import { Storage } from "@plasmohq/storage";

import { getDomain, getUrl, isHttpPage } from "~utils/url";

import { StorageKeys, type IRule, type TStorage } from "./constant";

export const addRules = async (urls: string[]) => {
  const storage = new Storage();

  const id = await storage.get<TStorage[StorageKeys.ID]>(StorageKeys.ID);
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

  storage.set(StorageKeys.ID, id + ruleAdd.length);

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
  if (!ids.length) {
    const allRules = await getRules();
    ids = allRules.map((item) => item.id);
  }
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
