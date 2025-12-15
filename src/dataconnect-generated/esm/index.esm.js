import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'smart-notes-frontend',
  location: 'us-east4'
};

export const createNewNoteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewNote', inputVars);
}
createNewNoteRef.operationName = 'CreateNewNote';

export function createNewNote(dcOrVars, vars) {
  return executeMutation(createNewNoteRef(dcOrVars, vars));
}

export const getNotesInNotebookRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetNotesInNotebook', inputVars);
}
getNotesInNotebookRef.operationName = 'GetNotesInNotebook';

export function getNotesInNotebook(dcOrVars, vars) {
  return executeQuery(getNotesInNotebookRef(dcOrVars, vars));
}

export const shareNoteWithUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ShareNoteWithUser', inputVars);
}
shareNoteWithUserRef.operationName = 'ShareNoteWithUser';

export function shareNoteWithUser(dcOrVars, vars) {
  return executeMutation(shareNoteWithUserRef(dcOrVars, vars));
}

export const listAvailableTagsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAvailableTags');
}
listAvailableTagsRef.operationName = 'ListAvailableTags';

export function listAvailableTags(dc) {
  return executeQuery(listAvailableTagsRef(dc));
}

