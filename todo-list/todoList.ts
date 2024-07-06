export type Todo = {
  id: number;
  name: string;
  order: number;
};

export function TodoList(todos: Todo[]): string {
  return `
      <form
        id="sortable-list"
        hx-post="/update-order"
        hx-trigger="sortEnd from:document" hx-swap="innerHTML"
        hx-target="#sortable-list"
      >
        <ul>
            ${sort(todos).reduce((prev, todo, idx) => {
              return (
                prev +
                `
                <li key=${idx} id=${idx} class="item" draggable="true">
                    <div id="dropzone" ondrop="dropHandler(event)" ondragover="dragoverHandler(event)" ondragleave="dragleaveHandler(event)"></div>
                    <div>
                        <input type="hidden" name="todo" value="${todo.id}" />
                        ${todo?.name}
                    </div>
                </li>`
              );
            }, "")}
        </ul>
      </form>
    `;
}

function sort(todos: Todo[]) {
  return todos.sort((a, b) => a.order - b.order);
}
