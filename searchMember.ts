export default function SearchMember(results) {
    return (`
        <ul>
        ${results.items.reduce((prev, item) => prev + (`
            <li key="${item?.id?.videoId}">
                <h2>${item?.snippet?.title}</h2>
                <p>${item?.snippet?.description}</p>
            </li>
        `), "")}
        </ul>
        
}