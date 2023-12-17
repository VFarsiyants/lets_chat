import styled from "styled-components";
import { formatTime, getDefaultImgName } from "../../utils";
import { useEffect, useRef } from "react";
import { useWebsoket } from "../../contexts/WebsockerContext";
import { StyledDefaultAvatar } from "../../ui/StyledDefaultAvatar";

const MessageContainer = styled.div`
  display: grid;
  column-gap: 13px;
  grid-template-columns: 40px 1fr;
  align-items: flex-start;
  &:first-child {
    margin-top: auto;
  }
`;

const AvatarWrapper = styled.div`
  grid-column-start: 1;
  height: 40px;
`;

const TimeP = styled.p`
  font-size: 12px;
  line-height: 14px;
  white-space: nowrap;
`;

const MessageWrapper = styled.div`
  grid-column-start: 2;
  display: flex;
  justify-content: ${(props) => (props.$isMyMessage ? "end" : "unset")};
  width: 75%;
  margin-left: ${(props) => (props.$isMyMessage ? "auto" : "unset")};
  align-items: center;
  gap: var(--Spacing-4, 4px);
  margin-top: 8px;
`;

const MessageText = styled.div`
  border-radius: var(--radius-corner-radius-8, 8px);
  background: ${(props) =>
    props.$isMyMessage
      ? "var(--bg-accent, #2B6CB0)"
      : "var(--color-gray-9, #dce1eb)"};
  color: ${(props) =>
    props.$isMyMessage
      ? "var(--text-reversible-text, #FFF)"
      : "var(--text-primary, #13141d)"};
  padding: var(--Spacing-4, 4px) var(--spacing-8, 8px);
  grid-column-start: 2;
  align-items: flex-start;
  align-items: center;
  margin-right: 0;
  overflow: hidden;
  max-width: fit-content;
  overflow-wrap: break-word;
`;

export default function Message({
  avatarUrl,
  isMyMessage,
  message,
  onRead,
  showAvatar,
  chatName,
}) {
  const { created_at: messageTime, text, id, is_read: isRead } = message;
  const ref = useRef();
  const { websocket } = useWebsoket();

  let options = {
    threshold: 1.0,
  };

  useEffect(() => {
    function callback(entries, observer) {
      //send websoket message that is read
      if (entries[0].isIntersecting && isRead === false) {
        websocket.sendMessage({
          type: "message.read",
          payload: id,
        });
        onRead();
      }
    }
    let observer = new IntersectionObserver(callback, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  });

  return (
    <>
      <MessageContainer ref={ref}>
        {showAvatar && (
          <AvatarWrapper>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" />
            ) : (
              <StyledDefaultAvatar>
                {getDefaultImgName(chatName)}
              </StyledDefaultAvatar>
            )}
          </AvatarWrapper>
        )}
        <MessageWrapper $isMyMessage={isMyMessage}>
          <MessageText $isMyMessage={isMyMessage}>{text}</MessageText>
          <TimeP>{formatTime(messageTime)}</TimeP>
        </MessageWrapper>
      </MessageContainer>
    </>
  );
}
