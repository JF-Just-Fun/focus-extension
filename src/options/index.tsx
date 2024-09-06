import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import IconButton from "@mui/material/IconButton";
import { useEffect, useRef, useState } from "react";

import { sendToBackground } from "@plasmohq/messaging";

import { StorageKeys, type IRule, type TStorage } from "~utils/constant";
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
  const [rules, setRules] = useState<TStorage[StorageKeys.RULES]>([]);
  const dialogRef = useRef<TAddDialogRef>(null);
  const snackRef = useRef<TSnackBarRef>(null);
  const { description } = chrome.runtime.getManifest();
  useEffect(() => {
    const params = paramsToObject(window.location.search);
    if (params.url) {
      handleSetRule({ ...params });
    }
    clearParams();

    getRules();
  }, []);

  const getRules = async () => {
    const res = await sendToBackground({
      name: "storage-rules",
      extensionId: chrome.runtime.id
    });
    if (res.Ok && res.data?.storageRules) {
      setRules(res.data?.storageRules);
    }
  };

  const handleDeleteRule = async (id: number) => {
    const res = await sendToBackground({
      name: "storage-remove-rules",
      body: {
        id
      },
      extensionId: chrome.runtime.id
    });

    if (res.Ok) {
      setRules(res.data.rules);
      snackRef.current.open(res.message, "success");
    } else {
      snackRef.current.open(res.message, "error");
    }
  };

  const handleSetRule = async (data: Partial<IRule>) => {
    const res = await sendToBackground({
      name: "storage-set-rules",
      body: {
        rule: data
      },
      extensionId: chrome.runtime.id
    });

    if (res.Ok) {
      getRules();
      snackRef.current.open("Operation successful!", "success");
    } else {
      snackRef.current.open(res?.message, "error");
    }
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
          sx={{
            position: "fixed",
            right: 20,
            bottom: 20,
            zIndex: 999
          }}>
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
