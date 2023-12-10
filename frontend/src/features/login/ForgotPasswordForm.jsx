import styled from "styled-components";
import { StyledButton } from "../../ui/StyledButton";
import { StyledForm } from "../../ui/StyledForm";
import { StyledH2 } from "../../ui/StyledH2";
import { StyledInput } from "../../ui/StyledInput";
import { StyledLink } from "../../ui/StyledLink";
import LoginActions from "./LoginActions";
import LoginFormInput from "./LoginFormInput";
import LoginOptions from "./LoginOptions";

const StyledP = styled.p`
  color: var(--text-secondary);
`;

export default function ForgotPasswordForm() {
  return (
    <StyledForm>
      <StyledH2>Enter your email</StyledH2>
      <StyledP>We will send a link to reset your password</StyledP>
      <LoginFormInput labelName="email">
        <StyledInput name="login" type="text" />
      </LoginFormInput>
      <LoginActions>
        <StyledLink to="/login">Authorization</StyledLink>
        <StyledLink to="/login/register">Register</StyledLink>
      </LoginActions>
      <StyledButton>Log in</StyledButton>
      <LoginOptions />
    </StyledForm>
  );
}
