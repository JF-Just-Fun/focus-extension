type TKeys = "current-id" | "net-rules"

type TValues = {
  "current-id": number
  "net-rules": Array<{
    id: number
    url: string
    start: number
    end: number
    weekly: Array<1 | 2 | 3 | 4 | 5 | 6 | 7>
  }>
}

export const getStorage = async <T extends TKeys>(key: T) => {
  const v = (await chrome.storage.local.get(key)) as Promise<{
    [key in T]: TValues[key]
  }>
  console.log("=> get storage: ", v)
  return v
}

export const setStorage = async <T extends TKeys>(
  key: T,
  value: TValues[T]
) => {
  try {
    await chrome.storage.local.set({ [key]: value })
  } catch (error) {
    console.error("=> set storage: ", error)
    return false
  }
  return true
}
