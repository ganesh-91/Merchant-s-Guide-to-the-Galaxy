var fs = require("fs");
var text = fs.readFileSync("./text.txt").toString('utf-8');
var textByLine = text.split("\n");

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
		currencyArray,
		queryStatementsArray,
		elementValueArray;

	currencyArray = _findGalaxyCurrencyNameFromFile(currency, inputText);
	console.log("currencyArray = ", currencyArray);
	console.log(" ");

	queryStatementsArray = _replaceValuesInStatement(currency, inputText);
	// console.log("queryStatementsArray = ", queryStatementsArray);
	// console.log(" ");

	elementValueArray = _evalValuesInQueryStatements(queryStatementsArray);

	console.log("elementValueArray = ", elementValueArray);
	console.log(" ");

	// elementValueArray = _evalValuesInQueryStatements(elementValueArray, );

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
			creditRegex = /Credits/i,
			howManyRegex = /how many/i,
			arrgCurrency = currencyArrg;

		for (var i = 0; i < inputTextLen; i++) {
			if ((!(howManyRegex.test(inputText[i]))) && (creditRegex.test(inputText[i]))) {

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
			valueAdd = 0,
			valueSub = 0,
			total = 0,
			flag = false,
			coinElement = [],
			newArray = [];
		for (var i = 0; i < arrayLen; i++) {
			item = array[i].split(' ');
			const len = item.length;
			for (var j = 0; j < len; j++) {
				const isStr = /is/,
					creditStr = /Credits/,
					nanStr = /[0-9]/;
				if ((isStr.test(item[j]))) {
					flag = true;
				}
				if ((nanStr.test(item[j]))) {
					if (flag) {
						valueSub = valueSub + parseInt(item[j]);
					} else {
						valueAdd = valueAdd + parseInt(item[j]);
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
			total = valueSub > valueAdd ? valueSub - valueAdd : valueAdd - valueSub;
			coinElement[i].value = total;
			// coinElement.push({
			// 	value: total
			// });
		}

		return coinElement;
	}

};

guidetotheGalaxyProblem(textByLine, currency);