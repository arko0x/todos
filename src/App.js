const axios = require("axios")

async function getRestUsersList() {
    try {
        const users = await axios.get("https://jsonplaceholder.typicode.com/users")
        console.log(users)
        return users.data.map(({id, name, email, username}) => ({
            id: id,
            name: name,
            email: email,
            login: username
        }))
    } 
    catch (error) {
        throw error
    }
}

async function getRestUserById(id) {
    try {
        const user = await axios.get("https://jsonplaceholder.typicode.com/users/" + id)
        console.log(user)
        return {
            id: user.data.id,
            name: user.data.name,
            email: user.data.email,
            login: user.data.username
        }
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

async function getRestTodosList() {
    try {
        const todos = await axios.get("https://jsonplaceholder.typicode.com/todos")
        return todos.data.map(({id, title, completed, userId}) => ({
            id: id,
            title: title,
            completed: completed,
            user_id: userId
        }))
    }
    catch (error) {
        throw error
    }
}

async function getRestTodoItemById(id) {
    try {
        const todo = await axios.get("https://jsonplaceholder.typicode.com/todos/" + id)
        return {
            id: todo.data.id,
            title: todo.data.title,
            completed: todo.data.completed,
            user_id: todo.data.userId
        }
        return todos.data.map(({id, title, completed, userId}) => ({
            id: id,
            title: title,
            completed: completed,
            user_id: userId
        }))
    }
    catch (error) {
        throw error
    }
}

async function getRestTodoItemByUserId(userId) {
    try {
        const todos = await axios.get("https://jsonplaceholder.typicode.com/users/" + userId + "/todos")
        return todos.data.map(({id, title, completed, userId}) => ({
            id: id,
            title: title,
            completed: completed,
            user_id: userId
        }))
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

// const usersList = [
//   {
//     id: 1,
//     name: "Jan Konieczny",
//     email: "jan.konieczny@wonet.pl",
//     login: "jkonieczny",
//   },
//   {
//     id: 2,
//     name: "Anna Wesołowska",
//     email: "anna.w@sad.gov.pl",
//     login: "anna.wesolowska",
//   },
//   {
//     id: 3,
//     name: "Piotr Waleczny",
//     email: "piotr.waleczny@gp.pl",
//     login: "p.waleczny",
//   },
// ];
// const todosList = [
//   { id: 1, title: "Naprawić samochód", completed: false, user_id: 3 },
//   { id: 2, title: "Posprzątać garaż", completed: true, user_id: 3 },
//   { id: 3, title: "Napisać e-mail", completed: false, user_id: 3 },
//   { id: 4, title: "Odebrać buty", completed: false, user_id: 2 },
//   { id: 5, title: "Wysłać paczkę", completed: true, user_id: 2 },
//   { id: 6, title: "Zamówic kuriera", completed: false, user_id: 3 },
// ];

const { createServer } = require("@graphql-yoga/node");
// Provide your schema
const server = createServer({
  schema: {
    typeDefs: `type Query {
        todos: [ToDoItem!]
        todo(id: ID!): ToDoItem
        users: [User!]
        user(id: ID!): User
    }
    
    type ToDoItem {
        id: ID!
        title: String!
        completed: Boolean!
        user: User!
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
        login: String!
        todos: [ToDoItem!]!
    }`,
    resolvers: {
      Query: {
        users: async () => getRestUsersList(),
        todos: async () => getRestTodosList(),
        todo: async (parent, args, context, info) =>
          await todoById(parent, args, context, info),
        user: async (parent, args, context, info) =>
          await userById(parent, args, context, info),
      },
      User: {
        todos: async (parent, args, context, info) =>
            await getRestTodoItemByUserId(parent.id),
      },
      ToDoItem: {
        user: async (parent, args, context, info) =>
            await getRestUserById(parent.user_id),
      },
    },
  },
});

async function todoById(parent, args, context, info) {
  return await getRestTodoItemById(args.id);
}
async function userById(parent, args, context, info) {
  return await getRestUserById(args.id)
}
// Start the server and explore http://localhost:4000/graphql
server.start();
