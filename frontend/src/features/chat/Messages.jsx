import styled from "styled-components";
import Message from "./Message";
import { useEffect, useRef, useState } from "react";
import { useWebsoket } from "../../contexts/WebsockerContext";
import { useAuth } from "../../contexts/AuthContext";
import { getMediaUrl } from "../../utils";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  overflow-y: scroll;
  height: 100%;
  padding: var(--spacing-20, 20px);
  background: var(--color-gray-11, #f5f7fb);
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default function Messages({ chat }) {
  const [messages, setMessages] = useState([]);
  const { websocket } = useWebsoket();
  const { user: currentUserId } = useAuth();
  const ref = useRef();

  useEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);

  const selectedChat = chat.id;
  const chatImageUrl = getMediaUrl(chat.image_url);

  useEffect(() => {
    websocket.waitForSocketConnection(() => {
      websocket.sendMessage({
        type: "fetch.messages",
        payload: selectedChat,
      });
      websocket.addCallbacks({
        "fetch.messages": (payload) => {
          setMessages(payload);
        },
        "new.message": (payload) => {
          if (payload.chat_id === selectedChat) {
            setMessages((messages) => [...messages, payload]);
          }
        },
      });
    });
  }, [websocket, selectedChat]);

  let previousMessage = null;

  return (
    <Container ref={ref}>
      {messages.map((message) => {
        let showAvatar =
          (previousMessage &&
            previousMessage?.author_id !== message.author_id &&
            message.author_id !== currentUserId) ||
          (!previousMessage && message.author_id !== currentUserId);
        previousMessage = message;
        return (
          <Message
            key={message.id}
            messageTime={message.created_at}
            avatarUrl={showAvatar ? chatImageUrl : undefined}
            isMyMessage={message.author_id === currentUserId}
          >
            {message.text}
          </Message>
        );
      })}
    </Container>
  );
}
