import { useEffect, useState } from "react"

import { ActionType } from "./background"

function OptionsIndex() {
  const [data, setData] = useState("")
  const [rules, setRules] = useState<number[]>([])

  useEffect(() => {
    handleGetRules()
  }, [])

  const handleGetRules = () => {
    chrome.runtime.sendMessage(
      {
        action: ActionType.GET_RULES
      },
      (response: { rules: chrome.declarativeNetRequest.Rule[] }) => {
        console.log("=> handleGetRules: ", response.rules)
        setRules(response.rules.map((item) => item.id))
      }
    )
  }

  const handleRemove = (id: number) => {
    chrome.runtime.sendMessage(
      {
        action: ActionType.UPDATE_RULES,
        removeList: [id]
      },
      (response) => {
        if (response.success) {
          handleGetRules()
        }
      }
    )
  }

  const handleAdd = (url: string) => {
    chrome.runtime.sendMessage(
      {
        action: ActionType.UPDATE_RULES,
        addList: [url]
      },
      (response) => {
        if (response.success) {
          handleGetRules()
        }
        setData("")
      }
    )
  }

  return (
    <div>
      <h1>
        Welcome to your <a href="https://www.plasmo.com">Plasmo</a> Extension!
      </h1>
      <h2>This is the Option UI page!</h2>
      <input onChange={(e) => setData(e.target.value)} value={data} />
      <button onClick={() => handleAdd(data)}>add domain</button>

      <div>
        <ul>
          {rules.map((item) => (
            <li key={item}>
              {item}&emsp;
              <span
                style={{ cursor: "pointer" }}
                onClick={() => handleRemove(item)}>
                X
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default OptionsIndex
