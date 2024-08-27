import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { useEffect, useRef, useState } from "react";

import { Storage } from "@plasmohq/storage";

import {
  ActionType,
  StorageKeys,
  type IRule,
  type TStorage
} from "~/background/constant";
import { setRule } from "~background/store";
import { clearParams, getUrlParams, paramsToObject } from "~utils/url";

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
  const [rules, setRules] = useState<TStorage[StorageKeys.RULES]>([]);
  const dialogRef = useRef<AddDialogRef>(null);
  const storage = new Storage();

  useEffect(() => {
    const params = paramsToObject(window.location.search);
    if (params.url) {
      handleAdd(params.url);
    }
    clearParams();

    getRules();
  }, []);

  const getRules = () => {
    chrome.runtime.sendMessage(
      {
        action: ActionType.STORAGE_RULES
      },
      (response) => {
        if (response.storageRules) {
          setRules(response.storageRules);
        }
      }
    );
  };

  const handleAdd = (url: string) => {
    chrome.runtime.sendMessage(
      {
        action: ActionType.STORAGE_SET_RULES,
        rule: {
          url
        }
      },
      (response) => {
        if (response.success) {
          getRules();
        }
      }
    );
  };

  const handleAddRuleModal = () => {
    dialogRef.current.open();
  };

  const handleUpdateRule = async (
    data: Partial<Omit<IRule, "id">> & Pick<IRule, "id">
  ) => {
    await setRule(data);
    getRules();
  };
  return (
    <CacheProvider value={styleCache}>
      <AddDialog ref={dialogRef} addRule={handleAdd} />
      <div style={{ margin: "20px" }}>
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
              <RuleItem key={item.id} {...item} onChange={handleUpdateRule} />
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
