import { useNavigate } from "react-router-dom";
import { StyledInput } from "../../ui/StyledInput";
import LoginFormInput from "./LoginFormInput";
import { StyledButton } from "../../ui/StyledButton";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import LoginActions from "./LoginActions";
import LoginOptions from "./LoginOptions";
import { StyledForm } from "../../ui/StyledForm";
import { StyledH2 } from "../../ui/StyledH2";
import { StyledLink } from "../../ui/StyledLink";

export default function LoginForm() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login: loginApi, isAuthenticated } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();
    if (!login || !password) return;
    await loginApi(login, password);
  }

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledH2>Log in</StyledH2>
      <LoginFormInput labelName="email">
        <StyledInput
          name="login"
          type="text"
          value={login}
          onChange={(event) => setLogin(event.target.value)}
        />
      </LoginFormInput>
      <LoginFormInput labelName="password">
        <StyledInput
          name="password"
          type="password"
          autoComplete="on"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </LoginFormInput>
      <LoginActions>
        <StyledLink to="register">Register</StyledLink>
        <StyledLink to="forgot_password">Forgot password</StyledLink>
      </LoginActions>
      <StyledButton>Log in</StyledButton>
      <LoginOptions />
    </StyledForm>
  );
}
