import io from 'socket.io-client';
import { uploadEvents } from '../../config/constants';

const socket = io();

export function subscribeToUploadStart(cb) {
  socket.on(uploadEvents.started, cb);
}

export function subscribeToUploadProgress(cb) {
  socket.on(uploadEvents.progress, cb);
}

export function subscribeToUploadFinished(cb) {
  socket.on(uploadEvents.finished, cb);
}

export function subscribeToUploadFailed(cb) {
  socket.on(uploadEvents.failed, cb);
}
