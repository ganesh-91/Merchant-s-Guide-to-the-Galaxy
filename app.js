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
		actualVal: 1,
		galaxyCurrencyVal: ""
	},
	{
		romanVal: "V",
		actualVal: 5,
		galaxyCurrencyVal: ""
	},
	{
		romanVal: "X",
		actualVal: 10,
		galaxyCurrencyVal: ""
	},
	{
		romanVal: "L",
		actualVal: 50,
		galaxyCurrencyVal: ""
	},
	{
		romanVal: "C",
		actualVal: 100,
		galaxyCurrencyVal: ""
	},
	{
		romanVal: "D",
		actualVal: 5000,
		galaxyCurrencyVal: ""
	},
	{
		romanVal: "M",
		actualVal: 10000,
		galaxyCurrencyVal: ""
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
	console.log("keysAndValueArray = ", keysAndValueArray);
	console.log(" ");

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
						curr[j].galaxyCurrencyVal = breakedStatement[0];
						arrgCurrency.push(curr[j]);
						// console.log(j);
						// console.log(arrgCurrency);
						// arrgCurrency[j].galaxyCurrencyVal = breakedStatement[0];
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
					if (arrgCurrency[j].galaxyCurrencyVal !== "") {
						subStr = new RegExp(arrgCurrency[j].galaxyCurrencyVal, 'i');
						if (subStr.test(inputText[i])) {
							var regexStr = new RegExp(arrgCurrency[j].galaxyCurrencyVal, 'g');
							inputText[i] = inputText[i].replace(regexStr, arrgCurrency[j].actualVal);
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
				name: currencyArray[i].galaxyCurrencyVal,
				value: currencyArray[i].actualVal
			})
		}
		keyObj = keyObj.concat(elementValueArray)
		return keyObj;
	}

	function _evalValuesInQuestionStatements(questionSatement, currencyArray, elementValueArray) {
		var queObjLen = questionSatement.length,
			value = 0,
			item = [],
			creditQuestions = [],
			nonCreditQuestions = [];
		for (var i = 0; i < queObjLen; i++) {
			if (creditRegex.test(questionSatement[i])) {
				creditQuestions.push(questionSatement[i])
			} else {
				nonCreditQuestions.push(questionSatement[i]);
			}
		}
		console.log("creditQuestions=", creditQuestions);
		console.log("nonCreditQuestions=", nonCreditQuestions);

		for (var i = 0; i < creditQuestions.length; i++) {
			item = creditQuestions[i].split(' ');

			for (var j = 0; j < item.length; j++) {
				value = hasOwnProperty(item[j], keysAndValueArray) ? value + hasOwnProperty(item[j], keysAndValueArray) : value + 0;
				// console.log("value=", value);
			}
			item.push("is", value);
			console.log(" ");
			console.log("item=", item);
		}


	}

};

function hasOwnProperty(item, valueArray) {
	// console.log("item, valueArray = ", item, valueArray);
	for (var i = 0; i < valueArray.length; i++) {
		if (valueArray[i].name == item) {
			// console.log(" valueArray[i].value=", valueArray[i].value);
			return (parseInt(valueArray[i].value));
		}
	}
}

guidetotheGalaxyProblem(textByLine, currency);