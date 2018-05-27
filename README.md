## Requirements
1. NodeJS v8 or above
2. run `npm install` in the project folder

## Development
1. To start the app in a dev mode you need to run `npm run dev`

It will run node with `nodemon` and will watch all your server changes.
It will also run `parcel` bundler in a watch mode so all you client changes will be hot reloaded.


## Running in prod
1. To start the app in a prod mode you need to run `npm start`
It will build the ui static files once and serve them as static files.
It will also start a server without watching for any changes.

## Testing
Only API tests are available right now.
1. To start api tests run `npm test`.