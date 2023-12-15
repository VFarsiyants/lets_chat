import styled from "styled-components";
import Contacts from "../features/contacts/Contacts";
import { WebsoketProvider } from "../contexts/WebsockerContext";
import { ChatProvider } from "../contexts/ChatContext";
import Chat from "../features/chat/Chat";

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100wv;
  overflow: hidden;
`;

export default function ChatPage() {
  return (
    <Container>
      <WebsoketProvider>
        <ChatProvider>
          <Contacts />
          <Chat />
        </ChatProvider>
      </WebsoketProvider>
    </Container>
  );
}
