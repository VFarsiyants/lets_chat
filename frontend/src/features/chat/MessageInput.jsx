import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import sendSvgUrl from "/send.svg";
import attachSvgUrl from "/attach.svg";
import { useWebsoket } from "../../contexts/WebsockerContext";

const Container = styled.div`
  display: flex;
  gap: var(--spacing-16, 16px);
  align-items: end;
  width: 100%;
  padding: var(--spacing-16, 16px) var(--spacing-12, 12px);
  background: #fff;
`;

const StyledInput = styled.textarea`
  width: 100%;
  border: none;
  resize: none;
  height: 18px;
  align-self: center;
  outline: none;
  box-shadow: none;
  background: transparent;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default function MessageInput({ chat }) {
  const [message, setMessage] = useState("");
  const { websocket } = useWebsoket();
  const ref = useRef();

  useEffect(() => {
    const maxInputHeight = 150;
    function handleHeight(e) {
      if (+e.target.scrollHeight < maxInputHeight) {
        e.target.style.height = "";
        e.target.style.height = e.target.scrollHeight + "px";
      }
    }
    function preventEnterNewLine(e) {
      if (e.keyCode == 13 && !e.shiftKey) {
        e.preventDefault();
      }
    }
    const textArea = ref.current;
    textArea.addEventListener("input", handleHeight);
    textArea.addEventListener("keydown", preventEnterNewLine);
    return () => {
      textArea.removeEventListener("input", handleHeight);
      textArea.removeEventListener("keydown", preventEnterNewLine);
    };
  }, []);

  function handleSendMessage() {
    if (!message) return;
    websocket.sendMessage({
      type: "send.message",
      payload: {
        chat_id: chat.id,
        text: message,
      },
    });
    setMessage("");
    ref.current.style.height = "18px";
  }

  useEffect(() => {
    websocket.waitForSocketConnection();
  }, [websocket]);

  return (
    <Container>
      <img src={attachSvgUrl} />
      <StyledInput
        ref={ref}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="write a message..."
        onKeyUp={(e) => {
          if (e.code === "Enter" && !e.shiftKey) handleSendMessage();
        }}
      />
      <img src={sendSvgUrl} onClick={handleSendMessage} />
    </Container>
  );
}
