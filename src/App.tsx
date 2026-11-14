import { useMemo, useState } from 'react'

import {
  Compass,
  Heart,
  UserRound,
  Sprout,
  Sparkles,
  Mic,
  MapPin,
  CalendarDays,
  Wallet,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  Check,
  LoaderCircle,
  Lightbulb,
  Clock,
  IndianRupee,
  Trash2
} from 'lucide-react'

import { destinations } from './data/destinations'
import type { Destination } from './types'

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type Tab = 'discover' | 'saved' | 'profile'

type Screen = 'discover' | 'results' | 'details'

type TravelScope = 'All' | 'India' | 'International'

type ExtractedPreferences = {
  budget: number | null
  duration: number | null
  moods: string[]
  crowdPreference: string
  travellers: string
  departureLocation: string
  travelScope: TravelScope
}

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type RankedDestination = Destination & {
  score: number
  matchReason: string
}

type ApiRecommendation = Omit<Destination, 'reason'> & {
  matchScore?: number
  matchReason?: string
  score?: number
  reason?: string
  estimatedTripBudget?: number
}

type AIResponse = {
  success: boolean
  needsMoreInfo: boolean
  question?: string | null
  missingFields?: string[]
  source: string
  model?: string
  preferences: ExtractedPreferences
  totalResults?: number
  recommendations?: ApiRecommendation[]
}

// Actual /api/destination-details response structure
type DestinationAIData = {
  destination: string
  overview: string
  highlights: string[]
  bestTime: string
  travelTips: string[]
}

// Actual /api/generate-itinerary response structure
type ItineraryActivity = {
  time: string
  activity: string
}

type ItineraryDay = {
  day: number
  title: string
  activities: ItineraryActivity[]
  estimatedCost?: number
}

type ItineraryData = {
  destination: string
  duration: number
  title?: string
  summary?: string
  days: ItineraryDay[]
  budgetSummary?: {
    accommodation?: number
    food?: number
    localTransport?: number
    activities?: number
    other?: number
    totalEstimated?: number
  }
  travelTips?: string[]
}

type DestinationDetailsResponse = {
  success: boolean
  source: string
  model: string
  destination: Destination
  details: DestinationAIData
}

type ItineraryResponse = {
  success: boolean
  source: string
  model: string
  destination: string
  duration: number
  estimatedTripBudget: number
  itinerary: ItineraryData
}

type SavedTrip = {
  id: string
  destination: Destination
  itinerary: ItineraryData
  savedAt: string
}

// --------------------------------------------------
// CONFIGURATION
// --------------------------------------------------

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000'

const moods = [
  'Peaceful',
  'Adventure',
  'Nature',
  'Romantic',
  'Food',
  'Culture',
  'Offbeat'
]

const moodEmojis = [
  '🌾',
  '🏕️',
  '🌿',
  '🌅',
  '🍜',
  '🏛️',
  '🌻'
]

const travelScopeOptions: {
  value: TravelScope
  label: string
  emoji: string
}[] = [
  {
    value: 'India',
    label: 'Within India',
    emoji: '🇮🇳'
  },
  {
    value: 'International',
    label: 'International',
    emoji: '✈️'
  }
]

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function formatCurrency(amount?: number | null) {
  if (
    typeof amount !== 'number' ||
    !Number.isFinite(amount)
  ) {
    return 'Not available'
  }

  return `₹${amount.toLocaleString('en-IN')}`
}

function matchesTravelScope(
  destination: Destination,
  scope: TravelScope
): boolean {
  const country = destination.country?.trim().toLowerCase()

  if (scope === 'All') return true

  if (scope === 'India') {
    return country === 'india'
  }

  if (scope === 'International') {
    return Boolean(country && country !== 'india')
  }

  return false
}

// --------------------------------------------------
// LOCAL STORAGE
// --------------------------------------------------

