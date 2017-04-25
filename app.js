var fs = require("fs");
var text = fs.readFileSync("./text.txt").toString('utf-8');
var textByLine = text.split("\n");

const creditRegex = /Credits/i,
	questionRegex = /[?]/i,
	isStr = /is/,
	creditStr = /Credits/,
	nanStr = /[0-9]/;

const currency = [{
		romanVal: "I",
		value: 1,
		name: ""
	},
	{
		romanVal: "V",
		value: 5,
		name: ""
	},
	{
		romanVal: "X",
		value: 10,
		name: ""
	},
	{
		romanVal: "L",
		value: 50,
		name: ""
	},
	{
		romanVal: "C",
		value: 100,
		name: ""
	},
	{
		romanVal: "D",
		value: 5000,
		name: ""
	},
	{
		romanVal: "M",
		value: 10000,
		name: ""
	}
];


const guidetotheGalaxyProblem = function guidetotheGalaxyProblem(textByLine, currency) {

	var inputText = textByLine,
		currencyArray = [],
		queryStatementsArray = [],
		elementValueArray = [],
		questionSatement = [],
		solvedQuestionValues = [];

	for (var i = 0; i < textByLine.length; i++) {
		if (questionRegex.test(textByLine[i])) {
			questionSatement.push(textByLine[i]);
		}
	}

	currencyArray = _findGalaxyCurrencyNameFromFile(currency, inputText);
	// console.log("currencyArray = ", currencyArray);
	// console.log(" ");

	queryStatementsArray = _replaceValuesInStatement(currency, inputText);
	// console.log("queryStatementsArray = ", queryStatementsArray);
	// console.log(" ");

	elementValueArray = _evalValuesInQueryStatements(queryStatementsArray);
	// console.log("elementValueArray = ", elementValueArray);
	// console.log(" ");

	keysAndValueArray = _concatcurrencyAndElement(elementValueArray, currencyArray);
	// console.log("keysAndValueArray = ", keysAndValueArray);
	// console.log(" ");

	solvedQuestionValues = _evalValuesInQuestionStatements(questionSatement, currencyArray, elementValueArray);

	function _findGalaxyCurrencyNameFromFile(currencyArrg, inputText) {
		var curr = currency,
			breakedStatement = [],
			inputTextLen = inputText.length,
			currencyLen = curr.length,
			subStr,
			arrgCurrency = [];

		for (var j = 0; j < currencyLen; j++) {
			for (var i = 0; i < inputTextLen; i++) {
				subStr = new RegExp(curr[j].romanVal.toUpperCase());
				// check if the statement is value assignment
				if (inputText[i].split(' ').length === 3) {
					// if the statement is have the roman number push the keyword in object
					if (subStr.test(inputText[i])) {
						breakedStatement = inputText[i].split(' ');
						curr[j].name = breakedStatement[0];
						arrgCurrency.push(curr[j]);
						// console.log(j);
						// console.log(arrgCurrency);
						// arrgCurrency[j].name = breakedStatement[0];
					}
				}
			}
		}
		return arrgCurrency;
	}

	function _replaceValuesInStatement(currencyArrg, inputText) {
		var curr = [],
			inputTextLen = inputText.length,
			currencyArrLen = currencyArrg.length,
			subStr,
			arrgCurrency = currencyArrg;

		for (var i = 0; i < inputTextLen; i++) {
			if ((!(questionRegex.test(inputText[i]))) && (creditRegex.test(inputText[i]))) {

				for (var j = 0; j < currencyArrLen; j++) {
					if (arrgCurrency[j].name !== "") {
						subStr = new RegExp(arrgCurrency[j].name, 'i');
						if (subStr.test(inputText[i])) {
							var regexStr = new RegExp(arrgCurrency[j].name, 'g');
							inputText[i] = inputText[i].replace(regexStr, arrgCurrency[j].value);
						}
					}
				}
				curr.push(inputText[i]);
			}
		}
		return curr;
	}

	function _evalValuesInQueryStatements(array) {
		var arrayLen = array.length,
			item = [],
			total = 0,
			coinElement = [],
			newArray = [];
		for (var i = 0; i < arrayLen; i++) {
			var diviser = 0,
				divident = 0,
				flag = false;
			item = array[i].split(' ');
			const len = item.length;
			for (var j = 0; j < len; j++) {

				if ((isStr.test(item[j]))) {
					flag = true;
				}
				if ((nanStr.test(item[j]))) {
					if (flag) {
						divident = parseInt(item[j]);
					} else {
						if (j > 0) {
							if (parseInt(item[j - 1]) < parseInt(item[j])) {
								diviser =
									diviser > parseInt(item[j]) ? diviser - parseInt(item[j]) : parseInt(item[j]) - diviser;
								// diviser = diviser - parseInt(item[j]);
							} else if (parseInt(item[j - 1]) == parseInt(item[j])) {
								diviser = diviser + parseInt(item[j]);
							} else if (parseInt(item[j - 1]) > parseInt(item[j])) {
								diviser = diviser + parseInt(item[j]);
							}
						} else {
							diviser = diviser + parseInt(item[j]);
						}
					}
				}
				if (((!isStr.test(item[j])) && (!creditStr.test(item[j])))) {
					if (!(nanStr.test(item[j]))) {
						coinElement.push({
							name: item[j],
							value: 0
						});
					}
				}
			}
			total = divident / diviser;
			coinElement[i].value = total;
		}
		return coinElement;
	}

	function _concatcurrencyAndElement(elementValueArray, currencyArray) {
		var keyObj = [],
			length = currencyArray.length;
		for (var i = 0; i < length; i++) {
			keyObj.push({
				name: currencyArray[i].name,
				value: currencyArray[i].value
			})
		}
		keyObj = keyObj.concat(elementValueArray)
		return keyObj;
	}

	function _evalValuesInQuestionStatements(questionSatement, currencyArray, elementValueArray) {
		var queObjLen = questionSatement.length,
			item = [],
			creditQuestions = [],
			solutionArray = [],
			nonCreditQuestions = [];
		for (var i = 0; i < queObjLen; i++) {
			if (creditRegex.test(questionSatement[i])) {
				creditQuestions.push(questionSatement[i])
			} else {
				nonCreditQuestions.push(questionSatement[i]);
			}
		}
		// console.log("creditQuestions=", creditQuestions);
		// console.log("nonCreditQuestions=", nonCreditQuestions);
		//  for creditQuestions 
		for (var i = 0; i < creditQuestions.length; i++) {
			var total = 0,
				statement = "";
			item = creditQuestions[i].split(' ');
			for (var j = 0; j < item.length; j++) {

				if (hasOwnProperty(item[j], currencyArray)) {

					if (j > 0) {
						if (hasOwnProperty(item[j - 1], currencyArray) < hasOwnProperty(item[j], currencyArray)) {
							total =
								total > hasOwnProperty(item[j], currencyArray) ? total - hasOwnProperty(item[j], currencyArray) : hasOwnProperty(item[j], currencyArray) - total;
						} else {
							total = total + hasOwnProperty(item[j], currencyArray);
						}
					}
					statement = statement.concat(" ", item[j]);
				} else if (hasOwnProperty(item[j], elementValueArray)) {
					total = total * hasOwnProperty(item[j], elementValueArray);
					statement = statement.concat(" ", item[j]);
				}

			}
			// item.push("is", total);
			// console.log(" ");
			// console.log("item=", item);
			console.log(statement, "is " + total);
		}
		//  for non creditQuestions 
		for (var i = 0; i < nonCreditQuestions.length; i++) {
			var total = 0,
				statement = "",
				unidentifiedStamentflag = true;
			item = nonCreditQuestions[i].split(' ');

			for (var j = 0; j < item.length; j++) {
				// console.log("item=", item);
				if (hasOwnProperty(item[j], currencyArray)) {
					unidentifiedStamentflag = false;
					total = total + hasOwnProperty(item[j], currencyArray)
					statement = statement.concat(" ", item[j]);
				}
			}
			if (unidentifiedStamentflag) {
				// item.push("is", total);
				console.log("I have no idea what you are talking about");
			} else {
				// item.push("is", total);
				// console.log(" ");
				console.log(statement, "is " + total);
			}

		}
		// solutionArray.push(item);
	}

};

function hasOwnProperty(item, valueArray) {
	// console.log("item ", item, valueArray);
	// console.log("item, valueArray = ", item, valueArray);
	for (var i = 0; i < valueArray.length; i++) {
		if (valueArray[i].name == item) {
			// console.log(" valueArray[i].value=", valueArray[i].value);
			return (valueArray[i].value);
		}
	}
}

guidetotheGalaxyProblem(textByLine, currency);