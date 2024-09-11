import type { PlasmoMessaging } from "@plasmohq/messaging";

import { Message } from "~utils/constant";
import { isHttpPage, openOptionsPageWithParams } from "~utils/url";

export const blockThisTab = async (tab?: chrome.tabs.Tab) => {
  if (!tab) {
    const currentTab = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });
    tab = currentTab[0];
  }
  const httpPage = isHttpPage(tab.url);
  if (httpPage) {
    await chrome.tabs.remove(tab.id);
    openOptionsPageWithParams({
      url: tab.url,
      title: tab.title,
      favicon: tab.favIconUrl
    });
  }
};

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
