// const http = require('https');

// const options = {
// 	method: 'GET',
// 	hostname: 'real-time-amazon-data.p.rapidapi.com',
// 	port: null,
// 	path: '/product-details?asin=B07ZPKBL9V&country=US',
// 	headers: {
// 		'x-rapidapi-key': '3c0c4e7f51msh8d207356aba435fp15ff0fjsnb887eb6dbc2d',
// 		'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com'
// 	}
// };

// const req = http.request(options, function (res) {
// 	const chunks = [];

// 	res.on('data', function (chunk) {
// 		chunks.push(chunk);
// 	});

// 	res.on('end', function () {
// 		const body = Buffer.concat(chunks);
// 		console.log(body.toString());
// 	});
// });

// req.end();

const https = require('https'); // ✅ use https, not http

const options = {
  method: 'GET',
  hostname: 'real-time-amazon-data.p.rapidapi.com',
  path: '/product-details?asin=B07ZPKBL9V&country=US',
  headers: {
    'x-rapidapi-key': '3c0c4e7f51msh8d207356aba435fp15ff0fjsnb887eb6dbc2d', // ⚠️ replace with your working key
    'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com'
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const jsoon = JSON.parse(data);
      console.log('✅ API Response:', JSON.stringify(jsoon, null, 2));
      
    } catch (err) {
      console.error('❌ Error parsing response:', err.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('⚠️ Request failed:', error);
});

req.end();
