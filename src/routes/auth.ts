import express from 'express';
import Driver from '../models/driver';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/authorize', (req, res) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    Driver.findOne({ username })
        .exec()
        .then((temp) => {
            if (temp) {
                const driver = temp.toObject();
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (bcrypt.compareSync(password, driver.password)) {
                    return res.status(200).json(driver).send();
                }
            }
            return res.status(401).send();
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err).send();
        });
});

export default router;
