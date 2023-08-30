const request = require('request');
const fs = require('fs');
const readline = require('readline');

// get command-line arguments
const args = process.argv.slice(2);

// ensure there are two cmd args
if (args.length !== 2) {
  console.log("Need exactly 2 parameters");
  process.exit();
}

// store the url and localpath
const url = args[0];
const filePath = args[1];

// cheack if file exists
// reference: https://flaviocopes.com/how-to-check-if-file-exists-node/
fs.access(filePath, fs.F_OK, (err) => {
  if (!err) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(`The file '${filePath}' already exists. Would you like to overwrite it? (y/n): `, answer => {
      rl.close();
      if (answer.toLowerCase() === 'y') {
        makeRequest();
      } else {
        console.log("Exiting program");
      }
    });

  } else {
    makeRequest();
  }
});

// http request
const makeRequest = () => {
  request(url, (error, response, body) => {
    if (error) {
      console.log("Error downloading from URL")
    }
  
    // file length
    const fileLength = body.length;
  
    // write the file
    fs.writeFile(filePath, body, err => {
      if (err) {
        console.log("Error saving file", err);
      } else {
        console.log(`Downloaded and saved ${fileLength} bytes to ${filePath}`)
      }
    });
  });

}