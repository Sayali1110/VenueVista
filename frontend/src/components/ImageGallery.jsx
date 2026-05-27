import { useEffect, useState } from 'react';
import { Box, Dialog, DialogContent, Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function ImageGallery({ images = [], title }) {
  const safeImages = images.length ? images : [];
  const [selected, setSelected] = useState(safeImages[0] || '');
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    setSelected(safeImages[0] || '');
  }, [safeImages[0]]);

  if (!selected) {
    return null;
  }

  return (
    <>
      <Box
        component="img"
        src={selected}
        alt={title}
        onClick={() => setPreviewOpen(true)}
        sx={{
          width: '100%',
          aspectRatio: '4 / 3',
          objectFit: 'cover',
          borderRadius: 2,
          cursor: 'zoom-in',
          boxShadow: '0 18px 44px rgba(31, 45, 43, 0.16)'
        }}
      />
      {safeImages.length > 1 ? (
        <Grid container spacing={1.25} sx={{ mt: 1 }}>
          {safeImages.map((imageUrl) => (
            <Grid item xs={3} sm={2} key={imageUrl}>
              <Box
                component="button"
                type="button"
                onClick={() => setSelected(imageUrl)}
                sx={{
                  p: 0,
                  border: imageUrl === selected ? 2 : 1,
                  borderColor: imageUrl === selected ? 'primary.main' : 'divider',
                  borderRadius: 1,
                  overflow: 'hidden',
                  width: '100%',
                  bgcolor: 'transparent',
                  cursor: 'pointer'
                }}
              >
                <Box
                  component="img"
                  src={imageUrl}
                  alt={`${title} thumbnail`}
                  sx={{ display: 'block', width: '100%', aspectRatio: '1 / 1', objectFit: 'cover' }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : null}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="lg" fullWidth>
        <DialogContent sx={{ p: 1, position: 'relative' }}>
          <IconButton
            aria-label="Close preview"
            onClick={() => setPreviewOpen(false)}
            sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'background.paper' }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src={selected}
            alt={title}
            sx={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', display: 'block' }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ImageGallery;

