const { app } = require('electron');
const fs = require('fs');
const path = require('path');

let resolvedDbPath = null;
function getDbPath() {
  if (!resolvedDbPath) {
    resolvedDbPath = path.join(app.getPath('userData'), 'database.json');
  }
  return resolvedDbPath;
}

const defaultData = {
  turmas: [],
  alunos: [],
  emprestimos: []
};

function init() {
  const dbPath = getDbPath();
  if (!fs.existsSync(dbPath)) {
    try {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
      fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2), 'utf-8');
      console.log('Database initialized at:', dbPath);
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }
}

function read() {
  init();
  const dbPath = getDbPath();
  try {
    const content = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading database file, returning default:', error);
    return defaultData;
  }
}

function write(data) {
  init();
  const dbPath = getDbPath();
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to database file:', error);
    return false;
  }
}

module.exports = {
  get dbPath() { return getDbPath(); },
  init,
  read,
  write
};
