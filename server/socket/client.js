import socketIO from 'socket.io';
import EventEmitter from 'events';
import { uploadEvents } from '../../config/constants';

const eventBus = new EventEmitter();

export function configureSocket(server) {
  const io = socketIO(server);
  io.on('connection', socket => {
    function uploadStarted(progress) {
      socket.emit(uploadEvents.started, { progress });
    }
    function uploadProgress(progress) {
      socket.emit(uploadEvents.progress, { progress });
    }
    function uploadFinished(progress) {
      socket.emit(uploadEvents.finished, { progress, finished: true });
    }
    function uploadFailed() {
      socket.emit(uploadEvents.failed, { error: 'Upload failed' });
    }
    eventBus.on(uploadEvents.started, uploadStarted);
    eventBus.on(uploadEvents.progress, uploadProgress);
    eventBus.on(uploadEvents.finished, uploadFinished);
    eventBus.on(uploadEvents.failed, uploadFailed);

    socket.on('disconnect', () => {
      eventBus.off(uploadEvents.started, uploadStarted);
      eventBus.off(uploadEvents.progress, uploadProgress);
      eventBus.off(uploadEvents.finished, uploadFinished);
      eventBus.off(uploadEvents.failed, uploadFailed);
    });
  });
}

export default eventBus;
