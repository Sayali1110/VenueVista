import AcUnitIcon from '@mui/icons-material/AcUnit';
import ChairIcon from '@mui/icons-material/Chair';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PetsIcon from '@mui/icons-material/Pets';
import WifiIcon from '@mui/icons-material/Wifi';

export const amenityOptions = [
  { key: 'wifi', label: 'WiFi', icon: WifiIcon },
  { key: 'parking', label: 'Parking', icon: LocalParkingIcon },
  { key: 'outdoor_seating', label: 'Outdoor Seating', icon: ChairIcon },
  { key: 'pet_friendly', label: 'Pet Friendly', icon: PetsIcon },
  { key: 'air_conditioning', label: 'Air Conditioning', icon: AcUnitIcon },
  { key: 'live_music', label: 'Live Music', icon: MusicNoteIcon },
  { key: 'family_friendly', label: 'Family Friendly', icon: FamilyRestroomIcon }
];

export const priceRanges = ['Budget', 'Moderate', 'Premium', 'Luxury'];

export const getEnabledAmenities = (place) =>
  amenityOptions.filter((amenity) => Boolean(place?.[amenity.key]));
