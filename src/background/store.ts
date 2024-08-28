import { assign, isEqual } from "lodash";

import { Storage } from "@plasmohq/storage";

import { getUrl } from "~utils/url";

import { StorageKeys, type IRule, type TStorage } from "./constant";

const storage = new Storage();

storage.watch({
  [StorageKeys.RULES]: (c) => {
    console.log("=> watch", StorageKeys.RULES, c);
  }
});

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
      end: 60 * 60 * 24,
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

  if (newRule.start >= 71400) newRule.start -= 71400;
  if (newRule.end >= 71400) newRule.end -= 71400;

  if (newRule.start > newRule.end) {
    [newRule.start, newRule.end] = [newRule.end, newRule.start];
  }
  return newRule;
};

export function getRule(id: number): Promise<IRule | undefined>;
export function getRule(): Promise<TStorage[StorageKeys.RULES]>;
export async function getRule(id?: number) {
  const res =
    (await storage.get<TStorage[StorageKeys.RULES]>(StorageKeys.RULES)) || [];
  console.log("=> getRule", res);

  if (id !== undefined) {
    const rule = res?.find((rule) => rule.id === id);
    return rule;
  }
  return res;
}

export const setRule = async (data: Partial<IRule>) => {
  const rules = await getRule();

  if (data.url && !getUrl(data.url)) {
    throw Error("url is invalid");
  }

  const index = rules?.findIndex((rule) => rule.id === data.id);

  const newRule = await getNewRule(rules, index, data);

  if (isEqual(newRule, rules[index])) throw Error("no change");

  rules.splice(!~index ? 0 : index, !~index ? 0 : 1, newRule);

  await storage.set(StorageKeys.RULES, rules);
  return newRule;
};

export const removeRule = async (id: number) => {
  const rules = await getRule();

  const otherRules = rules?.filter((rule) => rule.id !== id);
  await storage.set(StorageKeys.RULES, otherRules);
  return otherRules;
};
