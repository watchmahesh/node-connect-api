import axios from "axios";
import fs from "fs";
import { WebContentData } from "./interface/webhose.interface";

/**
 *
 */
export interface WebhoseFetchRequest {
  /**
   * The query string to pass into Webhose.io for fetch (see https://docs.webhose.io/docs/get-parameters parameter q)
   */
  query: string;

  /**
   * The number of posts to retrieve (if existing).
   */
  size: number;
}

/**
 *
 */
export interface WebhoseFetchResponse {
  /**
   * The number of posts that were actually fetched.
   */
  count: number;

  /**
   * The total number of posts that are possibly fetched.
   *
   * Sometimes, the fetch is not able to get all of the posts
   * which result in a totalCount that is less than count.
   */
  totalCount: number;
}

/**
 * A basic interface to Wehbhose.io in order to query and retrieve posts.
 */
export interface Webhose {
  /**
   * Fetch all posts from Webhose.io based on the request.
   *
   * If the {{request.size}} is greater than what can be retrieved in a single GET, then subsequent gets will occur
   * and the promise will resolve all requests have been completed.
   *
   * @param request
   */
  fetch(request: WebhoseFetchRequest,cb?: CustomQueryCallback): Promise<WebhoseFetchResponse>;
}

const URL_HOST: string = 'https://webhose.io';

const PATH_FILTER_WEB_CONTENT: string = '/filterWebContent';

// Define a specific type for cb
 export type CustomQueryCallback = (options: WebhoseFetchRequest) => object;

/**
 *
 */
export class WebhoseToDiskImpl implements Webhose {
  /**
   * @param outDir
   * @param token
   */
  constructor(private outDir: string,
    private token?: string) {
  }


  /**
   * @inheritDoc
   */
  async fetch(request: WebhoseFetchRequest, cb?: CustomQueryCallback): Promise<WebhoseFetchResponse> {
    console.info("Fetching with request", request);
    const url = `${URL_HOST}${PATH_FILTER_WEB_CONTENT}?${this.getParams(request,cb)}`;
    try {
      const response = await axios.get<WebContentData>(url);
      const { totalResults, moreResultsAvailable } = response.data;
      if (moreResultsAvailable) {
        await this.save(response.data)
      }
      const count = totalResults - moreResultsAvailable;
      return { count, totalCount: totalResults };

    } catch (err) {
      throw new Error("error fetching data");
    }
  }

  async save(data: WebContentData): Promise<void> {
    if (!fs.existsSync(this.outDir)) {
      fs.mkdirSync(this.outDir);
    }
    try {
      for (const post of data.posts) {
        const filePath = `${this.outDir}/${post.uuid}.json`;
        fs.writeFileSync(filePath, JSON.stringify(post));
      }
    } catch (err) {
      console.error("err", err);
      throw new Error("error saving file");
    }
  }

  getParams(request: WebhoseFetchRequest, cb?: CustomQueryCallback): string {
    const query:any = cb ? cb(request) : request
    return new URLSearchParams({...query, token: this.token,  }).toString();
  }
}
