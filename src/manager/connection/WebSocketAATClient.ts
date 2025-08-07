import { EventCallback, EventEmitter } from "../lifecycle/EventEmitter";

export type wsStatuses = "disconnected" | "connecting" | "connected";

export type WebSocketClientEvents = "ws_connected" | "ws_disconnect" | "ws_message";

class WebSocketAATClient {
  private eventEmitter: EventEmitter<WebSocketClientEvents>;
  wsStatus: wsStatuses = "disconnected";

  private checkConnectionJSONObj = {
    sender: {
      type: "controlDevice",
    },
    request: {
      type: "report",
      name: "checkConnection",
    },
    data: {},
  };

  private checkConnectionJSONOStr: string = JSON.stringify(this.checkConnectionJSONObj);

  private wsConnectingTimer: number = 0;
  private wsConnectingTimeOut: number = 5;

  private wsSendConnectionMsgTimer: number = 0;
  private wsSendConnectionMsgTimeOut: number = 30;

  private wsResponseWaitingTimer: number = 0;
  private wsResponseWaitingTimeOut: number = 30;

  private responseWaiting: number = 0;

  private serverIp: string = "ws://localhost:7242";
  private ws: WebSocket | null = null;

  connectInterval: number | undefined;

  constructor() {
    this.eventEmitter = new EventEmitter<WebSocketClientEvents>();
  }

  on(event: WebSocketClientEvents, callback: EventCallback) {
    return this.eventEmitter.on(event, callback);
  }

  public setIp(serverIp: string) {
    this.serverIp = serverIp;
  }

  public connect() {
    console.log("Try connect to aatWs!");
    if (this.wsStatus !== "connected" && this.wsStatus !== "connecting") {
      if (this.ws != null) {
        try {
          this.ws.close();
        } catch (e) {
          console.warn(e);
        }
      }
      this.ws = null;
      this.connectWebSocket();
      this.wsStatus = "connecting";
    }
    this.connectInterval = setInterval(this.connectionCheckTimerFunc.bind(this), 1000);
  }

  public disconnect() {
    console.log("Try disonnect!");
    if (this.ws) {
      this.ws.close();
      this.wsStatus = "disconnected";
    }
    if (this.connectInterval) {
      console.log("disconnect", this.connectInterval);
      clearInterval(this.connectInterval);
    }
  }

  public send(message: string) {
    if (this.ws != null && this.wsStatus === "connected") {
      this.ws.send(message);
      this.responseWaiting = 1;
    }
  }

  private connectionCheckTimerFunc() {
    if (this.wsStatus === "connecting") {
      if (++this.wsConnectingTimer === this.wsConnectingTimeOut) {
        this.wsConnectingTimer = 0;
        this.wsStatus = "disconnected";
      }
    } else {
      this.wsConnectingTimer = 0;
    }

    if (this.wsStatus === "connected") {
      if (this.responseWaiting === 0) {
        if (++this.wsSendConnectionMsgTimer === this.wsSendConnectionMsgTimeOut) {
          this.wsSendConnectionMsgTimer = 0;
          this.responseWaiting = 1;
          try {
            this.ws?.send(this.checkConnectionJSONOStr);
          } catch (e) {
            console.error(e);
          }
        }
      } else if (this.responseWaiting === 1) {
        if (++this.wsResponseWaitingTimer === this.wsResponseWaitingTimeOut) {
          this.responseWaiting = 0;
          this.wsResponseWaitingTimer = 0;
          this.wsStatus = "disconnected";
        }
      }
    } else {
      this.wsSendConnectionMsgTimer = 0;
      this.wsResponseWaitingTimer = 0;
      this.responseWaiting = 0;
    }

    if (this.wsStatus !== "connected" && this.wsStatus !== "connecting") {
      if (this.ws != null) {
        try {
          this.ws.close();
        } catch (e) {
          console.warn(e);
        }
      }
      this.ws = null;
      this.connectWebSocket();
      this.wsStatus = "connecting";
      this.wsConnectingTimer = 0;
    }
  }

  private connectWebSocket() {
    if (this.ws == null) {
      this.ws = new WebSocket(this.serverIp!);
      this.ws.onopen = () => {
        this.wsStatus = "connected";
        this.eventEmitter.emit("ws_connected");
      };
      this.ws.onmessage = (evt) => {
        console.log("onmessage:", evt.data);
        this.responseWaiting = 0;
        this.wsResponseWaitingTimer = 0;
        this.wsSendConnectionMsgTimer = 0;
        this.eventEmitter.emit("ws_message", evt.data);
      };
      this.ws.onclose = () => {
        this.wsStatus = "disconnected";
        this.eventEmitter.emit("ws_disconnect");
      };
    }
  }
}

const webSocketAATClient = new WebSocketAATClient();
export default webSocketAATClient;
