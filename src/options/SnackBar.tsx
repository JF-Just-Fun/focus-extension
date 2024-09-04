import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import { forwardRef, useImperativeHandle, useState } from "react";

export type TSnackBarRef = {
  open: (message: string, type: TType) => void;
};

type TType = "success" | "error";

export default forwardRef((_, ref) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TType>("success");
  const [message, setMessage] = useState(
    "This is a success Alert inside a Snackbar!"
  );

  useImperativeHandle<unknown, TSnackBarRef>(ref, () => ({
    open(message, type) {
      setOpen(true);
      setMessage(message);
      setType(type);
    }
  }));

  return (
    <Snackbar
      open={open}
      onClose={() => setOpen(false)}
      autoHideDuration={4000}
      TransitionComponent={(props) => <Slide {...props} direction="up" />}>
      <Alert severity={type} variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
});
