import React from "react"

import { useQuery, gql } from '@apollo/client';


const GET_TODOS = gql`
    query GetTodos {
      getTodos{
        id,
        todo,
        completed,
        user {
          firstname,
          lastName,
          email
        }
      }  
  }
`


function App() {

  const { loading, error, data } = useQuery(GET_TODOS);

  console.log('loading', loading);
  console.log('data', data);
  console.log('error', error);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <>
      {data.getTodos.map(({ id, todo, completed }) => (
        <div key={id}>
          <h3>{todo}</h3>
          <br />
          <b>Status:</b>
          <p>{completed.toString()}</p>
          <br />
        </div>
      ))
      }
    </>
  )
}

export default App
