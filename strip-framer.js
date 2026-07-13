const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
};

const files = walk('k:/Ajraksha/client/src');
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('framer-motion')) {
    // 1. Remove import
    content = content.replace(/import\s+{([^}]+)}\s+from\s+['"]framer-motion['"];?\n?/g, '');
    
    // 2. Remove AnimatePresence tags
    content = content.replace(/<AnimatePresence[^>]*>/g, '');
    content = content.replace(/<\/AnimatePresence>/g, '');
    
    // 3. Replace <motion.xxx with <xxx
    content = content.replace(/<motion\.([a-zA-Z0-9]+)/g, '<$1');
    content = content.replace(/<\/motion\.([a-zA-Z0-9]+)>/g, '</$1>');
    
    // 4. Remove framer-motion specific props
    content = content.replace(/\s+(initial|animate|exit|transition|whileHover|whileTap|layoutId|layout)={[^}]+}/g, '');
    content = content.replace(/\s+(initial|animate|exit|transition|whileHover|whileTap|layoutId|layout)="[^"]*"/g, '');
    
    fs.writeFileSync(file, content);
    console.log(`Stripped framer-motion from ${file}`);
    changedCount++;
  }
});

console.log(`\nDone. Updated ${changedCount} files.`);
