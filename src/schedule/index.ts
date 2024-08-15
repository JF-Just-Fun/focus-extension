export default async function (
  start: Array<{ id: number; when: number }> = [],
  end: Array<{ id: number; when: number }> = []
) {
  try {
    await chrome.alarms.clearAll()
  } catch (error) {
    console.error("=> clearAll", error)
  }
  start.forEach((item) => {
    chrome.alarms.create(`focus-schedule:start:${item.id}`, { when: item.when })
  })

  // 监听 alarm 触发事件
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (!alarm.name.startsWith("focus-schedule:")) return false

    const [, type, id] = alarm.name.split(":")
    console.log("定时任务运行中：", new Date())
    if (type === "start") {

    }
    // 在这里添加你想要执行的代码
  })
}
