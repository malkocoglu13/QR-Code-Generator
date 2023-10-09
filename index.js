import express from 'express';
import qr from 'qr-image';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: false }));


app.use(express.static('public'));


app.get('/', (req, res) => {
  res.render('index');
});


app.post('/generate', async (req, res) => {
  const url = req.body.url;
  const qr_svg = qr.imageSync(url, { type: 'png' });

  try {
    await fs.writeFile(join(__dirname, 'public/qr_img.png'), qr_svg);
    await fs.writeFile(join(__dirname, 'public/URL.txt'), url);
    console.log('The files have been saved!');
  } catch (err) {
    console.error('Error saving the files:', err);
  }

  res.render('generated', { url });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
