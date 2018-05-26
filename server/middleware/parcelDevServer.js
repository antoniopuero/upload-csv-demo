import Bundler from 'parcel-bundler';
const bundler = new Bundler('ui/index.html', {});

export default () => bundler.middleware();
