const { log } = require("console");
const fs = require("fs");
const { connect } = require("http2");
const path = require("path");
const readline = require("readline");

const args = process.argv.slice(2);
let paths;
let files; 
let mode;

// Load files from config file
const loadFiles = () => {
  const configPath = args[1];
  
  if (!configPath) {
    console.error("Please provide the path to the config file as the second argument.");
    process.exit(1);
  }

  return fs
    .readFileSync(configPath, "utf8")
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => line.split(";"))
    .map(([file, backup]) => ({ file, backup }));
};

// Normalize path separators for current OS
const handlePaths = (files) =>
    files.map((item) => {
    // Normalize path separators for current OS
    let file = item.file.replace(/[\/\\]/g, path.sep);
    let backup = item.backup.replace(/[\/\\]/g, path.sep);
    return { file, backup };
  });

// Backup a single file 
const backupSingleFile = (item) => {
  try {
    fs.copyFileSync(item.file, item.backup);
    let message = `Successfully backed up ${item.file} to ${item.backup}\n`;
    logger(message);
  } catch (error) {
    let = `Error backing up ${item.file} to ${item.backup}: ${error.message}\n`;
    logger(message);  
  }
};

// Confirm overwrite of file if it already exists in mode restore to avoid accidental data loss
const confirmOverwrite = async (file) => {
  if (fs.existsSync(file)) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await new Promise((resolve) => {
      rl.question(`File ${file} already exists. Do you want to overwrite it? (yes/no): `, (answer) => {
        rl.close();
        resolve(answer);
      });
    });

    if (answer.trim().toLowerCase() !== "yes") {
      let skipMessage = `Skipped restoring to ${file}\n`;
      logger(skipMessage);
      return false;
    }
  }
  return true;
};

// Restore a single file
const restoreSingleFile = async (item) => {
  try {
    if (await confirmOverwrite(item.file)) {
      fs.copyFileSync(item.backup, item.file);
      let message = `Successfully restored ${item.backup} to ${item.file}\n`;
      logger(message);
    }
  } catch (error) {
    let message = `Error restoring ${item.backup} to ${item.file}: ${error.message}\n`;
    logger(message);
  }
};

//  check for valid parameter for restore mode
const checParameterForRestore = () => {
  let argument = args[1];

  if (!argument) return undefined;

  // if Number ist provided, return the index of the file as index for arra
  if (Number(argument)) {
    return Number(argument)-1;
  }

  if (String(argument)) {
    return files.findIndex(file => file.file === argument);
  }

  let message = "Invalid argument provided"; 
  logger(message);    
  process.exit(1);  
}

// Backup files 
const backup = (files) => { 
  files.forEach((file) => backupSingleFile(file));
}

// Restore files
const restore = (files) => {  
  // check if a parameter is provided for restore mode
  let fileIndex = checParameterForRestore(); 

  // no file found with the provided argument
  if (fileIndex === -1) {
    let message = "No File found with the provided argument";  
    logger(message);  
    process.exit(1);

  }

  // restore single file if a valid parameter is provided
  if (!fileIndex()) {
    restoreSingleFile(files[fileIndex]);
    process.exit(0);  
  } 

  // restore all files if no argument is provided
  files.forEach((file) => restoreSingleFile(file));
} 

// Loging function
const logger = (message) => {
  if (!fs.existsSync("log.txt")) {
    console.log("Creating log file");
    fs.writeFileSync("log.txt", "");
  }
  let timestamp = new Date().toISOString();
  let message = `${timestamp}: ${message}`;
  fs.appendFileSync("log.txt", message);
  console.log((message)); 
};

// Ask mode wehen no mode or no valid mode is provided
const askMode = async () => {
  const answer = await new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("Please select a mode:");
    console.log("1. Backup");
    console.log("2. Restore");

    rl.question("Enter the number of the mode you want to select: ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });

  if (answer.trim() === "1") {
    return "backup";
  } else if (answer.trim() === "2") {
    return "restore";
  } else {
    let message = "Invalid mode selected";  
    logger(message);  
    process.exit(1);
  }
};

// Get mode
const getMode = async () => {
  const backup = args.includes("--backup");
  const restore = args.includes("--restore");

  if (backup && restore) {
    let message = "Please provide a valid argument: --backup or --restore";
    logger(message);  
    process.exit(1);
  }

  if (!backup && !restore) {
    return await askMode();
  }

  return backup ? "backup" : "restore";
};

// Execute mode
const executeMode = () => { 
  const validMods = ["backup", "restore"]; 

  if (!validMods.includes(mode)) {
    let message = "Invalid mode selected";
    logger(message);
    process.exit(1);
  }
  // execute mode cause a function with the same name as the mode exists
  eval(mode)(files);  
};

// Main function
mode = getMode();
paths = loadFiles();
files = handlePaths(paths);
executeMode();