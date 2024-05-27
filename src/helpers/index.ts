import axios from "axios";
import * as DBInit from "../database/init";

const apiKey = process.env.flickrApiKey as string;

const loadImages = async (tags: string[]) => {
  try {
    axios({
      method: 'get',
      url: 'https://api.flickr.com/services/rest',
      params: {
        method: 'flickr.photos.search',
        api_key: apiKey,
        tags: "cat",
        page: 1,
        per_page: 500,
        format: 'json',
        extras: 'url_n, date_upload, tags',
        nojsoncallback: 1
      }
    })
    .then(async res => {
      Promise.all(
        res.data.photos.photo.map(async (item: any) => {
          const dbConnection = await DBInit.connect();
          return await dbConnection.query(
            `INSERT INTO photos
            ("publishedDate", "imageUrl", "tags")
            VALUES (to_timestamp($1), $2, $3)
            RETURNING id`,
            [item.dateupload, item.url_n, item.tags],
          )
        })
      )
      console.log('Data saved')
    })
  } catch (error) {
    console.log("Error: ", error);
  }
}

export default loadImages;
