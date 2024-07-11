import video from "../player/static/scripts.js";

function search(query) {
    const param = new URLSearchParams({ s: query });
    console.log('url', param.toString());
    window.location.href = "/search/?" + param.toString();

}

window.MyTube = {
    ...window.MyTube,
    video,
    search,
  }