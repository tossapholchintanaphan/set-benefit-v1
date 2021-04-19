const fs = require("fs");
const https = require('https');

let listPriceStock = getListPriceStock().split('\n');
let listPriceStockCount = listPriceStock.length;
let listPriceStockFormat = listPriceStock.splice(1, listPriceStockCount);

console.log(listPriceStockFormat);

setTimeout(() => { 
  newTXT('./tmp/list-price-xd-stock.txt', '');
  loopThroughSplittedText(listPriceStockFormat);
}, 1000);

function getListPriceStock() {
  try {
    const listPriceStock = fs.readFileSync('./tmp/list-price-stock.txt', 'utf8');
    return listPriceStock;
  } catch(e) {
    console.log('Error:', e.stack);
  }
}

function loopThroughSplittedText(splittedText) {
  for (var i = 0; i < splittedText.length; i++) {
    (function (i) {
      setTimeout(function () {
        getPriceXDOfName(splittedText[i].split(' ')[0], splittedText[i].split(' ')[1]);
        console.log(`- Get price of '${splittedText[i]}'`);
      }, 100 * i);      
    })(i);
  };
}

function getPriceXDOfName(name, price) {
  let a,b,c,d,e,f;
  const path = '/set/companyrights.do?symbol={symbol}&ssoPageId=7&language=th&country=TH'
    .replace('{symbol}', name)

  const options = {
    host: 'www.set.or.th',
    path: path
  }

  var request = https.request(options, function (res) {
    var currentTime = new Date()
    var year = parseInt(currentTime.getFullYear()) + 543
    var data = '';
    res.on('data', function (chunk) {
        data += chunk;
    });
    res.on('end', function () {
      a = data.split('<td align="center" valign="top">');
      if (a[1]) {
        if (a[1].search('XD ') != -1 && a[1].search(year) != -1) {
          b = a[1].split('<td style="text-align:left;">');   
          c = b[2].split('</td>')[0];
          d = b[3].split('</td>')[0];
          e = b[4].split('</td>')[0];
          f = e/price;
  
          appendTXT('./tmp/list-price-xd-stock.txt', '\n' + `${name},${price},${e},${f},${c},${d}`);
          console.log(`[1] ${name},${price},${e},${f},${c},${d}`);
        } else {
          if (a[2]) {
            if (a[2].search('XD ') != -1 && a[2].search(year) != -1) {
              b = a[2].split('<td style="text-align:left;">');   
              c = b[2].split('</td>')[0];
              d = b[3].split('</td>')[0];
              e = b[4].split('</td>')[0];
              f = e/price;
      
              appendTXT('./tmp/list-price-xd-stock.txt', '\n' + `${name},${price},${e},${f},${c},${d}`);
              console.log(`[2] ${name},${price},${e},${f},${c},${d}`);
            } else {
              if (a[3]) {
                if (a[3].search('XD ') != -1 && a[3].search(year) != -1) {
                  b = a[3].split('<td style="text-align:left;">');   
                c = b[2].split('</td>')[0];
                d = b[3].split('</td>')[0];
                e = b[4].split('</td>')[0];
                f = e/price;
        
                appendTXT('./tmp/list-price-xd-stock.txt', '\n' + `${name},${price},${e},${f},${c},${d}`);
                console.log(`[3] ${name},${price},${e},${f},${c},${d}`);
                } else {
                  console.log('No data');
                }
              } else {
                console.log('No data');
              }
            }
          } 
        }
      }
    });
  });
  request.on('error', function (e) {
    console.log(e.message);
  });
  request.end();
}

function newTXT(file, data) {
  fs.writeFileSync(file, data);
}

function appendTXT(file, data) {
  fs.appendFile(file, data, (err) => {
    if (err) throw err;
  });
}