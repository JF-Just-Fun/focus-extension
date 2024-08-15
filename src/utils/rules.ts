import { getStorage } from "./storage"

export const addRules = async (urls: string[]) => {
  const id = await getStorage("current-id")
  console.log("=> id", id)
  const ruleAdd = urls.map((url, index) => {
    return {
      id: 2,
      priority: 10,
      action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
      condition: {
        urlFilter: url,
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME]
      }
    } satisfies chrome.declarativeNetRequest.Rule
  })

  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: ruleAdd
    })
    return true
  } catch (error: unknown) {
    console.log(error)
    return false
  }
}

export const removeRules = async (ids: number[]) => {
  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ids
    })
    return true
  } catch (error: unknown) {
    console.log(error)
    return false
  }
}

export const getRules = async () => {
  const rules = await chrome.declarativeNetRequest.getDynamicRules()
  return rules
}
