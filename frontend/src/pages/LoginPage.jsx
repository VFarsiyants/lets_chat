import { Outlet } from "react-router-dom";
import styled from "styled-components";

const StyledDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default function LoginPage() {
  return (
    <div>
      <StyledDiv>
        <Outlet />
      </StyledDiv>
    </div>
  );
}
