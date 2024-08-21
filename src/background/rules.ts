import { Storage } from "@plasmohq/storage";

import { getDomain, getUrl, isHttpPage } from "~utils/url";

import { StorageKeys, type TStorage } from "./constant";

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

export const fetchFavicon = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    // 查找 <link rel="icon"> 或 <link rel="shortcut icon">
    let link =
      doc.querySelector("link[rel='icon']") ||
      doc.querySelector("link[rel='shortcut icon']");

    if (link) {
      return new URL(link.getAttribute("href"), url).href; // 返回 favicon 的完整 URL
    } else {
      throw new Error("No favicon found");
    }
  } catch (error) {
    console.error("=> Failed to fetch favicon:", error);
    return "";
  }
};
