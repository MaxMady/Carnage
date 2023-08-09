const https = require('https');
const fs = require('fs');
const { webhook } = require('./manager/config');

// Replace 'YOUR_WEBHOOK_URL' with your actual Discord webhook URL
const webhookUrl = webhook

// String content to be sent as a text file
const textContent = "This is the content of the text file.";

// Prepare the payload data
const boundary = '-------------------------' + Date.now();
const data = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="file.txt"\r\nContent-Type: text/plain\r\n\r\n${textContent}\r\n--${boundary}--\r\n`;

// Prepare the request options
const options = {
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
  },
};

// Send a POST request to the Discord webhook
const request = https.request(webhookUrl, options, response => {
  let responseData = '';
  response.on('data', chunk => {
    responseData += chunk;
  });
  response.on('end', () => {
    if (response.statusCode === 204) {
      console.log("Text file sent successfully to the webhook.");
    } else {
      console.error(`Failed to send text file. Status code: ${response.statusCode}`);
      console.error(responseData);
    }
  });
});

// Write the payload data to the request body
request.write(data);

// End the request
request.end();
