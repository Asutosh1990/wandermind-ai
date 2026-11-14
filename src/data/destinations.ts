
import type { Destination } from '../types'

export const destinations: Destination[] = [
  // INDIA
  {
    id: 'munnar',
    name: 'Munnar',
    region: 'Kerala, India',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000',
    budget: 18000,
    days: 4,
    season: 'October – March',
    moods: ['Peaceful', 'Nature', 'Romantic'],
    description: 'Rolling tea gardens, misty hills and slow mornings in the Western Ghats.',
    reason: 'A calm nature escape with scenic viewpoints and a relaxed pace.',
    crowdLevel: 'Moderate'
  },
  {
    id: 'coorg',
    name: 'Coorg',
    region: 'Karnataka, India',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1000',
    budget: 16000,
    days: 3,
    season: 'October – May',
    moods: ['Peaceful', 'Nature', 'Adventure'],
    description: 'Coffee estates, forest trails and cosy stays surrounded by greenery.',
    reason: 'A close-to-home retreat with a mix of nature and gentle adventure.',
    crowdLevel: 'Low'
  },
  {
    id: 'varkala',
    name: 'Varkala',
    region: 'Kerala, India',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000',
    budget: 22000,
    days: 4,
    season: 'October – March',
    moods: ['Peaceful', 'Romantic', 'Food'],
    description: 'Cliffside cafés, golden sunsets and laid-back coastal experiences.',
    reason: 'Ideal for an unhurried coastal break with memorable sunsets.',
    crowdLevel: 'High'
  },
  {
    id: 'wayanad',
    name: 'Wayanad',
    region: 'Kerala, India',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1000',
    budget: 20000,
    days: 4,
    season: 'October – May',
    moods: ['Nature', 'Adventure', 'Offbeat'],
    description: 'Waterfalls, forest landscapes and quiet mountain roads.',
    reason: 'Good balance of outdoor activities and peaceful surroundings.',
    crowdLevel: 'Low'
  },

  // INTERNATIONAL
  {
    id: 'bali',
    name: 'Bali',
    region: 'Bali, Indonesia',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000',
    budget: 65000,
    days: 5,
    season: 'April – October',
    moods: ['Peaceful', 'Nature', 'Romantic', 'Adventure'],
    description: 'Tropical beaches, beautiful rice terraces, waterfalls and rich cultural experiences.',
    reason: 'A wonderful escape for couples and travellers seeking nature, relaxation and adventure.',
    crowdLevel: 'Moderate'
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    region: 'Bangkok, Thailand',
    country: 'Thailand',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1000',
    budget: 45000,
    days: 4,
    season: 'November – February',
    moods: ['Food', 'Culture', 'Adventure'],
    description: 'Vibrant street food, beautiful temples, shopping streets and exciting nightlife.',
    reason: 'A great choice for travellers who enjoy food, culture and energetic city experiences.',
    crowdLevel: 'High'
  },
  {
    id: 'singapore',
    name: 'Singapore',
    region: 'Singapore',
    country: 'Singapore',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1000',
    budget: 70000,
    days: 4,
    season: 'Year-round',
    moods: ['Adventure', 'Food', 'Culture'],
    description: 'Modern attractions, beautiful gardens, waterfront views and diverse food experiences.',
    reason: 'Ideal for a short international holiday with convenient transport and city attractions.',
    crowdLevel: 'High'
  },
  {
    id: 'dubai',
    name: 'Dubai',
    region: 'Dubai, UAE',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1000',
    budget: 75000,
    days: 5,
    season: 'November – March',
    moods: ['Adventure', 'Food', 'Culture'],
    description: 'Impressive architecture, desert adventures, beautiful beaches and shopping experiences.',
    reason: 'Suitable for travellers looking for a combination of luxury, entertainment and adventure.',
    crowdLevel: 'High'
  },
  {
    id: 'phuket',
    name: 'Phuket',
    region: 'Phuket, Thailand',
    country: 'Thailand',
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1000',
    budget: 55000,
    days: 5,
    season: 'November – April',
    moods: ['Peaceful', 'Romantic', 'Nature', 'Adventure'],
    description: 'Tropical beaches, island experiences, coastal views and relaxing seaside stays.',
    reason: 'A great option for beach lovers and couples looking for a tropical getaway.',
    crowdLevel: 'Moderate'
  },
  {
    id: 'colombo',
    name: 'Colombo',
    region: 'Colombo, Sri Lanka',
    country: 'Sri Lanka',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd524a0b?w=1000',
    budget: 50000,
    days: 4,
    season: 'Varies by region and monsoon',
    moods: ['Culture', 'Food', 'Nature', 'Offbeat'],
    description: 'Discover Sri Lankan cuisine, coastal experiences, heritage and nearby attractions.',
    reason: 'A good starting point for travellers interested in culture and exploring Sri Lanka.',
    crowdLevel: 'Moderate'
  }
]
