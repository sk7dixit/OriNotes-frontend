import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateNewNoteData {
  note_insert: Note_Key;
}

export interface CreateNewNoteVariables {
  notebookId: UUIDString;
  content: string;
  title: string;
}

export interface GetNotesInNotebookData {
  notes: ({
    id: UUIDString;
    title: string;
    content: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Note_Key)[];
}

export interface GetNotesInNotebookVariables {
  notebookId: UUIDString;
}

export interface ListAvailableTagsData {
  tags: ({
    id: UUIDString;
    name: string;
  } & Tag_Key)[];
}

export interface NoteTag_Key {
  noteId: UUIDString;
  tagId: UUIDString;
  __typename?: 'NoteTag_Key';
}

export interface Note_Key {
  id: UUIDString;
  __typename?: 'Note_Key';
}

export interface Notebook_Key {
  id: UUIDString;
  __typename?: 'Notebook_Key';
}

export interface ShareNoteWithUserData {
  sharedNote_insert: SharedNote_Key;
}

export interface ShareNoteWithUserVariables {
  noteId: UUIDString;
  sharedWithUserId: UUIDString;
  accessLevel: string;
}

export interface SharedNote_Key {
  noteId: UUIDString;
  sharedWithUserId: UUIDString;
  __typename?: 'SharedNote_Key';
}

export interface Tag_Key {
  id: UUIDString;
  __typename?: 'Tag_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateNewNoteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewNoteVariables): MutationRef<CreateNewNoteData, CreateNewNoteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewNoteVariables): MutationRef<CreateNewNoteData, CreateNewNoteVariables>;
  operationName: string;
}
export const createNewNoteRef: CreateNewNoteRef;

export function createNewNote(vars: CreateNewNoteVariables): MutationPromise<CreateNewNoteData, CreateNewNoteVariables>;
export function createNewNote(dc: DataConnect, vars: CreateNewNoteVariables): MutationPromise<CreateNewNoteData, CreateNewNoteVariables>;

interface GetNotesInNotebookRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetNotesInNotebookVariables): QueryRef<GetNotesInNotebookData, GetNotesInNotebookVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetNotesInNotebookVariables): QueryRef<GetNotesInNotebookData, GetNotesInNotebookVariables>;
  operationName: string;
}
export const getNotesInNotebookRef: GetNotesInNotebookRef;

export function getNotesInNotebook(vars: GetNotesInNotebookVariables): QueryPromise<GetNotesInNotebookData, GetNotesInNotebookVariables>;
export function getNotesInNotebook(dc: DataConnect, vars: GetNotesInNotebookVariables): QueryPromise<GetNotesInNotebookData, GetNotesInNotebookVariables>;

interface ShareNoteWithUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ShareNoteWithUserVariables): MutationRef<ShareNoteWithUserData, ShareNoteWithUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ShareNoteWithUserVariables): MutationRef<ShareNoteWithUserData, ShareNoteWithUserVariables>;
  operationName: string;
}
export const shareNoteWithUserRef: ShareNoteWithUserRef;

export function shareNoteWithUser(vars: ShareNoteWithUserVariables): MutationPromise<ShareNoteWithUserData, ShareNoteWithUserVariables>;
export function shareNoteWithUser(dc: DataConnect, vars: ShareNoteWithUserVariables): MutationPromise<ShareNoteWithUserData, ShareNoteWithUserVariables>;

interface ListAvailableTagsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAvailableTagsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAvailableTagsData, undefined>;
  operationName: string;
}
export const listAvailableTagsRef: ListAvailableTagsRef;

export function listAvailableTags(): QueryPromise<ListAvailableTagsData, undefined>;
export function listAvailableTags(dc: DataConnect): QueryPromise<ListAvailableTagsData, undefined>;

