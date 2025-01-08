import { danger, warn, fail, message } from "danger";

// Rule 1: Ensure PR has a proper title and description
if (danger.github.pr.title.length < 10) {
  fail("PR title should be at least 10 characters long.");
}

if (!danger.github.pr.body || danger.github.pr.body.length < 20) {
  fail("PR description should provide enough context (at least 20 characters).");
}

// Rule 2: Warn if sensitive files are modified
const sensitiveFiles = ["config.yml", "secrets.env"];
const modifiedFiles = danger.git.modified_files;

sensitiveFiles.forEach((file) => {
  if (modifiedFiles.includes(file)) {
    warn(`Sensitive file "${file}" was modified. Please review carefully.`);
  }
});

// Rule 3: Fail if console.log() is used in JS/TS files
const newOrModifiedFiles = [
  ...danger.git.modified_files,
  ...danger.git.created_files,
];

newOrModifiedFiles.forEach(async (file) => {
  if (file.endsWith(".js") || file.endsWith(".ts")) {
    const fileContent = await danger.github.utils.fileContents(file);
    if (fileContent.includes("console.log")) {
      fail(`Please remove console.log from ${file}`);
    }
  }
});

// Rule 4: Fail if no tests are updated for source changes
const srcFiles = modifiedFiles.filter((file) => file.startsWith("src/"));
const testFiles = modifiedFiles.filter((file) => file.startsWith("tests/"));

if (srcFiles.length > 0 && testFiles.length === 0) {
  fail("You modified source files but did not add or update any tests.");
}



//Rule 5:changes made to the Lockfile/package.json

const packageChanged = danger.git.modified_files.includes('package.json');
if(packageChanged)
{
  fail("Changes were made to package.json")
}


// All checks passed message
message("✅ All Danger.js checks passed successfully!");
