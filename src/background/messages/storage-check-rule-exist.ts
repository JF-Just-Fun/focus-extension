import type { PlasmoMessaging } from "@plasmohq/messaging";

import { checkRuleUrlExist } from "~background/store";
import { Message } from "~utils/constant";

const handler: PlasmoMessaging.MessageHandler<{
  url: string;
}> = async (req, res) => {
  let message: string = Message.SUCCESS;
  let Ok = true;
  let exist = false;
  try {
    exist = await checkRuleUrlExist(req.body.url);
  } catch (error: unknown) {
    message = error instanceof Error ? error.message : Message.ERROR;
    Ok = false;
  }

  res.send({
    Ok,
    message,
    data: {
      exist
    }
  });
};

export default handler;
