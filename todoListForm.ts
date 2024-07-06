import { TodoList, Todo } from "./todoList";

export function TodoListForm(todos: Todo[]): string {
  return `
        <div id="todo-list" hx-on::after-swap="addDragStart()">
            <form id="new-todo-form" hx-post="/add" hx-swap="innerHTML" hx-target="#todo-list">
                <input type="text" name="todo" hx-post="/add" hx-sync="closest form:abort"></input>
                <button type="submit">Submit</button>
            </form>
            ${TodoList(todos)}
        </div>
    `;
}