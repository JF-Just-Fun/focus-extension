import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import GppBadIcon from "@mui/icons-material/GppBad";
import GppBadOutlinedIcon from "@mui/icons-material/GppBadOutlined";
import {
  CardActions,
  FormControlLabel,
  FormLabel,
  IconButton,
  TextField
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

import type { IRule } from "~background/constant";
import { removeRule } from "~background/store";

import {
  StyledBadge,
  StyledDeleteMark,
  StyledTimePickerContainer,
  StyledWeeklyContainer
} from "./style";

interface IProps extends IRule {
  onChange?: (data: Partial<Omit<IRule, "id">> & Pick<IRule, "id">) => void;
}

export default function (props: IProps) {
  const [deleted, setDeleted] = useState(false);
  const [domain, setDomain] = useState(props.url);
  const handleDelete = () => {
    removeRule(props.id);
    setDeleted(true);
  };

  const handleChange = (data: Partial<Omit<IRule, "id">>) => {
    props.onChange?.({ id: props.id, ...data });
  };

  const getDayjsFromSeconds = (t: number) => {
    return dayjs().startOf("day").add(t, "second");
  };

  const getSecondsFromDayjs = (t: dayjs.Dayjs) => {
    return t.diff(dayjs().startOf("day"), "second");
  };

  const [timeArr, setTimeArr] = useState({
    start: getDayjsFromSeconds(props.start),
    end: getDayjsFromSeconds(props.end)
  });

  if (deleted) return null;

  return (
    <Card
      sx={{
        position: "relative",
        minWidth: 400,
        boxSizing: "border-box"
      }}>
      <CardContent
        sx={{ display: "flex", alignItems: "center", justifyContent: "start" }}>
        <StyledBadge
          overlap="circular"
          className={props.enabled ? "active" : "inactive"}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{ marginRight: "10px" }}
          variant="dot">
          <Avatar
            variant="rounded"
            src={props.favicon || null}
            alt={props.title || `${props.id}`}>
            {props.title?.[0] || `${props.id}`}
          </Avatar>
        </StyledBadge>
        <TextField
          id="address-input"
          label={props.title}
          variant="standard"
          value={domain}
          disabled={props.enabled}
          sx={{ minWidth: "300px", flex: 1 }}
          size="small"
          onKeyDown={(e) =>
            e.key === "Enter" && (e.target as HTMLElement)?.blur()
          }
          onChange={(e) => setDomain(e.target.value)}
          onBlur={(e) => handleChange({ url: e.target.value })}
        />
        <Checkbox
          sx={{ marginLeft: "10px" }}
          checked={props.enabled}
          icon={<GppBadOutlinedIcon sx={{ color: "#616161" }} />}
          checkedIcon={<GppBadIcon color="primary" />}
          onChange={(e) => handleChange({ enabled: e.target.checked })}
        />
      </CardContent>
      <StyledDeleteMark>
        <IconButton size="small" onClick={handleDelete}>
          <DeleteForeverIcon fontSize="large" color="action" />
        </IconButton>
      </StyledDeleteMark>
      <CardActions sx={{ flexDirection: "column" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StyledTimePickerContainer>
            <TimePicker
              label="Start"
              disabled={props.enabled}
              ampm={false}
              views={["hours", "minutes"]}
              timeSteps={{ hours: 1, minutes: 1 }}
              value={timeArr.start}
              onChange={(start) => {
                setTimeArr((prev) => ({ ...prev, start }));
              }}
              onAccept={(start) => {
                handleChange({
                  start: getSecondsFromDayjs(start)
                });
              }}
              slotProps={{
                textField: {
                  size: "small",
                  onBlur: () => {
                    handleChange({
                      start: getSecondsFromDayjs(timeArr.start)
                    });
                  }
                }
              }}
            />
            <TimePicker
              label="End"
              disabled={props.enabled}
              views={["hours", "minutes"]}
              timeSteps={{ hours: 1, minutes: 1 }}
              ampm={false}
              value={timeArr.end}
              onChange={(end) => setTimeArr((prev) => ({ ...prev, end }))}
              onAccept={(end) => {
                console.log("=> onAccept", end.format());

                handleChange({
                  end: getSecondsFromDayjs(end)
                });
              }}
              slotProps={{
                textField: {
                  size: "small",
                  onBlur: () => {
                    handleChange({
                      end: getSecondsFromDayjs(timeArr.end)
                    });
                  }
                }
              }}
            />
          </StyledTimePickerContainer>
        </LocalizationProvider>
        <StyledWeeklyContainer>
          <FormLabel component="legend">Repeat weekly</FormLabel>
          {(["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const).map(
            (day) => {
              return (
                <FormControlLabel
                  key={day}
                  control={
                    <Checkbox
                      disabled={props.enabled}
                      checked={props.weekly[day]}
                      onChange={(e) =>
                        handleChange({
                          weekly: { ...props.weekly, [day]: e.target.checked }
                        })
                      }
                      name={day}
                    />
                  }
                  label={day}
                />
              );
            }
          )}
        </StyledWeeklyContainer>
      </CardActions>
    </Card>
  );
}
