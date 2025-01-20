// insertCaseFields.js
const fs = require('fs');
const token = require('./token');

console.log("Re-insertion: Case UDFs");

// Cycle through all available files
let minfile = 1; // Min = 1; 
let maxfile = 19; // Max = 100; 

 for (var i = minfile; i <= maxfile; i++) {
    var filename = "abEntryCaseUdfs/abEntryCaseUdf" + i + ".json";
    parseField(filename);
}

// parseField("abEntryCaseUdfs/abEntryCaseUdf1.json")

function parseField(filename) {
    fs.readFile(filename, (error, data) => {
        if (error) console.log(error);
        rawdata = JSON.parse(data);

        // Field assignments
        let fieldAlphanumCol = rawdata.O.AlphaNumericCol[0];
        let fieldOldClientId = rawdata.O.Client_Id[0];
        let fieldCodeId = rawdata.O.Code_Id[0];
        let fieldContactNum = rawdata.O.Contact_Number[0];
        let fieldCreationDate = rawdata.O.Create_Date[0];
        let fieldCreator = rawdata.O.Creator_Id[0];
        let fieldDateCol = rawdata.O.DateCol[0];
        let fieldLmd = rawdata.O.Last_Modify_Date[0];
        let fieldModifiedBy = rawdata.O.Modified_By_Id[0];
        let fieldNumericCol = rawdata.O.NumericCol[0];
        let fieldTypeId = rawdata.O.Type_Id[0];
		let fieldMmddDate = rawdata.O.mmddDate[0];
        
		// account for null values ({"$": {"xsi:nil": "true"}})
        let alphanumCol = (typeof fieldAlphanumCol === "object") ? "" : fieldAlphanumCol;
		let oldClientId = (typeof fieldOldClientId === 'object') ? "" : fieldOldClientId;
		let codeId = (typeof fieldCodeId === 'object') ? 0 : parseInt(new Number(fieldCodeId).toFixed(0));
		let contactNum = (typeof fieldContactNum === 'object') ? 0 : parseInt(new Number(fieldContactNum).toFixed(0));
		let creationDate = (typeof fieldCreationDate === 'object') ? "1900-01-01" : fieldCreationDate;
		let creator = (typeof fieldCreator === 'object') ? "" : fieldCreator;
		let dateCol = (typeof fieldDateCol === "object") ? "1900-01-01" : fieldDateCol.substr(0, 10);
		let numericCol = (typeof fieldNumericCol === "object") ? 0 : parseInt(new Number(fieldNumericCol).toFixed(0));
		let lmd = (typeof fieldLmd === 'object') ? "1900-01-01" : fieldLmd.substr(0, 10);
		let modifiedBy = (typeof fieldModifiedBy === 'object') ? "1900-01-01" : fieldModifiedBy.substr(0, 10);
		let typeId = (typeof fieldTypeId === 'object') ? "" : fieldTypeId;
		let mmddDate = (typeof fieldMmddDate === "object") ? "1900-01-01": fieldMmddDate.substr(0, 10);
		
		
        const caseField = {
            alphanumCol,
            oldClientId,
            codeId,
            contactNum,
            creationDate,
            creator,
            dateCol,
            lmd,
            modifiedBy,
            numericCol,
            typeId,
			contactNum,
			mmddDate
        };

        getRecord(caseField);
    });
}

function getRecord(caseField) {
    // let token = "";
    let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
    let baseurl = "https://api.maximizer.com/octopus";
    let request = {
		"Case": {
			"Criteria": {
				"SearchQuery": {
					"Description": {
						"$LIKE": "%" + caseField.oldClientId
					}
				}
			},
			"Scope": {
				"Fields": {
					"Key": 1,
					"Subject": 1,
					"Description": 1
				}
			}
		},
		"Configuration": {
			"Drivers": {
				"ICaseSearcher": "Maximizer.Model.Access.Sql.CaseSearcher"
			}
		}
	};
	
	//let abList = new Map();
    let caseRead = `${baseurl}/Read`;
    fetch(caseRead, { method: "POST", body: JSON.stringify(request), headers: connectHeaders })
        .then((response) => response.json())
        .then((data) => {
            if (data.Code >= 0) {
                if (data.Case.Data.length < 1) {
					console.log(caseField.oldClientId + " - No records with this search key");
				} else {
					// data.AbEntry.Data.length >= 1
					console.log(caseField.oldClientId + " - Found record");
					getUdfFromCaseEntry(caseField, data.Case.Data[0].Key);
				}
				//console.log(data);
            } else {
                console.log(caseField.oldClientId + "-" + data.Msg[0].Message);
            }
        });
}

