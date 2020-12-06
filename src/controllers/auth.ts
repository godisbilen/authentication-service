import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Driver from '../models/driver';

const authenticateDriver = (username: string, password: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        Driver.findOne({ username })
            .exec()
            .then((temp) => {
                if (temp) {
                    const driver = temp.toObject();
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (bcrypt.compareSync(password, driver.password)) {
                        return resolve(true);
                    }
                    return reject({ status: 401, message: 'Password doesn´t match' });
                }
                return reject({ status: 401, message: 'No driver found' });
            })
            .catch((err) => {
                console.log(err);
                return reject({ status: 500, message: 'Internal server error' });
            });
    });
};

export default authenticateDriver;

const authRequired = (req: Request, res: Response, next: NextFunction): void => {
    if (req.headers.authorization) {
        const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
        const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');

        authenticateDriver(username, password)
            .then(() => {
                console.log('Next');
                next();
            })
            .catch((err) => {
                console.log(err);
                res.json(err.message).status(err.status).send();
            });
    } else {
        res.status(401).send();
    }
};

export { authRequired };
