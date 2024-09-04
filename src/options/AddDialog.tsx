import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { forwardRef, useImperativeHandle, useState } from "react";

import type { IRule } from "~background/constant";
import { fetchDocument } from "~options/document";
import { isHttpPage } from "~utils/url";

interface IProps {
  addRule: (rule: Partial<Omit<IRule, "url">> & Pick<IRule, "url">) => void;
}

export type TAddDialogRef = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};
export default forwardRef((props: IProps, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [domain, setDomain] = useState("");
  const [domainError, setDomainError] = useState(false);
  const { description } = chrome.runtime.getManifest();

  useImperativeHandle<unknown, TAddDialogRef>(ref, () => ({
    open() {
      setIsVisible(true);
    },
    close() {
      setIsVisible(false);
    },
    toggle() {
      setIsVisible(!isVisible);
    }
  }));

  const handleSubmit = async () => {
    setDomainError(false);
    // 判断domain是不是url
    if (!isHttpPage(domain)) {
      setDomainError(true);
      return;
    }

    const { favicon, title } = await fetchDocument(domain);

    props.addRule({ url: domain, favicon, title });
    setIsVisible(false);
  };

  const handleClose = () => {
    setDomain("");
    setDomainError(false);
    setIsVisible(false);
  };

  return (
    <Dialog open={isVisible} onClose={handleClose}>
      <DialogTitle>New Block</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
        <TextField
          required
          label="Domain to disable"
          id="domain"
          name="domain"
          type="text"
          fullWidth
          variant="standard"
          value={domain}
          error={domainError}
          helperText={
            domainError ? "domain format is protocol://hostname/subpath" : ""
          }
          onChange={(e) => setDomain(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Block</Button>
      </DialogActions>
    </Dialog>
  );
});
