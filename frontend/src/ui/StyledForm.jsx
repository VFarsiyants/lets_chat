import styled from "styled-components";

export const StyledForm = styled.form`
  width: 380px;
  background: var(--bg-primary);
  border-radius: var(--radius-corner-radius-8);
  box-shadow: 0px 1px 8px 0px rgba(39, 59, 74, 0.16);
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-16);
  @media (max-width: 380px) {
    width: 100vw;
  }
`;
