# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateNewNote, useGetNotesInNotebook, useShareNoteWithUser, useListAvailableTags } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateNewNote(createNewNoteVars);

const { data, isPending, isSuccess, isError, error } = useGetNotesInNotebook(getNotesInNotebookVars);

const { data, isPending, isSuccess, isError, error } = useShareNoteWithUser(shareNoteWithUserVars);

const { data, isPending, isSuccess, isError, error } = useListAvailableTags();

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createNewNote, getNotesInNotebook, shareNoteWithUser, listAvailableTags } from '@dataconnect/generated';


// Operation CreateNewNote:  For variables, look at type CreateNewNoteVars in ../index.d.ts
const { data } = await CreateNewNote(dataConnect, createNewNoteVars);

// Operation GetNotesInNotebook:  For variables, look at type GetNotesInNotebookVars in ../index.d.ts
const { data } = await GetNotesInNotebook(dataConnect, getNotesInNotebookVars);

// Operation ShareNoteWithUser:  For variables, look at type ShareNoteWithUserVars in ../index.d.ts
const { data } = await ShareNoteWithUser(dataConnect, shareNoteWithUserVars);

// Operation ListAvailableTags: 
const { data } = await ListAvailableTags(dataConnect);


```