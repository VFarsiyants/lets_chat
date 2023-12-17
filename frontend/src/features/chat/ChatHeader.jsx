import styled from "styled-components";
import { getDefaultImgName, getLastSeen, getMediaUrl } from "../../utils";
import { useEffect, useState } from "react";
import { StyledDefaultAvatar } from "../../ui/StyledDefaultAvatar";

const Container = styled.div`
  display: flex;
  padding: var(--spacing-12, 12px) var(--spacing-0, 0px) var(--spacing-12, 12px)
    var(--spacing-12, 12px);
  align-items: center;
  gap: 2px;
  align-self: stretch;
  background: #fff;
`;

const ChatDetailsDiv = styled.div`
  display: grid;
  grid-template-columns: 32px 1fr;
  column-gap: 8px;
  align-items: center;
`;

const ChatAvatarWrapper = styled.div`
  grid-column-start: 1;
  grid-row-start: 1;
  grid-row-end: 3;
  width: 100%;
  height: 32px;
`;

const ChatAvatar = styled.img`
  width: 100%;
  border-radius: 50%;
  aspect-ratio: 1/1;
`;

const ChatNameDiv = styled.div`
  grid-column-start: 2;
  grid-row-start: 1;
  grid-row-end: 2;
`;

const OnlineStatusDiv = styled.div`
  grid-column-start: 2;
  grid-row-start: 2;
  font-size: 12px;
  grid-row-end: 3;
  color: var(--Text-accent, #2b6cb0);
`;

export default function ChatHeader({ chat }) {
  const [lastSeenMessage, setLatSeenMessage] = useState();
  const {
    image_url: imageUrl,
    chat_name: chatName,
    is_online: isOnline,
  } = chat;

  useEffect(() => {
    setLatSeenMessage(
      getLastSeen(chat.last_seen ? new Date(chat.last_seen) : null)
    );
    const interval = setInterval(() => {
      setLatSeenMessage(
        getLastSeen(chat.last_seen ? new Date(chat.last_seen) : null)
      );
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [chat]);

  return (
    <Container>
      <ChatDetailsDiv>
        <ChatAvatarWrapper>
          {imageUrl ? (
            <ChatAvatar src={getMediaUrl(imageUrl)} />
          ) : (
            <StyledDefaultAvatar $fontSize="16px">
              {getDefaultImgName(chatName)}
            </StyledDefaultAvatar>
          )}
        </ChatAvatarWrapper>
        <ChatNameDiv>{chatName}</ChatNameDiv>
        <OnlineStatusDiv>
          {isOnline ? "online" : lastSeenMessage}
        </OnlineStatusDiv>
      </ChatDetailsDiv>
    </Container>
  );
}
