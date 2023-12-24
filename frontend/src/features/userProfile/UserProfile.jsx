import React, { createContext, useContext, useRef, useState } from "react";
import styled from "styled-components";

import UserActions from "./UserActions";
import EditUser from "./EditUser";
import { HorizontalContainer } from "../../ui/HorizontalContainer";
import { Transition } from "react-transition-group";

const UserProfilePage = styled(HorizontalContainer)`
  position: absolute;
  background-color: #edf2f7;
  width: 100%;
`;

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
  return (
    <div onClick={open} style={{ cursor: "pointer" }}>
      {children}
    </div>
  );
}

function Close({ children }) {
  const { close } = useContext(UserProfileContext);
  return <div onClick={close}>{children}</div>;
}

const duration = 300;

const defaultStyle = {
  transform: "translateX(-100vw)",
  transition: `all ${duration}ms ease-in-out`,
};

const transitionStyles = {
  entering: { transform: "translateX(0)" },
  entered: { transform: "translateX(0)" },
  exiting: { transform: "translateX(-100vw)" },
  exited: { transform: "translateX(-100vw)" },
};

function Page() {
  const { isOpen } = useContext(UserProfileContext);
  const nodeRef = useRef();

  return (
    <Transition
      nodeRef={nodeRef}
      in={isOpen}
      timeout={duration}
      mountOnEnter={true}
      unmountOnExit={true}
    >
      {(state) => (
        <UserProfilePage
          ref={nodeRef}
          style={{ ...defaultStyle, ...transitionStyles[state] }}
        >
          <UserActions />
          <EditUser />
        </UserProfilePage>
      )}
    </Transition>
  );
}

UserProfile.Open = Open;
UserProfile.Page = Page;
UserProfile.Close = Close;

export default UserProfile;
