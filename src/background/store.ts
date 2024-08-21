import { watch } from "fs";

import { Storage } from "@plasmohq/storage";

import { StorageKeys, type TStorage } from "./constant";

const storage = new Storage();

storage.watch({
  [StorageKeys.RULES]: (c) => {
    console.log("=> ", StorageKeys.RULES, c);
  }
});

export const getRules = async () => {
  return await storage.get<TStorage[StorageKeys.RULES]>(StorageKeys.RULES);
};

export const setRule = async (data: TStorage[StorageKeys.RULES][number]) => {
  const rules = await getRules();

  const rule = rules.find((rule) => rule.id === data.id);
  if (rule) {
    Object.assign(rule, data);
  }
  await storage.set(StorageKeys.RULES, [...rules, data]);
};
