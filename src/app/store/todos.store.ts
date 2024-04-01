import { patchState, signalStore, withComputed, withHooks, withMethods } from '@ngrx/signals';
import { removeEntity, setEntities, setEntity, updateEntity, withEntities } from '@ngrx/signals/entities';
import { Todo } from '../models/todo.model';
import { withRequestStatus } from './request.feature';
import { computed, inject, Provider } from '@angular/core';
import { Apollo, MutationResult } from 'apollo-angular';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import {
  ADD_TODO_MUTATION,
  GET_TODO_QUERY,
  GET_TODOS_QUERY,
  REMOVE_TODO_MUTATION,
  UPDATE_TODO_MUTATION,
} from '../api/todos.api';
import { tapResponse } from '@ngrx/operators';
import { ApolloError, ApolloQueryResult } from '@apollo/client';

export const TodosStore = signalStore(
  withRequestStatus(),
  withEntities<Todo>(),
  withMethods((store) => {
    const apollo = inject(Apollo);

    return {
      loadAll: rxMethod<void>(
        pipe(
          switchMap(() => apollo.query({ query: GET_TODOS_QUERY })),
          tapResponse({
            next: (response: ApolloQueryResult<{ getTodos: Todo[] }>) =>
              patchState(store, setEntities(response.data.getTodos)),
            error: (e: ApolloError[]) => patchState(store, { error: e[0].message }),
            finalize: () => patchState(store, { loading: false }),
          })
        )
      ),
      loadById: rxMethod<{ id: string }>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((variables) => apollo.query({ query: GET_TODO_QUERY, variables })),
          tapResponse({
            next: (response: ApolloQueryResult<{ getTodo?: Todo }>) => {
              if (response.data.getTodo) {
                patchState(store, setEntity(response.data.getTodo));
              }
            },
            error: (e: ApolloError[]) => patchState(store, { error: e[0].message }),
            finalize: () => patchState(store, { loading: false }),
          })
        )
      ),
      addTodo: rxMethod<{ text: string }>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((variables) => apollo.mutate({ mutation: ADD_TODO_MUTATION, variables })),
          tapResponse({
            next: (response: MutationResult<{ addTodo?: Todo }>) => {
              if (response.data?.addTodo) {
                patchState(store, setEntity(response.data.addTodo));
              }
            },
            error: (e: ApolloError[]) => patchState(store, { error: e[0].message }),
            finalize: () => patchState(store, { loading: false }),
          })
        )
      ),
      removeTodo: rxMethod<{ id: string }>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((variables) => apollo.mutate({ mutation: REMOVE_TODO_MUTATION, variables })),
          tapResponse({
            next: (response: MutationResult<{ removeTodo?: Todo }>) => {
              if (response.data?.removeTodo) {
                patchState(store, removeEntity(response.data.removeTodo.id));
              }
            },
            error: (e: ApolloError[]) => patchState(store, { error: e[0].message }),
            finalize: () => patchState(store, { loading: false }),
          })
        )
      ),
      updateTodo: rxMethod<{ id: string; text?: string; completed?: boolean }>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((variables) => apollo.mutate({ mutation: UPDATE_TODO_MUTATION, variables })),
          tapResponse({
            next: (response: MutationResult<{ updateTodo?: Todo }>) => {
              if (response.data?.updateTodo) {
                patchState(store, updateEntity({ id: response.data.updateTodo.id, changes: response.data.updateTodo }));
              }
            },
            error: (e: ApolloError[]) => patchState(store, { error: e[0].message }),
            finalize: () => patchState(store, { loading: false }),
          })
        )
      ),
    };
  }),
  withComputed(({ entities }) => ({
    pendingTodos: computed(() => entities().filter((todo) => !todo.completed)),
    completeTodos: computed(() => entities().filter((todo) => todo.completed)),
  })),
  withHooks(({ loadAll }) => ({
    onInit: () => loadAll(),
  }))
);

export type TodosStore = InstanceType<typeof TodosStore>;

export function provideTodosStore(): Provider[] {
  return [Apollo, TodosStore];
}
