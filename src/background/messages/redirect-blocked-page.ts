import type { PlasmoMessaging } from "@plasmohq/messaging";

import { Message } from "~utils/constant";

const handler: PlasmoMessaging.MessageHandler<{
  tabId?: string;
}> = async (req, res) => {
  let Ok = true;
  let message: string = Message.SUCCESS;

  const tabId =
    Number(req.body?.tabId) ||
    (
      await chrome.tabs.query({
        active: true,
        currentWindow: true
      })
    )[0].id;

  try {
    await chrome.tabs.update(tabId, {
      url: chrome.runtime.getURL("tabs/blocked.html")
    });
  } catch (error: unknown) {
    message = error instanceof Error ? error.message : Message.ERROR;
    Ok = false;
  }

  res.send({
    Ok,
    message
  });
};

export default handler;
