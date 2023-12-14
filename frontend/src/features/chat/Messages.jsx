import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  overflow-y: scroll;
  height: 100%;
  padding: var(--spacing-20, 20px);
  background: var(--color-gray-11, #f5f7fb);
`;

export default function Messages() {
  return <Container>Message</Container>;
}
