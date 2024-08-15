import { addRules, getRules, removeRules } from "./utils/rules"

console.log("this is background sw")

const handleUpdateRules = async (addList: string[], removeList: number[]) => {
  try {
    if (addList.length) await addRules(addList)
    if (removeList.length) await removeRules(removeList)
  } catch {
    return false
  }
  return true
}

const handleSetRulesAlarm = async (
  id: number,
  range: [{ start: number; end: number }]
) => {
  chrome.alarms.create("demo-default-alarm", {
    delayInMinutes: 1,
    periodInMinutes: 1
  })
}

export enum ActionType {
  UPDATE_RULES = "update_rules",
  GET_RULES = "get_rules",
  SET_RULES_ALARM = "set_rules_alarm"
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.action) {
    case ActionType.UPDATE_RULES:
      const { addList, removeList } = message
      const res = await handleUpdateRules(addList, removeList)
      sendResponse({ success: res })
      break
    case ActionType.GET_RULES:
      const rules = await getRules()
      sendResponse({ rules })
      break
    case ActionType.SET_RULES_ALARM:
      const { id, range } = message
      await handleSetRulesAlarm(id, range)
      sendResponse({ success: true })
      break
    default:
      break
  }
})
