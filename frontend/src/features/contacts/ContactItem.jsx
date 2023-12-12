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
import styled from "styled-components";
import { formatTime, getMediaUrl } from "../../utils";

const MessageCount = styled.div`
  padding: 1px 5px;
  border-radius: 28px;
  font-size: 12px;
  ${(props) =>
    props.active
      ? "color: #2B6CB0; background: #ffffff"
      : "color: #ffffff; background: #2B6CB0"}
`;

export default function ContactItem({ active, contact }) {
  // this variables should be moved to props
  const {
    email,
    first_name: firstName,
    last_name: lastName,
    last_message: lastMsgText,
    last_message_time: lastMsgTime,
    image_url: avatarUrl,
    is_online: isOnline,
  } = contact;

  const contactName = firstName & lastName ? `${firstName} ${lastName}` : email;
  const readStatus = true;
  const sentStatus = true;
  const unreadMsgNum = 2;
  return (
    <ContactsItemBox active={active}>
      <MessageLayout>
        <AvatarWrapper>
          <AvatarImg src={getMediaUrl(avatarUrl)} alt="Contact Avatar" />
          {isOnline && <OnlineStatus />}
        </AvatarWrapper>
        <ContactLineContainer>
          <NameDiv active={active}>{contactName}</NameDiv>
          {readStatus ? (
            <MessageStatusImg src={checkDoubleMarkUrl} active={active} />
          ) : sentStatus ? (
            <MessageStatusImg src={checkMarkUrl} active={active} />
          ) : null}
          <MessageTime active={active}>{formatTime(lastMsgTime)}</MessageTime>
        </ContactLineContainer>
        <ContactLineContainer>
          <MessageTextLine active={active}>{lastMsgText}</MessageTextLine>
          {unreadMsgNum ? (
            <MessageCount active={active}>{unreadMsgNum}</MessageCount>
          ) : null}
        </ContactLineContainer>
      </MessageLayout>
    </ContactsItemBox>
  );
}
