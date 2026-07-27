const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'Fitness', 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const urlRegex = /['"]http:\/\/localhost:5000\/api([^'"]*)['"]/g;
const backtickRegex = /`http:\/\/localhost:5000\/api([^`]*)`/g;
const imgRegex = /`http:\/\/localhost:5000\$\{([^}]*)\}`/g;

walkDir(directoryPath, (filePath) => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace string literals: 'http://localhost:5000/api/...' -> `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/...`
    content = content.replace(urlRegex, (match, p1) => {
      return `\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}${p1}\``;
    });

    // Replace backticks: `http://localhost:5000/api/...` -> `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/...`
    content = content.replace(backtickRegex, (match, p1) => {
      return `\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}${p1}\``;
    });

    // Replace image backticks: `http://localhost:5000${...}` -> `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}${...}`
    content = content.replace(imgRegex, (match, p1) => {
      return `\`\${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}\${${p1}}\``;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  }
});

console.log('Done!');
