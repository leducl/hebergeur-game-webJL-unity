const express = require('express');
const fileUpload = require('express-fileupload');
const unzipper = require('unzipper');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(fileUpload());
app.use(express.static('public'));

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

app.get('/', (req, res) => {
  const gamesPath = path.join(__dirname, 'public', 'games');
  ensureDir(gamesPath);
  const games = fs.readdirSync(gamesPath).filter(name => fs.lstatSync(path.join(gamesPath, name)).isDirectory());
  let html = '<h1>Unity WebGL Games</h1><ul>';
  for (const game of games) {
    const builds = fs.readdirSync(path.join(gamesPath, game)).filter(b => fs.lstatSync(path.join(gamesPath, game, b)).isDirectory());
    for (const build of builds) {
      html += `<li><a href="/games/${game}/${build}/index.html">${game} - ${build}</a></li>`;
    }
  }
  html += '</ul><a href="/upload">Upload new build</a>';
  res.send(html);
});

app.get('/upload', (req, res) => {
  const form = `
    <h1>Upload Unity WebGL Build</h1>
    <form method="post" enctype="multipart/form-data" action="/upload">
      Game Name: <input type="text" name="game" required><br>
      Build Zip: <input type="file" name="build" accept=".zip" required><br>
      <button type="submit">Upload</button>
    </form>`;
  res.send(form);
});

app.post('/upload', async (req, res) => {
  if (!req.files || !req.files.build || !req.body.game) {
    return res.status(400).send('Missing game name or build file');
  }
  const game = req.body.game.replace(/[^a-zA-Z0-9_-]/g, '');
  const uploadPath = path.join(__dirname, 'uploads');
  ensureDir(uploadPath);
  const buildFile = req.files.build;
  const timestamp = Date.now().toString();
  const gameDir = path.join(__dirname, 'public', 'games', game, timestamp);
  ensureDir(gameDir);
  const zipPath = path.join(uploadPath, `${game}-${timestamp}.zip`);
  await buildFile.mv(zipPath);
  fs.createReadStream(zipPath).pipe(unzipper.Extract({ path: gameDir }))
    .on('close', () => res.redirect('/'));
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
