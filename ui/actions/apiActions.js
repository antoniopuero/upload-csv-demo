import 'whatwg-fetch';
import map from 'lodash/map';

export function importFile(file) {
  const form = new FormData();
  form.append('file', file);
  return fetch('/import', {
    method: 'POST',
    body: form
  })
    .then(response => response.json())
    .then(data => {
      if (data.errors) {
        return { error: map(data.errors, error => error.message).join('; ') };
      } else {
        return data;
      }
    });
}
