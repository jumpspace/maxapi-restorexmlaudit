// insertOpps.js
const fs = require('fs');
const token = require('./token');

console.log("Re-insertion: Opportunity");

// Update token to the PAT of the target database
// const token = "";

console.log("Re-insertion: Oportunities");

// Cycle through all available files
let minfile = 2; // Min = 1
let maxfile = 6; // change this value to reflect how many note records you are re-inserting

/* for (var i = minfile; i <= maxfile; i++) {
    var filename = "abEntryOpps/abEntryOpp" + i + ".json";
    parseOpp(token, filename);
} */

// parseOpp(token, "abEntryOpps/abEntryOpp2.json");
// parseOpp(token, "abEntryOpps/abEntryOpp3.json");
// parseOpp(token, "abEntryOpps/abEntryOpp4.json");
// parseOpp(token, "abEntryOpps/abEntryOpp5.json");
// parseOpp(token, "abEntryOpps/abEntryOpp6.json");
parseOpp(token, "abEntryOpps/abEntryOpp7.json");

function parseOpp(token, filename) {
	fs.readFile(filename, (error, data) => {
		if (error) console.log(error);
		rawData = JSON.parse(data);
		
		// field assignments
		let oppActualRevenue = rawData.O.Actual_Revenue[0];
		let ownerId = rawData.O.Owner_Id[0];
		let oldClientId = rawData.O.Client_Id[0];
		let currentStageId = rawData.O.Current_Stage_Id[0];
		let oppStatus = rawData.O.Status[0];
		let updatedById = rawData.O.Updated_By_Id[0];
		let oppCloseDate = rawData.O.Close_Date[0];
		let processId = rawData.O.Process_Id[0];
		let oppForecastRevenue = rawData.O.Forecast_Revenue[0];
		let strategyId = rawData.O.Strategy_Id[0];
		let oppName = rawData.O.Name[0];
		let oldOppId = rawData.O.Opp_Id[0];
		let oppLmd = rawData.O.Last_Modify_Date[0];
		let completionComment = rawData.O.Completion_Comment[0];
		let probClose = rawData.O.Probability_Closing[0];
		let oppActualCloseDate = rawData.O.Actual_Close_Date[0];
		let oppCost = rawData.O.Cost[0];
		let oppLastUpdateDate = rawData.O.Last_Update_Date[0];
		let teamId = rawData.O.Team_Id[0];
		let objective = rawData.O.Objective[0];
		let oppComment = rawData.O.Comment[0];
		let oppStartDate = rawData.O.Start_Date[0];
		let oppCreateDate = rawData.O.Create_Date[0];
		let oppAge = rawData.O.Opportunity_Age[0];
		let nextAction = rawData.O.NextAction[0];
		let creatorId = rawData.O.Creator_Id[0];
		
		// Date Formatting and type conversion // account for null values ({"$": { "xsi:nil": "true" } })
		let closeDate = (typeof oppCloseDate === "object") ? "1900-01-01" : oppCloseDate.substr(0, 10);
		let lmd = (typeof oppLmd === "object") ? "1900-01-01" : oppLmd.substr(0, 10);
		let lud = (typeof oppLastUpdateDate === "object") ? "1900-01-01" : oppLastUpdateDate.substr(0, 10);
		let actClose = (typeof oppActualCloseDate === "object") ? "1900-01-01" : oppActualCloseDate.substr(0, 10);
		let startDate = (typeof oppStartDate === "object") ? "1900-01-01" : oppStartDate.substr(0, 10);
		let createDate = (typeof oppCreateDate === "object") ? "1900-01-01" : oppCreateDate.substr(0, 10);
		let comment = (typeof oppComment === "object") ? "" : oppComment;
		let cost = (typeof oppCost === "object") ? 0.00 : parseFloat((new Number(oppCost)).toFixed(2));
		let fcastrev = (typeof oppForecastRevenue === "object") ? 0.00 : parseFloat((new Number(oppForecastRevenue)).toFixed(2));
		let actRev = (typeof oppActualRevenue === "object") ? 0.00 : parseFloat((new Number(oppActualRevenue)).toFixed(2));
		let age = (typeof oppAge === "object") ? 0 : parseInt(new Number(oppAge));
		let status = (typeof oppStatus === "object") ? 0 : parseInt(new Number(oppStatus));
		
		// Package opp into Object
		const opportunity = {
			actRev, 
			ownerId, 
			oldClientId, 
			currentStageId, 
			oppStatus, 
			updatedById, 
			closeDate, 
			processId, 			
			fcastrev, 
			strategyId, 
			oppName, 
			oldOppId, 
			lmd, 
			completionComment, 
			probClose, 
			actClose, 
			cost, 
			lud, 
			teamId, 
			objective,
			comment,
			startDate,
			createDate,
			age,
			nextAction,
			creatorId,
			status,
			comment
		};
		//console.log(opportunity);
		getAbEntry(token, opportunity, filename);
	});
}

