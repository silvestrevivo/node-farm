const http = require('http');
const fs = require('fs');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const {pathname: pathName, query} = url.parse(req.url, true);

  // Overview Page
  if(pathName === '/' || pathName === '/overview'){
    res.writeHead(200, {'Content-Type': 'text/html'});

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);

  // Product Page
  } else if(pathName === '/product'){
    res.writeHead(200, {'Content-Type': 'text/html'});
    const product = dataObj[query.id];

    const output = replaceTemplate(tempProduct, product)

    res.end(output);

  // API
  } else if (pathName === '/api'){
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(data);

  // Not Found
  } else {
    res.writeHead(400, {
      'Content-Type': 'text/html',
      'my-own-header': 'hello world'
    });
    res.end('<h1>Page not found!</h1>')
  }
})

server.listen(3000, () => {
  console.log('server listening to localhost://3000');
})

