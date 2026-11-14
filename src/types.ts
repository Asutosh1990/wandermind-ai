
export type Destination = {
  id: string
  name: string
  region: string
  country?: string
  image: string
  budget: number
  days: number
  season: string
  moods: string[]
  description: string
  reason: string
  crowdLevel: 'Low' | 'Moderate' | 'High'
}
