import getApp from './app';

const app = getApp();

if (!process.env.DB_URL) {
    throw Error('Envirement variable "DB_URL" is required');
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server started at port ' + port);
});
