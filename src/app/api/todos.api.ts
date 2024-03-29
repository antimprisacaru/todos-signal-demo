import { gql } from 'apollo-angular';

const GET_TODOS_QUERY = gql<{ getTodos: Todo[] }, never>`
    query GetTodos {
        getTodos {
            id
            text
            completed
        }
    }
`;

const GET_TODO_QUERY = gql<{ getTodo: Todo }, { id: string }>`
    query GetTodo($id: ID!) {
        getTodo(id: $id) {
            id
            text
            completed
        }
    }
`;

const ADD_TODO_MUTATION = gql<{ addTodo: Todo }, { text: string }>`
    mutation AddTodo($text: String!) {
        addTodo(text: $text) {
            id
            text
            completed
        }
    }
`;

const REMOVE_TODO_MUTATION = gql<{ removeTodo: Todo }, { id: string }>`
    mutation RemoveTodo($id: ID!) {
        removeTodo(id: $id) {
            id
            text
            completed
        }
    }`;

const UPDATE_TODO_MUTATION = gql<{ updateTodo: Todo }, { text: string }>`
    mutation UpdateTodo($text: String!) {
        updateTodo(text: $text) {
            id
            text
            completed
        }
    }
`;