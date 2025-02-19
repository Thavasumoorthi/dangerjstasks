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

//Rule 6:Ensure PR have assignee
const pr = danger.github.pr
if (pr.assignee === null) {
  fail("Please assign someone to merge this PR, and optionally include people who should review.");
}


//Rule 7:

const modifiledFiles =danger.git.modified_files
const createdFiles=danger.git.created_files


const sourceFile='src/user.js';
const testFile='test/usertest.js'

// Check if the main file was modified or created
const mainFileChanged = modifiledFiles.includes(sourceFile) || createdFiles.includes(sourceFile);

// Check if the corresponding test file was modified or created
const testFileChanged = modifiledFiles.includes(testFile) || createdFiles.includes(testFile);

// Warn or fail if the main file was changed but the test file was not
if (mainFileChanged && !testFileChanged) {

  warn("main file changed but test file or nit changed")
}



// All checks passed message
message("✅ All Danger.js checks passed successfully!");
