export { createSocketApp } from './app';

const server = new http.Server(app);
return createSocketApp(server, options);
