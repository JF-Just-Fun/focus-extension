import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Badge, IconButton, Input, styled, TextField } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Switch from "@mui/material/Switch";
import { useEffect, useState } from "react";

import type { IRule } from "~background/constant";
import { removeRule } from "~background/store";

const StyledBadge = styled(Badge)(() => ({
  "&.active .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    "&::after": {
      animation: "ripple 1.2s infinite ease-in-out"
    }
  },
  "& .MuiBadge-badge": {
    boxShadow: `0 0 0 2px #fff`,
    backgroundColor: "#ff3300",
    color: "#ff3300",
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      border: "1px solid currentColor",
      content: '""',
      boxSizing: "border-box"
    }
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0
    }
  }
}));

interface IProps extends IRule {
  onChange?: (data: Partial<Omit<IRule, "id">> & Pick<IRule, "id">) => void;
}

export default function (props: IProps) {
  const [deleted, setDeleted] = useState(false);
  const [domain, setDomain] = useState(props.url);

  const handleDelete = () => {
    console.log("=> handleDelete", props);
    removeRule(props.id);
    setDeleted(true);
  };

  const handleChange = (
    data: Partial<Omit<IRule, "id">> & Pick<IRule, "id">
  ) => {
    console.log("=> handleChange", data);

    props.onChange?.(data);
  };

  if (deleted) return null;

  return (
    <Card
      sx={{
        position: "relative",
        minWidth: 275,
        marginBottom: "30px",
        marginRight: "30px",
        display: "inline-block",
        paddingRight: "40px",
        boxSizing: "border-box"
      }}>
      <CardContent>
        <StyledBadge
          overlap="circular"
          className={props.enabled ? "active" : "inactive"}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{ marginRight: "10px" }}
          variant="dot">
          <Avatar src={props.favicon}>{props.title || `${props.id}`}</Avatar>
        </StyledBadge>
        <TextField
          id="address-input"
          label={props.title}
          variant="standard"
          value={domain}
          size="small"
          onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
          onChange={(e) => setDomain(e.target.value)}
          onBlur={(e) => handleChange({ id: props.id, url: e.target.value })}
        />

        <Switch
          checked={props.enabled}
          onChange={(e) =>
            handleChange({ id: props.id, enabled: e.target.checked })
          }
        />
      </CardContent>
      <IconButton
        size="small"
        onClick={handleDelete}
        sx={{
          position: "absolute",
          right: "5px",
          top: "50%",
          transform: "translateY(-50%)"
        }}>
        <DeleteForeverIcon style={{ cursor: "pointer" }} fontSize="small" />
      </IconButton>
    </Card>
  );
}
