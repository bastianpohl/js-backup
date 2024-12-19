const fs = require("fs");
const path = require("path");
const readline = require("readline");

const parseCsv = () =>  fs
    .readFileSync("./config.csv", "utf8")
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => line.split(";"))
    .map(([file, backup]) => ({ file, backup }))

const loadFiles = (files) =>
    files.map((item) => {
    // Normalize path separators for current OS
    let file = item.file.replace(/[\/\\]/g, path.sep);
    let backup = item.backup.replace(/[\/\\]/g, path.sep);
    return { file, backup };
  });

const backupSingleFile = (item) => {
  try {
    fs.copyFileSync(item.file, item.backup);
    const timestamp = new Date().toISOString();
    const successMessage = `${timestamp}: Successfully backed up ${item.file} to ${item.backup}\n`;
    logger(successMessage);
  } catch (error) {
    const timestamp = new Date().toISOString();
    const errorMessage = `${timestamp}: Error backing up ${item.file} to ${item.backup}: ${error.message}\n`;
    logger(errorMessage);
  }
};

const logger = (message) => {
  if (!fs.existsSync("log.txt")) {
    console.log("Creating log file");
    fs.writeFileSync("log.txt", "");
  }
  fs.appendFileSync("log.txt", message);
};

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
      const timestamp = new Date().toISOString();
      const skipMessage = `${timestamp}: Skipped restoring to ${file}\n`;
      logger(skipMessage);
      return false;
    }
  }
  return true;
};

const restoreSingleFile = async (item) => {
  try {
    if (await confirmOverwrite(item.file)) {
      fs.copyFileSync(item.backup, item.file);
      const timestamp = new Date().toISOString();
      const successMessage = `${timestamp}: Successfully restored ${item.backup} to ${item.file}\n`;
      logger(successMessage);
    }
  } catch (error) {
    const timestamp = new Date().toISOString();
    const errorMessage = `${timestamp}: Error restoring ${item.backup} to ${item.file}: ${error.message}\n`;
    logger(errorMessage);
  }
};

const paths = parseCsv();
const files = loadFiles(paths);

const args = process.argv.slice(2);

const askMode = () => {
  return new Promise((resolve) => {
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
};

const executeMode = async () => {
  let mode;
  if (args.includes("--backup")) {
    mode = "1";
  } else if (args.includes("--restore")) {
    mode = "2";
  } else {

    mode = await askMode();
  }

  if (mode === "1") {
    files.forEach((file) => backupSingleFile(file));
  } else if (mode === "2") {
    files.forEach((file) => restoreSingleFile(file));
  } else {
    console.log("Invalid selection. Please provide a valid argument: --backup or --restore");
  }
};

executeMode();