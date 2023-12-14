import styled from "styled-components";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import Messages from "./Messages";

const ChatContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default function Chat() {
  return (
    <ChatContainer>
      <ChatHeader />
      <Messages />
      <MessageInput />
    </ChatContainer>
  );
}
