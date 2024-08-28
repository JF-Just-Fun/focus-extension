import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
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
import { clearParams, paramsToObject } from "~utils/url";

import AddDialog, { type AddDialogRef } from "./AddDialog";
import RuleItem from "./RuleItem";
import { StyleOptionsHeader } from "./style";

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
  const { description } = chrome.runtime.getManifest();
  useEffect(() => {
    const params = paramsToObject(window.location.search);
    if (params.url) {
      handleSetRule({ url: params.url });
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

  const handleSetRule = (data: Partial<IRule>) => {
    console.log("=> handleSetRule", data);

    chrome.runtime.sendMessage(
      {
        action: ActionType.STORAGE_SET_RULES,
        rule: data
      },
      (response) => {
        console.log("=> response", response);

        if (response.rule) {
          getRules();
        }
      }
    );
  };

  const handleAddRuleModal = () => {
    dialogRef.current.open();
  };

  return (
    <CacheProvider value={styleCache}>
      <AddDialog ref={dialogRef} addRule={handleSetRule} />
      <StyleOptionsHeader>{description}</StyleOptionsHeader>
      <div style={{ margin: "20px" }}>
        <IconButton
          onClick={handleAddRuleModal}
          style={{ position: "fixed", right: 20, bottom: 20, zIndex: 999 }}>
          <AddCircleIcon color="primary" fontSize="large" />
        </IconButton>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
          {rules.map((item) => (
            <RuleItem key={item.id} {...item} onChange={handleSetRule} />
          ))}
        </div>
      </div>
    </CacheProvider>
  );
}

export default OptionsIndex;
