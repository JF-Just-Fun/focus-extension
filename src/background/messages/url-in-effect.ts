import type { PlasmoMessaging } from "@plasmohq/messaging";

import { urlInEffect } from "~background/rules";
import { Message } from "~utils/constant";

const handler: PlasmoMessaging.MessageHandler<{
  url: string;
}> = async (req, res) => {
  let Ok = true;
  let effect = false;
  let message: string = Message.SUCCESS;
  try {
    effect = await urlInEffect(req.body.url);
  } catch (error: unknown) {
    Ok = false;
    message = error instanceof Error ? error.message : Message.ERROR;
  }

  res.send({
    Ok,
    message,
    data: {
      effect
    }
  });
};

export default handler;
