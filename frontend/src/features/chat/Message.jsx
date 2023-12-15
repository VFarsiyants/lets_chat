import styled from "styled-components";
import { formatTime } from "../../utils";

const MessageContainer = styled.div`
  display: grid;
  column-gap: 13px;
  grid-template-columns: 40px 1fr;
  align-items: flex-start;
  &:first-child {
    margin-top: auto;
  }
`;

const StyledImg = styled.img`
  grid-column-start: 1;
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
  display: inline-block;
  max-width: fit-content;
`;

export default function Message({
  avatarUrl,
  children,
  isMyMessage,
  messageTime,
}) {
  return (
    <MessageContainer>
      {avatarUrl && <StyledImg src={avatarUrl} alt="Avatar" />}
      <MessageWrapper $isMyMessage={isMyMessage}>
        <MessageText $isMyMessage={isMyMessage}>{children}</MessageText>
        <TimeP>{formatTime(messageTime)}</TimeP>
      </MessageWrapper>
    </MessageContainer>
  );
}
