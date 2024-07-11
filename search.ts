type SearchResource = {
    id: {
        kind: string;
        videoId: string;
        channelId: string;
        playlistId?: string;
    },
    snippet: {
        publishedAt: Date;
        channelId: string;
        title: string;
        description: string;
        thumbnails: {
            default?: {
                url: string;
                width: number;
                height: number;
            },
            medium?: {
                url: string;
                width: number;
                height: number;
            },
            high?: {
                url: string;
                width: number;
                height: number;
            },
        };
        channelTitle: string;
    }
}

type SearchResponse = {
    nextPageToken: string;
    prevPageToken: string;
    regionCode: string;
    items: SearchResource[]
}


export default function Search(results: SearchResponse) {
    
    return (`
        <ul>
        ${results.items.reduce((prev, item) => prev + (`
            <li key="${item?.id?.videoId}">
                <h2>${item?.snippet?.title}</h2>
                <p>${item?.snippet?.description}</p>
            </li>
        `), "")}
        </ul>
        <script type="text/javascript">
            const items = ${JSON.stringify(results.items)};
            let counter = 0;
            window.MyTube = {
                ...window.MyTube,
                results: {
                    data: items,
                    result: function(prop) {
                        if (!prop) return {
                            videoId: items[counter]?.id?.videoId,
                            select: function() {
                                let location = "/?v=" + items[counter]?.id?.videoId;
                                window.location.href = location;
                            }
                        }
                        return items[counter]?.snippet[prop];
                    },
                    nextResult: function() {
                        counter++;
                        if (counter >= items.length) counter = 0;
                        // TODO: Fetch next page instead of cycling to the beginning

                        return items[counter]?.snippet?.title;
                    },
                    prevResult: function() {
                        counter--;
                        if (counter < 0) {
                            counter = 0;
                            throw new Error("Already at the first item.");
                        }

                        return items[counter]?.snippet?.title;
                    }
                },
            }
            console.log('See .results for operations on search results');
        </script>
    `);
}