import socketIO from 'socket.io';
export function configureSocket(server) {
  const io = socketIO(server);
  io.on('connection', socket => {
    console.log(socket);
  });
}
