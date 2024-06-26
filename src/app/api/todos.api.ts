import { gql } from 'apollo-angular';
import { Todo } from '../models/todo.model';

export const GET_TODOS_QUERY = gql<{ getTodos: Todo[] }, void>`
  query GetTodos {
    getTodos {
      id
      text
      completed
    }
  }
`;

export const GET_TODO_QUERY = gql<{ getTodo?: Todo }, { id: string }>`
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      text
      completed
    }
  }
`;

export const ADD_TODO_MUTATION = gql<{ addTodo?: Todo }, { text: string }>`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) {
      id
      text
      completed
    }
  }
`;

export const REMOVE_TODO_MUTATION = gql<{ removeTodo?: Todo }, { id: string }>`
  mutation RemoveTodo($id: ID!) {
    removeTodo(id: $id) {
      id
      text
      completed
    }
  }
`;

export const UPDATE_TODO_MUTATION = gql<{ updateTodo?: Todo }, { id: string; text?: string, completed?: boolean }>`
  mutation UpdateTodo($id: String!, $text: String!) {
    updateTodo(id: $id, text: $text) {
      id
      text
      completed
    }
  }
`;
