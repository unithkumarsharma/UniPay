import fs from 'fs';
import path from 'path';

const APP_DIR = path.join(process.cwd(), 'src', 'app');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = getAllFiles(APP_DIR);
console.log(`Scanning ${allFiles.length} page/API files in src/app ...`);

let issuesFound = 0;

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const relPath = path.relative(process.cwd(), file);

  // Check 1: Incorrect user property user.balance instead of user.walletBalance
  if (content.includes('user.balance') || content.includes('user?.balance')) {
    console.warn(`[WARN] ${relPath}: Found 'user.balance' property access (should be walletBalance)`);
    issuesFound++;
  }

  // Check 2: 'use client' missing in files using useState/useEffect/useAuth
  if ((content.includes('useState') || content.includes('useEffect') || content.includes('useAuth')) && !content.includes("'use client'") && !content.includes('"use client"')) {
    console.warn(`[WARN] ${relPath}: Uses React state/hooks but missing 'use client' directive`);
    issuesFound++;
  }

  // Check 3: Check for any console.error or swallowed exceptions without proper error return
  if (content.includes('catch (e) {}') || content.includes('catch (err) {}')) {
    console.warn(`[NOTICE] ${relPath}: Found empty catch block 'catch (e) {}'`);
  }
}

console.log(`Scan completed. Total potential issues flagged: ${issuesFound}`);
