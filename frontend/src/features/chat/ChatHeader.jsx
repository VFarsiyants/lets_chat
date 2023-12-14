import styled from "styled-components";

const Container = styled.div`
  display: flex;
  padding: var(--spacing-12, 12px) var(--spacing-0, 0px) var(--spacing-12, 12px)
    var(--spacing-12, 12px);
  align-items: center;
  gap: 2px;
  align-self: stretch;
`;

export default function ChatHeader() {
  return <Container>ChatHeader</Container>;
}
