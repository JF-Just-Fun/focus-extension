export enum ActionType {
  BLOCK_THIS_DOMAIN = "block_this_domain",
  REDIRECT_BLOCKED_PAGE = "redirect_blocked_page",
  URL_IN_EFFECT = "url_in_effect",
  STORAGE_RULES = "storage_rules",
  STORAGE_SET_RULES = "storage_set_rules",
  STORAGE_REMOVE_RULES = "storage_remove_rules",
  STORAGE_CHECK_RULE_URL_EXIST = "storage_check_rule_url_exist"
}

export interface IActionParams {
  [ActionType.URL_IN_EFFECT]: {
    url: string;
  };
  [ActionType.STORAGE_REMOVE_RULES]: {
    id: number;
  };
  [ActionType.STORAGE_SET_RULES]: {
    rule: IRule;
  };
  [ActionType.STORAGE_CHECK_RULE_URL_EXIST]: {
    url: string;
  };
}

export enum StorageKeys {
  ID = "current-id",
  RULES = "net-rules"
}

export const weekName = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun"
] as const;

export interface IRule {
  id: number;
  enabled: boolean;
  url: string;
  start: number;
  end: number;
  title: string;
  favicon: string;
  weekly: {
    [key in (typeof weekName)[number]]: boolean;
  };
}

export type TStorage = {
  [StorageKeys.ID]: number;
  [StorageKeys.RULES]: Array<IRule>;
};
