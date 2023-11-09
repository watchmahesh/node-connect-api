/**
 * NOTE: API response Type Defination to showcase the handeling of types for response,
 * not to be considered as a complete implementation
 */

export interface PostData {
    /**
     * Additional data object for the post
     */
    thread: object;

    /**
     * Unique id for the post.
     */
    uuid: string;

    /**
     * url of the post item.
     */
    url: string;
}

/**
 *
 */
export interface WebContentData {
    /**
     * The array of all the posts items received from api
     */
    posts: PostData[];

    /**
     * Total posts available for a given query.
     */
    totalResults: number;

    /**
     * More results available other than the fetched results in one request.
     */
    moreResultsAvailable: number;

    /**
     * Total number of request left for a give size and query to fetch all data.
     */
    requestsLeft: number;

    /**
     * API end point to hit for next batch of data.
     */
    next: string;
}
