import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

function ChatProvider({ children }) {
  const [chat, setChat] = useState(null);

  return (
    <ChatContext.Provider value={{ chat, setChat }}>
      {children}
    </ChatContext.Provider>
  );
}

function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
}

export { ChatProvider, useChat };
