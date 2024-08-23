import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { forwardRef, useImperativeHandle, useState } from "react";

import { isHttpPage } from "~utils/url";

interface IProps {
  addRule: (url: string) => void;
}

export type AddDialogRef = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};
export default forwardRef((props: IProps, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [domain, setDomain] = useState("");
  const [domainError, setDomainError] = useState(false);
  const { description } = chrome.runtime.getManifest();

  useImperativeHandle(ref, () => ({
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

  const handleSubmit = () => {
    setDomainError(false);
    // 判断domain是不是url
    if (!isHttpPage(domain)) {
      setDomainError(true);
      return;
    }
    props.addRule(domain);
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
