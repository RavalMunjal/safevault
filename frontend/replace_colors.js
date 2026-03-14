const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Background replacements
    content = content.replace(/bg-slate-50\b/g, 'bg-lightBase');
    content = content.replace(/dark:bg-slate-900\b/g, 'dark:bg-darkBase');
    content = content.replace(/dark:bg-slate-800\b/g, 'dark:bg-darkCard');
    
    // Brand color replacements
    content = content.replace(/from-indigo-600 to-indigo-500/g, 'from-primary to-primary/80');
    content = content.replace(/hover:from-indigo-700 hover:to-indigo-600/g, 'hover:from-primary/90 hover:to-primary');
    content = content.replace(/text-indigo-600/g, 'text-primary');
    content = content.replace(/dark:text-indigo-400/g, 'dark:text-primary');
    content = content.replace(/text-indigo-500/g, 'text-primary');
    content = content.replace(/dark:text-indigo-300/g, 'dark:text-primary/80');
    content = content.replace(/ring-indigo-500/g, 'ring-primary');
    content = content.replace(/border-indigo-500/g, 'border-primary');
    content = content.replace(/border-indigo-100/g, 'border-primary/20');
    content = content.replace(/border-indigo-200/g, 'border-primary/30');
    content = content.replace(/dark:border-indigo-800\/50/g, 'dark:border-primary/30');
    content = content.replace(/bg-indigo-50\b/g, 'bg-primary/10');
    content = content.replace(/bg-indigo-100\b/g, 'bg-primary/20');
    content = content.replace(/dark:bg-indigo-900\/30/g, 'dark:bg-primary/20');
    content = content.replace(/dark:bg-indigo-900\/50/g, 'dark:bg-primary/30');
    
    // Decorative glows
    content = content.replace(/bg-indigo-500\/20/g, 'bg-primary/20');
    content = content.replace(/bg-emerald-500\/20/g, 'bg-accent/20');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Updated ' + filePath);
    }
  }
});
