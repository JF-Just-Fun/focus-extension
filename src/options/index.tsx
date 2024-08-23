import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { useEffect, useRef, useState } from "react";

import { clearParams, getUrlParams, paramsToObject } from "~utils/url";

import { ActionType } from "../background/constant";
import AddDialog, { type AddDialogRef } from "./AddDialog";
import RuleItem from "./RuleItem";

const styleElement = document.createElement("style");
window.document.body.appendChild(styleElement);

const styleCache = createCache({
  key: "plasmo-mui-cache",
  prepend: true,
  container: styleElement
});

function OptionsIndex() {
  const [data, setData] = useState("");
  const [rules, setRules] = useState<number[]>([]);
  const dialogRef = useRef<AddDialogRef>(null);

  useEffect(() => {
    handleGetRules();
    const params = paramsToObject(window.location.search);
    if (params.url) {
      handleAdd(params.url);
    }
    clearParams();
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

  const handleAddRuleModal = () => {
    dialogRef.current.open();
  };

  return (
    <CacheProvider value={styleCache}>
      <AddDialog ref={dialogRef} addRule={handleAdd} />
      <div>
        <input onChange={(e) => setData(e.target.value)} value={data} />
        <button onClick={() => handleAdd(data)}>add domain</button>

        <IconButton
          onClick={handleAddRuleModal}
          style={{ position: "fixed", right: 20, bottom: 20, zIndex: 999 }}>
          <AddCircleIcon color="primary" fontSize="large" />
        </IconButton>

        <TextField id="standard-basic" label="Standard" variant="standard" />
        <Checkbox
          icon={
            <RemoveCircleOutlineOutlinedIcon style={{ color: "#616161" }} />
          }
          checkedIcon={<RemoveCircleIcon color="primary" />}
        />
        <div>
          <ul>
            {rules.map((item) => (
              <RuleItem key={item} id={item} url={item.toString()} />
              // <li key={item}>
              //   {item}&emsp;
              //   <span
              //     style={{ cursor: "pointer" }}
              //     onClick={() => handleRemove(item)}>
              //     X
              //   </span>
              // </li>
            ))}
          </ul>
        </div>
      </div>
    </CacheProvider>
  );
}

export default OptionsIndex;
