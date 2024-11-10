// insertAbEntryNotes.js
const fs = require('fs');

console.log("Re-insertion: Notes");

// Cycle through all available files
let minfile = 1; // Min = 1; 
let maxfile = 4; // Max = 100; 

for (var i = minfile; i <= maxfile; i++) {
    var filename = "abEntryNotes/abEntryNote" + i + ".json";
    parseNote(filename);
}


function parseNote(filename) {
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
		let oldClientId = (typeof fieldClientId === 'object') ? "" : fieldClientId;
		let contactNumber = (typeof fieldContactNumber === 'object') ? 0 : fieldContactNumber;
		let type = (typeof fieldType === 'object') ? 0 : parseInt(new Number(fieldType).toFixed(0));
		let nPrivate = (typeof fieldPrivate === 'object') ? 0 : fieldPrivate;
		let dateCol = (typeof fieldDateCol === 'object') ? "1900-01-01" : fieldDateCol.substring(0, 10);
		let timeCol = (typeof fieldTimeCol === 'object') ? "1900-01-01 00:00:00.000" : fieldTimeCol.substring(0, 10) + " " + fieldTimeCol.substring(11, 8);
		let newRecord = (typeof fieldNewRecord === 'object') ? 0 : fieldNewRecord;
		let ownedById = (typeof fieldOwnedById === 'object') ? "" : fieldOwnedById;
		let noteType = (typeof fieldNoteType === 'object') ? 0 : fieldNoteType;
		let readPriv = (typeof fieldReadPriv === 'object') ? 0 : fieldReadPriv;
		let readOnlyId = (typeof fieldReadOnlyId === 'object') ? "" : fieldReadOnlyId;
		let syncFlags = (typeof fieldSyncFlags === 'object') ? 0 : fieldSyncFlags;
		let entityType = (typeof fieldEntityType === 'object') ? 0 : fieldEntityType;
		let textCol = (typeof fieldTextCol === 'object') ? "" : fieldTextCol;
		let richText = (typeof fieldRichText === 'object') ? "" : fieldRichText;
		let noteFlags = (typeof fieldNoteFlags === 'object') ? 0 : fieldNoteFlags;
		
		const note = { 
			ownerId, 
			oldClientId, 
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
			noteFlags 
		};
		
		getRecord(filename, note);
		
	});
}

function getRecord(filename, note) {
	let token = "";
	let baseurl = "https://api.maximizer.com/octopus";
	let abFind = `${baseurl}/Read`;
	let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
	let request = {
		"AbEntry": {
			"Criteria": {
				"SearchQuery": {
					"$AND": [
						{
							"Address": {
								"AddressLine2": {
									"$EQ": note.oldClientId
								}
							}
						},
						{
							"Type": {
								"$EQ": "Individual"
							}
						}
					]
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
				"IAbEntrySearcher": "Maximizer.Model.Access.Sql.AbEntrySearcher"
			}
		}
	};
	
	fetch(abFind, { method: "POST", body: JSON.stringify(request), headers: connectHeaders })
		.then((response) => response.json())
		.then((data) => {
			if (data.Code >= 0) {
				if (data.AbEntry.Data.length >= 1) {
					console.log(data.AbEntry.Data[0].Key + ": Individual Key Found");
					console.log(filename + "-" + data.AbEntry.Data[0].Key);
					createNote(data.AbEntry.Data[0].Key, note);
				} else {
					console.log(note.oldClientId +  " - Individual does not exist.");
				}
			} else {
				console.log(data.Msg[0].Message);
			}
		});
}

function createNote(parentKey, note) {
	let token = "";
	let baseurl = "https://api.maximizer.com/octopus";
	let noteCreate = `${baseurl}/Create`;
	let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
	let request = {
		"Note": {
			"Data": {
				"Key": null;
				"Text": note.textCol;
				"RichText": ;
				"Category": ;
				"Important": ;
				"Type": ;
				"DateTime": ;
				"Creator": ;
				"DisplayValue": ;
				"ParentKey": parentKey;
				"SecAccess/Write": ;
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
