export function createWebsocketManager() {
  const clients = new Set();

  function addClient(socket) {
    clients.add(socket);
  }

  function removeClient(socket) {
    clients.delete(socket);
  }

  function broadcast(message) {
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
