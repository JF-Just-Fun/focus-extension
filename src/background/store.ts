import dayjs from "dayjs";
import { assign, isEqual } from "lodash";

import { Storage } from "@plasmohq/storage";

import {
  StorageKeys,
  weekName,
  type IRule,
  type TStorage
} from "~utils/constant";
import { getUrl, isHttpPage, openOptionsPageWithParams } from "~utils/url";

import { removeAlarms, setAlarms } from "./alarms";

const storage = new Storage();

const DayEnd = 24 * 60 * 60 - 1;

const getNewRule = async (
  originRules: IRule[],
  index: number,
  data: Partial<IRule>
) => {
  const id = await storage.get<TStorage[StorageKeys.ID]>(StorageKeys.ID);
  const currentRule =
    originRules[index] ||
    ({
      enabled: true,
      title: "",
      favicon: "",
      start: 0,
      end: DayEnd,
      weekly: {
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
        sun: true
      },
      url: data.url,
      id
    } satisfies IRule);

  if (!~index) await storage.set(StorageKeys.ID, id + 1);

  const newRule = assign({}, currentRule, data);

  if (newRule.start > DayEnd) newRule.start -= DayEnd;
  if (newRule.end > DayEnd) newRule.end -= DayEnd;

  if (newRule.start > newRule.end) {
    [newRule.start, newRule.end] = [newRule.end, newRule.start];
  }

  if (!getUrl(newRule.url)) throw Error("url is invalid");
  if (!~index && (await checkRuleUrlExist(newRule.url, originRules)))
    throw Error("Url already exists!");

  return newRule;
};

export function getRule(id: number): Promise<IRule | undefined>;
export function getRule(): Promise<TStorage[StorageKeys.RULES]>;
export async function getRule(id?: number) {
  const res =
    (await storage.get<TStorage[StorageKeys.RULES]>(StorageKeys.RULES)) || [];

  if (id !== undefined) {
    const rule = res?.find((rule) => rule.id === id);
    return rule;
  }
  return res;
}

export const setRule = async (data: Partial<IRule>) => {
  const rules = await getRule();

  const index = rules?.findIndex((rule) => rule.id === data.id);

  const newRule = await getNewRule(rules, index, data);

  if (isEqual(newRule, rules[index])) throw Error("no change");

  rules.splice(!~index ? 0 : index, !~index ? 0 : 1, newRule);

  await storage.set(StorageKeys.RULES, rules);

  const todayWeekName = weekName[dayjs().day()];
  if (newRule.enabled && newRule.weekly[todayWeekName]) {
    await setAlarms([newRule]);
  } else await removeAlarms([newRule]);
  return newRule;
};

export const removeRule = async (id: number) => {
  const rules = await getRule();

  const otherRules = rules?.filter((rule) => rule.id !== id);
  const deletedRule = rules?.find((rule) => rule.id === id);
  try {
    await storage.set(StorageKeys.RULES, otherRules);
    await removeAlarms([deletedRule]);
  } catch (error: unknown) {
    console.log(
      "=> error: removeRule",
      error instanceof Error ? error.message : error
    );
  }
  return otherRules;
};

export const checkRuleUrlExist = async (url: string, rules?: IRule[]) => {
  if (!rules) rules = await getRule();
  return !!~rules.findIndex((rule) => {
    const currentUrlRegExp = new RegExp(`${getUrl(url)}.*`);
    return currentUrlRegExp.test(getUrl(rule.url));
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
    openOptionsPageWithParams({
      url: tab.url,
      title: tab.title,
      favicon: tab.favIconUrl
    });
    chrome.tabs.update(tab.id, {
      url: chrome.runtime.getURL("tabs/blocked.html")
    });
  }
};
