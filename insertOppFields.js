// insertOppFields.js
const fs = require('fs');
const token = require('./token');

console.log("Re-insertion: Opp UDFs");

// Cycle through all available files
let minfile = 1; // Min = 1; 
let maxfile = 238; // Max = 100; 

for (var i = minfile; i <= maxfile; i++) {
    var filename = "abEntryOppUdfs/abEntryOppUdf" + i + ".json";
    parseField(filename);
}

// parseField("abEntryOppUdfs/abEntryOppUdf20.json")

function parseField(filename) {
    fs.readFile(filename, (error, data) => {
        if (error) console.log(error);
        let rawdata = JSON.parse(data);

        // field assignments
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
		let fieldContactnum = rawdata.O.Contact_Number[0];
		let fieldMmddDate = rawdata.O.mmddDate[0];

        // account for null values ({"$": {"xsi:nil": "true"}})
        let alphanumCol = (typeof fieldAlphanumCol === "object") ? "" : fieldAlphanumCol;
        let oldClientId = (typeof fieldOldClientId === 'object') ? "" : fieldOldClientId;
        let codeId = (typeof fieldCodeId === 'object') ? "" : fieldCodeId;
        let contactNum = (typeof fieldContactNum === 'object') ? 0 : parseInt(new Number(fieldContactNum).toFixed(0));
        let creationDate = (typeof fieldCreationDate === 'object') ? "1900-01-01" : fieldCreationDate.substr(0, 10);
        let creator = (typeof fieldCreator === 'object') ? "" : fieldCreator;
        let dateCol = (typeof fieldDateCol === "object") ? "1900-01-01" : fieldDateCol.substr(0, 10);
        let lmd = (typeof fieldLmd === 'object') ? "1900-01-01" : fieldLmd.substr(0, 10);
        let modifiedBy = (typeof fieldModifiedBy === 'object') ? "1900-01-01" : fieldModifiedBy.substr(0, 10);
        let numericCol = (typeof fieldNumericCol === "object") ? 0 : parseInt(new Number(fieldNumericCol).toFixed(0));
        let typeId = (typeof fieldTypeId === 'object') ? "" : fieldTypeId;
		let mmddDate = (typeof fieldMmddDate === "object") ? "1900-01-01": fieldMmddDate.substr(0, 10);

        const oppField = {
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

        getRecord(oppField);
    });
}

function getRecord(oppField) {
    // let token = "";
    let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
    let baseurl = "https://api.maximizer.com/octopus";
    let request = {
        "Opportunity": {
            "Criteria": {
                "SearchQuery": {
                    "Description": {
                        "$LIKE": "%" + oppField.oldClientId
                    }
                }
            },
            "Scope": {
                "Fields": {
                    "Key": 1,
                    "Objective": 1,
                    "Description": 1
                }
            }
        },
        "Configuration": {
            "Drivers": {
                "IOpportunitySearcher": "Maximizer.Model.Access.Sql.OpportunitySearcher"
            }
        }
    };

    let oppRead = `${baseurl}/Read`;
    fetch(oppRead, { method: "POST", body: JSON.stringify(request), headers: connectHeaders })
        .then((response) => response.json())
        .then((data) => {
            if (data.Code >= 0) {
                if (data.Opportunity.Data.length >= 1) {
                    console.log(oppField.oldClientId + " - Found record");
                    getUdfFromOppEntry(oppField, data.Opportunity.Data[0].Key);
                } else {
                    console.log(oppField.oldClientId + " - No records with this search key");
                }
            } else {
                console.log(oppField.oldClientId + " - " + data.Msg[0].Message);
            }
        });
}

function getUdfFromOppEntry(oppField, parentKey) {
    // let token = "";
    let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
	let baseurl = "https://api.maximizer.com/octopus";
    let oppEntryUdfRead = `${baseurl}/Read`;
    let searchKey = (oppField.typeId == 60028) ? "/Opportunity/Product" : ((oppField.typeId == 60025) ? "/Opportunity/Category" : "/Opportunity/Udf/$TYPEID(" + oppField.typeId + ")");
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

    fetch(oppEntryUdfRead, { method: "POST", body: JSON.stringify(request), headers: connectHeaders })
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
					checkUdfType(oppField, parentKey, udfType, isMultiSelect);
				} else {
					console.log(oppField.oldClientId + " - Type ID " + oppField.typeId + "- no Type found");
				}
            } else {
                console.log(data.Msg[0].Message);
            }
        });
}

