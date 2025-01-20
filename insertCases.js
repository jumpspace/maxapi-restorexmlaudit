// insertCase.js
const fs = require('fs');
const token = require('./token');

console.log("Re-Insertion: Cases");

// Cycle through all available files
let minfile = 1; // Min = 1; 
let maxfile = 4; // Max = 100; 

/* for (var i = minfile; i <= maxfile; i++) {
    var filename = "abEntryCases/abEntryCase" + i + ".json";
    parseCase(filename);
} */

// parseCase("abEntryCases/abEntryCase1.json");
// parseCase("abEntryCases/abEntryCase2.json");
// parseCase("abEntryCases/abEntryCase3.json");
parseCase("abEntryCases/abEntryCase4.json");

function parseCase(filename) {
	fs.readFile(filename, (error, data) => {
		if (error) console.log(error);
		let rawdata = JSON.parse(data);
		
		// field assignments
		let fieldDescription = rawdata.O.Description[0];
		let fieldRecordType = rawdata.O.Record_Type[0];
		let fieldCaseNumber = rawdata.O.Case_Number[0];
		let fieldStatus = rawdata.O.Status[0];
		let fieldPriority = rawdata.O.Priority[0];
		let fieldSeverity = rawdata.O.Severity[0];
		let fieldFee = rawdata.O.Fee[0];
		let fieldBillRate = rawdata.O.BillRate[0];
		let fieldBillableTime = rawdata.O.BillableTime[0];
		let fieldCreateDate = rawdata.O.Create_Date[0];
		let fieldLmd = rawdata.O.Last_Modify_Date[0];
		let fieldPrivate = rawdata.O.Private[0];
		let fieldSubject = rawdata.O.Subject[0];
		let fieldFeeType = rawdata.O.Fee_Type[0];
		let fieldContactId = rawdata.O.Contact_Id[0];
		let fieldReason = rawdata.O.Reason[0];
		let fieldSequenceNum = rawdata.O.Sequence_Number[0];
		let fieldSolutionId = rawdata.O.Solution_Id[0];
		let fieldCreatorId = rawdata.O.Creator_Id[0];
		let fieldArticleNum = rawdata.O.Article_Number[0];
		let fieldCaseResolvedDate = rawdata.O.Case_Resolved_Date[0];
		let fieldClientId = rawdata.O.Client_Id[0];
		let fieldRecordId = rawdata.O.Record_Id[0];
		let fieldAssignedToId = rawdata.O.Assigned_To_Id[0];
		let fieldClass = rawdata.O.Class[0];
		let fieldOwnerId = rawdata.O.Owner_Id[0];
		let fieldContactNumber = rawdata.O.Contact_Number[0];
		let fieldArea = rawdata.O.Area[0];
		let fieldDeadlineDate = rawdata.O.Deadline_Date[0];
		let fieldNotifyFlag = rawdata.O.Notify_Flag[0];
		let fieldCaseId = rawdata.O.Case_Id[0];
		let fieldSolutionNum = rawdata.O.Solution_Number[0];
		let fieldCaseOwnerId = rawdata.O.Case_Owner_Id[0];
		let fieldOrigin = rawdata.O.Origin[0];
		let fieldDataMachineId = rawdata.O.Data_Machine_Id[0];
		let fieldQueue = rawdata.O.Queue[0];
		let fieldModifiedById = rawdata.O.Modified_By_Id[0];
		let fieldType = rawdata.O.Type[0];
		let fieldCaseResolvedBy = rawdata.O.Case_Resolved_By[0];
		let fieldClientNum = rawdata.O.Client_Number[0];
		
		
		// parseInt(new Number(fieldNumericCol).toFixed(0));
		// Account for JSON null fields :: { "$" { "xsi:nil": "true" } }
		let description = (typeof fieldDescription === 'object') ? "" : fieldDescription;
		let recordType = (typeof fieldRecordType === 'object') ? 0 : parseInt(new Number(fieldRecordType).toFixed(0));
		let caseNumber = (typeof fieldCaseNumber === 'object') ? "" : fieldCaseNumber;
		let caseStatus = (typeof fieldStatus === 'object') ? "" : fieldStatus;
		let priority = (typeof fieldPriority === 'object') ? 0 : parseInt(new Number(fieldPriority).toFixed(0));
		let severity = (typeof fieldSeverity === 'object') ? 0 : parseInt(new Number(fieldSeverity).toFixed(0));
		let fee = (typeof fieldFee === 'object') ? 0 : parseInt(new Number(fieldFee).toFixed(2));
		let billRate = (typeof fieldBillRate === 'object') ? 0 : parseInt(new Number(fieldBillRate).toFixed(2));
		let billableTime = (typeof fieldBillableTime === 'object') ? 0: parseInt(new Number(fieldBillableTime).toFixed(2));
		let createDate = (typeof fieldCreateDate === 'object') ? "1900-01-01" : fieldCreateDate.substr(0, 10);
		let lmd = (typeof fieldLmd === 'object') ? '1900-01-01' : fieldLmd.substr(0, 10);
		let secPrivate = (typeof fieldPrivate === 'object') ? 0 : parseInt(new Number(fieldPrivate).toFixed(0));
		let subject = (typeof fieldSubject === 'object') ? "" : fieldSubject;
		let feeType = (typeof fieldFeeType === 'object') ? 0 : parseInt(new Number(fieldFeeType).toFixed(0));
		let ContactId = (typeof fieldContactId === 'object') ? "" : fieldContactId;
		let reason = (typeof fieldReason === 'object') ? "" : fieldReason;
		let sequenceNum = (typeof fieldSequenceNum === 'object') ? 0 : parseInt(new Number(fieldSequenceNum).toFixed(0));
		let solutionId = (typeof fieldSolutionId === 'object') ? "" : fieldSolutionId;
		let creatorId = (typeof fieldCreatorId === 'object') ? "" : fieldCreatorId;
		let articleNum = (typeof fieldArticleNum == 'object') ? "" : fieldArticleNum;
		let caseResolvedDate = (typeof fieldCaseResolvedDate === 'object') ? "1900-01-01" : fieldCaseResolvedDate.substr(0, 10);
		let oldClientId = (typeof fieldClientId === 'object') ? "" : fieldClientId;
		let recordId = (typeof fieldRecordId === 'object') ? 0 : parseInt(new Number(fieldRecordId).toFixed(0));
		let assignedToId = (typeof fieldAssignedToId === 'object') ? "" : fieldAssignedToId;
		let caseClass = (typeof fieldClass === 'object') ? 0 : parseInt(new Number(fieldClass).toFixed(0));
		let ownerId = (typeof fieldOwnerId === 'object') ? "" : fieldOwnerId;
		let contactNumber = (typeof fieldContactNumber === 'object') ? 0 : parseInt(new Number(fieldContactNumber).toFixed(0));
		let caseArea = (typeof fieldArea === 'object') ? 0 : parseInt(new Number(fieldArea).toFixed(0));
		let deadlineDate = (typeof fieldDeadlineDate === 'object') ? "1900-01-01" : fieldDeadlineDate.substr(0, 10);
		let notifyFlag = (typeof fieldNotifyFlag === 'object') ? 0 : parseInt(new Number(fieldNotifyFlag).toFixed(0));
		let caseId = (typeof fieldCaseId === 'object') ? "" : fieldCaseId;
		let solutionNum = (typeof fieldSolutionNum === 'object') ? 0 : parseInt(new Number(fieldSolutionNum).toFixed(0));
		let caseOwnerId = (typeof fieldCaseOwnerId === 'object') ? "" : fieldCaseOwnerId;
		let Origin = (typeof fieldOrigin === 'object') ? 0 : parseInt(new Number(fieldOrigin).toFixed(0));
		let dataMachineId = (typeof fieldDataMachineId === 'object') ? 0 : parseInt(new Number(fieldDataMachineId).toFixed(0));
		let queue = (typeof fieldQueue === 'object') ? "" : fieldQueue;
		let modifiedById = (typeof fieldModifiedById === 'object') ? "" : fieldModifiedById;
		let type = (typeof fieldType === 'object') ? "" : fieldType;
		let caseResolvedBy = (typeof fieldCaseResolvedBy === 'object') ? "" : fieldCaseResolvedBy;
		let clientNum = (typeof fieldClientNum === 'object') ? 0 : parseInt(new Number(fieldClientNum).toFixed(0));
		let creatorIdKey = "";
		let caseOwnerIdKey = "";
		let modifiedByIdKey = "";
		let ownerIdKey = "";
		let caseResolvedByKey = "";
		let assignedToIdKey = "";
		let defaultIdKey = "";
		
		const csCase = {
			description,
			recordType,
			caseNumber,
			caseStatus,
			priority,
			severity,
			fee,
			billRate,
			billableTime,
			createDate,
			lmd,
			secPrivate,
			subject,
			feeType,
			ContactId,
			reason,
			sequenceNum,
			solutionId,
			creatorId,
			articleNum,
			caseResolvedDate,
			oldClientId,
			recordId,
			assignedToId,
			caseClass,
			ownerId,
			contactNumber,
			caseArea,
			deadlineDate,
			notifyFlag,
			caseId,
			solutionNum,
			caseOwnerId,
			Origin,
			dataMachineId, 
			queue,
			modifiedById,
			type,
			caseResolvedBy,
			clientNum,
			creatorIdKey,
			modifiedByIdKey,
			ownerIdKey,
			caseOwnerIdKey,
			caseResolvedByKey,
			assignedToIdKey,
			defaultIdKey
		};
		
		console.log(csCase);
		let masterKey = findUser("MASTER");
		findAbEntry(filename, masterKey, csCase);
		
	});
}

