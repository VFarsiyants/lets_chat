import { Fragment } from "react";

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
  const [firstUnreadMessageId, setFirstUnreadMessageId] = useState(null);
  const { websocket } = useWebsoket();
  const { user: currentUserId } = useAuth();
  const ref = useRef();
  const scrollToRef = useRef();

  const selectedChat = chat.id;
  const chatImageUrl = getMediaUrl(chat.image_url);

  useEffect(() => {
    websocket.sendMessage({
      type: "fetch.messages",
      payload: selectedChat,
    });
    websocket.addCallbacks({
      "fetch.messages": (payload) => {
        setMessages(payload);
        setFirstUnreadMessageId(
          payload.find((message) => message.is_read === false)?.id
        );
        if (scrollToRef.current) {
          scrollToRef.current.scrollIntoView(true);
        } else {
          ref.current.scrollTop = ref.current.scrollHeight;
        }
      },
      "new.message": (payload) => {
        if (payload.chat_id === selectedChat) {
          setMessages((messages) => [...messages, payload]);
        }
        websocket.sendMessage({
          type: "update.chat",
          payload: selectedChat,
        });
      },
    });
  }, [websocket, selectedChat]);

  let previousMessage = null;

  function markMessageAsRead(id) {
    setMessages((messages) =>
      messages.map((message) =>
        message.id === id ? { ...message, is_read: true } : message
      )
    );
  }

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
          <Fragment key={message.id}>
            {firstUnreadMessageId === message.id && (
              <p ref={scrollToRef}>Unread messages</p>
            )}
            <Message
              messageTime={message.created_at}
              showAvatar={showAvatar}
              avatarUrl={chatImageUrl}
              chatName={chat.chat_name}
              isMyMessage={message.author_id === currentUserId}
              message={message}
              onRead={() => markMessageAsRead(message.id)}
            >
              {message.text}
            </Message>
          </Fragment>
        );
      })}
    </Container>
  );
}
