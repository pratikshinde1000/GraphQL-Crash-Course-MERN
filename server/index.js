const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const startServer = async () => {
    const app = express();
    const PORT = 4200;
    const server = new ApolloServer({
        typeDefs: `

            type User{
                id: ID!
                firstname: String
                lastName: String
                age: String!
                username: String!
                phone: String!
                email: String!
                gender: String!
            }

            type Todo {
                id: ID!
                todo: String!
                completed: Boolean!
                user: User
            }
            type Query{
                getTodos: [Todo]
                getUsers: [User]
                getUser(id: ID!): User
                getTodo(id: ID!): Todo
            }
        `,
        resolvers: {
            Todo: {
                user: async (todo) => {
                    // console.log('todo', todo);
                    const response = await axios.get(`https://dummyjson.com/users/${todo.userId}`);
                    return response.data;
                }
            },
            Query: {
                getTodos: async () => {
                    const response = await axios.get('https://dummyjson.com/todos');
                    // console.log('response', response?.data?.todos);
                    return response.data.todos || [];
                },

                getUsers: async() => {
                    const response = await axios.get('https://dummyjson.com/users');
                    // console.log('user', response.data);
                    return response.data.users || [];
                },

                getUser: async(parent, {id}) => {
                    const response = await axios.get(`https://dummyjson.com/users/${id}`);
                    return response.data;
                },

                getTodo: async (parent, {id}) => {
                    const response = await axios.get(`https://dummyjson.com/todos/${id}`);
                    return response.data;
                }


            }
        }
    });

    app.use(bodyParser.json());
    app.use(cors());

    await server.start();
    app.use('/graphql', expressMiddleware(server));

    app.listen(4200, () => console.log(`Express Server Started: ${PORT}`))

}

startServer();

