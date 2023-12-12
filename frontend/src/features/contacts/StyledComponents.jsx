import styled from "styled-components";
import SVG from "react-inlinesvg";

export const MessageLayout = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr;
  grid-template-rows: 1fr 1fr;
  row-gap: 4px;
  column-gap: 12px;
  width: 100%;
`;
export const AvatarImg = styled.img`
  width: 40px;
  position: relative;
`;

export const OnlineStatus = styled.div`
  position: absolute;
  border-radius: 100px;
  width: 12px;
  height: 12px;
  background: var(--button-primary, #2b6cb0);
  right: -2px;
  bottom: 0;
  border: solid 2px var(--bg-primary, #fff);
  border-radius: 50%;
`;

export const AvatarWrapper = styled.div`
  position: relative;
  grid-column-start: 1;
  grid-row-start: 1;
  grid-row-end: 3;
`;

export const ContactLineContainer = styled.div`
  color: var(--text-primary);
  display: flex;
  gap: 4px;
  align-items: center;
  grid-column-start: 2;
  width: 100%;
  min-width: 0;
  justify-content: flex-end;
`;
export const MessageTextLine = styled.div`
  grid-column-start: 2;
  grid-row-start: 2;
  grid-row-end: 3;
  ${(props) =>
    props.active ? "color: #FFF;" : "color: var(--text-secondary, #8287a0);"}
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  min-height: 0;
  margin-right: auto;
`;
export const MessageStatusImg = styled(SVG)`
  width: var(--spacing-16, 16px);
  height: var(--spacing-16, 16px);
  path {
    stroke: ${(props) => (props.active ? "#FFF" : "#2B6CB0")};
    fill: ${(props) => (props.active ? "#FFF" : "#2B6CB0")};
  }
`;
export const MessageTime = styled.div`
  font-size: 12px;
  color: var(--text-secondary, #8287a0);
  ${(props) =>
    props.active ? "color: #FFF;" : "color: var(--text-secondary, #8287a0);"}
  white-space: nowrap;
  margin-left: auto;
`;
export const NameDiv = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  min-height: 0;
  margin-right: auto;
  flex: 1;
  ${(props) => (props.active ? "color: #FFF;" : "")}
`;

export const ContactsItemBox = styled.div`
  padding: var(--spacing-12);
  height: 64px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  border-bottom: 1px solid var(--stroke-default, #edeef5);
  ${(props) =>
    props.active ? "background-color: var(--button-primary, #2b6cb0);" : ""}
`;
export const ContactsBox = styled.div`
  height: 100vh;
  width: 100%;
  max-width: 300px;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
`;
export const ContactsItemWraper = styled.div`
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;
export const InputWrapper = styled.div`
  border-radius: var(--radius-corner-radius-8, 8px);
  background: #edeef5;
  height: var(--spacing-32, 32px);
  padding: 10px var(--spacing-12, 12px);
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-left: 10px;
`;
export const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
`;
