const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.onDocumentCreate = functions.firestore
    .document('/portfolio/{docId}')
    .onCreate((snap, context) => {
        console.log(`Um novo documento foi criado com o ID: ${context.params.docId}`);
        return null; // É importante retornar um valor ou uma promessa
    });