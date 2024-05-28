import axios from "axios";
import { CronJob } from "cron";
import * as DBInit from "../database/init";

const apiKey = process.env.flickrApiKey as string;

export const scheduledJob = new CronJob(
  "0 * * * *",
  () => {
    console.log(`Cron job ran successfully`);
    loadImages(["cat"]);
  },
  null,
  true,
  "America/Los_Angeles"
);

export const loadImages = async (tags: string[]) => {
  try {
    axios({
      method: "get",
      url: "https://api.flickr.com/services/rest",
      params: {
        method: "flickr.photos.search",
        api_key: apiKey,
        tags: tags.join(" "),
        page: 1,
        per_page: 500,
        format: "json",
        extras: "url_n, date_upload, tags",
        nojsoncallback: 1,
      },
    }).then(async (res) => {
      Promise.all(
        res.data.photos.photo.map(async (item: any) => {
          const dbConnection = await DBInit.connect();
          return await dbConnection.query(
            `INSERT INTO photos
              ("publishedDate", "imageUrl", "tags")
              SELECT to_timestamp($1), $2, $3
              WHERE NOT EXISTS (
                SELECT "imageUrl" FROM photos WHERE "imageUrl" = $4
              )
              RETURNING id`,
            [item.dateupload, item.url_n, item.tags, item.url_n]
          );
        })
      );
      console.log("Data saved");
    });
  } catch (error) {
    console.log("Error: ", error);
  }
};
