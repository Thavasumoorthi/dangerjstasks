/*1)

const { execSync } = require('child_process');
import { danger, warn, fail, message } from "danger";

try {
  // Get modified files (unstaged)
  const modifiedFiles = execSync('git diff --name-only').toString().split('\n').filter(Boolean);

  console.log("modifiedFiles is ",modifiedFiles)

  // Get created (added) files (staged)
  const createdFiles = execSync('git diff --name-only --cached').toString().split('\n').filter(Boolean);
 
  console.log("created file is ",createdFiles)



  // Combine both modified and created files
  const allFiles = [...modifiedFiles, ...createdFiles];

  console.log("Modified and Created Files:", allFiles);

  // Check if there are any modified or added files and show warning or failure
  if (allFiles.length > 0) {
    // You can apply any condition here for specific file types or any other check
    if (allFiles.some(file => file.endsWith('.js') || file.endsWith('.ts'))) {
      warn("⚠️ You have modified or created JavaScript/TypeScript files. Please review your changes.");
    }

    // Example of failure condition (if you have specific files you don't want to see added or modified)
    if (allFiles.some(file => file.includes('sensitive'))) {
      fail("❌ Sensitive files should not be modified or added.");
    }
  } else {
    warn("⚠️ No modified or created files detected.");
  }

} catch (error) {
  console.error("Error fetching files:", error);
}

*/

/*
//2)--------------------------------

import { danger, warn, fail, message } from "danger";


console.log("added file is",danger.git.created_files)
console.log("modified file is",danger.git.modified_files)
*/


//3)--------------------------
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


//Rule 7:check if both source and test case file written

const modifiledFiles =danger.git.modified_files
const createdFiles=danger.git.created_files


const sourceFile='src/user.js';
const testFile='test/usertest.js'

const mainFileChanged = modifiledFiles.includes(sourceFile) || createdFiles.includes(sourceFile);

const testFileChanged = modifiledFiles.includes(testFile) || createdFiles.includes(testFile);

if (mainFileChanged && !testFileChanged) {

  warn("main file changed but test file or nit changed")
}



// All checks passed message
message("✅ All Danger.js checks passed successfully!");


