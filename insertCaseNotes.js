 // insertNotes.js
const fs = require('fs');
const token = require('./token');

console.log("Re-insertion: Case Notes");

// Cycle through all available files
let minfile = 1; // Min = 1; 
let maxfile = 4; // Max = 100; 

for (var i = minfile; i <= maxfile; i++) {
    var filename = "abEntryCaseNotes/abEntryCaseNote" + i + ".json";
    parseNote(filename);
}


function parseCaseNote(filename) {
	fs.readFile(filename, (error, data) => {
		if (error) console.log(error);
		let rawdata = JSON.parse(data);
		
		// field assignments
		let fieldOwnerId = rawdata.O.Owner_Id[0];
		let fieldClientId = rawdata.O.Client_Id[0];
		let fieldContactNumber = rawdata.O.Contact_Number[0];
		let fieldType = rawdata.O.Type[0];
		let fieldPrivate = rawdata.O.Private[0];
		let fieldDateCol = rawdata.O.DateCol[0];
		let fieldTimeCol = rawdata.O.TimeCol[0];
		let fieldNewRecord = rawdata.O.NewRecord[0];
		let fieldOwnedById = rawdata.O.Owned_By_Id[0];
		let fieldNoteType = rawdata.O.Note_Type[0];
		let fieldReadPriv = rawdata.O.ReadPriv[0];
		let fieldReadOnlyId = rawdata.O.Read_Only_Id[0];
		let fieldSyncFlags = rawdata.O.SyncFlags[0];
		let fieldEntityType = rawdata.O.Entity_Type[0];
		let fieldTextCol = rawdata.O.TextCol[0];
		let fieldRichText = rawdata.O.RichText[0];
		let fieldNoteFlags = rawdata.O.NoteFlags[0];
		
		let ownerId = (typeof fieldOwnerId === 'object') ? "" : fieldOwnerId;
		let oldCaseId = (typeof fieldClientId === 'object') ? "" : fieldClientId;
		let contactNumber = (typeof fieldContactNumber === 'object') ? 0 : fieldContactNumber;
		let type = (typeof fieldType === 'object') ? 0 : parseInt(new Number(fieldType).toFixed(0));
		let nPrivate = (typeof fieldPrivate === 'object') ? 0 : fieldPrivate;
		let dateCol = (typeof fieldDateCol === 'object') ? "1900-01-01" : fieldDateCol.substring(0, 10);
		let timeCol = (typeof fieldTimeCol === 'object') ? "1900-01-01 00:00:00.000" : fieldTimeCol.substring(0, 10) + " " + fieldTimeCol.substring(11, 8);
		let newRecord = (typeof fieldNewRecord === 'object') ? 0 : fieldNewRecord;
		let ownedById = (typeof fieldOwnedById === 'object') ? "" : fieldOwnedById;
		let noteType = (typeof fieldNoteType === 'object') ? "" : fieldNoteType;
		let readPriv = (typeof fieldReadPriv === 'object') ? 0 : fieldReadPriv;
		let readOnlyId = (typeof fieldReadOnlyId === 'object') ? "" : fieldReadOnlyId;
		let syncFlags = (typeof fieldSyncFlags === 'object') ? 0 : fieldSyncFlags;
		let entityType = (typeof fieldEntityType === 'object') ? 0 : fieldEntityType;
		let textCol = (typeof fieldTextCol === 'object') ? "" : fieldTextCol;
		let richText = (typeof fieldRichText === 'object') ? "" : fieldRichText;
		let noteFlags = (typeof fieldNoteFlags === 'object') ? 0 : fieldNoteFlags;
		let ownerIdKey = "";
		let ownedByIdKey = "";
		let readOnlyIdKey = "";
		
		const note = { 
			ownerId, 
			oldCaseId, 
			contactNumber, 
			type, 
			nPrivate, 
			dateCol, 
			timeCol, 
			newRecord, 
			ownedById, 
			noteType, 
			readPriv, 
			readOnlyId, 
			syncFlags, 
			entityType, 
			textCol, 
			richText, 
			noteFlags, 
			ownerIdKey, 
			ownedByIdKey, 
			readOnlyIdKey 
		};
		
		console.log(note);
		let masterKey = "MASTER";
		getRecord(filename, masterKey, note);
	});
}