function findAbEntry(filename, userKey, csCase) {
	console.log("Searching for existing entry. . .");
	// let token = "";
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
									"$EQ": csCase.oldClientId
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
					updateCaseFields(userKey, csCase);
					createCase(data.AbEntry.Data[0].Key, csCase);
				} else {
					console.log(csCase.oldClientId + ": Individual does not exist.");
				}
			} else {
				console.log(data.Msg[0].Message);
			}
		});
}

function createCase(parentKey, csCase) {
	console.log("Creating CS case entry. . ." + csCase.caseId);
	// let token = "";
	let baseurl = "https://api.maximizer.com/octopus";
	let caseCreate = `${baseurl}/Create`;
	let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
	let request = {
		"Case": {
			"Data": {
				"Key": null,
				"CaseNumber": csCase.caseNumber,
				"Subject": csCase.subject,
				"Description": (csCase.description  + " - " + csCase.caseId),
				"AbEntryKey": parentKey,
				"ContactKey": null,
				"AssignedTo": csCase.assignedToIdKey,
				"Priority": csCase.priority,
				"Severity": csCase.severity,
				"ResolvedDate": csCase.caseResolvedDate,
				"ResolvedBy": csCase.caseResolvedByKey,
				"Owner": csCase.caseOwnerIdKey,
				"FollowUpDate": csCase.deadlineDate,
				"Overdue": false,
				"LastModifyDate": csCase.lmd,
				"ModifiedBy": csCase.modifiedByIdKey,
				"CreationDate": csCase.createDate,
				"Creator": csCase.creatorIdKey,
				"SecStatus": {
					"CanCreate": true,
					"CanRead": true,
					"CanUpdate": true,
					"CanDelete": true
				},
				"Type": csCase.type,
				"Origin": null,
				"Category": null,
				"Product": null,
				"Queue": csCase.queue,
				"Status": csCase.caseStatus
			}
		}
	};

	fetch(caseCreate, { method: "POST", body: JSON.stringify(request), headers: connectHeaders })
		.then((response) => response.json())
		.then((data) => {
			if (data.Code >= 0) {
				console.log(data);
			} else {
				console.log(data.Msg[0].Message);
			}
		});
}

