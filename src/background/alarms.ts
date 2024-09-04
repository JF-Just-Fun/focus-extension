import dayjs from "dayjs";

import type { IRule } from "./constant";
import { weekName } from "./constant";
import { getRule } from "./store";

export const alarmInit = async () => {
  const rules = await getRule();
  await setAlarms(rules);

  chrome.alarms.onAlarm.addListener(function (alarm) {
    const [type, id] = alarm.name.split("-rule-");
    if (type === "start") {
      console.log("=> end-rule: ", id);
    } else if (type === "end") {
      console.log("=> start-rule: ", id);
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
    const hasStarted = startTime < currentTime;
    const hasEnded = endTime < currentTime;

    if (hasEnded) return;
    chrome.alarms.create(`end-rule-${rule.id}`, {
      when: endTime
    });

    if (hasStarted) {
      console.log("=> start-rule: hasStarted", rule);
    } else {
      chrome.alarms.create(`start-rule-${rule.id}`, {
        when: startTime
      });
    }
  });
};

export const removeAlarms = async (rules: IRule[]) => {
  await Promise.all(
    rules.map((rule) => {
      chrome.alarms.clear(`start-rule-${rule.id}`);
      chrome.alarms.clear(`end-rule-${rule.id}`);
    })
  );
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
