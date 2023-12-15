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
import { formatTime, getMediaUrl } from "../../utils";
import { MessageCount } from "./StyledComponents";

export default function ContactItem({ active, contact, onChatSelect }) {
  // this variables should be moved to props
  const {
    chat_name: chatName,
    last_message: lastMsgText,
    last_message_time: lastMsgTime,
    image_url: avatarUrl,
    is_online: isOnline,
  } = contact;

  const readStatus = true;
  const sentStatus = true;
  const unreadMsgNum = 2;
  return (
    <ContactsItemBox $active={active} onClick={onChatSelect}>
      <MessageLayout>
        <AvatarWrapper>
          <AvatarImg src={getMediaUrl(avatarUrl)} alt="Contact Avatar" />
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
            {lastMsgTime ? formatTime(lastMsgTime) : ""}
          </MessageTime>
        </ContactLineContainer>
        <ContactLineContainer>
          <MessageTextLine $active={active}>{lastMsgText}</MessageTextLine>
          {unreadMsgNum ? (
            <MessageCount $active={active}>{unreadMsgNum}</MessageCount>
          ) : null}
        </ContactLineContainer>
      </MessageLayout>
    </ContactsItemBox>
  );
}
