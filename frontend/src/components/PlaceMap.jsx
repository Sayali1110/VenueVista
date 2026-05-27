import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { Box, Typography } from '@mui/material';

const markerIcon = L.divIcon({
  className: 'venuevista-marker',
  html: '<div></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

function PlaceMap({ name, latitude, longitude }) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return null;
  }

  const position = [latitude, longitude];

  return (
    <Box
      sx={{
        height: { xs: 280, md: 360 },
        borderRadius: 2,
        overflow: 'hidden',
        '& .leaflet-container': { height: '100%', width: '100%' },
        '& .venuevista-marker div': {
          width: 20,
          height: 20,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          border: '3px solid white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.35)'
        }
      }}
    >
      <MapContainer center={position} zoom={14} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={markerIcon}>
          <Popup>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="caption">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </Typography>
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
}

export default PlaceMap;
