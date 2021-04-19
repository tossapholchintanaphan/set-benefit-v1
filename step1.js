const fs = require("fs");
const https = require('https');
const rimraf = require("rimraf");
const search = require('./config/search.json');

let searchUrl = '';
const tempPath = './tmp';

// #1 Check temp path and create temp path
console.log('(1) Check existing \'tmp\' path.');
if (fs.existsSync(tempPath)) {
  rimraf( 'tmp', () => { 
    console.log('- Delete existing \'tmp\' path Success.');
  });
} else {
  console.log('- No existing \'tmp\' path.');
}
setTimeout(() => { 
  fs.mkdirSync(tempPath);
  console.log('- Create \'tmp\' path Sucess'); 
}, 1000);



// #2 Create list of all stock name
setTimeout(() => { 
  // console.log('(2) Create list of all stock name.');
  newTXT('./tmp/list-stock.txt', '');
  console.log(`- Count of list prefix = ${search.stockPrefix.length}`);
  loopThroughSplittedText(search.stockPrefix);
}, 2000);


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
      setTimeout(function () {
        getContentOfName(splittedText[i]);
        console.log(`- Search of prefix '${splittedText[i]}'`);
      }, 1000 * i);
    })(i);
  };
}

function getContentOfName(prefix) {
  let a;
  const path = search.setURL.path
    .replace('{language}', search.language)
    .replace('{country}', search.country)
    .replace('{prefix}', prefix);

  const options = {
    host: 'www.set.or.th',
    path: path
  }

  var request = https.request(options, function (res) {
    var data = '';
    res.on('data', function (chunk) {
        data += chunk;
    });
    res.on('end', function () {
      a = data.match(/"">(.+)<\/a>/g);
      a.forEach( elem => {
        appendTXT('./tmp/list-stock.txt', '\n' + elem.replace('"">', '').replace('</a>',''));
      });
    });
  });
  request.on('error', function (e) {
    console.log(e.message);
  });
  request.end();
}