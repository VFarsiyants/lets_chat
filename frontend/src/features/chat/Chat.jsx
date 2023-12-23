import styled from "styled-components";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import UserProfile from "../userProfile/UserProfile";

const ChatContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default function Chat({ chat }) {
  return (
    <ChatContainer>
      <ChatHeader key={chat.id} chat={chat} />
      <Messages chat={chat} />
      <MessageInput chat={chat} />
    </ChatContainer>
  );
}
