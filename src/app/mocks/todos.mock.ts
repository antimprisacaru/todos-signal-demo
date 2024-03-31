import { delay, GraphQLHandler, HttpResponse } from 'msw';
import { inject } from '@angular/core';
import { ApiMockHandler } from '../providers/api-mock-handler.graphql';
import {
  ADD_TODO_MUTATION,
  GET_TODO_QUERY,
  GET_TODOS_QUERY,
  REMOVE_TODO_MUTATION,
  UPDATE_TODO_MUTATION,
} from '../api/todos.api';
import { Todo } from '../models/todo.model';
import { randBoolean, randNumber, randText, randUuid } from '@ngneat/falso';
import { GraphQLError } from 'graphql/error';

const todos: Todo[] = Array.from({ length: randNumber({ min: 10, max: 30 }) }).map(
  (): Todo => ({
    id: randUuid(),
    completed: randBoolean(),
    text: randText(),
  })
);

export default function mockTodos(): GraphQLHandler[] {
  const api = inject(ApiMockHandler);

  return [
    api.query(GET_TODOS_QUERY, async () => {
      await delay();
      return HttpResponse.json({ data: { getTodos: todos } });
    }),
    api.query(GET_TODO_QUERY, async ({ variables }) => {
      const foundTodo = todos.find((t) => t.id === variables.id);

      await delay();
      if (!foundTodo) {
        return HttpResponse.json({
          data: { getTodo: undefined },
          errors: [new GraphQLError(`Todo with ID ${variables.id} could not be found!`)],
        });
      }

      return HttpResponse.json({ data: { getTodo: foundTodo } });
    }),
    api.mutation(ADD_TODO_MUTATION, async ({ variables }) => {
      // Push returns the new length for the array after it's been added
      const newLength = todos.push({ id: randUuid(), text: variables.text, completed: false });
      await delay();
      return HttpResponse.json({ data: { addTodo: todos[newLength - 1] } });
    }),
    api.mutation(REMOVE_TODO_MUTATION, async ({ variables }) => {
      const foundTodo = todos.find((t) => t.id === variables.id);

      await delay();
      if (!foundTodo) {
        return HttpResponse.json({
          data: { removeTodo: undefined },
          errors: [new GraphQLError(`Todo with ID ${variables.id} could not be found!`)],
        });
      }

      return HttpResponse.json({ data: { removeTodo: foundTodo } });
    }),
    api.mutation(UPDATE_TODO_MUTATION, async ({ variables }) => {
      const foundTodo = todos.findIndex((t) => t.id === variables.id);

      await delay();
      if (!foundTodo) {
        return HttpResponse.json({
          data: { updateTodo: undefined },
          errors: [new GraphQLError(`Todo with ID ${variables.id} could not be found!`)],
        });
      }

      // Update todo in the array
      todos[foundTodo].text = variables.text;

      return HttpResponse.json({ data: { updateTodo: todos[foundTodo] } });
    }),
  ];
}