function checkUdfType(oppField, parentKey, udfType, isMulti) {
    let udfId = (oppField.typeId == 60028) ? "/Opportunity/Product" : ((oppField.typeId == 60025) ? "/Opportunity/Category" : "/Opportunity/Udf/$TYPEID(" +  oppField.typeId + ")");
	switch (udfType) {
		case "DateTimeField": 	
			let requestDate = { "Opportunity": { "Data": { "Key": parentKey, [udfId]: oppField.dateCol } } };
			console.log("Date Field:" + oppField.dateCol);
            updateFields(oppField, requestDate);
			break;
		case "StringField":
			let requestText = { "Opportunity": { "Data": { "Key": parentKey, [udfId]: oppField.alphanumCol } } };
			console.log("String Field:" + oppField.alphanumCol);
			updateFields(oppField, requestText);
			break;
		case "NumericField":
			let requestNum = { "Opportunity": { "Data": { "Key": parentKey, [udfId]: oppField.numericCol } } };
			console.log("Numeric Field:" + oppField.numericCol);
			updateFields(oppField, requestNum);
			break;
		case "EnumField<StringItem>":
			if (isMulti) {  // multiselect
                console.log("Table Field-Multi: " + oppField.codeId)
				getCurrentMultiselectUdfState(oppField, parentKey);
			} else {
				let requestSingle = { "Opportunity": { "Data": { "Key": parentKey, [udfId]: [oppField.codeId] } } };
				console.log("Table Field:" + oppField.codeId);
				updateFields(oppField, requestSingle);
			}
			break;
		default: 
			break;
	}
}

function getCurrentMultiselectUdfState(oppField, key) {
	// let token = "";
    let udfId = "/Opportunity/Udf/$TYPEID(" + oppField.typeId + ")";
    let baseurl = "https://api.maximizer.com/octopus";
    let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
	let oppReadItems = `${baseurl}/Read`;
	let requestSearchItems = {
		"Opportunity": {
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
	fetch(oppReadItems, { method: "POST", body: JSON.stringify(requestSearchItems), headers: connectHeaders })
		.then((response) => response.json())
		.then((data) => {
			if (data.Code >= 0) {
				console.log(data);
				let udfTypeId = data.Opportunity.Data[0];
				if (udfTypeId[udfId] == null) {
                    console.log(data);
					if (typeof oppField.codeId === 'number') { 
						let newCodeId = oppField.codeId.toString();
						updateFields(oppField, { "Opportunity": { "Data": { "Key": key, [udfId]: [newCodeId] } } });	
					} else {
						updateFields(oppField, { "Opportunity": { "Data": { "Key": key, [udfId]: [oppField.codeId] } } });
					}
				} else {
					if (typeof oppField.codeId === 'number') { 
						let newCodeId = oppField.codeId.toString(); 
						let newUdfItems = udfTypeId[udfId].unshift(newCodeId);	
					} else {
						let newUdfItems = udfTypeId[udfId].unshift(oppField.codeId);
					}
					console.log(udfTypeId[udfId]);
                    updateFields(oppField, { "Opportunity": { "Data": { "Key": key, [udfId]: udfTypeId[udfId] } } });
				}
			} else {
				console.log(data.Msg[0].Message);
            }
        });
}

function updateFields(oppField, requestType) {
	// let token = "";
    let baseurl = "https://api.maximizer.com/octopus";
    let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
    let oppUpdate = `${baseurl}/Update`;
    let request = requestType;
    fetch(oppUpdate, { method: "POST", body: JSON.stringify(request), headers: connectHeaders })
        .then((response) => response.json())
        .then((data) => {
        if (data.Code >= 0) {
            console.log(data);
        } else {
            console.log(oppField.oldClientId + "-" + oppField.typeId + "-" + data.Msg[0].Message);
			console.log(requestType);
        }
    });
}