import styled from "styled-components";
import backButtonSvg from "/back.svg";

const Container = styled.div`
  padding: var(--spacing-16, 16px) var(--spacing-12, 12px);
`;

const StyledButton = styled.button`
  color: var(--text-accent, #2b6cb0);
  background-color: transparent;
  border: none;
  font-size: 14px;
  display: flex;
  align-items: center;
`;

export default function BackButton() {
  return (
    <Container>
      <StyledButton>
        <img src={backButtonSvg} />
        Back
      </StyledButton>
    </Container>
  );
}
