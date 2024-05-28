import express from 'express';
import { AppDataSource } from './data-source';
import { loadImages, scheduledJob } from './helpers';
import * as DBInit from './database/init';
const cors = require('cors');

AppDataSource.initialize().then(() => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.get('/images/remove/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const dbConnection = await DBInit.connect();
      await dbConnection.query(
        `DELETE FROM photos WHERE id=${id}`
      )
      return res.json({
        status: "success",
        message: "Image removed successfully",
      });
    } catch (err) {
      console.log(`Error in remove image:`, err);
      return res.json({
        status: "error",
        message: "Image not removed",
      })
    }
  })
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
      SELECT tag, COUNT(*) AS frequency FROM (
      SELECT unnest(regexp_split_to_array(tags, ' ')) AS tag FROM photos
      ) AS tag_table
      GROUP BY tag
      ORDER BY frequency DESC
      LIMIT 10
      `
    );

    return res.json({
      photos: photos.rows,
      topTags: topTags.rows,
    });
  })

  loadImages(["cat"]);
  scheduledJob.start();

  return app.listen(process.env.PORT, () => {
    console.log("APP is running on port: ", process.env.PORT);
  });
})
