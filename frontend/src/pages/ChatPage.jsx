import styled from "styled-components";
import Contacts from "../features/contacts/Contacts";
import { useWebsoket } from "../contexts/WebsockerContext";
import { useChat } from "../contexts/ChatContext";
import Chat from "../features/chat/Chat";

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100wv;
  overflow: hidden;
`;

export default function ChatPage() {
  const { chat } = useChat();
  const { websocketReady } = useWebsoket();

  if (websocketReady)
    return (
      <Container>
        <Contacts />
        {chat ? <Chat chat={chat} /> : <p>Select contact to start chating</p>}
      </Container>
    );

  return <p>Loading...</p>;
}
