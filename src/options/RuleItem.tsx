import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Switch from "@mui/material/Switch";
import { useEffect, useState } from "react";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}>
    •
  </Box>
);

interface IProps {
  id: number;
  url: string;
  enable?: boolean;
  title?: string;
  favicon?: string;
  weekly?: boolean;
  weeklyTime?: Array<{ start: string; end: string }>;
  onChange?: (data: Omit<IProps, "onChange" | "id">) => void;
}

export default function (props: IProps) {
  const { id, url, enable, title, favicon, weekly, weeklyTime } = props;
  const [ruleData, setRuleData] = useState({
    id,
    url,
    enable,
    title,
    favicon,
    weekly,
    weeklyTime
  });

  // useEffect(() => {}, [id, url, enable, title, favicon, weekly, weeklyTime]);

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        {props.title}
        <Switch value={props.enable} />
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
