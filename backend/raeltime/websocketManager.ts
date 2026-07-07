import type WebSocket from "ws";

export function createWebsocketManager() {
  const clients = new Set<WebSocket>();

  function addClient(socket: WebSocket) {
    clients.add(socket);
  }

  function removeClient(socket: WebSocket) {
    clients.delete(socket);
  }

  function broadcast(message: unknown) {
    for (const client of clients) {
      client.send(JSON.stringify(message));
    }
  }

  return {
    addClient,
    removeClient,
    broadcast,
  };
}
