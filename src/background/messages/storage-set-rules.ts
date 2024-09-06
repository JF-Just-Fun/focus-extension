import type { PlasmoMessaging } from "@plasmohq/messaging";

import { setRule } from "~background/store";
import { Message, type IRule } from "~utils/constant";

const handler: PlasmoMessaging.MessageHandler<{
  rule: IRule;
}> = async (req, res) => {
  let Ok = true;
  let message: string = Message.SUCCESS;
  let currentRule: IRule = null;

  try {
    currentRule = await setRule(req.body.rule);
  } catch (error: unknown) {
    Ok = false;
    message = error instanceof Error ? error.message : Message.ERROR;
  }

  res.send({
    Ok,
    message,
    data: {
      rule: currentRule
    }
  });
};

export default handler;
