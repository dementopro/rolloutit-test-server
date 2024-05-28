import express from 'express';
import { AppDataSource } from './data-source';
import loadImages from './helpers';
import * as DBInit from './database/init';
const cors = require('cors');

AppDataSource.initialize().then(() => {
   const app = express();
   app.use(express.json());
   app.use(cors());
   app.get('/images/:page/:tag', async (req, res) => {
    const { page, tag } = req.params;
    const dbConnection = await DBInit.connect();
    const photos = tag !== "all" ? 
    await dbConnection.query(
      `SELECT * FROM photos WHERE "tags" LIKE '%${tag}%' ORDER BY "publishedDate" DESC LIMIT 10 OFFSET ${(Number(page) - 1) * 10}`
    )
    : await dbConnection.query(
      `SELECT * FROM photos ORDER BY "publishedDate" DESC LIMIT 10 OFFSET ${(Number(page) - 1) * 10}`
    ) 
    const topTags = await dbConnection.query(
      `
      select tag, count(*) as frequency from (
      select unnest(regexp_split_to_array(tags, ' ')) as tag from photos
      ) as tag_table
      group by tag
      order by frequency desc
      limit 10
      `
    );

    return res.json({
      photos: photos.rows,
      topTags: topTags.rows,
    });
 })

  loadImages(["cat"]);

  return app.listen(process.env.PORT, () => {
    console.log("APP is running on port: ", process.env.PORT);
  });
})