function getAbEntry(token, opportunity, filename) {
	let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
	let baseurl = "https://api.maximizer.com/octopus";
	let abEntryRead = `${baseurl}/Read`;
	let request = {
		"AbEntry": {
			"Criteria": {
				"SearchQuery": {
					"Address": {
						"AddressLine2": {
							"$EQ": opportunity.oldClientId
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
				"IAbEntrySearcher": "Maximizer.Model.Access.Sql.AbEntrySearcher"
			}
		},
		"Compatibility": {
			"AbEntryKey": "2.0"
		}
	};
	
	fetch(abEntryRead, { method: "POST", body: JSON.stringify(request), headers: connectHeaders })
		.then((response) => response.json())
		.then((data) => {
			if (data.Code >= 0) {
				if (data.AbEntry.Data.length >= 1) {
					console.log(filename + "-" + data.AbEntry.Data[0].Key);
					getOpportunity(token, opportunity, data.AbEntry.Data[0].Key, filename);
				} else {
					console.log("ERROR (data): " + filename + " - " + opportunity.oldClientId + " - Client ID does not exist");
				}
				
			} else {
				console.log("ERROR (connect): "+ filename + " - " + abNote.oldClientId + "- " + data.Msg[0].Message);
			}
		});
}

function getOpportunity(token, opportunity, abEntryKey, filename) {
	let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
	let baseurl = "https://api.maximizer.com/octopus";
	let oppRead = `${baseurl}/Read`;
	let request = {
		"Opportunity": {
			"Criteria": {
				"SearchQuery": {
					"$AND": [{
						"ParentKey": {
							"$EQ": abEntryKey
						}
					},{
						"Key": {
							"$EQ": {
								"Id": opportunity.oldOppId
							}
						}
					}]
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
				"IOpportunitySearcher": "Maximizer.Model.Access.Sql.OpportunitySearcher"
			}
		},
		"Compatibility": {
			"OpportunityKey": "2.0"
		}
	};
	
	//console.log(filename + " - " + abEntryKey + " - " + opportunity.oldOppId);
	fetch(oppRead, { method: "POST", body: JSON.stringify(request), headers: connectHeaders })
		.then((response) => response.json())
		.then((data) => {
			if (data.Code >= 0) {
				if (data.Opportunity.Data.length >= 1) {
					console.log(filename + "-" + abEntryKey + "-" + data.Opportunity.Data[0].Key + " UPDATE");
					updateOpportunity(token, data.Opportunity.Data[0].Key, opportunity, filename);
				} else {
					console.log(filename + "-" + abEntryKey + "- CREATE");
					createOpportunity(token, abEntryKey, opportunity, filename);
				}
				
			} else {
				console.log(filename + " - " + data.Msg[0].Message);
			}
		});
}

function createOpportunity(token, parentKey, opportunity, filename) {
	let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
	let baseurl = "https://api.maximizer.com/octopus";
	let oppCreate = `${baseurl}/Create`;
	let request = {
		"Opportunity": {
			"Data": {
				"Key": null,
				"ParentKey": parentKey,
				"Objective": opportunity.objective,
				"Description": opportunity.comment + " - " + opportunity.oldOppId,
				"Status": opportunity.status,
				"Cost": opportunity.cost,
				"ActualRevenue": opportunity.actRev,
				"ForecastRevenue": opportunity.fcastrev,
				"StartDate": opportunity.startDate,
				"CloseDate": opportunity.actClose,
				"Creator": {
					"UID": opportunity.creatorId
				},
				"ModifiedBy": {
					"UID": opportunity.updatedById
				},
				"LastModifyDate": opportunity.lmd,
				"NextAction": opportunity.nextAction
			}
		}
	};
	
	fetch(oppCreate, { method: "POST", body: JSON.stringify(request), headers: connectHeaders })
		.then((response) => response.json())
		.then((data) => {
			if (data.Code >= 0) {
				console.log(filename + " - " + data.Opportunity.Data.Key + " - Opp Created");
			} else {
				console.log(filename + " - " + data.Msg[0].Message);
			}
		});
}

function updateOpportunity(token, oppKey, opportunity, filename){
	let connectHeaders = { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + token };
	let baseurl = "https://api.maximizer.com/octopus";
	let oppUpdate = `${baseurl}/Update`;
	let request = {
		"Opportunity": {
			"Data": {
				"Key": oppKey,
				"Objective": opportunity.objective,
				"Description": opportunity.comment,
				"Status": opportunity.status,
				"Cost": opportunity.cost,
				"ActualRevenue": opportunity.actRev,
				"ForecastRevenue": opportunity.fcastrev,
				"StartDate": opportunity.startDate,
				"CloseDate": opportunity.actClose,
				"Creator": {
					"UID": opportunity.creatorId
				},
				"ModifiedBy": {
					"UID": opportunity.updatedById
				},
				"LastModifyDate": opportunity.lmd,
				"NextAction": opportunity.nextAction
			}
		}
	};
	
	fetch(oppUpdate, { method: "POST", body: JSON.stringify(request), headers: connectHeaders })
		.then((response) => response.json())
		.then((data) => {
			if (data.Code >= 0) {
				console.log(data);
				console.log(filename + " - " + data.Opportunity.Data.Key + " - Opp Updated");
			} else {
				console.log(filename + " - " + data.Msg[0].Message);
			}
		});
}
