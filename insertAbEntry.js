// insertAbEntry.js
const fs = require('fs');

console.log("Re-insertion: AbEntry");

// Cycle through all available files
let minfile = 1;
let maxfile = 2;

/* for (var i = minfile; i <= maxfile; i++) {
    var filename = "abEntries/abEntry" + i + ".json";
    parseAbEntry(filename);
} */

parseAbEntry("abEntries/abEntry1.json");

function parseAbEntry(filename) {
    fs.readFile(filename, (error, data) => {
        if (error) console.log(error);
		let rawdata = JSON.parse(data);
        
		// Field assignments
		let fieldCreateDate = rawdata.O.Create_Date[0];
        let fieldAssignedTo = rawdata.O.Assigned_To[0];
        let fieldNameType = rawdata.O.Name_Type[0];
        let fieldAddress1 = rawdata.O.Address_Line_1[0];
        let fieldPhone1 = rawdata.O.Phone_1[0];
        let fieldPhone4Desc = rawdata.O.Phone_4_Desc[0];
        let fieldPhone3 = rawdata.O.Phone_3[0];
        let fieldPhone1Desc = rawdata.O.Phone_1_Desc[0];
        let fieldLmd = rawdata.O.Last_Modify_Date[0];
        let fieldStProv = rawdata.O.State_Province[0];
        let fieldDept = rawdata.O.Department[0];
        let fieldEmail3Desc = rawdata.O.Email_3_Desc[0];
        let fieldMrMs = rawdata.O.MrMs[0];
        let fieldPhone2 = rawdata.O.Phone_2[0];
        let fieldPhone1Ext = rawdata.O.Phone_1_Extension[0];
        let fieldCity = rawdata.O.City[0];
        let fieldSalutation = rawdata.O.Salutation[0];
        let fieldEmail2Desc = rawdata.O.Email_2_Desc[0];
        let fieldPhone3Ext = rawdata.O.Phone_3_Extension[0];
        let fieldPhone3Desc = rawdata.O.Phone_3_Desc[0];
        let fieldZipPostal = rawdata.O.Zip_Code[0];
        let fieldDivision = rawdata.O.Division[0];
        let fieldPhone4Ext = rawdata.O.Phone_4_Extension[0];
        let fieldPhone2Ext = rawdata.O.Phone_2_Extension[0];
        let fieldOwnerId = rawdata.O.Owner_Id[0];
        let fieldCountry = rawdata.O.Country[0];
        let fieldInitial = rawdata.O.Initial[0];
        let fieldAddress2 = rawdata.O.Address_Line_2[0];
        let fieldEmail1Desc = rawdata.O.Email_1_Desc[0];
        let fieldUpdaterId = rawdata.O.Updated_By_Id[0];
        let fieldPhone2Desc = rawdata.O.Phone_2_Desc[0];
        let fieldOldClientId = rawdata.O.Client_Id[0];
        let fieldCompanyName = rawdata.O.Firm[0];
        let fieldPosition = rawdata.O.Title[0];
        let fieldClientName = rawdata.O.Name[0];
        let fieldFirstName = rawdata.O.First_Name[0];
        let fieldCreatorId = rawdata.O.Creator_Id[0];
        let fieldRecordType = rawdata.O.Record_Type[0];
		let fieldContactnum = rawdata.O.Contact_Number[0];

        let recType = (recordType == "2") ? "Individual" : "Contact";

        let createDate = (typeof fieldCreateDate === 'object') ? "1900-01-01" : fieldCreateDate.substr(0, 10);
        let assignedTo = (typeof fieldAssignedTo === 'object') ? "" : fieldAssignedTo;
        let nameType = (typeof fieldNameType === 'object') ? "" : fieldNameType;
        let address1 = (typeof fieldAddress1 === 'object') ? "" : fieldAddress1;
        let phone1 = (typeof fieldPhone1 === 'object') ? "" : fieldPhone1;
        let phone4Desc =(typeof fieldPhone4Desc === 'object') ? "" : fieldPhone4Desc;
        let phone3 = (typeof fieldPhone3 === 'object') ? "" : fieldPhone3;
        let phone1Desc = (typeof fieldPhone1Desc === 'object') ? "" : fieldPhone1Desc;
        let lmd = (typeof fieldLmd === 'object') ? "1900-01-01" : fieldLmd.substr(0, 10) ;
        let stProv = (typeof fieldStProv === 'object') ? "" : fieldStProv;
        let dept = (typeof fieldDept === 'object') ? "" : fieldDept;
        let email3Desc =(typeof fieldEmail3Desc === 'object') ? "" : fieldEmail3Desc;
        let mrMs = (typeof fieldMrMs === 'object') ? "" : fieldMrMs;
        let phone2 = (typeof fieldPhone2 === 'object') ? "" : fieldPhone2;
        let phone1Ext = (typeof fieldPhone1Ext === 'object') ? "" : fieldPhone1Ext;
        let city = (typeof fieldCity === 'object') ? "" : fieldCity;
        let salutation = (typeof fieldSalutation === 'object') ? "" : fieldSalutation;
        let email2Desc = (typeof fieldEmail2Desc === 'object') ? "" : fieldEmail2Desc;
        let phone3Ext = (typeof fieldPhone3Ext === 'object') ? "" : fieldPhone3Ext;
        let phone3Desc = (typeof fieldPhone3Desc === 'object') ? "" : fieldPhone3Desc;
        let zipPostal = (typeof fieldZipPostal === 'object') ? "" : fieldZipPostal;
        let division = (typeof fieldDivision === 'object') ? "" : fieldDivision;
        let phone4Ext =(typeof fieldPhone4Ext === 'object') ? "" : fieldPhone4Ext;
        let phone2Ext = (typeof fieldPhone2Ext === 'object') ? "" : fieldPhone2Ext;
        let ownerId = (typeof fieldOwnerId === 'object') ? "" : fieldOwnerId;
        let country =  (typeof fieldCountry === 'object') ? "" : fieldCountry;
        let initial = (typeof fieldInitial === 'object') ? "" : fieldInitial;
        let address2 = (typeof fieldAddress2 === 'object') ? "" : fieldAddress2;
        let email1Desc = (typeof fieldEmail1Desc === 'object') ? "" : fieldEmail1Desc;
        let updaterId = (typeof fieldUpdaterId === 'object') ? "" : fieldUpdaterId;
        let phone2Desc = (typeof fieldPhone2Desc === 'object') ? "" : fieldPhone2Desc;
        let oldClientId = (typeof fieldOldClientId === 'object') ? "" : fieldOldClientId;
        let companyName = (typeof fieldCompanyName === 'object') ? "" : fieldCompanyName;
        let position = (typeof fieldPosition === 'object') ? "" : fieldPosition;
        let clientName = (typeof fieldClientName === 'object') ? "" : fieldClientName;
        let firstName = (typeof fieldFirstName === 'object') ? "" : fieldFirstName;
        let creatorId = (typeof fieldCreatorId === 'object') ? "" : fieldCreatorId;
        let recordType = (typeof fieldRecordType === 'object') ? "" : fieldRecordType;
        let contactnum = (typeof fieldContactnum === 'object') ? "" : fieldContactnum;

        const abEntry = {
            assignedTo,
            recType,
            address1,
            phone1,
            phone4Desc,
            phone3,
            phone1Desc,
            lmd,
            stProv,
            dept,
            email3Desc,
            mrMs,
            phone2,
            phone1Ext,
            city,
            salutation,
            email2Desc,
            phone3Ext,
            phone3Desc,
            zipPostal,
            division,
            phone4Ext,
            phone2Ext,
            ownerId,
            country,
            initial,
            createDate,
            address2,
            email1Desc,
            updaterId,
            phone2Desc,
            oldClientId,
            companyName,
            position,
            clientName,
            firstName,
            creatorId,
			contactnum,
            nameType
        };

        console.log(abEntry);
		if (abEntry.recType == "Individual") {
			console.log("Individual");
			console.log(filename);
			createAbEntry(abEntry, null);
		} else {
			// Contact Entry
			console.log("Contact");
			console.log(filename);
			findAbEntry(abEntry);
		}
		
    });
}

