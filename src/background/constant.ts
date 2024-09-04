export enum ActionType {
  UPDATE_RULES = "update_rules",
  GET_RULES = "get_rules",
  SET_RULES_ALARM = "set_rules_alarm",
  BLOCK_THIS_DOMAIN = "block_this_domain",
  REDIRECT_BLOCKED_PAGE = "redirect_blocked_page",
  URL_MATCH_RULE = "url_match_rule",
  STORAGE_RULES = "storage_rules",
  STORAGE_SET_RULES = "storage_set_rules",
  STORAGE_REMOVE_RULES = "storage_remove_rules",
  STORAGE_CHECK_RULE_URL_EXIST = "storage_check_rule_url_exist"
}

export interface IActionParams {
  [ActionType.SET_RULES_ALARM]: {
    rules: IRule[];
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

export interface IRule {
  id: number;
  enabled: boolean;
  url: string;
  start: number;
  end: number;
  title: string;
  favicon: string;
  weekly: {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
  };
}

export type TStorage = {
  [StorageKeys.ID]: number;
  [StorageKeys.RULES]: Array<IRule>;
};
