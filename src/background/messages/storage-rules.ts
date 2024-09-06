import type { PlasmoMessaging } from "@plasmohq/messaging";

import { getRule } from "~background/store";
import { Message, type IRule } from "~utils/constant";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const storageRules: IRule[] = [];
  let Ok = true;
  let message: string = Message.SUCCESS;

  try {
    const rules = await getRule();
    storageRules.push(...rules);
  } catch (error: unknown) {
    Ok = false;
    message = error instanceof Error ? error.message : Message.ERROR;
  }

  res.send({
    Ok,
    message,
    data: {
      storageRules
    }
  });
};

export default handler;
