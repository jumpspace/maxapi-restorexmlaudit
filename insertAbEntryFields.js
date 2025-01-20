// insertAbEntryFields.js
const fs = require('fs');
const token = require('./token');

console.log("Re-insertion: UDFs");

// Cycle through all available files
let minfile = 1; // Min = 1; 
let maxfile = 87; // Max = 100; 

 for (var i = minfile; i <= maxfile; i++) {
    var filename = "abEntryUdfs/abEntryUdf" + i + ".json";
    parseField(filename);
}

//parseField("abEntryUdfs/abEntryUdf1.json")

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
		let codeId = (typeof fieldCodeId === 'object') ? "" : fieldCodeId;
		let contactNum = (typeof fieldContactNum === 'object') ? "" : fieldContactNum;
		let creationDate = (typeof fieldCreationDate === 'object') ? "1900-01-01" : fieldCreationDate.substr(0, 10);
		let numericCol = (typeof fieldNumericCol === "object") ? 0 : parseInt(new Number(fieldNumericCol).toFixed(0));
		let creator = (typeof fieldCreator === 'object') ? "" : fieldCreator;
		let dateCol = (typeof fieldDateCol === "object") ? "1900-01-01" : fieldDateCol.substr(0, 10);
		let lmd = (typeof fieldLmd === 'object') ? "1900-01-01": fieldLmd.substr(0, 10);
		let modifiedBy = (typeof fieldModifiedBy === 'object') ? "" : fieldModifiedBy;
		let typeId = (typeof fieldTypeId === 'object') ? "" : fieldTypeId;
		let mmddDate = (typeof fieldMmddDate === "object") ? "1900-01-01": fieldMmddDate.substr(0, 10);
				
        const abField = {
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
			mmddDate
        };

        getRecord(abField);
    });
}

function getRecord(abField) {
    // let token = "";
    let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
    let baseurl = "https://api.maximizer.com/octopus";
    let request = {
        "AbEntry": {
            "Criteria": {
                "SearchQuery": {
					"$AND": [ {
						"Address": {
							"AddressLine2": {
								"$EQ": abField.oldClientId
							}
						}
					},
					{
						"Phone4": {
							"Extension": {
								"$EQ": abField.contactNum
							}
						}
					}]
                }
            },
            "Scope": {
                "Fields": {
                    "Key": 1,
					"Type": 1
                }
            }
        },
		"Configuration": {
			"Drivers": {
				"IAbEntrySearcher": "Maximizer.Model.Access.Sql.AbEntrySearcher"
			}
		}
    };
	
	let abList = new Map();
    let abRead = `${baseurl}/Read`;
    fetch(abRead, { method: "POST", body: JSON.stringify(request), headers: connectHeaders })
        .then((response) => response.json())
        .then((data) => {
            if (data.Code >= 0) {
                if (data.AbEntry.Data.length < 1) {
					console.log(abField.oldClientId + ":" + abField.contactnum + " - No records with this search key");
				} else {
					// data.AbEntry.Data.length >= 1
					getUdfFromAbEntry(abField, data.AbEntry.Data[0].Key);
				}
				console.log(data);
            } else {
                console.log(abField.oldClientId + "-" + data.Msg[0].Message);
            }
        });
}

function getUdfFromAbEntry(abField, parentKey) {
    // let token = "";
    let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
    let searchKey = "Udf/$TYPEID(" + abField.typeId + ")";
	let baseurl = "https://api.maximizer.com/octopus";
    let abEntryUdfRead = `${baseurl}/Read`;
	let request = {
		"Schema": {
			"Criteria": {
				"SearchQuery": {
					"$AND": [
					{
						"Key": {
							"$EQ": searchKey
						}
					},
					{
						"AppliesTo": {
							"$EQ": "AbEntry"
						}
					}
					]
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
		}
	};
	
	fetch(abEntryUdfRead, { method: "POST", body: JSON.stringify(request), headers: connectHeaders })
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
					checkUdfType(abField, parentKey, udfType, isMultiSelect);
				} else {
					console.log(abField.oldClientId + "- no Type found");
				}
			} else {
				console.log(data.Msg[0].Message);
			}
		});
}

function checkUdfType(abField, abEntryKey, udfType, isMulti) {
    let udfId = "Udf/$TYPEID(" +  abField.typeId + ")";
	switch (udfType) {
		case "DateTimeField": 	
			let requestDate = { "AbEntry": { "Data": { "Key": abEntryKey, [udfId]: abField.dateCol } } };
			console.log("Date Field:" + abField.dateCol);
            updateFields(abField, requestDate);
			break;
		case "StringField":
			let requestText = { "AbEntry": { "Data": { "Key": abEntryKey, [udfId]: abField.alphanumCol } } };
			console.log("String Field:" + abField.alphanumCol);
			updateFields(abField, requestText);
			break;
		case "NumericField":
			let requestNum = { "AbEntry": { "Data": { "Key": abEntryKey, [udfId]: abField.numericCol } } };
			console.log("Numeric Field:" + abField.numericCol);
			updateFields(abField, requestNum);
			break;
		case "EnumField<StringItem>":
			if (isMulti) {  // multiselect
                console.log("Table Field-Multi: " + abField.codeId)
				getCurrentMultiselectUdfState(abField, abEntryKey);
			} else {
				let requestSingle = { "AbEntry": { "Data": { "Key": abEntryKey, [udfId]: [abField.codeId] } } };
				console.log("Table Field:" + abField.codeId);
				updateFields(abField, requestSingle);
			}
			break;
		default: 
			break;
	}
}

function getCurrentMultiselectUdfState(abField, key) {
	// let token = "";
    let udfId = "Udf/$TYPEID(" + abField.typeId + ")";
    let baseurl = "https://api.maximizer.com/octopus";
    let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
	let abEntryReadItems = `${baseurl}/Read`;
	let requestSearchItems = {
		"AbEntry": {
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
	fetch(abEntryReadItems, { method: "POST", body: JSON.stringify(requestSearchItems), headers: connectHeaders })
		.then((response) => response.json())
		.then((data) => {
			if (data.Code >= 0) {
				console.log(data);
				let udfTypeId = data.AbEntry.Data[0];
				if (udfTypeId[udfId] == null) {
                    console.log(data);
                    updateFields(abField, { "AbEntry": { "Data": { "Key": key, [udfId]: [abField.codeId] } } });
				} else {
					let newUdfItems = udfTypeId[udfId].unshift(abField.codeId);
					console.log(udfTypeId[udfId]);
                    updateFields(abField, { "AbEntry": { "Data": { "Key": key, [udfId]: udfTypeId[udfId] } } });
				}
			} else {
				console.log(data.Msg[0].Message);
            }
        });
}

function updateFields(abField, requestType) {
	// let token = "";
    let baseurl = "https://api.maximizer.com/octopus";
    let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
    let abEntryUpdate = `${baseurl}/Update`;
    let request = requestType;
    fetch(abEntryUpdate, { method: "POST", body: JSON.stringify(request), headers: connectHeaders })
        .then((response) => response.json())
        .then((data) => {
        if (data.Code >= 0) {
            console.log(data);
        } else {
            console.log(abField.oldClientId + "-" + abField.typeId + "-" + data.Msg[0].Message);
        }
    });
}
