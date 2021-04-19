const fs = require("fs");
const https = require('https');

let listStock = getListStock().split('\n');
let listStockCount = listStock.length;
let listStockFormat = listStock.splice(1, listStockCount);
let jsonArray = [];

console.log(listStockFormat);

setTimeout(() => { 
  newTXT('./tmp/list-price-stock.txt', '');
  loopThroughSplittedText(listStockFormat);
}, 1000);


function getListStock() {
  try {
    const listStock = fs.readFileSync('./tmp/list-stock.txt', 'utf8');
    return listStock;
  } catch(e) {
    console.log('Error:', e.stack);
  }
}

function newTXT(file, data) {
  fs.writeFileSync(file, data);
}

function appendTXT(file, data) {
  fs.appendFile(file, data, (err) => {
    if (err) throw err;
  });
}

function loopThroughSplittedText(splittedText) {
  for (var i = 0; i < splittedText.length; i++) {
    (function (i) {
      let a,b;
      setTimeout(function () {
        a = getPriceOfName(splittedText[i]);
        console.log(`- Get price of '${splittedText[i]}'`);
      }, 1000 * i);      
    })(i);
  };
}

function getPriceOfName(name) {
// https://www.set.or.th/set/companyrights.do?symbol=2S&ssoPageId=7&language=th&country=TH
  let a,b;
  const path = '/mkt/stockquotation.do?symbol={symbol}&ssoPageId=1&language=th&country=TH'
    .replace('{symbol}', name)

  const options = {
    host: 'marketdata.set.or.th',
    path: path
  }

  var request = https.request(options, function (res) {
    var data = '';
    res.on('data', function (chunk) {
        data += chunk;
    });
    res.on('end', function () {
      a = data.match(/<\/i>[0-9](.+)/g);
      console.log(a);
      if (a) {
        b = a[0].replace('</i>', '');
        appendTXT('./tmp/list-price-stock.txt', '\n' + `${name} ${b}`);
      }
      console.log(`${name} ${b}`);
    });
  });
  request.on('error', function (e) {
    console.log(e.message);
  });
  request.end();
}