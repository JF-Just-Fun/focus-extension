export enum ActionType {
  UPDATE_RULES = "update_rules",
  GET_RULES = "get_rules",
  SET_RULES_ALARM = "set_rules_alarm",
  BLOCK_THIS_DOMAIN = "block_this_domain",
  REDIRECT_BLOCKED_PAGE = "redirect_blocked_page",
  URL_MATCH_RULE = "url_match_rule"
}

export enum StorageKeys {
  ID = "current-id",
  RULES = "net-rules"
}

export type TStorage = {
  [StorageKeys.ID]: number;
  [StorageKeys.RULES]: Array<{
    id: number;
    enabled: boolean;
    url: string;
    start: number;
    end: number;
    weekly: Array<1 | 2 | 3 | 4 | 5 | 6 | 7>;
  }>;
};
