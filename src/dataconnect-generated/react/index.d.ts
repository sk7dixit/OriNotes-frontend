import { CreateNewNoteData, CreateNewNoteVariables, GetNotesInNotebookData, GetNotesInNotebookVariables, ShareNoteWithUserData, ShareNoteWithUserVariables, ListAvailableTagsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateNewNote(options?: useDataConnectMutationOptions<CreateNewNoteData, FirebaseError, CreateNewNoteVariables>): UseDataConnectMutationResult<CreateNewNoteData, CreateNewNoteVariables>;
export function useCreateNewNote(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewNoteData, FirebaseError, CreateNewNoteVariables>): UseDataConnectMutationResult<CreateNewNoteData, CreateNewNoteVariables>;

export function useGetNotesInNotebook(vars: GetNotesInNotebookVariables, options?: useDataConnectQueryOptions<GetNotesInNotebookData>): UseDataConnectQueryResult<GetNotesInNotebookData, GetNotesInNotebookVariables>;
export function useGetNotesInNotebook(dc: DataConnect, vars: GetNotesInNotebookVariables, options?: useDataConnectQueryOptions<GetNotesInNotebookData>): UseDataConnectQueryResult<GetNotesInNotebookData, GetNotesInNotebookVariables>;

export function useShareNoteWithUser(options?: useDataConnectMutationOptions<ShareNoteWithUserData, FirebaseError, ShareNoteWithUserVariables>): UseDataConnectMutationResult<ShareNoteWithUserData, ShareNoteWithUserVariables>;
export function useShareNoteWithUser(dc: DataConnect, options?: useDataConnectMutationOptions<ShareNoteWithUserData, FirebaseError, ShareNoteWithUserVariables>): UseDataConnectMutationResult<ShareNoteWithUserData, ShareNoteWithUserVariables>;

export function useListAvailableTags(options?: useDataConnectQueryOptions<ListAvailableTagsData>): UseDataConnectQueryResult<ListAvailableTagsData, undefined>;
export function useListAvailableTags(dc: DataConnect, options?: useDataConnectQueryOptions<ListAvailableTagsData>): UseDataConnectQueryResult<ListAvailableTagsData, undefined>;
