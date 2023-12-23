import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { WebSocketInstance } from "../services/websoket";
import { useAuth } from "./AuthContext";

const WebsocketContext = createContext();

let connected = false;

function WebsoketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);

  useMemo(() => {
    if (!isConnected) {
      WebSocketInstance.connect();
      WebSocketInstance.waitForSocketConnection(() => {
        setIsConnected(true);
      });
    }
  }, [isConnected]);

  useEffect(() => {
    function disconnect() {
      if (connected) {
        WebSocketInstance.disconnect();
      }
    }
    return disconnect;
  }, []);

  return (
    <WebsocketContext.Provider
      value={{ websocket: WebSocketInstance, websocketReady: isConnected }}
    >
      {children}
    </WebsocketContext.Provider>
  );
}

function useWebsoket() {
  const context = useContext(WebsocketContext);
  if (context === undefined)
    throw new Error("WebsocketContext was used outside AuthProvider");
  return context;
}

export { WebsoketProvider, useWebsoket };
