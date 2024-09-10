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
  } catch (error: unknown) {
    console.log("=> error", error instanceof Error ? error.message : error);
    return false;
  }
};

export const removeNetRules = async (ids?: number[]) => {
  const allRules = await getNetRules();
  const existRuleIds = allRules.map((item) => item.id);
  if (!ids?.length) {
    ids = [...existRuleIds];
  } else {
    ids = ids.filter((id) => existRuleIds.includes(id));
  }
  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ids
    });
  } catch (error: unknown) {
    return false;
  }
  return true;
};

export const getNetRules = async () => {
  const rules = await chrome.declarativeNetRequest.getDynamicRules();
  return rules;
};

export const urlInEffect = async (url: string) => {
  const rules = await getNetRules();
  console.log("=> net rules", rules);

  return rules.some((rule) => {
    const regex = new RegExp(
      rule.condition.urlFilter.replace(/^\|\|/, "").replace(/\/\*$/, ".*")
    );
    return regex.test(url);
  });
};
