import { PostData, WebContentData } from "../interface/webhose.interface"

export function mockWebhoseResponse(totalPost?: number, totalResults?: number): WebContentData {
    let data: WebContentData = {
        moreResultsAvailable: totalResults - totalPost > 0 ? totalResults - totalPost : 0,
        next: '',
        posts: [],
        requestsLeft: 200,
        totalResults: totalResults,
    }

    const randomId = function () {
        return Math.random().toString(36).substring(2, 16);
    };

    const generatePost = () => (new Array(totalPost)).fill(1).map(i => (<PostData>{
        "thread": {},
        "uuid": randomId(),
        "url": "https://forums.sherdog.com/threads/when-did-the-nytimes-hire-david-duke-as-an-editor.3951353/page-2#post-7",

    }))

    data.posts = generatePost()

    return data
}