function getRecord(filename, userKey, note) {
	// let token = "";
	let baseurl = "https://api.maximizer.com/octopus";
	let caseFind = `${baseurl}/Read`;
	let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
	let request = {
		"Case": {
			"Criteria": {
				"SearchQuery": {
					"Description": {
						"$LIKE": note.oldCaseId 
					}
				}
			},
			"Scope": {
				"Fields": {
					"Key": 1
				}
			}
		},
		"Configuration": {
			"Drivers": {
				"ICaseSearcher": "Maximizer.Model.Access.Sql.CaseSearcher"
			}
		}
	};
	
	fetch(caseFind, { method: "POST", body: JSON.stringify(request), headers: connectHeaders })
		.then((response) => response.json())
		.then((data) => {
			if (data.Code >= 0) {
				if (data.Case.Data.length >= 1) {
					console.log(data.Case.Data[0].Key + ": Case Key Found");
					console.log(filename + "-" + data.Case.Data[0].Key);
					updateNoteFields(userKey, note);
					createNote(data.Case.Data[0].Key, note);
				} else {
					console.log(note.oldCaseId +  " - Case does not exist.");
				}
			} else {
				console.log(data.Msg[0].Message);
			}
		});
}

function createNote(parentKey, note) {
	// let token = "";
	let baseurl = "https://api.maximizer.com/octopus";
	let noteCreate = `${baseurl}/Create`;
	let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
	let request = {
		"Note": {
			"Data": {
				"Key": null;
				"Text": note.textCol;
				"Category": note.noteType;
				"Important": false;
				"Type": note.type;
				"DateTime": note.dateCol;
				"Creator": note.ownerId;
				"ParentKey": parentKey;
				"SecAccess/Write": note.ownedByIdKey;
				"SecAccess/Read": note.readOnlyIdKey;
			}
		}
	};
	
	fetch(noteCreate, { method: "POST", body: JSON.stringify(request), headers: connectHeaders })
		.then((response) => response.json())
		.then((data) => {
			if (data.Code >= 0) {
				console.log(data);
			} else {
				console.log(data.Msg[0].Message);
			}
		});
}

function updateNoteFields(userKey, note) {
	ownerIdKey = (note.ownerId == "") ? userKey : findUser(note.ownerId);
	if (ownerIdKey == "") { note.ownerIdKey = userKey; }
	ownedByIdKey = (note.ownedById == "") ? userKey : findUser(ntoe.ownedById);
	if (ownedByIdKey == "") { note.ownedByIdKey = userKey; }
	readOnlyIdKey = (note.readOnlyId == "") ? userKey : findUser(note.readOnlyId);
	if (readOnlyIdKey == "") { note.readOnlyIdKey = userKey; }
}

function findUser(userId) {
	console.log("Searching for user. . .");
	// let token = "";
	let baseurl = "https://api.maximizer.com/octopus";
	let userFind = `${baseurl}/Read`;
	let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
	let request = {
		"User": {
			"Criteria": {
				"SearchQuery": {
					"Key": {
						"$EQ": {
							"Uid": userId
						}
					}
				}
			},
			"Scope": {
				"Fields": {
					"Key": 1
				}
			}
		},
		"Configuration": {
			"Drivers": {
				"IUserSearcher": "Maximizer.Model.Access.Sql.UserSearcher"
			}
		}
	};
	
	fetch(userFind, { method: "POST", body: JSON.stringify(request), headers: connectHeaders })
		.then((response) => response.json())
		.then((data) => {
			if (data.Code >= 0) {
				if (data.User.Data.length >= 1) {
					console.log(userId + " - " + data.User.Data[0].Key);
					return data.User.Data[0].Key;
				} else {
					console.log(userId + " - No user ID supplied or does not exist in database.");
					return "";
				}
			} else {
				console.log(data);
				console.log(data.Msg[0].Message);
				return "";
			}
		});
	
}