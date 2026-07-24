import express from 'express';
import { uploadMedia } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/', uploadMedia);

export default router;
