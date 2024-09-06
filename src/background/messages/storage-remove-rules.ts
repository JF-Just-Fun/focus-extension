import type { PlasmoMessaging } from "@plasmohq/messaging";

import { removeRule } from "~background/store";
import { Message } from "~utils/constant";

const handler: PlasmoMessaging.MessageHandler<{
  id: number;
}> = async (req, res) => {
  let message: string = Message.SUCCESS;
  let Ok = true;
  const rules = [];
  try {
    const restRule = await removeRule(req.body.id);
    rules.push(...restRule);
  } catch (error: unknown) {
    message = error instanceof Error ? error.message : Message.ERROR;
    Ok = false;
  }

  res.send({
    Ok,
    message,
    data: {
      rules
    }
  });
};

export default handler;
