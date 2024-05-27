import express from 'express';
import { AppDataSource } from './data-source';
import loadImages from './helpers';


AppDataSource.initialize().then(() => {
   const app = express();
   app.use(express.json())
   app.get('/', (req, res) => {
   return res.json('Established connection!');
 })

  loadImages(["cat"]);

  return app.listen(process.env.PORT);
})