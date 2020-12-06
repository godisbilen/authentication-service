import { Application } from 'express';

const path = '/driver';

// Import all router files
import auth from './auth';
import createDriver from './createDriver';

export default (app: Application): void => {
    app.use(path, auth);
    app.use(path, createDriver);
};
