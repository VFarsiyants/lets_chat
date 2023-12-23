import React, { createContext, useContext, useState } from "react";
import styled from "styled-components";

import UserActions from "./UserActions";
import EditUser from "./EditUser";

const UserProfileContext = createContext();

export function UserProfile({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <UserProfileContext.Provider value={{ open, close, isOpen }}>
      {children}
    </UserProfileContext.Provider>
  );
}

function Open({ children }) {
  const { open } = useContext(UserProfileContext);
  return <div onClick={open}>{children}</div>;
}

function Close({ children }) {
  const { close } = useContext(UserProfileContext);
  return <div onClick={close}>{children}</div>;
}

const UserProfilePage = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #edf2f7;
  overflow: hidden;
`;

function Page() {
  const { isOpen } = useContext(UserProfileContext);

  if (isOpen) {
    return (
      <UserProfilePage>
        <UserActions />
        <EditUser />
      </UserProfilePage>
    );
  }
}

UserProfile.Open = Open;
UserProfile.Page = Page;
UserProfile.Close = Close;

export default UserProfile;
