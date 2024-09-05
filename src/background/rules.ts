import { getDomain, getUrl } from "~utils/url";

interface INetRule {
  id: number;
  url: string;
}
export const addNetRules = async (netRules: Array<INetRule> | INetRule) => {
  if (!Array.isArray(netRules)) netRules = [netRules];

  const ruleAdd = netRules.map((netRule, index) => {
    const domain = getDomain(netRule.url);
    if (!domain) throw Error("url is not valid");
    const urlFilter = `||${getUrl(netRule.url)}*`;
    return {
      id: netRule.id,
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

  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: ruleAdd
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const removeNetRules = async (ids?: number[]) => {
  if (!ids?.length) {
    const allRules = await getNetRules();
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

export const getNetRules = async () => {
  const rules = await chrome.declarativeNetRequest.getDynamicRules();
  console.log("=> net-rules", rules);

  return rules;
};

export const urlInEffect = async (url: string) => {
  const rules = await getNetRules();
  return rules.some((rule) => {
    const regex = new RegExp(
      rule.condition.urlFilter.replace(/^\|\|/, "").replace(/\/\*$/, ".*")
    );
    return regex.test(url);
  });
};
