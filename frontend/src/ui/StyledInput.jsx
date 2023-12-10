import styled from "styled-components";

export const StyledInput = styled.input`
  padding: var(--spacing-12, 12px) var(--spacing-16, 16px);
  border-radius: var(--radius-corner-radius-8, 8px);
  border: 1px solid var(--color-gray-10, #edeef5);
  background: var(--bg-primary, #fff);
  width: ${(props) => (props.width ? props.width : "100%")};
`;
