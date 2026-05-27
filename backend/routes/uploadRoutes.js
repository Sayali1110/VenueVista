import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter(_req, file, callback) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(new Error('Only jpg, jpeg, png, and webp images are allowed.'));
      return;
    }

    callback(null, true);
  }
});

const router = Router();

router.post('/', protect, upload.single('image'), uploadImage);

export default router;
