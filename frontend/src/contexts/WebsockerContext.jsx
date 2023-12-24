import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { WebSocketInstance } from "../services/websoket";
import { useAuth } from "./AuthContext";

const WebsocketContext = createContext();

function WebsoketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    if (!isConnected) {
      WebSocketInstance.connect();
      WebSocketInstance.waitForSocketConnection(() => {
        setIsConnected(true);
        WebSocketInstance.sendMessage({
          type: "get.current_user",
        });
      });
    }
    WebSocketInstance.addCallbacks({
      "current.user": (payload) => setCurrentUser(payload),
    });
  }, [setCurrentUser, isConnected]);

  function disconnect() {
    WebSocketInstance.disconnect();
    setIsConnected(false);
  }

  return (
    <WebsocketContext.Provider
      value={{
        websocket: WebSocketInstance,
        websocketReady: isConnected,
        disconnect,
      }}
    >
      {children}
    </WebsocketContext.Provider>
  );
}

function useWebsoket() {
  const context = useContext(WebsocketContext);
  if (context === undefined)
    throw new Error("WebsocketContext was used outside WebsocketProvider");
  return context;
}

export { WebsoketProvider, useWebsoket };
