const EVENTS = {
    SORT_END: "sortEnd",
};

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

    removeDragStart();

    const data = e.dataTransfer.getData("text/plain");
    const el = e.target.parentElement;
    el.parentElement.insertBefore(document.getElementById(data), el);

    const event = new Event(EVENTS.SORT_END);

    document.dispatchEvent( event );
}

function dragoverHandler(e) {
    e.preventDefault();
    e.target.classList.add("active");
    e.dataTransfer.dropEffect = "move";
}

function addDragStart() {
    let el = document.querySelectorAll(".item");

    el.forEach(x => x.addEventListener("dragstart", dragStartHandler));
}

function removeDragStart() {
    let allDraggable = document.querySelectorAll(".item");
    allDraggable.forEach(x => x.removeEventListener("dragstart", dragStartHandler));
}

window.addEventListener("DOMContentLoaded", function() {
    addDragStart();
});