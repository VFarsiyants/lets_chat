import { Fragment, useReducer } from "react";

import styled from "styled-components";
import Message from "./Message";
import { useEffect, useRef } from "react";
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

const initialState = {
  messages: [],
  firstUnreadMessageId: null,
  toBottom: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "fetch_messages":
      return {
        ...state,
        messages: action.payload,
        firstUnreadMessageId: action.payload.find(
          (message) => message.is_read === false
        )?.id,
      };
    case "new_message":
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
        toBottom: action.payload.toBottom,
      };
    case "mark_as_read":
      return {
        ...state,
        messages: state.messages.map((message) =>
          message.id === action.payload
            ? { ...message, is_read: true }
            : message
        ),
      };
    case "unstick_from_bottom":
      return { ...state, toBottom: false };
    default:
      throw new Error("Uknown action");
  }
}

export default function Messages({ chat }) {
  const [{ messages, firstUnreadMessageId, toBottom }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const { websocket } = useWebsoket();
  const { user: currentUserId } = useAuth();

  const ref = useRef();
  const scrollToRef = useRef();

  const selectedChat = chat.id;
  const chatImageUrl = getMediaUrl(chat.image_url);

  function scrollToBottom() {
    ref.current.scrollTop = ref.current.scrollHeight;
  }

  useEffect(() => {
    if (toBottom) scrollToBottom();
    dispatch({
      type: "unstick_from_bottom",
    });
  }, [dispatch, toBottom]);

  useEffect(() => {
    websocket.sendMessage({
      type: "fetch.messages",
      payload: selectedChat,
    });
    websocket.addCallbacks({
      "fetch.messages": (payload) => {
        dispatch({
          type: "fetch_messages",
          payload: payload,
        });
        if (scrollToRef.current) {
          scrollToRef.current.scrollIntoView(true);
        } else scrollToBottom();
      },
      "new.message": (resPayload) => {
        if (resPayload.chat_id === selectedChat) {
          const shouldScroll =
            ref.current.scrollHeight -
              ref.current.scrollTop -
              ref.current.clientHeight ===
              0 || resPayload.author_id === currentUserId;
          dispatch({
            type: "new_message",
            payload: { message: resPayload, toBottom: shouldScroll },
          });
        }
        websocket.sendMessage({
          type: "update.chat",
          payload: selectedChat,
        });
      },
    });
  }, [websocket, selectedChat, currentUserId]);

  function markMessageAsRead(id) {
    dispatch({
      type: "mark_as_read",
      payload: id,
    });
  }

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
          <Fragment key={message.id}>
            {firstUnreadMessageId === message.id && (
              <p
                ref={scrollToRef}
                style={{ marginTop: previousMessage ? "auto" : "unset" }}
              >
                Unread messages
              </p>
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
