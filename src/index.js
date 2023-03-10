import dotenv from 'dotenv';
import logger from 'configs/winston.config';
import express from 'express';
import morgan from 'morgan';
import db from 'models';
import router from 'routers';
import routerAdmin from 'routers/admin';
// eslint-disable-next-line no-unused-vars
import stringFormat from 'utils/string-format';
import { swagger } from 'helpers/swagger';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import { getAllKey, getKey } from 'helpers/redis';
import { rabbit } from 'helpers/rabbitMQ';

dotenv.config();

db.sequelize.sync();

const app = express();

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const queue = 'task_queue';

const task = cron.schedule('* * * 12 * *', async () => {
  logger.info(`Cron job test every minute`, Date(Date.now()).toString());
  const keys = await getAllKey(0, 'publicId_*');
  if (keys.length > 0) {
    for (let i = 0; i < keys.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const data = await getKey(0, keys[i]);
      // eslint-disable-next-line no-await-in-loop
      await rabbit.channel.sendToQueue(queue, Buffer.from(data), {
        persistent: true,
      });

      console.log(" [x] Sent '%s'", data);
    }
  }
});

task.start();

app.use('/api-docs', swagger());

app.use('/api/v1', router);
app.use('/api/v1/admin', routerAdmin);

export default app;