function updateCaseFields(userKey, csCase) {
	csCase.creatorIdKey = (csCase.creatorId == "") ? userKey : findUser(csCase.creatorId);
	if (csCase.creatorIdKey == "") { csCase.creatorIdKey = userKey; }
	csCase.modifiedByIdKey = (csCase.modifiedById == "") ? userKey : findUser(csCase.modifiedById);
	if (csCase.modifiedByIdKey == "") { csCase.modifiedByIdKey = userKey; }
	csCase.ownerIdKey = (csCase.ownerId == "") ? userKey : findUser(csCase.ownerId);
	if (csCase.ownerIdKey == "") { csCase.ownerIdKey = userKey; }
	csCase.caseOwnerIdKey = (csCase.caseOwnerId == "") ? userKey : findUser(csCase.caseOwnerId);
	if (csCase.caseOwnerIdKey == "") { csCase.caseOwnerIdKey = userKey; }
	csCase.caseResolvedByKey = (csCase.caseResolvedBy == "") ? userKey : findUser(csCase.caseResolvedBy);
	if (csCase.caseResolvedByKey == "") { csCase.caseResolvedByKey = userKey; }
	csCase.assignedToIdKey = (csCase.assignedToId == "") ? userKey : findUser(csCase.assignedToId);
	if (csCase.assignedToIdKey == "") { csCase.assignedToIdKey = userKey; }
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

/*
*/