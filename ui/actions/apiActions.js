import 'whatwg-fetch';
import map from 'lodash/map';

function mapErrors(errors) {
  return {
    error: map(errors, error => `${error.field}: ${error.message}`).join('; ')
  };
}

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
        return mapErrors(data.errors);
      } else {
        return data;
      }
    });
}

export function getData(query, limit, offset) {
  return fetch('/search', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, limit, offset })
  })
    .then(response => response.json())
    .then(data => {
      if (data.errors) {
        return mapErrors(data.errors);
      } else {
        return data.results;
      }
    });
}
