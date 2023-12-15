import styled from "styled-components";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { useChat } from "../../contexts/ChatContext";

const ChatContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default function Chat() {
  const { chat } = useChat();

  return (
    <ChatContainer>
      {chat ? (
        <>
          <ChatHeader chat={chat} />
          <Messages chat={chat} />
          <MessageInput chat={chat} />
        </>
      ) : (
        <p>Select contact to start chating</p>
      )}
    </ChatContainer>
  );
}
