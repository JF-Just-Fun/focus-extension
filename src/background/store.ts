import { Storage } from "@plasmohq/storage";

import { fetchDocument } from "~/utils/document";

import { StorageKeys, type IRule, type TStorage } from "./constant";

const storage = new Storage();

storage.watch({
  [StorageKeys.RULES]: (c) => {
    console.log("=> watch", StorageKeys.RULES, c);
  }
});

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
  const id = await storage.get<TStorage[StorageKeys.ID]>(StorageKeys.ID);

  let oldRuleIndex = -1;
  const oldRule = rules?.find((rule, index) => {
    if (rule.id === data.id) {
      oldRuleIndex = index;
      return true;
    }
    return false;
  });

  const documentUrl = data.url || oldRule.url;
  let originTitle = oldRule.title || data.title || "";
  let originFavicon = oldRule.favicon || data.favicon || "";

  if (documentUrl) {
    const { favicon, title } = await fetchDocument(documentUrl);
    originTitle = title || originTitle;
    originFavicon = favicon || originFavicon;
  }

  const currentRule =
    oldRule ||
    ({
      enabled: true,
      title: "",
      favicon: "",
      start: 0,
      end: 60 * 60 * 24,
      weekly: [1, 2, 3, 4, 5, 6, 7],
      url: data.url,
      id
    } satisfies IRule);

  rules.splice(!~oldRuleIndex ? 0 : oldRuleIndex, !~oldRuleIndex ? 0 : 1, {
    ...currentRule,
    ...data,
    title: originTitle,
    favicon: originFavicon
  });

  await storage.set(StorageKeys.RULES, rules);
  if (!~oldRuleIndex) await storage.set(StorageKeys.ID, id + 1);
  return currentRule;
};

export const removeRule = async (id: number) => {
  const rules = await getRule();

  const otherRules = rules?.filter((rule) => rule.id !== id);
  await storage.set(StorageKeys.RULES, otherRules);
  return otherRules;
};
