import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
  run_at: "document_start"
}

function content() {
  useEffect(() => {
    console.log("this is my content")
    const urlFilter = "https://dvyinpo.github.io/doc-space/"
    chrome.runtime.sendMessage(
      {
        action: "updateRules",
        urlFilter
      },
      (response) => {
        if (response.success) {
          console.log(`Successfully updated rule to block: ${urlFilter}`)
        } else {
          console.error("Failed to update rule")
        }
      }
    )
  }, [])
  return null
}

export default content
