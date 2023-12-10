import styled from "styled-components";

export const StyledButton = styled.button`
  width: ${(props) => (props.width ? props.width : "100%")};
  padding: var(--spacing-12) var(--spacing-24);
  background: ${(props) => {
    switch (props.type) {
      case "primary":
        return "var(--button-primary)";
      case "apple":
        return "var(--color-gray-1)";
      case "google":
        return "var(--color-gray-11)";
      default:
        return "var(--button-primary)";
    }
  }};
  color: ${(props) =>
    props.type === "google"
      ? "var(--text-secondary)"
      : "var(--text-reversible-text)"};
  border-radius: var(--radius-corner-radius-8);
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-8);
  opacity: ${(props) => (props.disabled ? "0.7" : "1")};
  filter: ${(props) => (props.disabled ? "grayscale(100%)" : "")};
`;
