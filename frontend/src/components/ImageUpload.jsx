import { useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { uploadImage } from '../api/upload.js';

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const maxSize = 5 * 1024 * 1024;

function ImageUpload({ images, onChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      return 'Only jpg, jpeg, png, and webp images are allowed.';
    }

    if (file.size > maxSize) {
      return 'Each image must be 5MB or smaller.';
    }

    return '';
  };

  const handleFiles = async (files) => {
    const selected = Array.from(files || []);
    if (!selected.length) return;

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const uploaded = [];

      for (const file of selected) {
        const validationError = validateFile(file);
        if (validationError) {
          throw new Error(validationError);
        }

        const imageUrl = await uploadImage(file, (event) => {
          if (event.total) {
            setProgress(Math.round((event.loaded * 100) / event.total));
          }
        });
        uploaded.push(imageUrl);
      }

      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = (imageUrl) => {
    onChange(images.filter((image) => image !== imageUrl));
  };

  return (
    <Stack spacing={2}>
      <Paper
        variant="outlined"
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        sx={{
          p: 3,
          textAlign: 'center',
          borderStyle: 'dashed',
          bgcolor: dragging ? 'action.hover' : 'background.paper'
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          hidden
          onChange={(event) => handleFiles(event.target.files)}
        />
        <Stack spacing={1.5} alignItems="center">
          {uploading ? <CircularProgress /> : <CloudUploadIcon color="primary" sx={{ fontSize: 44 }} />}
          <Typography variant="h6">Upload place images</Typography>
          <Typography variant="body2" color="text.secondary">
            Drag and drop images here, or choose files from your device.
          </Typography>
          <Button variant="outlined" onClick={() => inputRef.current?.click()} disabled={uploading}>
            Choose Images
          </Button>
          {uploading ? <LinearProgress variant="determinate" value={progress} sx={{ width: '100%', mt: 1 }} /> : null}
        </Stack>
      </Paper>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {images.length ? (
        <Grid container spacing={2}>
          {images.map((imageUrl) => (
            <Grid item xs={6} sm={4} key={imageUrl}>
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={imageUrl}
                  alt="Uploaded place"
                  sx={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: 1 }}
                />
                <IconButton
                  aria-label="Remove image"
                  onClick={() => removeImage(imageUrl)}
                  sx={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.paper' }
                  }}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : null}
    </Stack>
  );
}

export default ImageUpload;

