let player;
const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.size ? urlParams.get("v") : "M7lc1UVf-VE";

const tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

console.log('video id', videoId, urlParams);


window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId,
        playerVars: {
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
event.target.playVideo();
}

let done = false;
function onPlayerStateChange(event) {
if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(player.stopVideo, 6000);
    done = true;
}
}

function stop() {
    player.stopVideo();
}

function play() {
    player.playVideo();
}

function pause() {
    player.pauseVideo();
}

function next() {
    player.nextVideo();
}

function prev() {
    player.previousVideo();
}

function mute() {
    if (player.isMuted()) {
        player.unMute();
    } else {
        player.mute();
    }
}

export default {
    onPlayerReady,
    onPlayerStateChange,
    stop,
    play,
    pause,
    next,
    prev,
    mute,
}