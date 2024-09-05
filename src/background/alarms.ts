import dayjs from "dayjs";

import type { IRule } from "./constant";
import { weekName } from "./constant";
import { addNetRules, removeNetRules } from "./rules";
import { getRule } from "./store";

export const alarmInit = async () => {
  removeNetRules();
  const rules = await getRule();
  await setAlarms(rules);

  chrome.alarms.onAlarm.addListener(function (alarm) {
    const [type, id] = alarm.name.split("-rule-");
    const rule = rules.find((r) => r.id === Number(id));
    if (!rule) return;

    if (type === "start") {
      console.log("=> start-rule: ", id);
      addNetRules([{ id: rule.id, url: rule.url }]);
    } else if (type === "end") {
      removeNetRules([rule.id]);
      console.log("=> end-rule: ", id);
    }
  });
};

export const setAlarms = async (rules: IRule[]) => {
  if (!rules.length) return;
  const currentTime = Date.now();

  rules.forEach((rule) => {
    const todayWeekName = weekName[dayjs().day()];
    if (!rule.weekly[todayWeekName]) return;

    const startTime = dayjs()
      .startOf("day")
      .add(rule.start, "seconds")
      .valueOf();
    const endTime = dayjs().startOf("day").add(rule.end, "seconds").valueOf();
    const hasEnded = endTime < currentTime;

    if (hasEnded) return;
    chrome.alarms.create(`end-rule-${rule.id}`, {
      when: endTime
    });
    chrome.alarms.create(`start-rule-${rule.id}`, {
      when: startTime
    });
  });
};

export const removeAlarms = async (rules: IRule[]) => {
  try {
    await Promise.all(
      rules.map((rule) => {
        removeNetRules([rule.id]);
        chrome.alarms.clear(`start-rule-${rule.id}`);
        chrome.alarms.clear(`end-rule-${rule.id}`);
      })
    );
    return true;
  } catch (error) {
    console.error(
      "=> removeAlarms",
      error instanceof Error ? error.message : error
    );
    return false;
  }
};

export const getAlarms = async (ids: number[]) => {
  const result = [] as Array<{
    start?: chrome.alarms.Alarm;
    end?: chrome.alarms.Alarm;
  }>;
  ids.forEach(async (id) => {
    const start = await chrome.alarms.get(`start-rule-${id}`);
    const end = await chrome.alarms.get(`end-rule-${id}`);
    result.push({ start, end });
  });

  return result;
};

export const clearAlarms = async () => {
  return await chrome.alarms.clearAll();
};

export const getAllAlarms = async () => {
  return await chrome.alarms.getAll();
};