function readSavedDestinations(): string[] {
  try {
    const data = JSON.parse(
      localStorage.getItem('wandermind-saved') || '[]'
    )

    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function readSavedTrips(): SavedTrip[] {
  try {
    const data = JSON.parse(
      localStorage.getItem('wandermind-saved-trips') || '[]'
    )

    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

// --------------------------------------------------
// MAIN APP
// --------------------------------------------------

function App() {
  const [tab, setTab] = useState<Tab>('discover')
  const [screen, setScreen] = useState<Screen>('discover')

  const [prompt, setPrompt] = useState('')

  const [selectedMoods, setSelectedMoods] = useState<string[]>([])

  const [location, setLocation] = useState('')
  const [budget, setBudget] = useState('30000')
  const [duration, setDuration] = useState('4')
  const [travellers, setTravellers] = useState('Any')

  const [travelScope, setTravelScope] =
    useState<TravelScope>('India')

  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>([])

  const [followUpAnswer, setFollowUpAnswer] = useState('')

  const [extractedPreferences, setExtractedPreferences] =
    useState<ExtractedPreferences | null>(null)

  const [saved, setSaved] = useState<string[]>(
    readSavedDestinations
  )

  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>(
    readSavedTrips
  )

  const [isCurrentItinerarySaved, setIsCurrentItinerarySaved] =
    useState(false)

  const [activeDestination, setActiveDestination] =
    useState<Destination | null>(null)

  const [refinement, setRefinement] = useState('')

  const [aiResults, setAiResults] =
    useState<RankedDestination[]>([])

  const [isLoading, setIsLoading] = useState(false)

  const [aiError, setAiError] = useState('')

  const [recommendationSource, setRecommendationSource] =
    useState('')

  const [useLocalFallback, setUseLocalFallback] =
    useState(false)

  const [destinationAI, setDestinationAI] =
    useState<DestinationAIData | null>(null)

  const [isDetailsLoading, setIsDetailsLoading] =
    useState(false)

  const [detailsError, setDetailsError] = useState('')

  const [itinerary, setItinerary] =
    useState<ItineraryData | null>(null)

  const [isItineraryLoading, setIsItineraryLoading] =
    useState(false)

  const [itineraryError, setItineraryError] = useState('')

  // --------------------------------------------------
  // COMMON PREFERENCES
  // --------------------------------------------------

  function getTravelPreferences() {
    return {
      budget:
        extractedPreferences?.budget ??
        (Number(budget) || 30000),

      duration:
        extractedPreferences?.duration ??
        (Number(duration) || 4),

      moods:
        extractedPreferences?.moods ??
        selectedMoods,

      travellers:
        extractedPreferences?.travellers ??
        travellers,

      departureLocation:
        extractedPreferences?.departureLocation ??
        location,

      crowdPreference:
        extractedPreferences?.crowdPreference ??
        'Any',

      travelScope
    }
  }

  // --------------------------------------------------
  // LOCAL FALLBACK RECOMMENDATION ENGINE
  // --------------------------------------------------

  const localResults = useMemo(() => {
    const budgetLimit =
      extractedPreferences?.budget ??
      (Number(budget) || 30000)

    const selectedDuration =
      extractedPreferences?.duration ??
      (Number(duration) || 4)

    const activeMoods =
      extractedPreferences?.moods ??
      selectedMoods

    const crowdRank = {
      Low: 1,
      Moderate: 2,
      High: 3
    }

    const matches = destinations
      .filter(destination =>
        matchesTravelScope(destination, travelScope)
      )
      .map(destination => {
        const estimatedTripBudget = Math.ceil(
          (destination.budget / destination.days) *
            selectedDuration
        )

        return {
          ...destination,
          budget: estimatedTripBudget,
          days: selectedDuration
        }
      })
      .filter(destination =>
        destination.budget <= budgetLimit
      )
      .map(destination => {
        const matchingMoods = destination.moods.filter(mood =>
          activeMoods.includes(mood)
        )

        const adventureBonus =
          refinement === 'More adventure' &&
          destination.moods.includes('Adventure')
            ? 8
            : 0

        const score = Math.min(
          98,
          70 + matchingMoods.length * 10 + adventureBonus
        )

        const matchReason =
          matchingMoods.length > 0
            ? `Matches your ${matchingMoods.join(
                ' and '
              )} travel preferences.`
            : destination.reason

        return {
          ...destination,
          score,
          matchReason
        }
      })

    if (refinement === 'Less crowded') {
      matches.sort(
        (a, b) =>
          crowdRank[a.crowdLevel] -
            crowdRank[b.crowdLevel] ||
          b.score - a.score
      )
    } else if (refinement === 'Lower budget') {
      matches.sort((a, b) => a.budget - b.budget)
    } else {
      matches.sort((a, b) => b.score - a.score)
    }

    return matches
  }, [
    budget,
    duration,
    selectedMoods,
    refinement,
    travelScope,
    extractedPreferences
  ])

  // --------------------------------------------------
  // FINAL RESULTS
  // --------------------------------------------------

  const results = useMemo((): RankedDestination[] => {
    const source = useLocalFallback
      ? localResults
      : aiResults

    const budgetLimit =
      extractedPreferences?.budget ??
      (Number(budget) || 30000)

    const filteredSource = source.filter(destination => {
      const matchesScope = matchesTravelScope(
        destination,
        travelScope
      )

      const matchesBudget =
        Number.isFinite(Number(destination.budget)) &&
        Number(destination.budget) <= budgetLimit

      return matchesScope && matchesBudget
    })

    const sorted = [...filteredSource]

    const crowdRank = {
      Low: 1,
      Moderate: 2,
      High: 3
    }

    if (refinement === 'Less crowded') {
      sorted.sort(
        (a, b) =>
          crowdRank[a.crowdLevel] -
            crowdRank[b.crowdLevel] ||
          b.score - a.score
      )
    } else if (refinement === 'Lower budget') {
      sorted.sort((a, b) => a.budget - b.budget)
    } else if (refinement === 'More adventure') {
      sorted.sort((a, b) => {
        const aAdventure = a.moods.includes('Adventure') ? 1 : 0
        const bAdventure = b.moods.includes('Adventure') ? 1 : 0

        return bAdventure - aAdventure || b.score - a.score
      })
    } else {
      sorted.sort((a, b) => b.score - a.score)
    }

    return sorted
  }, [
    aiResults,
    localResults,
    refinement,
    travelScope,
    useLocalFallback,
    budget,
    extractedPreferences
  ])

  // --------------------------------------------------
  // INITIAL DISCOVERY
  // --------------------------------------------------

  async function findMyDestinations() {
    const userMessage = prompt.trim()

    if (!userMessage) {
      setAiError(
        'Please describe the kind of trip you are looking for.'
      )
      return
    }

    setExtractedPreferences(null)
    setFollowUpAnswer('')

    setChatMessages([
      {
        id: `${Date.now()}-user`,
        role: 'user',
        content: userMessage
      }
    ])

    setRefinement('')

    await requestRecommendations(userMessage, false)
  }

  // --------------------------------------------------
  // SEND FOLLOW-UP MESSAGE
  // --------------------------------------------------

  async function submitFollowUpAnswer() {
    const answer = followUpAnswer.trim()

    if (!answer || isLoading) return

    setChatMessages(current => [
      ...current,
      {
        id: `${Date.now()}-user`,
        role: 'user',
        content: answer
      }
    ])

    setFollowUpAnswer('')

    await requestRecommendations(answer, true)
  }

  // --------------------------------------------------
  // CONVERSATIONAL AI RECOMMENDATION API
  // --------------------------------------------------

  async function requestRecommendations(
    userMessage: string,
    isFollowUp: boolean
  ) {
    setIsLoading(true)

    setAiError('')
    setAiResults([])
    setRecommendationSource('')
    setUseLocalFallback(false)

    setScreen('results')
    setTab('discover')

    try {
      const requestBody = {
        prompt: userMessage,

        preferences: {
          travelScope
        },

        ...(isFollowUp && extractedPreferences
          ? {
              previousPreferences: extractedPreferences
            }
          : {})
      }

      console.log(
        'Sending AI request:',
        requestBody
      )

      const response = await fetch(
        `${API_BASE_URL}/api/ai-recommend`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      )

      if (!response.ok) {
        throw new Error(
          `Backend returned status ${response.status}`
        )
      }

      const data: AIResponse = await response.json()

      if (!data.success || !data.preferences) {
        throw new Error(
          'Invalid response from backend.'
        )
      }

      console.log('AI response:', data)

      setExtractedPreferences(data.preferences)

      if (data.preferences.budget !== null) {
        setBudget(String(data.preferences.budget))
      }

      if (data.preferences.duration !== null) {
        setDuration(String(data.preferences.duration))
      }

      setSelectedMoods(data.preferences.moods || [])

      setTravellers(
        data.preferences.travellers || 'Any'
      )

      setLocation(
        data.preferences.departureLocation || ''
      )

      if (data.needsMoreInfo) {
        const question =
          data.question ||
          'Could you share a little more about your trip?'

        setChatMessages(current => [
          ...current,
          {
            id: `${Date.now()}-assistant`,
            role: 'assistant',
            content: question
          }
        ])

        return
      }

      const recommendations =
        data.recommendations || []

      const budgetLimit = data.preferences.budget

      const requestedDuration =
        data.preferences.duration

      const filteredRecommendations =
        recommendations.filter(item => {
          const matchesScope = matchesTravelScope(
            item,
            travelScope
          )

          const estimatedBudget = Number(
            item.estimatedTripBudget ?? item.budget
          )

          const matchesBudget =
            budgetLimit !== null &&
            Number.isFinite(estimatedBudget) &&
            estimatedBudget <= budgetLimit

          return matchesScope && matchesBudget
        })

      const mappedResults: RankedDestination[] =
        filteredRecommendations.map(item => {
          const matchReason =
            item.matchReason ??
            item.reason ??
            'Recommended based on your travel preferences.'

          const estimatedBudget = Number(
            item.estimatedTripBudget ?? item.budget
          )

          return {
            ...item,

            budget: estimatedBudget,

            days:
              requestedDuration !== null
                ? requestedDuration
                : item.days,

            score: item.matchScore ?? item.score ?? 0,

            reason:
              item.reason ?? item.matchReason ?? '',

            matchReason
          }
        })

      setAiResults(mappedResults)

      setRecommendationSource(
        data.source || 'AI recommendations'
      )

      const assistantMessage =
        mappedResults.length > 0
          ? `I found ${mappedResults.length} destinations that match your preferences. Your total trip budget is ${formatCurrency(
              budgetLimit
            )} for ${requestedDuration} days. Here are my recommendations below.`
          : 'I could not find destinations matching all your preferences within your maximum total trip budget. Would you like to adjust your budget, duration or travel preferences?'

      setChatMessages(current => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: assistantMessage
        }
      ])

      if (mappedResults.length === 0) {
        setAiError(
          'No destinations match your preferences and maximum total trip budget. Try adjusting your request.'
        )
      }

    } catch (error) {
      console.error(
        'WanderMind AI recommendation error:',
        error
      )

      const hasRequiredPreferences =
        extractedPreferences !== null &&
        extractedPreferences.budget !== null &&
        extractedPreferences.duration !== null

      if (hasRequiredPreferences) {
        setAiError(
          'AI recommendations are temporarily unavailable. Showing local recommendations instead.'
        )

        setUseLocalFallback(true)
      } else {
        setAiError(
          'WanderMind AI could not process your message. Please try again.'
        )

        setUseLocalFallback(false)
      }

      setChatMessages(current => [
        ...current,
        {
          id: `${Date.now()}-assistant-error`,
          role: 'assistant',
          content:
            'Sorry, I could not process that message. Please try again.'
        }
      ])

    } finally {
      setIsLoading(false)
    }
  }

  // --------------------------------------------------
  // AI DESTINATION DETAILS API
  // --------------------------------------------------

  async function loadDestinationDetails(
    destination: Destination
  ) {
    setDestinationAI(null)
    setDetailsError('')
    setItinerary(null)
    setItineraryError('')

    setIsDetailsLoading(true)
    setIsCurrentItinerarySaved(false)

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/destination-details`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            destinationId: destination.id,
            preferences: getTravelPreferences()
          })
        }
      )

      if (!response.ok) {
        throw new Error(
          `Backend returned status ${response.status}`
        )
      }

      const data: DestinationDetailsResponse =
        await response.json()

      if (!data.success || !data.details) {
        throw new Error(
          'Invalid destination details response.'
        )
      }

      console.log('Destination details response:', data)

      setDestinationAI(data.details)

    } catch (error) {
      console.error(
        'Destination details error:',
        error
      )

      setDetailsError(
        'Unable to generate AI destination details right now. You can still view the basic destination information.'
      )

    } finally {
      setIsDetailsLoading(false)
    }
  }

  // --------------------------------------------------
  // AI ITINERARY API
  // --------------------------------------------------


async function generateItinerary() {
  if (!activeDestination) return

  setIsItineraryLoading(true)
  setItineraryError('')
  setItinerary(null)
  setIsCurrentItinerarySaved(false)

  try {
    const travelPreferences = getTravelPreferences()

    const requestedDays =
      extractedPreferences?.duration ??
      travelPreferences.duration

    const maximumBudget =
      extractedPreferences?.budget ??
      travelPreferences.budget

    const response = await fetch(
      `${API_BASE_URL}/api/generate-itinerary`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          destinationId: activeDestination.id,
          destinationName: activeDestination.name,

          preferences: travelPreferences,

          conversation: chatMessages,

          requestedDuration: requestedDays,

          maximumBudget: maximumBudget
        })
      }
    )

    if (!response.ok) {
      throw new Error(
        `Backend returned status ${response.status}`
      )
    }

    const data: ItineraryResponse =
      await response.json()

    if (!data.success || !data.itinerary) {
      throw new Error(
        'Invalid itinerary response from backend.'
      )
    }

    console.log('Itinerary response:', data)

    // Validate requested duration
    const returnedDays = data.itinerary.days || []

    if (returnedDays.length !== requestedDays) {
      throw new Error(
        `Expected ${requestedDays} days, but received ${returnedDays.length} days.`
      )
    }

    if (data.itinerary.duration !== requestedDays) {
      throw new Error(
        `Expected ${requestedDays} days, but received ${data.itinerary.duration} days.`
      )
    }

    // Validate budget breakdown
    const budgetSummary = data.itinerary.budgetSummary

    if (!budgetSummary) {
      throw new Error(
        'The itinerary does not contain a budget breakdown.'
      )
    }

    const totalEstimated = budgetSummary.totalEstimated

    if (
      typeof totalEstimated !== 'number' ||
      totalEstimated <= 0
    ) {
      throw new Error(
        'The itinerary contains an invalid total budget.'
      )
    }

    // Ensure total trip budget does not exceed maximum budget
    if (totalEstimated > maximumBudget) {
      throw new Error(
        `The estimated trip cost of ₹${totalEstimated.toLocaleString('en-IN')} exceeds your maximum budget of ₹${maximumBudget.toLocaleString('en-IN')}. Please try again.`
      )
    }

    // Validate that all budget categories are returned
    const requiredBudgetFields = [
      'accommodation',
      'food',
      'localTransport',
      'activities',
      'other'
    ] as const

    for (const field of requiredBudgetFields) {
      if (
        typeof budgetSummary[field] !== 'number' ||
        budgetSummary[field]! < 0
      ) {
        throw new Error(
          `The itinerary is missing a valid ${field} budget.`
        )
      }
    }

    // Display itinerary only after validation
    setItinerary(data.itinerary)

  } catch (error) {
    console.error(
      'Itinerary generation error:',
      error
    )

    setItineraryError(
      error instanceof Error
        ? error.message
        : 'Unable to generate your itinerary right now. Please try again.'
    )

  } finally {
    setIsItineraryLoading(false)
  }
}


  // --------------------------------------------------
  // SAVE COMPLETE ITINERARY
  // --------------------------------------------------

  function saveItinerary() {
    if (!itinerary || !activeDestination) return

    const newTrip: SavedTrip = {
      id: `${activeDestination.id}-${Date.now()}`,
      destination: activeDestination,
      itinerary,
      savedAt: new Date().toISOString()
    }

    setSavedTrips(current => {
      const next = [newTrip, ...current]

      localStorage.setItem(
        'wandermind-saved-trips',
        JSON.stringify(next)
      )

      return next
    })

    setIsCurrentItinerarySaved(true)
  }

  // --------------------------------------------------
  // DELETE SAVED ITINERARY
  // --------------------------------------------------

  function deleteSavedTrip(id: string) {
    setSavedTrips(current => {
      const next = current.filter(
        trip => trip.id !== id
      )

      localStorage.setItem(
        'wandermind-saved-trips',
        JSON.stringify(next)
      )

      return next
    })
  }

  // --------------------------------------------------
  // OPEN SAVED ITINERARY
  // --------------------------------------------------

  function openSavedTrip(trip: SavedTrip) {
    setActiveDestination(trip.destination)
    setItinerary(trip.itinerary)
    setDestinationAI(null)

    setDetailsError('')
    setItineraryError('')

    setIsDetailsLoading(false)
    setIsItineraryLoading(false)

    setIsCurrentItinerarySaved(true)

    setScreen('details')
    setTab('discover')
  }

  // --------------------------------------------------
  // PROFILE MOOD SELECTION
  // --------------------------------------------------

  function toggleMood(mood: string) {
    setSelectedMoods(current =>
      current.includes(mood)
        ? current.filter(item => item !== mood)
        : [...current, mood]
    )
  }

  // --------------------------------------------------
  // SAVE OR REMOVE DESTINATION
  // --------------------------------------------------

  function toggleSaved(id: string) {
    setSaved(current => {
      const next = current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id]

      localStorage.setItem(
        'wandermind-saved',
        JSON.stringify(next)
      )

      return next
    })
  }

  // --------------------------------------------------
  // OPEN DESTINATION DETAILS
  // --------------------------------------------------

  function openDetails(destination: Destination) {
    setActiveDestination(destination)
    setScreen('details')
    setTab('discover')

    void loadDestinationDetails(destination)
  }

  // --------------------------------------------------
  // BOTTOM NAVIGATION
  // --------------------------------------------------

  function navigate(next: Tab) {
    setTab(next)
    setScreen('discover')
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div
      className="app-shell"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(248, 250, 247, 0.91),
            rgba(248, 250, 247, 0.94)
          ),
          url("https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2000&q=85")
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <style>{`

        .hero-space {
          background-image:
            linear-gradient(
              90deg,
              rgba(13, 38, 32, 0.48),
              rgba(13, 38, 32, 0.08)
            ),
            url("https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=90");

          background-size: cover;
          background-position: center 48%;
          background-repeat: no-repeat;
          min-height: 230px;
          border-radius: 22px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 12px 32px rgba(24, 52, 43, 0.12);
        }

        .hero-space::after {
          content: "Find your own somewhere";
          position: absolute;
          bottom: 18px;
          left: 22px;
          color: white;
          font-size: 13px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-weight: 600;
          text-shadow: 0 2px 8px rgba(0,0,0,0.35);
        }

        .curator-pill,
        .inspired-pill {
          position: relative;
          z-index: 1;
        }

        .curator-pill {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(8px);
        }

        .inspired-pill {
          color: white;
          background: rgba(16, 40, 33, 0.55);
          backdrop-filter: blur(8px);
        }

        .search-panel,
        .parameters,
        .detail-panel,
        .destination-card,
        .saved-trip-card {
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(10px);
        }

        .travel-scope-options {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .travel-scope-option {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 14px 12px;
          border: 1px solid #dce7e1;
          border-radius: 14px;
          background: rgba(255,255,255,0.88);
          color: #42564d;
          font: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .travel-scope-option.active {
          border-color: #397b65;
          background: #e9f3ed;
          color: #245c48;
          box-shadow: 0 0 0 2px rgba(57,123,101,0.10);
        }

        .travel-scope-option span {
          font-size: 19px;
        }

        .search-action {
          margin: 22px 0 36px;
        }

        .search-action .primary-button {
          width: 100%;
        }

        .search-action .muted {
          text-align: center;
          margin-top: 12px;
          line-height: 1.5;
        }

        .discover-helper {
          margin: 12px 0 0;
          text-align: center;
          color: #738078;
          font-size: 13px;
          line-height: 1.5;
        }

        .chat-panel {
          margin: 24px 0;
          padding: 20px;
          border-radius: 20px;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 25px rgba(24, 52, 43, 0.06);
        }

        .chat-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 14px;
          border-bottom: 1px solid #e7eee9;
        }

        .chat-heading h2 {
          margin: 0;
          font-size: 17px;
        }

        .chat-heading .muted {
          display: block;
          margin-top: 4px;
          font-size: 12px;
        }

        .chat-messages {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 20px 0;
        }

        .chat-message {
          display: flex;
          flex-direction: column;
          max-width: 85%;
          gap: 5px;
        }

        .chat-message.user {
          align-self: flex-end;
          align-items: flex-end;
        }

        .chat-message.assistant {
          align-self: flex-start;
          align-items: flex-start;
        }

        .chat-role {
          font-size: 11px;
          color: #78877e;
          font-weight: 600;
        }

        .chat-bubble {
          padding: 13px 16px;
          border-radius: 16px;
          line-height: 1.6;
          font-size: 14px;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .chat-message.user .chat-bubble {
          background: #28664f;
          color: white;
          border-bottom-right-radius: 5px;
        }

        .chat-message.assistant .chat-bubble {
          background: #edf3ef;
          color: #263d32;
          border-bottom-left-radius: 5px;
        }

        .chat-typing {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #718078;
          font-size: 13px;
          padding: 10px 0;
        }

        .chat-input-area {
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-top: 1px solid #e7eee9;
          padding-top: 15px;
        }

        .chat-input-area textarea {
          width: 100%;
          min-height: 75px;
          padding: 13px;
          border: 1px solid #d8e3df;
          border-radius: 12px;
          background: white;
          font: inherit;
          resize: vertical;
          box-sizing: border-box;
        }

        .chat-input-area textarea:focus {
          outline: none;
          border-color: #397b65;
          box-shadow: 0 0 0 3px rgba(57,123,101,0.10);
        }

        .chat-input-area .primary-button {
          width: 100%;
        }

        .chat-empty-hint {
          color: #78877e;
          font-size: 12px;
          text-align: center;
          margin: 0;
        }

        .ai-highlight-list {
          display: grid;
          gap: 12px;
        }

        .ai-highlight {
          padding: 14px;
          border: 1px solid #e3ebe5;
          border-radius: 12px;
          background: #f8faf8;
        }

        .ai-highlight p {
          margin: 6px 0 0;
          line-height: 1.6;
        }

        .loading-content {
          text-align: center;
          padding: 25px 10px;
        }

        .loading-content svg {
          margin: 0 auto 12px;
        }

        .itinerary-heading {
          margin: 22px 0;
        }

        .itinerary-heading h2 {
          margin-bottom: 8px;
        }

        .itinerary-heading > span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #62756b;
          font-size: 13px;
        }

        .save-itinerary-action {
          margin: 20px 0;
        }

        .save-itinerary-action .primary-button {
          width: 100%;
        }

        .itinerary-day {
          margin: 18px 0;
          padding: 18px;
          border: 1px solid #e3ebe5;
          border-radius: 16px;
          background: #fff;
        }

        .day-heading {
          margin-bottom: 16px;
        }

        .day-heading span {
          color: #397b65;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .day-heading h3 {
          margin: 6px 0 0;
        }

        .day-activity {
          padding: 12px 0;
          border-top: 1px solid #edf1ee;
        }

        .day-activity strong {
          color: #315c49;
          font-size: 13px;
        }

        .day-activity p {
          margin: 7px 0 0;
          line-height: 1.6;
          font-size: 14px;
        }

        .day-cost {
          display: flex;
          align-items: center;
          gap: 6px;
          padding-top: 12px;
          border-top: 1px solid #edf1ee;
          color: #52685c;
          font-size: 13px;
        }

        .budget-breakdown {
          padding: 18px;
          margin-top: 20px;
          border-radius: 15px;
          background: #f1f6f2;
        }

        .budget-breakdown h3,
        .itinerary-tips h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 0;
        }

        .budget-breakdown > div {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 0;
          border-top: 1px solid #dfe9e2;
          font-size: 14px;
        }

        .budget-breakdown .budget-total {
          font-weight: 700;
          color: #245c48;
        }

        .itinerary-tips {
          padding: 18px;
          margin-top: 20px;
          border-radius: 15px;
          background: #f8f6ed;
        }

        .itinerary-tips li {
          margin: 9px 0;
          line-height: 1.5;
        }

        .disclaimer {
          margin-top: 20px;
          line-height: 1.5;
        }

        .saved-trip-card {
          display: flex;
          overflow: hidden;
          margin-bottom: 18px;
          border-radius: 16px;
        }

        .saved-trip-image {
          width: 35%;
          min-width: 110px;
        }

        .saved-trip-image img {
          width: 100%;
          height: 100%;
          min-height: 220px;
          object-fit: cover;
        }

        .saved-trip-body {
          flex: 1;
          padding: 18px;
          min-width: 0;
        }

        .saved-trip-body h3 {
          margin: 5px 0;
        }

        .saved-trip-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin: 12px 0;
          font-size: 13px;
        }

        .saved-trip-meta span {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .saved-trip-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 15px;
        }

        .remove-trip-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid #e1e8e3;
          border-radius: 10px;
          padding: 10px 13px;
          background: white;
          color: #8a4b4b;
          cursor: pointer;
        }

        .saved-date {
          font-size: 12px;
        }

        .profile-avatar {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          margin: 0 auto 12px;
          border-radius: 50%;
          background: #e7f1e9;
          color: #28664f;
          font-size: 25px;
          font-weight: 700;
        }

        .parameters {
          text-align: center;
          padding: 24px;
          border-radius: 18px;
        }

        .mood-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 15px;
        }

        .mood-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 14px;
          border: 1px solid #dce7e1;
          border-radius: 20px;
          background: white;
          cursor: pointer;
          font: inherit;
        }

        .mood-chip.selected {
          background: #e9f3ed;
          border-color: #397b65;
          color: #245c48;
        }

        .privacy-note {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 7px;
          margin-top: 22px;
          font-size: 12px;
          color: #718078;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 520px) {
          .hero-space {
            min-height: 185px;
            border-radius: 17px;
          }

          .travel-scope-options {
            gap: 8px;
          }

          .travel-scope-option {
            padding: 12px 8px;
            font-size: 13px;
          }

          .chat-panel {
            padding: 15px;
          }

          .chat-message {
            max-width: 94%;
          }

          .saved-trip-card {
            flex-direction: column;
          }

          .saved-trip-image {
            width: 100%;
            height: 160px;
          }

          .saved-trip-image img {
            min-height: 160px;
            height: 160px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }

      `}</style>

      {/* HEADER */}

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <Sprout size={22} />
          </div>

          <div>
            <strong>WanderMind AI</strong>
            <span>Mindful Travel Discovery</span>
          </div>
        </div>

        <div className="guest">
          <i />
          Guest Mode
        </div>
      </header>

      <main className="main-content">

        {/* DISCOVER SCREEN */}

        {screen === 'discover' && tab === 'discover' && (
          <>
            <div className="hero-space">
              <div className="curator-pill">
                <Sparkles size={14} />
                AI Mindful Curator
              </div>

              <div className="inspired-pill">
                Inspired by the outdoors
              </div>
            </div>

            <section className="intro">
              <p className="eyebrow">
                YOUR NEXT ESCAPE STARTS HERE
              </p>

              <h1>Where do you feel like going?</h1>

              <p>
                Tell us what kind of trip you have in mind.
                We'll find destinations that match your
                preferences, budget and travel mood.
              </p>
            </section>

            <section className="panel search-panel">
              <div className="panel-heading">
                <div className="heading-icon">
                  <Sparkles size={17} />
                </div>

                <h2>Describe your ideal trip</h2>

                <button
                  className="icon-button"
                  aria-label="Voice input"
                  title="Voice input coming soon"
                  type="button"
                >
                  <Mic size={19} />
                </button>
              </div>

              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="For example: I want a peaceful 4-day trip with my partner from Bengaluru, within ₹30,000..."
              />

              <div className="suggestions">
                {[
                  '✨ A peaceful mountain escape for 4 days',
                  '🌊 Quiet coastal escapes under ₹25,000',
                  '🌿 A nature retreat with my partner'
                ].map(suggestion => (
                  <button
                    key={suggestion}
                    className="suggestion"
                    type="button"
                    onClick={() =>
                      setPrompt(suggestion.replace(/^\S+\s/, ''))
                    }
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </section>

            <section className="moods-section travel-scope-section">
              <div className="section-heading">
                <h2>Where would you like to travel?</h2>
                <span>Choose your travel scope</span>
              </div>

              <div className="travel-scope-options">
                {travelScopeOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    className={`travel-scope-option ${
                      travelScope === option.value ? 'active' : ''
                    }`}
                    aria-pressed={travelScope === option.value}
                    onClick={() => setTravelScope(option.value)}
                  >
                    <span>{option.emoji}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="search-action">
              <button
                className="primary-button"
                type="button"
                onClick={findMyDestinations}
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading
                  ? 'Understanding your travel request...'
                  : 'Find My Destinations'}

                {isLoading ? (
                  <LoaderCircle size={18} className="spin" />
                ) : (
                  <ArrowRight size={18} />
                )}
              </button>

              <p className="discover-helper">
                Just describe your trip. WanderMind AI will
                understand your preferences and ask if
                anything important is missing.
              </p>
            </section>
          </>
        )}

        {/* RESULTS SCREEN */}

        {screen === 'results' && tab === 'discover' && (
          <>
            <button
              className="back-button"
              type="button"
              onClick={() => setScreen('discover')}
            >
              <ArrowLeft size={17} />
              Back to discovery
            </button>

            <section className="intro">
              <p className="eyebrow">CURATED FOR YOUR MOOD</p>

              <h1>Your mindful travel matches</h1>

              <p>
                Chat with WanderMind AI to refine your
                travel preferences and discover destinations.
              </p>

              <p className="muted">
                Travel scope: {travelScope === 'India'
                  ? 'Within India'
                  : 'International'}
              </p>
            </section>

            <section className="chat-panel">
              <div className="chat-heading">
                <div className="heading-icon">
                  <Sparkles size={17} />
                </div>

                <div>
                  <h2>WanderMind AI</h2>
                  <span className="muted">
                    Your personal travel assistant
                  </span>
                </div>
              </div>

              <div className="chat-messages">
                {chatMessages.map(message => (
                  <div
                    key={message.id}
                    className={`chat-message ${message.role}`}
                  >
                    <span className="chat-role">
                      {message.role === 'user' ? 'You' : 'WanderMind AI'}
                    </span>

                    <div className="chat-bubble">
                      {message.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="chat-typing">
                    <LoaderCircle size={16} className="spin" />
                    WanderMind AI is thinking...
                  </div>
                )}
              </div>

              <div className="chat-input-area">
                <textarea
                  value={followUpAnswer}
                  onChange={e => setFollowUpAnswer(e.target.value)}
                  onKeyDown={e => {
                    if (
                      e.key === 'Enter' &&
                      !e.shiftKey &&
                      !isLoading &&
                      followUpAnswer.trim()
                    ) {
                      e.preventDefault()
                      void submitFollowUpAnswer()
                    }
                  }}
                  placeholder="Tell me more about your trip..."
                  disabled={isLoading}
                  rows={2}
                />

                <button
                  className="primary-button"
                  type="button"
                  onClick={submitFollowUpAnswer}
                  disabled={!followUpAnswer.trim() || isLoading}
                >
                  Send message
                  <ArrowRight size={18} />
                </button>

                <p className="chat-empty-hint">
                  Press Enter to send · Shift + Enter for a new line
                </p>
              </div>
            </section>

            {!isLoading && aiError && (
              <div className="panel">
                <p>{aiError}</p>
              </div>
            )}

            {!isLoading && recommendationSource && (
              <p className="muted">
                <Sparkles size={14} />
                Powered by {recommendationSource}
              </p>
            )}

            {!isLoading && results.length > 0 && (
              <div className="refinements">
                {[
                  'All matches',
                  'Less crowded',
                  'More adventure',
                  'Lower budget'
                ].map(option => (
                  <button
                    key={option}
                    type="button"
                    className={
                      refinement === option ||
                      (!refinement && option === 'All matches')
                        ? 'filter active'
                        : 'filter'
                    }
                    onClick={() =>
                      setRefinement(
                        option === 'All matches' ? '' : option
                      )
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {!isLoading && (
              <div className="destination-list">
                {results.map(destination => (
                  <article
                    className="destination-card"
                    key={destination.id}
                  >
                    <img
                      src={destination.image}
                      alt={destination.name}
                    />

                    <div className="destination-body">
                      <div className="destination-top">
                        <div>
                          <h3>{destination.name}</h3>
                          <p>{destination.region}</p>
                        </div>

                        <span className="match">
                          {destination.score}% match
                        </span>
                      </div>

                      <p>{destination.matchReason}</p>

                      <div className="destination-meta">
                        <span>
                          {formatCurrency(destination.budget)} est.
                        </span>

                        <span>{destination.days} days</span>

                        <span>Crowd: {destination.crowdLevel}</span>

                        <button
                          type="button"
                          onClick={() => toggleSaved(destination.id)}
                          aria-label="Save destination"
                        >
                          <Heart
                            size={17}
                            fill={
                              saved.includes(destination.id)
                                ? 'currentColor'
                                : 'none'
                            }
                          />
                        </button>
                      </div>

                      <button
                        className="text-button"
                        type="button"
                        onClick={() => openDetails(destination)}
                      >
                        View details
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {!isLoading &&
              results.length === 0 &&
              !aiError &&
              chatMessages.length > 0 &&
              chatMessages[chatMessages.length - 1]?.role === 'assistant' && (
                <div className="empty">
                  <h3>Waiting for your travel details</h3>
                  <p>
                    Continue the conversation with WanderMind AI
                    to find destinations matching your trip.
                  </p>
                </div>
              )}
          </>
        )}

        {/* DESTINATION DETAILS SCREEN */}

        {screen === 'details' &&
          activeDestination &&
          tab === 'discover' && (
            <>
              <button
                className="back-button"
                type="button"
                onClick={() => setScreen('results')}
              >
                <ArrowLeft size={17} />
                Back to matches
              </button>

              <div className="detail-hero">
                <img
                  src={activeDestination.image}
                  alt={activeDestination.name}
                />

                <span className="detail-match">
                  A mindful match for you
                </span>
              </div>

              <section className="intro">
                <p className="eyebrow">
                  {activeDestination.region}
                </p>

                <h1>{activeDestination.name}</h1>

                <p>{activeDestination.description}</p>
              </section>

              <section className="panel detail-panel">
                <div className="detail-stats">
                  <div>
                    <strong>
                      {formatCurrency(activeDestination.budget)}
                    </strong>
                    <span>Estimated budget</span>
                  </div>

                  <div>
                    <strong>{activeDestination.days} days</strong>
                    <span>Ideal stay</span>
                  </div>

                  <div>
                    <strong>{activeDestination.season}</strong>
                    <span>Best season</span>
                  </div>
                </div>

                <button
                  className="primary-button"
                  type="button"
                  onClick={() => toggleSaved(activeDestination.id)}
                >
                  <Bookmark size={17} />

                  {saved.includes(activeDestination.id)
                    ? 'Saved to your trips'
                    : 'Save destination'}
                </button>
              </section>

              {/* AI DESTINATION DETAILS */}

              <section className="panel detail-panel ai-detail-panel">
                <div className="section-heading">
                  <h2>
                    <Sparkles size={18} />
                    AI Travel Guide
                  </h2>
                </div>

                {isDetailsLoading && (
                  <div className="loading-content">
                    <LoaderCircle size={24} className="spin" />

                    <h3>Creating your travel guide...</h3>

                    <p className="muted">
                      Your AI model is preparing destination insights
                      based on your travel preferences.
                    </p>
                  </div>
                )}

                {!isDetailsLoading && detailsError && (
                  <div className="error-message">
                    <p>{detailsError}</p>

                    <button
                      className="text-button"
                      type="button"
                      onClick={() =>
                        loadDestinationDetails(activeDestination)
                      }
                    >
                      Try again
                      <ArrowRight size={15} />
                    </button>
                  </div>
                )}

                {!isDetailsLoading && destinationAI && (
                  <div className="ai-content">
                    <h2>{destinationAI.destination}</h2>

                    <p>{destinationAI.overview}</p>

                    {destinationAI.highlights?.length > 0 && (
                      <>
                        <h3>
                          <MapPin size={17} />
                          Places and highlights
                        </h3>

                        <ul>
                          {destinationAI.highlights.map(
                            (highlight, index) => (
                              <li key={index}>{highlight}</li>
                            )
                          )}
                        </ul>
                      </>
                    )}

                    {destinationAI.bestTime && (
                      <>
                        <h3>
                          <CalendarDays size={17} />
                          Best time to visit
                        </h3>

                        <p>{destinationAI.bestTime}</p>
                      </>
                    )}

                    {destinationAI.travelTips?.length > 0 && (
                      <>
                        <h3>
                          <Lightbulb size={17} />
                          Practical travel tips
                        </h3>

                        <ul>
                          {destinationAI.travelTips.map(
                            (tip, index) => (
                              <li key={index}>{tip}</li>
                            )
                          )}
                        </ul>
                      </>
                    )}
                  </div>
                )}
              </section>

              {/* ITINERARY GENERATION */}

              <section className="panel detail-panel itinerary-panel">
                <div className="section-heading">
                  <h2>
                    <CalendarDays size={18} />
                    Your Personalised Itinerary
                  </h2>
                </div>

                <p>
                  Let AI create a day-by-day travel plan based
                  on your budget, travel duration and preferences.
                </p>

                <button
                  className="primary-button"
                  type="button"
                  onClick={generateItinerary}
                  disabled={isItineraryLoading}
                >
                  {isItineraryLoading
                    ? 'Creating your itinerary...'
                    : itinerary
                      ? 'Regenerate Itinerary'
                      : 'Generate My Itinerary'}

                  {isItineraryLoading ? (
                    <LoaderCircle size={18} className="spin" />
                  ) : (
                    <ArrowRight size={18} />
                  )}
                </button>

                {isItineraryLoading && (
                  <div className="loading-content">
                    <LoaderCircle size={24} className="spin" />

                    <p>
                      Planning your trip day by day.
                      This may take a little while.
                    </p>
                  </div>
                )}

                {!isItineraryLoading && itineraryError && (
                  <div className="error-message">
                    <p>{itineraryError}</p>
                  </div>
                )}

                {!isItineraryLoading && itinerary && (
                  <div className="itinerary-content">
                    <div className="itinerary-heading">
                      <p className="eyebrow">
                        YOUR AI-GENERATED TRIP PLAN
                      </p>

                      <h2>
                        {itinerary.title ||
                          `${itinerary.duration}-Day ${itinerary.destination} Itinerary`}
                      </h2>

                      {itinerary.summary && (
                        <p>{itinerary.summary}</p>
                      )}

                      <span>
                        <Clock size={15} />
                        {itinerary.duration} days
                      </span>
                    </div>

                    <div className="save-itinerary-action">
                      <button
                        className="primary-button"
                        type="button"
                        onClick={saveItinerary}
                        disabled={isCurrentItinerarySaved}
                      >
                        {isCurrentItinerarySaved ? (
                          <>
                            <Check size={18} />
                            Itinerary Saved
                          </>
                        ) : (
                          <>
                            <Bookmark size={18} />
                            Save Complete Itinerary
                          </>
                        )}
                      </button>

                      {isCurrentItinerarySaved && (
                        <p className="muted">
                          Your complete travel plan is saved
                          in Saved Trips.
                        </p>
                      )}
                    </div>

                    {/* DAY-BY-DAY PLAN */}

                    {itinerary.days?.map(day => (
                      <article
                        className="itinerary-day"
                        key={day.day}
                      >
                        <div className="day-heading">
                          <span>DAY {day.day}</span>
                          <h3>{day.title}</h3>
                        </div>

                        {day.activities?.map((activity, index) => (
                          <div
                            className="day-activity"
                            key={`${day.day}-${index}`}
                          >
                            <strong>
                              {activity.time === 'Morning' && '🌅 '}
                              {activity.time === 'Afternoon' && '☀️ '}
                              {activity.time === 'Evening' && '🌙 '}
                              {activity.time}
                            </strong>

                            <p>{activity.activity}</p>
                          </div>
                        ))}

                        {typeof day.estimatedCost === 'number' && (
                          <div className="day-cost">
                            <IndianRupee size={15} />

                            Estimated daily cost:{' '}
                            {formatCurrency(day.estimatedCost)}
                          </div>
                        )}
                      </article>
                    ))}

                    {/* BUDGET BREAKDOWN */}

                    {itinerary.budgetSummary && (
                      <div className="budget-breakdown">
                        <h3>
                          <Wallet size={18} />
                          Estimated Budget Breakdown
                        </h3>

                        {typeof itinerary.budgetSummary.accommodation === 'number' && (
                          <div>
                            <span>Accommodation</span>
                            <strong>
                              {formatCurrency(
                                itinerary.budgetSummary.accommodation
                              )}
                            </strong>
                          </div>
                        )}

                        {typeof itinerary.budgetSummary.food === 'number' && (
                          <div>
                            <span>Food</span>
                            <strong>
                              {formatCurrency(
                                itinerary.budgetSummary.food
                              )}
                            </strong>
                          </div>
                        )}

                        {typeof itinerary.budgetSummary.localTransport === 'number' && (
                          <div>
                            <span>Local transport</span>
                            <strong>
                              {formatCurrency(
                                itinerary.budgetSummary.localTransport
                              )}
                            </strong>
                          </div>
                        )}

                        {typeof itinerary.budgetSummary.activities === 'number' && (
                          <div>
                            <span>Activities</span>
                            <strong>
                              {formatCurrency(
                                itinerary.budgetSummary.activities
                              )}
                            </strong>
                          </div>
                        )}

                        {typeof itinerary.budgetSummary.other === 'number' && (
                          <div>
                            <span>Other expenses</span>
                            <strong>
                              {formatCurrency(
                                itinerary.budgetSummary.other
                              )}
                            </strong>
                          </div>
                        )}

                        {typeof itinerary.budgetSummary.totalEstimated === 'number' && (
                          <div className="budget-total">
                            <span>Total estimated budget</span>
                            <strong>
                              {formatCurrency(
                                itinerary.budgetSummary.totalEstimated
                              )}
                            </strong>
                          </div>
                        )}
                      </div>
                    )}

                    {itinerary.travelTips?.length > 0 && (
                      <div className="itinerary-tips">
                        <h3>
                          <Lightbulb size={18} />
                          AI Travel Tips
                        </h3>

                        <ul>
                          {itinerary.travelTips.map(
                            (tip, index) => (
                              <li key={index}>{tip}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    <p className="muted disclaimer">
                      These are AI-generated planning estimates,
                      not live prices or confirmed bookings.
                      Verify costs, opening hours and travel
                      arrangements before your trip.
                    </p>
                  </div>
                )}
              </section>
            </>
          )}

        {/* SAVED SCREEN */}

        {tab === 'saved' && (
          <>
            <section className="intro">
              <p className="eyebrow">
                YOUR TRAVEL COLLECTION
              </p>

              <h1>Saved Trips</h1>

              <p>
                Your favourite destinations and personalised
                travel plans, all in one place.
              </p>
            </section>

            <section className="saved-trips-section">
              <div className="section-heading">
                <h2>
                  <CalendarDays size={19} />
                  My Itineraries
                </h2>

                <span>{savedTrips.length} saved</span>
              </div>

              {savedTrips.length > 0 ? (
                <div className="saved-trip-list">
                  {savedTrips.map(trip => (
                    <article
                      className="panel saved-trip-card"
                      key={trip.id}
                    >
                      <div className="saved-trip-image">
                        <img
                          src={trip.destination.image}
                          alt={trip.destination.name}
                        />
                      </div>

                      <div className="saved-trip-body">
                        <p className="eyebrow">
                          SAVED TRAVEL PLAN
                        </p>

                        <h3>{trip.destination.name}</h3>

                        <p>{trip.destination.region}</p>

                        <div className="saved-trip-meta">
                          <span>
                            <CalendarDays size={14} />
                            {trip.itinerary.duration} days
                          </span>

                          {typeof trip.itinerary.budgetSummary?.totalEstimated === 'number' && (
                            <span>
                              <Wallet size={14} />
                              {formatCurrency(
                               trip.itinerary.budgetSummary?.totalEstimated ?? trip.destination.budget
                              )}
                            </span>
                          )}
                        </div>

                        <p className="muted saved-date">
                          Saved on{' '}
                          {new Date(trip.savedAt).toLocaleDateString('en-IN')}
                        </p>

                        <div className="saved-trip-actions">
                          <button
                            className="primary-button"
                            type="button"
                            onClick={() => openSavedTrip(trip)}
                          >
                            View Itinerary
                            <ArrowRight size={16} />
                          </button>

                          <button
                            className="remove-trip-button"
                            type="button"
                            onClick={() => deleteSavedTrip(trip.id)}
                          >
                            <Trash2 size={15} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty">
                  <CalendarDays size={28} />

                  <h3>No saved itineraries yet</h3>

                  <p>
                    Generate a personalised travel plan
                    and save it here for later.
                  </p>

                  <button
                    className="primary-button"
                    type="button"
                    onClick={() => navigate('discover')}
                  >
                    Explore destinations
                  </button>
                </div>
              )}
            </section>

            <section className="saved-destinations-section">
              <div className="section-heading">
                <h2>
                  <Heart size={19} />
                  Saved Destinations
                </h2>

                <span>{saved.length} saved</span>
              </div>

              {saved.length > 0 ? (
                <div className="destination-list">
                  {destinations
                    .filter(destination =>
                      saved.includes(destination.id)
                    )
                    .map(destination => (
                      <article
                        className="destination-card"
                        key={destination.id}
                      >
                        <img
                          src={destination.image}
                          alt={destination.name}
                        />

                        <div className="destination-body">
                          <h3>{destination.name}</h3>

                          <p>{destination.region}</p>

                          <div className="destination-meta">
                            <span>
                              {formatCurrency(destination.budget)} est.
                            </span>

                            <button
                              type="button"
                              onClick={() => toggleSaved(destination.id)}
                            >
                              Remove
                            </button>
                          </div>

                          <button
                            className="text-button"
                            type="button"
                            onClick={() => openDetails(destination)}
                          >
                            View details
                            <ArrowRight size={15} />
                          </button>
                        </div>
                      </article>
                    ))}
                </div>
              ) : (
                <div className="empty">
                  <Heart size={25} />

                  <h3>No saved destinations</h3>

                  <p>
                    Save places you like to find them here.
                  </p>
                </div>
              )}
            </section>
          </>
        )}

        {/* PROFILE SCREEN */}

        {tab === 'profile' && (
          <>
            <section className="intro">
              <p className="eyebrow">
                YOUR TRAVEL IDENTITY
              </p>

              <h1>Your travel profile</h1>

              <p>
                Shape recommendations around the way
                you like to travel.
              </p>
            </section>

            <section className="panel parameters">
              <div className="profile-avatar">G</div>

              <h2>Guest Traveller</h2>

              <p className="muted">
                Guest Mode · Preferences stored on this device
              </p>

              <div className="section-heading">
                <h2>Favourite travel moods</h2>
              </div>

              <div className="mood-list">
                {moods.map((mood, index) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => toggleMood(mood)}
                    className={`mood-chip ${
                      selectedMoods.includes(mood) ? 'selected' : ''
                    }`}
                  >
                    <span>{moodEmojis[index]}</span>
                    {mood}
                  </button>
                ))}
              </div>

              <p className="privacy-note">
                <Check size={15} />
                Your preferences stay in this browser for now.
              </p>
            </section>
          </>
        )}

      </main>

      {/* BOTTOM NAVIGATION */}

      <nav className="bottom-nav">
        <button
          type="button"
          className={tab === 'discover' ? 'nav-item active' : 'nav-item'}
          onClick={() => navigate('discover')}
        >
          <Compass size={20} />
          <span>Discover</span>
        </button>

        <button
          type="button"
          className={tab === 'saved' ? 'nav-item active' : 'nav-item'}
          onClick={() => navigate('saved')}
        >
          <Heart size={20} />
          <span>Saved</span>
        </button>

        <button
          type="button"
          className={tab === 'profile' ? 'nav-item active' : 'nav-item'}
          onClick={() => navigate('profile')}
        >
          <UserRound size={20} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  )
}

export default App
