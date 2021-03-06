const { remote, ipcRenderer, shell } = require('electron')
const fs = require('fs')
const md = require("markdown").markdown
let runFromSource = remote.getGlobal('runFromSource')
document.addEventListener("DOMContentLoaded", function(event) {
  let mdPath = "resources/app.asar/legal/tos.md"
  if (runFromSource) {
    mdPath = "legal/tos.md"
  }
  fs.readFile(mdPath, "utf-8", (error, fileContents) => {
    console.log(error)
    console.log(fileContents)
    let fileLines = fileContents.split("\n")
    fileContents = "";
    fileLines.forEach(line => {
      if (line.startsWith("#")) {
        fileContents += "##" + line;
      } else {
        fileContents += line;
      }
    })
    document.getElementById("terms_container").innerHTML = md.toHTML(fileContents)
    $(document).on('click', 'a[href^="http"]', function(event) {
      event.preventDefault();
      shell.openExternal(this.href);
    });
    $("#agree").click(e => {
      ipcRenderer.send('tosAgreed', {agreed: true})
    })
  })
})