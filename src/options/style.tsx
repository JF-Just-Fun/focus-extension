import styled from "@emotion/styled";
import Badge from "@mui/material/Badge";

export const StyledTimePickerContainer = styled("div")`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  & > div {
    flex: 1;
    width: 150px;
  }
`;

export const StyledWeeklyContainer = styled("div")`
  margin-top: 10px;
`;

export const StyledDeleteMark = styled("div")`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 5px;
  background-color: #ff0000;
  z-index: 999;
  transition:
    width 0.3s ease-in-out,
    background-color 0.3s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  &::before {
    content: "";
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #ff0000;
    top: 0;
    left: 0;
    z-index: 1;
  }
  &:hover {
    background-color: #adadad;
    width: 100%;
    &::before {
      opacity: 0;
      pointer-events: none;
    }
  }
`;

export const StyledBadge = styled(Badge)({
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
  "&.active .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    "&::after": {
      animation: "ripple 1.2s infinite ease-in-out"
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
});

export const StyleOptionsHeader = styled("div")({
  width: "100%",
  height: "100px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "38px",
  // background: "linear-gradient(to right, #8400ff 15%, #ff0033)",
  // backgroundSize: "200% 200%",
  background:
    "linear-gradient(to right, #0004ff, #FC466B, #8400ff, #4CAF50, #FF5722)",
  backgroundSize: "200% 200%", // 调整背景大小，以适应更多颜色
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  animation: "gradient 10s linear infinite",

  "@keyframes gradient": {
    "0%": { backgroundPosition: "0% 50%" },
    "25%": { backgroundPosition: "100% 100%" },
    "50%": { backgroundPosition: "0% 100%" },
    "75%": { backgroundPosition: "100% 0%" },
    "100%": { backgroundPosition: "0% 50%" }
  }
});
