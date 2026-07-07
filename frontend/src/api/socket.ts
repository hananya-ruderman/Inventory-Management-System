import logger from '../utils/logging'

export function connectSocket(onMessage: (data:any)=>void) {
    var socket = new WebSocket("ws://localhost:3000/ws");

    socket.onopen = () => {
        logger.info("WS connected");
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage(data);
    };

    socket.onclose = () => {
        logger.info("WS disconnected");
    };
}