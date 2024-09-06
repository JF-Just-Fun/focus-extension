import type { PlasmoMessaging } from "@plasmohq/messaging";

import { blockThisTab } from "~background/store";
import { Message } from "~utils/constant";

const handler: PlasmoMessaging.MessageHandler<{
  tab?: chrome.tabs.Tab;
}> = async (req, res) => {
  let message: string = Message.SUCCESS;
  let Ok = true;
  try {
    await blockThisTab(req.body?.tab);
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
