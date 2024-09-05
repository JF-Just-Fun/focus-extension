import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import { ActionType } from "~utils/constant";

const color = "#0460cc";

const ripple = keyframes`
  from {
    opacity: 1;
    transform: scale3d(0.75,0.75,1);
  }
  to {
    opacity: 0;
    transform: scale3d(2,2,1);
  }
`;

const RippleStep = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 30px;
  border-radius: 100%;
  background: #ffffff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.25);
  cursor: pointer;

  span {
    position: relative;
    font-size: 72px;
    top: 5px;
    left: -5px;
  }

  &::after {
    opacity: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: "";
    height: 100%;
    width: 100%;
    background: ${color};
    border-radius: 100%;
    animation-name: ${ripple};
    animation-duration: 2s;
    animation-delay: 0;
    animation-iteration-count: infinite;
    animation-timing-function: cubic-bezier(0.65, 0, 0.34, 1);
    z-index: -1;
  }
`;

function IndexPopup() {
  const handleClick = async () => {
    chrome.runtime.sendMessage(
      {
        action: ActionType.BLOCK_THIS_DOMAIN
      },
      (response) => {
        // if (response.blocked) {
        //   chrome.runtime.sendMessage({
        //     action: ActionType.REDIRECT_BLOCKED_PAGE
        //   });
        // }
      }
    );
  };
  return (
    <div
      style={{
        padding: 16
      }}>
      <RippleStep onClick={handleClick}>
        <RemoveCircleOutlineIcon
          style={{ width: "30px", height: "30px", color: color }}
        />
      </RippleStep>
    </div>
  );
}

export default IndexPopup;
