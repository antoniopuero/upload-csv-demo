import socketIO from 'socket.io';
import EventEmitter from 'events';
import { uploadEvents } from '../../config/constants';

const eventBus = new EventEmitter();

export function configureSocket(server) {
  const io = socketIO(server);
  io.on('connection', socket => {
    eventBus.on(uploadEvents.started, progress => {
      socket.emit(uploadEvents.started, { progress });
    });
    eventBus.on(uploadEvents.progress, progress => {
      socket.emit(uploadEvents.progress, { progress });
    });
    eventBus.on(uploadEvents.finished, progress => {
      socket.emit(uploadEvents.finished, { progress, finished: true });
    });
    eventBus.on(uploadEvents.failed, () => {
      socket.emit(uploadEvents.failed, { error: 'Upload failed' });
    });
  });
}

export default eventBus;
