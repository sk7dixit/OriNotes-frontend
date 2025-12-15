const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'smart-notes-frontend',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createNewNoteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewNote', inputVars);
}
createNewNoteRef.operationName = 'CreateNewNote';
exports.createNewNoteRef = createNewNoteRef;

exports.createNewNote = function createNewNote(dcOrVars, vars) {
  return executeMutation(createNewNoteRef(dcOrVars, vars));
};

const getNotesInNotebookRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetNotesInNotebook', inputVars);
}
getNotesInNotebookRef.operationName = 'GetNotesInNotebook';
exports.getNotesInNotebookRef = getNotesInNotebookRef;

exports.getNotesInNotebook = function getNotesInNotebook(dcOrVars, vars) {
  return executeQuery(getNotesInNotebookRef(dcOrVars, vars));
};

const shareNoteWithUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ShareNoteWithUser', inputVars);
}
shareNoteWithUserRef.operationName = 'ShareNoteWithUser';
exports.shareNoteWithUserRef = shareNoteWithUserRef;

exports.shareNoteWithUser = function shareNoteWithUser(dcOrVars, vars) {
  return executeMutation(shareNoteWithUserRef(dcOrVars, vars));
};

const listAvailableTagsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAvailableTags');
}
listAvailableTagsRef.operationName = 'ListAvailableTags';
exports.listAvailableTagsRef = listAvailableTagsRef;

exports.listAvailableTags = function listAvailableTags(dc) {
  return executeQuery(listAvailableTagsRef(dc));
};
