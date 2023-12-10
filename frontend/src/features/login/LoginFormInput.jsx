import styled from "styled-components";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const StyledLabel = styled.label`
  color: var(--text-secondary);
  text-transform: capitalize;
  font-size: 14px;
  font-weight: 500;
`;

export default function LoginFormInput({ labelName, children }) {
  return (
    <StyledDiv>
      <StyledLabel htmlFor={children.props.name}>{labelName}</StyledLabel>
      {children}
    </StyledDiv>
  );
}
