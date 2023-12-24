import { useRef } from "react";
import { Transition, SwitchTransition } from "react-transition-group";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { FullHeightContainer } from "../../ui/FullHeightContainer";

const duration = 150;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

export default function Chat({ chat }) {
  const nodeRef = useRef(null);
  return (
    <SwitchTransition>
      <Transition
        key={chat.id}
        nodeRef={nodeRef}
        in={!!chat.id}
        timeout={duration}
      >
        {(state) => (
          <FullHeightContainer
            ref={nodeRef}
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            <ChatHeader chat={chat} />
            <Messages chat={chat} />
            <MessageInput chat={chat} />
          </FullHeightContainer>
        )}
      </Transition>
    </SwitchTransition>
  );
}
