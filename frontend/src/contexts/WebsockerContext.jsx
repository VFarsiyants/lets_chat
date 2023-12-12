import { createContext, useContext, useEffect, useState } from "react";
import { WebSocketInstance } from "../services/websoket";

const WebsocketContext = createContext();

function WebsoketProvider({ children }) {
  const [websocket] = useState(WebSocketInstance);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    websocket.connect();
    setIsConnected(true);
    return () => websocket.disconnect();
  }, [websocket]);

  return (
    <WebsocketContext.Provider value={{ websocket }}>
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
