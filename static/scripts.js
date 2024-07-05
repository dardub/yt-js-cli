console.log('static script.js')

function dragStartHandler(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.dataTransfer.setData("text/html", e.target.outerHTML);
}

function dragleaveHandler(e) {
    e.preventDefault();

    e.target.classList.remove("active");
}

function dropHandler(e) {
    e.preventDefault();
    e.target.classList.remove("active");

    const data = e.dataTransfer.getData("text/plain");
    const el = e.target.parentElement;
    el.parentElement.insertBefore(document.getElementById(data), el);
}

function dragoverHandler(e) {
    e.preventDefault();
    console.log("dragOverHandler", e);
    e.target.classList.add("active");
    e.dataTransfer.dropEffect = "move";
}

window.addEventListener("DOMContentLoaded", function() {
    const el = document.querySelectorAll(".item");

    el.forEach(x => x.addEventListener("dragstart", dragStartHandler));
});