function findAbEntry(abEntry) {
	console.log("Searching for existing entry. . .");
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
									"$EQ": abEntry.oldClientId
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
				console.log(data);
				console.log(data.AbEntry.Data[0].Key + ": Individual Key Found");
				createAbEntry(abEntry, data.AbEntry.Data[0].Key);
			} else {
				console.log(data.Msg[0].Message);
			}
		});
}

function createAbEntry(abEntry, primaryRecKey) {
	console.log("Creating new entry. . .");
    let token = "";
	let baseurl = "https://api.maximizer.com/octopus";
    let abUpdate = `${baseurl}/Create`;
    let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
    let request = {
        "AbEntry": {
            "Data": {
                "Key": primaryRecKey,
                "Type": abEntry.recType,
				"ParentKey": primaryRecKey,
                "Salutation": abEntry.salutation,
                "FirstName": abEntry.firstName,
                "LastName": abEntry.clientName,
                "Creator": {
                    "UID": abEntry.createdBy
                },
                "ModifiedBy": {
                    "UID": abEntry.modifiedBy
                },
                "Phone1": {
                    "Description": abEntry.phone1Desc,
                    "Number": abEntry.phone1,
                    "Extension": abEntry.phone1Ext
                },
                "Phone2": {
                    "Description": abEntry.phone2Desc,
                    "Extension": abEntry.phone2Ext,
                    "Number": abEntry.phone2
                },
                "Phone3": {
                    "Description": abEntry.phone3Desc,
                    "Extension": abEntry.phone3Ext,
                    "Number": abEntry.phone3
                },
                "Phone4": {
                    "Description": abEntry.phone4Desc,
                    "Extension": abEntry.contactnum,
                    "Number": abEntry.phone4
                },
                "Email": {
                    "Address": "",
                    "Description": abEntry.email1Desc
                },
                "Email2": {
                    "Address": "",
                    "Description": abEntry.emai2Desc
                },
                "Email3": {
                    "Address": "",
                    "Description": abEntry.emai31Desc
                },
                "Address": {
                    "AddressLine1": abEntry.address1,
                    "AddressLine2": abEntry.oldClientId,
                    "City": abEntry.city,
                    "StateProvince": abEntry.stProv,
                    "ZipCode": abEntry.zipPostal,
                },
                "LastModifyDate": abEntry.lmd,

            }
        }
    };

    fetch(abUpdate, { method: "POST", body: JSON.stringify(request), headers: connectHeaders })
        .then((response) => response.json())
        .then((data) => { 
            if (data.Code >= 0) {
                console.log("Creting new entry: " + abEntry.LastName + " - " + abEntry.FirstName);
                console.log(data);
            } else {
                console.log(data.Msg[0].Message);
            }
         });
}
