import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
// import { MdDelete } from "react-icons/md";
// import { Icon } from '@aws-amplify/ui-react';
// import Button from '@mui/material/Button';
import { Button, Grid } from '@mui/material';
import { MdDelete, MdEdit } from 'react-icons/md';
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'


const client = generateClient<Schema>();

function App() {
  const [books, setBooks] = useState<Array<Schema["Books"]["type"]>>([]);

  useEffect(() => {
    client.models.Books.observeQuery().subscribe({
      next: (data) => {
        setBooks([...data.items])
        console.log(data)
      },
      error: (error) => console.warn(error),
    });
  }, []);

  function createBooks() {
    const data = window.prompt("Book Name");
    if(!data) return
    client.models.Books.create({ name: data });

  }

  type Nullable<T> = T | null;
  function updateBooks(id: string, currentName?: Nullable<string>) {
    const name = window.prompt("Book Name", currentName || "");
    if(!name) return
    client.models.Books.update({ id, name });
  }

    
  function deleteBooks(id: string) {
    client.models.Books.delete({ id })
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
    <main>
      <h1>{user?.signInDetails?.loginId}'s books</h1>
      <button onClick={createBooks}>+ new</button><ul style={{ padding: 0, listStyle: 'none' }}>
      {books.map((book) => (
        <Grid 
          container 
          key={book.id} 
          alignItems="center" 
          justifyContent="space-between" 
          spacing={2} 
          style={{ marginBottom: '10px' }}
        >
          <Grid item>
            <Button variant="contained" color="primary" 
            onClick={() => updateBooks(book.id , book.name)}
            >
              <MdEdit size={20} />
            </Button>
          </Grid>
          <Grid item xs style={{ textAlign: 'center' }}>
            <li>{book.name}</li>
          </Grid>
          <Grid item>
            <Button variant="contained" color="error" onClick={() => deleteBooks(book.id)}>
              <MdDelete size={20} />
            </Button>
          </Grid>
        </Grid>
      ))}
    </ul>
      <button onClick={signOut}>Sign out</button>
    </main>
    )}
    </Authenticator>
  );
}

export default App;
