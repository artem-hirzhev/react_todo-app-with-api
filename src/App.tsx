/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  KeyboardEvent, useContext, useEffect, useRef, useState,
} from 'react';
import {
  getTodos, addTodo, deleteTodo, completeTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer';
import { TodosList } from './components/TodosList';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [title, setTitle] = useState<string>('');
  const [filter, setFilter] = useState(Filter.all);
  const [Error, setError] = useState<string>('');
  const [isHidden, setIsHidden] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const completedTodos = todos.filter(todo => todo.completed);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos);
    }
  }, []);

  const handleAdd = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || !user) {
      return;
    }

    if (!title.trim()) {
      setError('emty');
      setIsHidden(false);
      setTimeout(() => setIsHidden(true), 3000);

      return;
    }

    setIsAdding(true);

    const todo = {
      title,
      userId: user.id,
      completed: false,
    };

    addTodo(todo)
      .then(result => setTodos(
        prevTodos => (
          prevTodos
            ? [...prevTodos, result]
            : [result]
        ),
      ))
      .catch(() => {
        setError('add');
        setIsHidden(false);
      })
      .finally(() => {
        setIsAdding(false);
        setTitle('');
        setTimeout(() => setIsHidden(true), 3000);
      });
  };

  const handleDelete = (id: number) => {
    setSelectedTodoIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError('delete');
        setIsHidden(false);
      })
      .finally(() => {
        setSelectedTodoIds([]);
        setTimeout(() => setIsHidden(true), 3000);
      });
  };

  const handleCompletedChange = (id: number, data: boolean) => {
    setSelectedTodoIds(prev => [...prev, id]);

    completeTodo(id, data)
      .then(() => setTodos(prevTodos => {
        prevTodos.find(todo => todo.id === id).completed = data;

        return prevTodos;
      }))
      .catch(() => setError('update'))
      .finally(() => setSelectedTodoIds([]));
  };

  const completeAll = () => {
    if (todos.every(todo => todo.completed)) {
      todos.forEach(todo => handleCompletedChange(todo.id, false));
    } else {
      todos.forEach(todo => handleCompletedChange(todo.id, true));
    }
  };

  const clearCompleted = () => {
    completedTodos.forEach(todo => handleDelete(todo.id));
  };

  const handleFilter = (arr: Todo[], filterType: string) => {
    switch (filterType) {
      case Filter.active:
        return arr.filter(element => !element.completed);

      case Filter.completed:
        return arr.filter(element => element.completed);

      default:
        return arr;
    }
  };

  const visibleTodos = !todos ? [] : handleFilter(todos, filter);
  const activeCount = !todos ? 0 : todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          handleAdd={handleAdd}
          setIsHidden={setIsHidden}
          isAdding={isAdding}
          completeAll={completeAll}
        />

        {(todos.length > 0 || isAdding) && (
          <>
            <TodosList
              todos={visibleTodos}
              title={title}
              isAdding={isAdding}
              handleDelete={handleDelete}
              handleCompletedChange={handleCompletedChange}
              selectedTodoIds={selectedTodoIds}
            />

            <Footer
              filter={filter}
              setFilter={setFilter}
              activeCount={activeCount}
              clearCompleted={clearCompleted}
              completedTodosCount={completedTodos.length}
            />
          </>
        )}
      </div>

      <ErrorNotification
        isHidden={isHidden}
        setIsHidden={setIsHidden}
        onError={Error}
      />
    </div>
  );
};
