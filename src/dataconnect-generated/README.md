# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetNotesInNotebook*](#getnotesinnotebook)
  - [*ListAvailableTags*](#listavailabletags)
- [**Mutations**](#mutations)
  - [*CreateNewNote*](#createnewnote)
  - [*ShareNoteWithUser*](#sharenotewithuser)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetNotesInNotebook
You can execute the `GetNotesInNotebook` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getNotesInNotebook(vars: GetNotesInNotebookVariables): QueryPromise<GetNotesInNotebookData, GetNotesInNotebookVariables>;

interface GetNotesInNotebookRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetNotesInNotebookVariables): QueryRef<GetNotesInNotebookData, GetNotesInNotebookVariables>;
}
export const getNotesInNotebookRef: GetNotesInNotebookRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getNotesInNotebook(dc: DataConnect, vars: GetNotesInNotebookVariables): QueryPromise<GetNotesInNotebookData, GetNotesInNotebookVariables>;

interface GetNotesInNotebookRef {
  ...
  (dc: DataConnect, vars: GetNotesInNotebookVariables): QueryRef<GetNotesInNotebookData, GetNotesInNotebookVariables>;
}
export const getNotesInNotebookRef: GetNotesInNotebookRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getNotesInNotebookRef:
```typescript
const name = getNotesInNotebookRef.operationName;
console.log(name);
```

### Variables
The `GetNotesInNotebook` query requires an argument of type `GetNotesInNotebookVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetNotesInNotebookVariables {
  notebookId: UUIDString;
}
```
### Return Type
Recall that executing the `GetNotesInNotebook` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetNotesInNotebookData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetNotesInNotebookData {
  notes: ({
    id: UUIDString;
    title: string;
    content: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Note_Key)[];
}
```
### Using `GetNotesInNotebook`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getNotesInNotebook, GetNotesInNotebookVariables } from '@dataconnect/generated';

// The `GetNotesInNotebook` query requires an argument of type `GetNotesInNotebookVariables`:
const getNotesInNotebookVars: GetNotesInNotebookVariables = {
  notebookId: ..., 
};

// Call the `getNotesInNotebook()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getNotesInNotebook(getNotesInNotebookVars);
// Variables can be defined inline as well.
const { data } = await getNotesInNotebook({ notebookId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getNotesInNotebook(dataConnect, getNotesInNotebookVars);

console.log(data.notes);

// Or, you can use the `Promise` API.
getNotesInNotebook(getNotesInNotebookVars).then((response) => {
  const data = response.data;
  console.log(data.notes);
});
```

### Using `GetNotesInNotebook`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getNotesInNotebookRef, GetNotesInNotebookVariables } from '@dataconnect/generated';

// The `GetNotesInNotebook` query requires an argument of type `GetNotesInNotebookVariables`:
const getNotesInNotebookVars: GetNotesInNotebookVariables = {
  notebookId: ..., 
};

// Call the `getNotesInNotebookRef()` function to get a reference to the query.
const ref = getNotesInNotebookRef(getNotesInNotebookVars);
// Variables can be defined inline as well.
const ref = getNotesInNotebookRef({ notebookId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getNotesInNotebookRef(dataConnect, getNotesInNotebookVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.notes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.notes);
});
```

## ListAvailableTags
You can execute the `ListAvailableTags` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAvailableTags(): QueryPromise<ListAvailableTagsData, undefined>;

interface ListAvailableTagsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAvailableTagsData, undefined>;
}
export const listAvailableTagsRef: ListAvailableTagsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAvailableTags(dc: DataConnect): QueryPromise<ListAvailableTagsData, undefined>;

interface ListAvailableTagsRef {
  ...
  (dc: DataConnect): QueryRef<ListAvailableTagsData, undefined>;
}
export const listAvailableTagsRef: ListAvailableTagsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAvailableTagsRef:
```typescript
const name = listAvailableTagsRef.operationName;
console.log(name);
```

### Variables
The `ListAvailableTags` query has no variables.
### Return Type
Recall that executing the `ListAvailableTags` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAvailableTagsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAvailableTagsData {
  tags: ({
    id: UUIDString;
    name: string;
  } & Tag_Key)[];
}
```
### Using `ListAvailableTags`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAvailableTags } from '@dataconnect/generated';


// Call the `listAvailableTags()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAvailableTags();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAvailableTags(dataConnect);

console.log(data.tags);

// Or, you can use the `Promise` API.
listAvailableTags().then((response) => {
  const data = response.data;
  console.log(data.tags);
});
```

### Using `ListAvailableTags`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAvailableTagsRef } from '@dataconnect/generated';


// Call the `listAvailableTagsRef()` function to get a reference to the query.
const ref = listAvailableTagsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAvailableTagsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.tags);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.tags);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewNote
You can execute the `CreateNewNote` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewNote(vars: CreateNewNoteVariables): MutationPromise<CreateNewNoteData, CreateNewNoteVariables>;

interface CreateNewNoteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewNoteVariables): MutationRef<CreateNewNoteData, CreateNewNoteVariables>;
}
export const createNewNoteRef: CreateNewNoteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewNote(dc: DataConnect, vars: CreateNewNoteVariables): MutationPromise<CreateNewNoteData, CreateNewNoteVariables>;

interface CreateNewNoteRef {
  ...
  (dc: DataConnect, vars: CreateNewNoteVariables): MutationRef<CreateNewNoteData, CreateNewNoteVariables>;
}
export const createNewNoteRef: CreateNewNoteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewNoteRef:
```typescript
const name = createNewNoteRef.operationName;
console.log(name);
```

### Variables
The `CreateNewNote` mutation requires an argument of type `CreateNewNoteVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNewNoteVariables {
  notebookId: UUIDString;
  content: string;
  title: string;
}
```
### Return Type
Recall that executing the `CreateNewNote` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewNoteData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewNoteData {
  note_insert: Note_Key;
}
```
### Using `CreateNewNote`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewNote, CreateNewNoteVariables } from '@dataconnect/generated';

// The `CreateNewNote` mutation requires an argument of type `CreateNewNoteVariables`:
const createNewNoteVars: CreateNewNoteVariables = {
  notebookId: ..., 
  content: ..., 
  title: ..., 
};

// Call the `createNewNote()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewNote(createNewNoteVars);
// Variables can be defined inline as well.
const { data } = await createNewNote({ notebookId: ..., content: ..., title: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewNote(dataConnect, createNewNoteVars);

console.log(data.note_insert);

// Or, you can use the `Promise` API.
createNewNote(createNewNoteVars).then((response) => {
  const data = response.data;
  console.log(data.note_insert);
});
```

### Using `CreateNewNote`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewNoteRef, CreateNewNoteVariables } from '@dataconnect/generated';

// The `CreateNewNote` mutation requires an argument of type `CreateNewNoteVariables`:
const createNewNoteVars: CreateNewNoteVariables = {
  notebookId: ..., 
  content: ..., 
  title: ..., 
};

// Call the `createNewNoteRef()` function to get a reference to the mutation.
const ref = createNewNoteRef(createNewNoteVars);
// Variables can be defined inline as well.
const ref = createNewNoteRef({ notebookId: ..., content: ..., title: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewNoteRef(dataConnect, createNewNoteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.note_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.note_insert);
});
```

## ShareNoteWithUser
You can execute the `ShareNoteWithUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
shareNoteWithUser(vars: ShareNoteWithUserVariables): MutationPromise<ShareNoteWithUserData, ShareNoteWithUserVariables>;

interface ShareNoteWithUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ShareNoteWithUserVariables): MutationRef<ShareNoteWithUserData, ShareNoteWithUserVariables>;
}
export const shareNoteWithUserRef: ShareNoteWithUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
shareNoteWithUser(dc: DataConnect, vars: ShareNoteWithUserVariables): MutationPromise<ShareNoteWithUserData, ShareNoteWithUserVariables>;

interface ShareNoteWithUserRef {
  ...
  (dc: DataConnect, vars: ShareNoteWithUserVariables): MutationRef<ShareNoteWithUserData, ShareNoteWithUserVariables>;
}
export const shareNoteWithUserRef: ShareNoteWithUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the shareNoteWithUserRef:
```typescript
const name = shareNoteWithUserRef.operationName;
console.log(name);
```

### Variables
The `ShareNoteWithUser` mutation requires an argument of type `ShareNoteWithUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ShareNoteWithUserVariables {
  noteId: UUIDString;
  sharedWithUserId: UUIDString;
  accessLevel: string;
}
```
### Return Type
Recall that executing the `ShareNoteWithUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ShareNoteWithUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ShareNoteWithUserData {
  sharedNote_insert: SharedNote_Key;
}
```
### Using `ShareNoteWithUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, shareNoteWithUser, ShareNoteWithUserVariables } from '@dataconnect/generated';

// The `ShareNoteWithUser` mutation requires an argument of type `ShareNoteWithUserVariables`:
const shareNoteWithUserVars: ShareNoteWithUserVariables = {
  noteId: ..., 
  sharedWithUserId: ..., 
  accessLevel: ..., 
};

// Call the `shareNoteWithUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await shareNoteWithUser(shareNoteWithUserVars);
// Variables can be defined inline as well.
const { data } = await shareNoteWithUser({ noteId: ..., sharedWithUserId: ..., accessLevel: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await shareNoteWithUser(dataConnect, shareNoteWithUserVars);

console.log(data.sharedNote_insert);

// Or, you can use the `Promise` API.
shareNoteWithUser(shareNoteWithUserVars).then((response) => {
  const data = response.data;
  console.log(data.sharedNote_insert);
});
```

### Using `ShareNoteWithUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, shareNoteWithUserRef, ShareNoteWithUserVariables } from '@dataconnect/generated';

// The `ShareNoteWithUser` mutation requires an argument of type `ShareNoteWithUserVariables`:
const shareNoteWithUserVars: ShareNoteWithUserVariables = {
  noteId: ..., 
  sharedWithUserId: ..., 
  accessLevel: ..., 
};

// Call the `shareNoteWithUserRef()` function to get a reference to the mutation.
const ref = shareNoteWithUserRef(shareNoteWithUserVars);
// Variables can be defined inline as well.
const ref = shareNoteWithUserRef({ noteId: ..., sharedWithUserId: ..., accessLevel: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = shareNoteWithUserRef(dataConnect, shareNoteWithUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sharedNote_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sharedNote_insert);
});
```

