const { spawn, execSync } = require("child_process");

const powershellCommand = "Get-Date";
const powershell = spawn("powershell.exe", [
  "-NoLogo",
  "-NoProfile",
  "-NonInteractive",
  "-ExecutionPolicy",
  "Bypass",
  "-Command",
  powershellCommand,
]);



function getSystem(id) {
  let UUID = execSync(
      "powershell.exe (Get-CimInstance -Class Win32_ComputerSystemProduct).UUID"
    )
      .toString()
      .split("\r\n")[0],
    MacAddress = execSync(
      "powershell.exe (Get-CimInstance -ClassName 'Win32_NetworkAdapter' -Filter 'NetConnectionStatus = 2').MACAddress"
    )
      .toString()
      .split("\r\n")[0],
    ProductKey = execSync(
      "powershell.exe (Get-WmiObject -query 'select * from SoftwareLicensingService').OA3xOriginalProductKey"
    )
      .toString()
      .split("\r\n")[0],
    localIP = execSync("powershell.exe (Get-NetIPAddress).IPAddress")
      .toString()
      .split("\r\n")[0],
    getIPAddress = execSync(
      "powershell.exe (Resolve-DnsName -Name myip.opendns.com -Server 208.67.222.220).IPAddress"
    )
      .toString()
      .split("\r\n")[0];
}

module.exports = { getSystem };
