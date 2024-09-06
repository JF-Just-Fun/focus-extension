export enum StorageKeys {
  ID = "current-id",
  RULES = "net-rules"
}

export const weekName = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat"
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

export enum Message {
  SUCCESS = "Success!",
  ERROR = "Error!"
}
