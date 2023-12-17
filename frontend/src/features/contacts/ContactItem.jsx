import checkDoubleMarkUrl from "/checkmateDone.svg";
import checkMarkUrl from "/checkDone.svg";
import {
  MessageLayout,
  AvatarImg,
  ContactLineContainer,
  NameDiv,
  MessageStatusImg,
  MessageTime,
  MessageTextLine,
  ContactsItemBox,
  AvatarWrapper,
  OnlineStatus,
} from "./StyledComponents";
import {
  formatTime,
  getMediaUrl,
  getDate,
  getDayOfWeek,
  getDefaultImgName,
} from "../../utils";
import { MessageCount } from "./StyledComponents";
import { StyledDefaultAvatar } from "../../ui/StyledDefaultAvatar";

function getLastMessageTime(dateTime) {
  const date = new Date(dateTime);
  const diffTime = new Date() - date;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0) {
    if (diffDays > 7) {
      return getDate(date);
    } else return getDayOfWeek(date);
  }
  return formatTime(dateTime);
}

export default function ContactItem({ active, contact, onChatSelect }) {
  const {
    chat_name: chatName,
    last_message: lastMsgText,
    last_message_time: lastMsgTime,
    image_url: avatarUrl,
    is_online: isOnline,
    unread_count: unreadCount,
  } = contact;

  const readStatus = false;
  const sentStatus = false;
  return (
    <ContactsItemBox $active={active} onClick={onChatSelect}>
      <MessageLayout>
        <AvatarWrapper>
          {avatarUrl ? (
            <AvatarImg src={getMediaUrl(avatarUrl)} alt="Contact Avatar" />
          ) : (
            <StyledDefaultAvatar>
              {getDefaultImgName(chatName)}
            </StyledDefaultAvatar>
          )}
          {isOnline && <OnlineStatus />}
        </AvatarWrapper>
        <ContactLineContainer>
          <NameDiv $active={active}>{chatName}</NameDiv>
          {readStatus ? (
            <MessageStatusImg src={checkDoubleMarkUrl} $active={active} />
          ) : sentStatus ? (
            <MessageStatusImg src={checkMarkUrl} $active={active} />
          ) : null}
          <MessageTime $active={active}>
            {lastMsgTime ? getLastMessageTime(lastMsgTime) : ""}
          </MessageTime>
        </ContactLineContainer>
        <ContactLineContainer>
          <MessageTextLine $active={active}>{lastMsgText}</MessageTextLine>
          {unreadCount ? (
            <MessageCount $active={active}>{unreadCount}</MessageCount>
          ) : null}
        </ContactLineContainer>
      </MessageLayout>
    </ContactsItemBox>
  );
}
