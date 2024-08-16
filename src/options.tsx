import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";

import { ActionType } from "./background";

const styleElement = document.createElement("style");

const styleCache = createCache({
  key: "plasmo-mui-cache",
  prepend: true,
  container: styleElement
});

export const getStyle = () => styleElement;

function OptionsIndex() {
  const [data, setData] = useState("");
  const [rules, setRules] = useState<number[]>([]);

  useEffect(() => {
    handleGetRules();
  }, []);

  const handleGetRules = () => {
    chrome.runtime.sendMessage(
      {
        action: ActionType.GET_RULES
      },
      (response: { rules: chrome.declarativeNetRequest.Rule[] }) => {
        console.log("=> handleGetRules: ", response.rules);
        setRules(response.rules.map((item) => item.id));
      }
    );
  };

  const handleRemove = async (id: number) => {
    const res = await chrome.runtime.sendMessage({
      action: ActionType.UPDATE_RULES,
      removeList: [id]
    });

    if (res.success) {
      handleGetRules();
    } else {
      console.error("=> remove rule error!!!");
    }
  };

  const handleAdd = (url: string) => {
    chrome.runtime.sendMessage(
      {
        action: ActionType.UPDATE_RULES,
        addList: [url]
      },
      (response) => {
        if (response.success) {
          handleGetRules();
        }
        setData("");
      }
    );
  };

  return (
    <CacheProvider value={styleCache}>
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
      <Button>mybtn</Button>
    </CacheProvider>
  );
}

export default OptionsIndex;
