import styled from "styled-components";
import Contacts from "../features/contacts/Contacts";
import { Outlet } from "react-router-dom";

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100wv;
  overflow: hidden;
`;

const ChatBox = styled.div`
  height: 100%;
  width: 100%;
  background-color: green;
`;

export default function ChatPage() {
  return (
    <Container>
      <Contacts />
      <ChatBox>
        <Outlet />
      </ChatBox>
    </Container>
  );
}
