import React from "react";
import { StyledButton } from "../../ui/StyledButton";
import { IoLogoApple } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import styled from "styled-components";

const OrGoWith = styled.div`
  color: var(--text-secondary);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  p {
    margin: 0 var(--spacing-16);
  }
`;

const StyledHr = styled.hr`
  color: var(--text-secondary);
  width: 100%;
`;

export default function LoginOptions() {
  return (
    <>
      <OrGoWith>
        <StyledHr />
        <p>or go with</p>
        <StyledHr />
      </OrGoWith>
      <StyledButton disabled={true} type="apple">
        <IoLogoApple />
        <span>Continue with Apple</span>
      </StyledButton>
      <StyledButton disabled={true} type="google">
        <FcGoogle />
        <span>Google</span>
      </StyledButton>
    </>
  );
}
