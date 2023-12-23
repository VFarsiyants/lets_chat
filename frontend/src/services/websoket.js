import { getLocalAccessToken } from "../utils";

class WebSocketService {
  static instance = null;
  callbacks = {};
  closeCallback = null;
  openCallback = null;

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
    this.selfClosed = false;
  }

  connect() {
    if (this.socketRef) return;
    const webSocketPort = 8000;
    const apiHost = "localhost";
    const token = getLocalAccessToken();
    if (!token) {
      console.log("Can not connect to server, token is not set");
    }
    const path = `ws://${apiHost}:${webSocketPort}/ws/?token=${token}`;
    this.socketRef = new WebSocket(path);
    this.socketRef.onopen = (e) => {
      console.log("websocket open");
      if (this.openCallback) this.openCallback(e);
    };
    this.socketRef.onmessage = (e) => {
      this.socketNewMessage(e.data);
    };
    this.socketRef.onerror = (e) => {
      console.log(e.message);
    };
    this.socketRef.onclose = (e) => {
      console.log(e);
      if (!this.selfClosed) {
        console.log("websocket is closed, trying to reconnect");
        if (this.closeCallback) this.closeCallback(e);
        this.connect();
      } else {
        this.selfClosed = false;
        console.log("websocket is closed");
      }
    };
  }

  disconnect() {
    if (this?.socketRef) {
      this.selfClosed = true;
      this.socketRef.close(4000, "closed by user");
      this.socketRef = null;
    }
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const eventType = parsedData.event;
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    if (eventType) {
      const callback = this.callbacks[eventType];
      if (callback) callback(parsedData.payload);
    }
  }

  addCallbacks(callbacks) {
    for (const [name, callback] of Object.entries(callbacks)) {
      this.callbacks[name] = callback;
    }
  }

  addCloseCallback(callback) {
    this.closeCallback = callback;
  }

  addOpenCallback(callback) {
    this.openCallback = callback;
  }

  state() {
    return this.socketRef.readyState;
  }

  sendMessage(data) {
    try {
      this.socketRef.send(JSON.stringify({ ...data }));
    } catch (err) {
      console.log(err.message);
    }
  }

  waitForSocketConnection(callback) {
    const recursion = this.waitForSocketConnection;
    setTimeout(() => {
      if (this.state() === 1) {
        if (callback != null) {
          callback();
        }
        return;
      } else {
        console.log("waiting for connection...");
        recursion.bind(this)(callback);
      }
    }, 1);
  }
}

export const WebSocketInstance = WebSocketService.getInstance();
