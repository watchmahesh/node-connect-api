import { CustomQueryCallback, Webhose, WebhoseFetchRequest, WebhoseFetchResponse, WebhoseToDiskImpl } from "./webhose";
import * as fs from "fs";
import dotenv from 'dotenv';
dotenv.config();

const DIR_WEHBOSE_POSTS: string = 'webhose_posts';

console.info("ITONICS Webhose.io Fetcher");


const token = process.env.WEBHOSE_TOKEN;
const webhose: Webhose = new WebhoseToDiskImpl(DIR_WEHBOSE_POSTS, token);

// search all of Webhose for the first 200 posts with the query of 'food'
const request: WebhoseFetchRequest = {
    query: "food",
    size: 200
};
// Customize Handler return object to  search with params. //Bonus Part
const handler: CustomQueryCallback = (options) => ({
    q: options.query,
    size: options.size,
})

webhose.fetch(request, handler).then((response: WebhoseFetchResponse) => {
    console.info('Fetch finished', response);

    // read the files after fetch to take a look at how many there are
    return new Promise((resolve, reject) => {
        fs.readdir(DIR_WEHBOSE_POSTS, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}).then((files: string[]) => {
    console.info('Fetched files', files);

}).catch((err: any) => {
    console.error(err);
});
