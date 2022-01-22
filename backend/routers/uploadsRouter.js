import multer from 'multer';
import express from 'express';
import { isAuth } from '../utils.js';

const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination(req, files, xy) {    
    xy(null, 'uploads/');
  },
  filename(req, files, xy) {
    xy(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });

// => /api/uploads
uploadRouter.post('/', isAuth, upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});

export default uploadRouter;