function getUdfFromCaseEntry(caseField, parentKey) {
    // let token = "";
    let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
	let baseurl = "https://api.maximizer.com/octopus";
    let caseEntryUdfRead = `${baseurl}/Read`;
	let searchKey = (caseField.typeId == 60028) ? "/Case/Product" : ((caseField.typeId == 60025) ? "/Case/Category" : "/Case/Udf/$TYPEID(" + caseField.typeId + ")") ;
	let request = {
		"Schema": {
			"Criteria": {
				"SearchQuery": {
					"Key": {
						"$EQ": searchKey
					}
				}
			},
			"Scope": {
				"Fields": {
					"Key": 1,
					"AppliesTo": 1,
					"Type": 1,
					"Name": 1,
					"Attributes": 1
				}
			}
		},
		"Compatibility": {
			"SchemaObject": "1.0"
		}
	};
	
	fetch(caseEntryUdfRead, { method: "POST", body: JSON.stringify(request), headers: connectHeaders })
		.then((response) => response.json())
		.then((data) => {
			if (data.Code >= 0) {
				let partialResult = data.Schema.Data;
				if (partialResult.length != 0) {
					let udfType = data.Schema.Data[0].Type;
					let isMultiSelect = "";
				
					if (udfType == "EnumField<StringItem>") {
						isMultiSelect = data.Schema.Data[0].Attributes.MultiSelect;
					} else {
						isMultiSelect = "";
					}
					checkUdfType(caseField, parentKey, udfType, isMultiSelect);
				} else {
					console.log(caseField.oldClientId + " - Type ID " + caseField.typeId + "- no Type found");
				}
			} else {
				console.log(data.Msg[0].Message);
			}
		});
}

function checkUdfType(caseField, parentKey, udfType, isMulti) {
    let udfId = (caseField.typeId == 60028) ? "/Case/Product" : ((caseField.typeId == 60025) ? "/Case/Category" : "/Case/Udf/$TYPEID(" +  caseField.typeId + ")");
	switch (udfType) {
		case "DateTimeField": 	
			let requestDate = { "Case": { "Data": { "Key": parentKey, [udfId]: caseField.dateCol } } };
			console.log("Date Field:" + caseField.dateCol);
            updateFields(caseField, requestDate);
			break;
		case "StringField":
			let requestText = { "Case": { "Data": { "Key": parentKey, [udfId]: caseField.alphanumCol } } };
			console.log("String Field:" + caseField.alphanumCol);
			updateFields(caseField, requestText);
			break;
		case "NumericField":
			let requestNum = { "Case": { "Data": { "Key": parentKey, [udfId]: caseField.numericCol } } };
			console.log("Numeric Field:" + caseField.numericCol);
			updateFields(caseField, requestNum);
			break;
		case "EnumField<StringItem>":
			if (isMulti) {  // multiselect
                console.log("Table Field-Multi: " + caseField.codeId)
				getCurrentMultiselectUdfState(caseField, parentKey);
			} else {
				let requestSingle = { "Case": { "Data": { "Key": parentKey, [udfId]: [caseField.codeId] } } };
				console.log("Table Field:" + caseField.codeId);
				updateFields(caseField, requestSingle);
			}
			break;
		default: 
			break;
	}
}

function getCurrentMultiselectUdfState(caseField, key) {
	// let token = "";
    let udfId = "/Case/Udf/$TYPEID(" + caseField.typeId + ")";
    let baseurl = "https://api.maximizer.com/octopus";
    let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
	let caseReadItems = `${baseurl}/Read`;
	let requestSearchItems = {
		"Case": {
			"Criteria": {
				"SearchQuery": {
					"Key": {
						"$EQ": key
                    }
                }
			},
			"Scope": {
				"Fields": {
					"Key": 1,
					[udfId]: 1
                }
            }
		}
	};
	fetch(caseReadItems, { method: "POST", body: JSON.stringify(requestSearchItems), headers: connectHeaders })
		.then((response) => response.json())
		.then((data) => {
			if (data.Code >= 0) {
				console.log(data);
				let udfTypeId = data.Case.Data[0];
				if (udfTypeId[udfId] == null) {
                    console.log(data);
					if (typeof caseField.codeId === 'number') { 
						let newCodeId = caseField.codeId.toString();
						updateFields(caseField, { "Case": { "Data": { "Key": key, [udfId]: [newCodeId] } } });	
					} else {
						updateFields(caseField, { "Case": { "Data": { "Key": key, [udfId]: [caseField.codeId] } } });
					}
				} else {
					if (typeof caseField.codeId === 'number') { 
						let newCodeId = caseField.codeId.toString(); 
						let newUdfItems = udfTypeId[udfId].unshift(newCodeId);	
					} else {
						let newUdfItems = udfTypeId[udfId].unshift(caseField.codeId);
					}
					console.log(udfTypeId[udfId]);
                    updateFields(caseField, { "Case": { "Data": { "Key": key, [udfId]: udfTypeId[udfId] } } });
				}
			} else {
				console.log(data.Msg[0].Message);
            }
        });
}

function updateFields(caseField, requestType) {
	// let token = "";
    let baseurl = "https://api.maximizer.com/octopus";
    let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
    let caseUpdate = `${baseurl}/Update`;
    let request = requestType;
    fetch(caseUpdate, { method: "POST", body: JSON.stringify(request), headers: connectHeaders })
        .then((response) => response.json())
        .then((data) => {
        if (data.Code >= 0) {
            console.log(data);
        } else {
            console.log(caseField.oldClientId + "-" + caseField.typeId + "-" + data.Msg[0].Message);
			console.log(requestType);
        }
    });
}
