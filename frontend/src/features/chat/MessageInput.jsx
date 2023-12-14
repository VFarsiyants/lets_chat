import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import sendSvgUrl from "/send.svg";
import attachSvgUrl from "/attach.svg";

const Container = styled.div`
  display: flex;
  gap: var(--spacing-16, 16px);
  align-items: end;
  width: 100%;
  padding: var(--spacing-16, 16px) var(--spacing-12, 12px);
`;

const StyledInput = styled.textarea`
  width: 100%;
  border: none;
  resize: none;
  height: 14px;
  align-self: center;
  outline: none;
  box-shadow: none;
`;

export default function MessageInput() {
  const [message, setMessage] = useState("");
  const ref = useRef();

  useEffect(() => {
    function handleHeight(e) {
      e.target.style.height = "";
      console.log("input");
      e.target.style.height = e.target.scrollHeight + "px";
    }
    const textArea = ref.current;
    textArea.addEventListener("input", handleHeight);
    return () => textArea.removeEventListener("input", handleHeight);
  }, []);

  return (
    <Container>
      <img src={attachSvgUrl} />
      <StyledInput
        ref={ref}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <img src={sendSvgUrl} />
    </Container>
  );
}
