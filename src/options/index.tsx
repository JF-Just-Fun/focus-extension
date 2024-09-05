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
} from "~utils/constant";
import { clearParams, paramsToObject } from "~utils/url";

import AddDialog, { type TAddDialogRef } from "./AddDialog";
import RuleItem from "./RuleItem";
import SnackBar, { type TSnackBarRef } from "./SnackBar";
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
  const dialogRef = useRef<TAddDialogRef>(null);
  const snackRef = useRef<TSnackBarRef>(null);
  const storage = new Storage();
  const { description } = chrome.runtime.getManifest();
  useEffect(() => {
    const params = paramsToObject(window.location.search);
    if (params.url) {
      handleSetRule({ ...params });
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
        if (response?.storageRules) {
          setRules(response.storageRules);
        }
      }
    );
  };

  const handleDeleteRule = (id: number) => {
    chrome.runtime.sendMessage(
      {
        action: ActionType.STORAGE_REMOVE_RULES,
        id
      },
      (response) => {
        if (response?.rules) {
          setRules(response.rules);
          snackRef.current.open("Remove successful!", "success");
        } else {
          snackRef.current.open(response?.message, "error");
        }
      }
    );
  };

  const handleSetRule = (data: Partial<IRule>) => {
    chrome.runtime.sendMessage(
      {
        action: ActionType.STORAGE_SET_RULES,
        rule: data
      },
      (response) => {
        if (response?.rule) {
          getRules();
          snackRef.current.open("Operation successful!", "success");
        } else {
          snackRef.current.open(response?.message, "error");
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
      <SnackBar ref={snackRef} />
      <StyleOptionsHeader>{description}</StyleOptionsHeader>
      <div style={{ margin: "20px" }}>
        <IconButton
          onClick={handleAddRuleModal}
          size="large"
          style={{ position: "fixed", right: 20, bottom: 20, zIndex: 999 }}>
          <AddCircleIcon color="primary" fontSize="large" />
        </IconButton>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px"
          }}>
          {rules.map((item) => (
            <RuleItem
              key={item.id}
              {...item}
              onChange={handleSetRule}
              onDelete={handleDeleteRule}
            />
          ))}
        </div>
      </div>
    </CacheProvider>
  );
}

export default OptionsIndex;
