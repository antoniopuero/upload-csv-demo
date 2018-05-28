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
    eventBus.addListener(uploadEvents.started, uploadStarted);
    eventBus.addListener(uploadEvents.progress, uploadProgress);
    eventBus.addListener(uploadEvents.finished, uploadFinished);
    eventBus.addListener(uploadEvents.failed, uploadFailed);

    socket.on('disconnect', () => {
      eventBus.removeListener(uploadEvents.started, uploadStarted);
      eventBus.removeListener(uploadEvents.progress, uploadProgress);
      eventBus.removeListener(uploadEvents.finished, uploadFinished);
      eventBus.removeListener(uploadEvents.failed, uploadFailed);
    });
  });
}

export default eventBus;
