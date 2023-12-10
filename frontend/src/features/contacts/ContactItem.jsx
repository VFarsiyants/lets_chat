import avatarUrl from "./rabbit.png";
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
} from "./StyledComponents";
import styled from "styled-components";

const MessageCount = styled.div`
  padding: 1px 5px;
  border-radius: 28px;
  font-size: 12px;
  ${(props) =>
    props.active
      ? "color: #2B6CB0; background: #ffffff"
      : "color: #ffffff; background: #2B6CB0"}
`;

export default function ContactItem({ active = false }) {
  // this variables should be moved to props
  const contactName = "Sharon Barns";
  const readStatus = true;
  const sentStatus = true;
  const lastMsgText = "Sure. We are always looking to expand the database";
  const unreadMsgNum = 2;
  const lastMsgTime = "12:09 pm";
  return (
    <ContactsItemBox active={active}>
      <MessageLayout>
        <AvatarImg src={avatarUrl} alt="Contact Avatar" />
        <ContactLineContainer>
          <NameDiv active={active}>{contactName}</NameDiv>
          {readStatus ? (
            <MessageStatusImg src={checkDoubleMarkUrl} active={active} />
          ) : sentStatus ? (
            <MessageStatusImg src={checkMarkUrl} active={active} />
          ) : null}
          <MessageTime active={active}>{lastMsgTime}</MessageTime>
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
