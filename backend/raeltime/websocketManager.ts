import WebSocket from "ws";

export function createWebsocketManager() {
  const clients = new Set<WebSocket>();

  function addClient(socket: WebSocket) {
    clients.add(socket);
  }

  function removeClient(socket: WebSocket) {
    clients.delete(socket);
  }

  function broadcast(message: object) {
    const data = JSON.stringify(message);

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      } else {
        clients.delete(client);
      }
    });
  }

  return {
    addClient,
    removeClient,
    broadcast,
  };
}
