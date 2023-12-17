import styled from "styled-components";

export const StyledDefaultAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 50%;
  height: 100%;
  aspect-ratio: 1 / 1;
  color: var(--text-secondary);
  background-color: var(--color-gray-10);
  font-size: ${(props) => (props.$fontSize ? props.$fontSize : "20px")};
`;
