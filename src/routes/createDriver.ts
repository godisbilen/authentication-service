import express from 'express';
import Driver from '../models/driver';
import bcrypt from 'bcrypt';
import { authRequired } from '../controllers/auth';

const router = express.Router();

router.post('/', authRequired, (req, res) => {
    const { username, password, firstname, lastname } = Object.assign(req.body);

    Driver.findOne({ username })
        .exec()
        .then((d) => {
            if (d) {
                return res.status(500).send();
            }
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const driver = new Driver({ username, password: hash, firstname, lastname });
            driver
                .save()
                .then(() => {
                    return res.status(200).send();
                })
                .catch((err) => {
                    return res.json(err).status(500).send();
                });
        });
});

export default router;
