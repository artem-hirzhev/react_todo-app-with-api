import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  title: string;
  isAdding: boolean;
  handleDelete: (id: number) => void;
  handleCompletedChange: (id: number, data: boolean) => void;
  selectedTodoIds: number[];
};

export const TodosList: React.FC<Props> = (
  {
    todos,
    title,
    isAdding,
    handleDelete,
    handleCompletedChange,
    selectedTodoIds,
  },
) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              checked={todo.completed}
              className="todo__status"
              onClick={() => {
                return todo.completed
                  ? handleCompletedChange(todo.id, false)
                  : handleCompletedChange(todo.id, true);
              }}
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames(
              'modal overlay',
              {
                'is-active': selectedTodoIds.some(id => id === todo.id),
              },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {isAdding && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">{title}</span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
