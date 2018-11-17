import ActionCable from "actioncable";

interface ActionCableOptions {
  native?: boolean;
}

const ActionCableJwt = {
  createConnection: (
    jwtCallback: () => Promise<string>,
    opts: ActionCableOptions = {}
  ) => {
    // @ts-ignore
    ActionCable.getConfig = () => null;
    // @ts-ignore
    ActionCable.createWebSocketURL = (url: string) =>
      url.replace(/^http/, "ws");

    // @ts-ignore
    ActionCable.Connection.prototype.open = async function open() {
      if (this.isActive()) {
        // @ts-ignore
        ActionCable.log(
          `Attempted to open WebSocket, but existing socket is ${this.getState()}`
        );
        return false;
      }

      jwtCallback().then((jwt: string) => {
        if (jwt) {
          // @ts-ignore
          ActionCable.log(
            // @ts-ignore
            `Opening WebSocket, current state is + ${this.getState()}, subprotocols: ${ActionCable.INTERNAL.protocols.concat(
              jwt
            )}`
          );
          if (this.webSocket != null) this.uninstallEventHandlers();

          // @ts-ignore
          this.webSocket = new ActionCable.WebSocket(
            this.consumer.url,
            // @ts-ignore
            ActionCable.INTERNAL.protocols.concat(jwt)
          );
          this.webSocket.protocol = "actioncable-v1-json";
          this.installEventHandlers();
          this.monitor.start();
        }
      });
      return true;
    };

    if (opts.native) {
      // @ts-ignore
      global.document = {
        addEventListener() {},
        removeEventListener() {}
      };
      // @ts-ignore
      global.__APOLLO_DEVTOOLS_GLOBAL_HOOK__ = "";
    }
    return ActionCable;
  }
};

export default ActionCableJwt;
