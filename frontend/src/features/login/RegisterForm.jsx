import { StyledButton } from "../../ui/StyledButton";
import { StyledForm } from "../../ui/StyledForm";
import { StyledH2 } from "../../ui/StyledH2";
import { StyledInput } from "../../ui/StyledInput";
import { StyledLink } from "../../ui/StyledLink";
import LoginActions from "./LoginActions";
import LoginFormInput from "./LoginFormInput";
import LoginOptions from "./LoginOptions";

export default function RegisterForm() {
  return (
    <StyledForm>
      <StyledH2>Registration</StyledH2>
      <LoginFormInput labelName="email">
        <StyledInput name="login" type="text" />
      </LoginFormInput>
      <LoginFormInput labelName="password">
        <StyledInput name="password" type="password" />
      </LoginFormInput>
      <LoginFormInput labelName="repeat password">
        <StyledInput name="repeat_password" type="password" />
      </LoginFormInput>
      <LoginActions>
        <StyledLink to="/login">Authorization</StyledLink>
      </LoginActions>
      <StyledButton>Register</StyledButton>
      <LoginOptions />
    </StyledForm>
  );
}
