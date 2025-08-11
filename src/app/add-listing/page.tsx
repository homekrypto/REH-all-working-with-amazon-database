'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import ImageUploader from '@/components/ui/image-uploader'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Home, 
  MapPin, 
  DollarSign,
  Ruler,
  Star,
  Upload,
  Calendar,
  User,
  Eye,
  FileText,
  Plus,
  X,
  Camera,
  Video,
  Building,
  Car,
  Bed,
  Bath,
  Wifi,
  Waves,
  Shield,
  School,
  Hospital,
  Train,
  ShoppingBag,
  Coffee
} from 'lucide-react'

interface ListingData {
  // Step 1: General Information
  title: string
  description: string
  listingType: string
  propertyType: string
  
  // Step 2: Location Details
  country: string
  city: string
  streetAddress: string
  state: string
  postalCode: string
  latitude: number
  longitude: number
  
  // Step 3: Price & Financials
  price: number
  currency: string
  paymentFrequency: string
  isNegotiable: boolean
  acceptsCrypto: boolean
  cryptoTypes: string[]
  maintenanceFees: number
  propertyTaxes: number
  
  // Step 4: Property Metrics
  totalArea: number
  livingArea: number
  lotSize: number
  areaUnit: string
  yearBuilt: number
  bedrooms: number
  bathrooms: number
  floors: number
  parkingSpaces: number
  furnishingStatus: string
  floorNumber: number
  hasElevator: boolean
  view: string
  energyEfficiencyRating: string
  
  // Step 5: Features & Amenities
  features: string[]
  nearbyPlaces: string[]
  
  // Step 6: Media Uploads
  videoTourUrl: string
  virtualTourUrl: string
  floorPlanImage: string | null
  
  // Step 7: Availability & Legal
  availableFrom: string
  ownershipType: string
  titleDeedAvailable: boolean
  isExclusive: boolean
  
  // Step 8: Agent & Agency Information
  agentName: string
  agentPhone: string
  agentEmail: string
  agencyName: string
  licenseNumber: string
  whatsappLink: string
  languagesSpoken: string[]
  
  // Step 9: Review & Publishing
  status: string
  acceptTerms: boolean
}

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Spain', 'Italy', 'Portugal', 'Netherlands', 'Switzerland', 'Japan'
]

const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF']

const propertyTypes = [
  'Apartment', 'House', 'Villa', 'Condo', 'Townhouse', 'Land', 'Commercial', 'Office', 'Retail'
]

const listingTypes = ['For Sale', 'For Rent', 'Pre-Sale', 'Auction']

const features = [
  'Balcony', 'Swimming Pool', 'Smart Home', 'Pet Friendly', 'Gated Community',
  'Air Conditioning', 'Heating', 'Fireplace', 'Garden', 'Garage', 'Parking',
  'Elevator', 'Security System', 'CCTV', 'Intercom', 'Gym', 'Sauna',
  'Concierge', 'Laundry', 'Dishwasher', 'Microwave', 'Refrigerator',
  'Furnished', 'Unfurnished', 'Partially Furnished'
]

const nearbyPlaces = [
  'School', 'Hospital', 'Metro Station', 'Beach', 'Shopping Mall',
  'Restaurant', 'Cafe', 'Park', 'Supermarket', 'Pharmacy',
  'Bank', 'Post Office', 'Gym', 'Library', 'Museum'
]

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Chinese', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Dutch'
]

export default function AddListingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const isEditMode = !!editId
  
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingExisting, setLoadingExisting] = useState(isEditMode)
  const [listingData, setListingData] = useState<ListingData>({
    title: '',
    description: '',
    listingType: '',
    propertyType: '',
    country: '',
    city: '',
    streetAddress: '',
    state: '',
    postalCode: '',
    latitude: 0,
    longitude: 0,
    price: 0,
    currency: 'USD',
    paymentFrequency: 'one-time',
    isNegotiable: false,
    acceptsCrypto: false,
    cryptoTypes: [],
    maintenanceFees: 0,
    propertyTaxes: 0,
    totalArea: 0,
    livingArea: 0,
    lotSize: 0,
    areaUnit: 'sqm',
    yearBuilt: new Date().getFullYear(),
    bedrooms: 0,
    bathrooms: 0,
    floors: 0,
    parkingSpaces: 0,
    furnishingStatus: 'unfurnished',
    floorNumber: 0,
    hasElevator: false,
    view: '',
    energyEfficiencyRating: '',
    features: [],
    nearbyPlaces: [],
    videoTourUrl: '',
    virtualTourUrl: '',
    floorPlanImage: null,
    availableFrom: '',
    ownershipType: '',
    titleDeedAvailable: false,
    isExclusive: false,
    agentName: 'John Doe', // Auto-filled from profile
    agentPhone: '+1 (555) 123-4567', // Auto-filled from profile
    agentEmail: 'john.doe@example.com', // Auto-filled from profile
    agencyName: '',
    licenseNumber: '',
    whatsappLink: '',
    languagesSpoken: [],
    status: 'draft',
    acceptTerms: false
  })

  const floorPlanInputRef = useRef<HTMLInputElement>(null)

  // New state for SEO-optimized image handling
  const [imageKeys, setImageKeys] = useState<string[]>([])
  const [imageSubjects, setImageSubjects] = useState<string[]>([])

  // Load existing listing data in edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      const loadExistingListing = async () => {
        try {
          setLoadingExisting(true)
          const response = await fetch(`/api/listings/${editId}`)
          
          if (!response.ok) {
            throw new Error('Failed to load listing')
          }
          
          const listing = await response.json()
          
          // Map API response to form data
          setListingData({
            title: listing.title || '',
            description: listing.description || '',
            listingType: listing.listingType || '',
            propertyType: listing.type || '',
            country: listing.country || '',
            city: listing.city || '',
            streetAddress: listing.streetAddress || '',
            state: listing.state || '',
            postalCode: listing.postalCode || '',
            latitude: listing.latitude || 0,
            longitude: listing.longitude || 0,
            price: listing.price || 0,
            currency: listing.currency || 'USD',
            paymentFrequency: listing.paymentFrequency || 'one-time',
            isNegotiable: listing.isNegotiable || false,
            acceptsCrypto: listing.acceptsCrypto || false,
            cryptoTypes: listing.cryptoTypes || [],
            maintenanceFees: listing.maintenanceFees || 0,
            propertyTaxes: listing.propertyTaxes || 0,
            totalArea: listing.totalArea || 0,
            livingArea: listing.livingArea || 0,
            lotSize: listing.lotSize || 0,
            areaUnit: listing.areaUnit || 'sqm',
            yearBuilt: listing.yearBuilt || new Date().getFullYear(),
            bedrooms: listing.bedrooms || 0,
            bathrooms: listing.bathrooms || 0,
            floors: listing.floors || 0,
            parkingSpaces: listing.parkingSpaces || 0,
            furnishingStatus: listing.furnishingStatus || 'unfurnished',
            floorNumber: listing.floorNumber || 0,
            hasElevator: listing.hasElevator || false,
            view: listing.view || '',
            energyEfficiencyRating: listing.energyEfficiencyRating || '',
            features: listing.features || [],
            nearbyPlaces: listing.nearbyPlaces || [],
            videoTourUrl: listing.videoTourUrl || '',
            virtualTourUrl: listing.virtualTourUrl || '',
            floorPlanImage: null,
            availableFrom: listing.availableFrom || '',
            ownershipType: listing.ownershipType || '',
            titleDeedAvailable: listing.titleDeedAvailable || false,
            isExclusive: listing.isExclusive || false,
            agentName: listing.agent?.name || 'John Doe',
            agentPhone: listing.agent?.phone || '+1 (555) 123-4567',
            agentEmail: listing.agent?.email || 'john.doe@example.com',
            agencyName: listing.agent?.agencyName || '',
            licenseNumber: listing.licenseNumber || '',
            whatsappLink: listing.whatsappLink || '',
            languagesSpoken: listing.languagesSpoken || [],
            status: listing.status || 'draft',
            acceptTerms: true // Assume accepted for existing listings
          })
          
          // Load existing images
          if (listing.images && listing.images.length > 0) {
            const keys = listing.images.map((img: any) => img.url)
            const subjects = listing.images.map((img: any) => img.subject || 'property')
            setImageKeys(keys)
            setImageSubjects(subjects)
          }
          
        } catch (error) {
          console.error('Error loading listing:', error)
          alert('Failed to load listing for editing. You will create a new listing instead.')
        } finally {
          setLoadingExisting(false)
        }
      }
      
      loadExistingListing()
    }
  }, [isEditMode, editId])

  const updateField = (field: keyof ListingData, value: any) => {
    setListingData(prev => ({ ...prev, [field]: value }))
  }

  // Handle image uploads from the new component
  const handleImagesChange = useCallback((keys: string[], subjects: string[]) => {
    setImageKeys(keys)
    setImageSubjects(subjects)
  }, [])

  const handleFeatureToggle = (feature: string) => {
    const currentFeatures = listingData.features
    if (currentFeatures.includes(feature)) {
      updateField('features', currentFeatures.filter(f => f !== feature))
    } else {
      updateField('features', [...currentFeatures, feature])
    }
  }

  const handleNearbyPlaceToggle = (place: string) => {
    const currentPlaces = listingData.nearbyPlaces
    if (currentPlaces.includes(place)) {
      updateField('nearbyPlaces', currentPlaces.filter(p => p !== place))
    } else {
      updateField('nearbyPlaces', [...currentPlaces, place])
    }
  }

  const handleLanguageToggle = (language: string) => {
    const currentLanguages = listingData.languagesSpoken
    if (currentLanguages.includes(language)) {
      updateField('languagesSpoken', currentLanguages.filter(l => l !== language))
    } else {
      updateField('languagesSpoken', [...currentLanguages, language])
    }
  }

  const nextStep = () => {
    if (step < 9) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Debug: Log the data being submitted
      console.log('🔍 Form submission data:', {
        title: listingData.title,
        imageKeys: imageKeys,
        imageSubjects: imageSubjects,
        imageKeysLength: imageKeys.length,
        imageSubjectsLength: imageSubjects.length
      })
      
      const url = isEditMode ? `/api/listings/${editId}` : '/api/listings'
      const method = isEditMode ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: listingData.title,
          description: listingData.description,
          price: listingData.price,
          currency: listingData.currency,
          location: [listingData.streetAddress, listingData.city, listingData.country].filter(Boolean).join(', '),
          type: listingData.propertyType,
          imageKeys: imageKeys, // Use the new image processing system
          imageSubjects: imageSubjects,
          status: 'active', // Always set to active - no admin approval needed
        }),
      })
      
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || `Failed to ${isEditMode ? 'update' : 'create'} listing`)
      }
      
      const result = await res.json()
      console.log(`✅ Listing ${isEditMode ? 'updated' : 'created'} successfully:`, result)
      
      // Show success message and redirect to dashboard with success notification
      const action = isEditMode ? 'listing-updated' : 'listing-created'
      router.push(`/dashboard?success=${action}&title=` + encodeURIComponent(listingData.title))
    } catch (e) {
      console.error(`❌ Failed to ${isEditMode ? 'update' : 'create'} listing:`, e)
      alert(`Failed to ${isEditMode ? 'update' : 'create'} listing: ` + (e as Error).message)
      setIsLoading(false)
    }
  }

  const canProceedToNextStep = () => {
    switch (step) {
      case 1:
        return listingData.title && listingData.description && listingData.listingType && listingData.propertyType
      case 2:
        return listingData.country && listingData.city && listingData.streetAddress
      case 3:
        return listingData.price > 0
      case 4:
        return listingData.totalArea > 0
      case 5:
        return true // Features are optional
      case 6:
        return imageKeys.length > 0 // At least one image must be uploaded
      case 7:
        return listingData.availableFrom && listingData.ownershipType
      case 8:
        return listingData.agentName && listingData.agentPhone && listingData.agentEmail
      case 9:
        return listingData.acceptTerms
      default:
        return false
    }
  }

  const getStepIcon = (stepNumber: number) => {
    const icons = [Home, MapPin, DollarSign, Ruler, Star, Upload, Calendar, User, Eye]
    return icons[stepNumber - 1]
  }

  const getStepTitle = (stepNumber: number) => {
    const titles = [
      'General Information',
      'Location Details',
      'Price & Financials',
      'Property Metrics',
      'Features & Amenities',
      'Media Uploads',
      'Availability & Legal',
      'Agent & Agency Information',
      'Review & Publishing'
    ]
    return titles[stepNumber - 1]
  }

  return (
    <div className="min-h-screen bg-background pt-16">
        {/* Header */}
        <div className="bg-card shadow-sm border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Building className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">Add New Listing</span>
              </div>
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((stepNumber) => {
                const Icon = getStepIcon(stepNumber)
                return (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {step > stepNumber ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    {stepNumber < 9 && (
                      <div className={`w-16 h-1 mx-2 ${
                        step > stepNumber ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {getStepTitle(step)}
            </h2>
            <Progress value={(step / 9) * 100} className="max-w-md mx-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {/* Step 1: General Information */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Property Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Luxury Downtown Penthouse with City Views"
                        value={listingData.title}
                        onChange={(e) => updateField('title', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your property in detail..."
                        value={listingData.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        rows={6}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="listingType">Listing Type</Label>
                        <Select value={listingData.listingType} onValueChange={(value) => updateField('listingType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select listing type" />
                          </SelectTrigger>
                          <SelectContent>
                            {listingTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="propertyType">Property Type</Label>
                        <Select value={listingData.propertyType} onValueChange={(value) => updateField('propertyType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            {propertyTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Location Details */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select value={listingData.country} onValueChange={(value) => updateField('country', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map(country => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="Enter city name"
                          value={listingData.city}
                          onChange={(e) => updateField('city', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          placeholder="Enter state or province"
                          value={listingData.state}
                          onChange={(e) => updateField('state', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="streetAddress">Street Address</Label>
                      <Input
                        id="streetAddress"
                        placeholder="Enter full street address"
                        value={listingData.streetAddress}
                        onChange={(e) => updateField('streetAddress', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          placeholder="Enter postal code"
                          value={listingData.postalCode}
                          onChange={(e) => updateField('postalCode', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Coordinates (Auto-filled)</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Latitude"
                            value={listingData.latitude || ''}
                            readOnly
                          />
                          <Input
                            placeholder="Longitude"
                            value={listingData.longitude || ''}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <MapPin className="inline h-4 w-4 mr-1" />
                        Map preview will be shown here. You can drag the pin to adjust the exact location.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Price & Financials */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="Enter price"
                          value={listingData.price || ''}
                          onChange={(e) => updateField('price', Number(e.target.value))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={listingData.currency} onValueChange={(value) => updateField('currency', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map(currency => (
                              <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                        <Select value={listingData.paymentFrequency} onValueChange={(value) => updateField('paymentFrequency', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="one-time">One-time</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="negotiable">Is Negotiable?</Label>
                          <p className="text-sm text-gray-600">Allow price negotiation</p>
                        </div>
                        <Switch
                          id="negotiable"
                          checked={listingData.isNegotiable}
                          onCheckedChange={(checked) => updateField('isNegotiable', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="crypto">Accepts Cryptocurrency?</Label>
                          <p className="text-sm text-gray-600">Enable crypto payments</p>
                        </div>
                        <Switch
                          id="crypto"
                          checked={listingData.acceptsCrypto}
                          onCheckedChange={(checked) => updateField('acceptsCrypto', checked)}
                        />
                      </div>
                    </div>

                    {listingData.acceptsCrypto && (
                      <div className="space-y-2">
                        <Label>Accepted Cryptocurrencies</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {['BTC', 'ETH', 'USDT', 'BNB'].map(crypto => (
                            <div key={crypto} className="flex items-center space-x-2">
                              <Checkbox
                                id={crypto}
                                checked={listingData.cryptoTypes.includes(crypto)}
                                onCheckedChange={() => {
                                  const current = listingData.cryptoTypes
                                  if (current.includes(crypto)) {
                                    updateField('cryptoTypes', current.filter(c => c !== crypto))
                                  } else {
                                    updateField('cryptoTypes', [...current, crypto])
                                  }
                                }}
                              />
                              <Label htmlFor={crypto} className="text-sm">{crypto}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="maintenanceFees">Maintenance Fees (Optional)</Label>
                        <Input
                          id="maintenanceFees"
                          type="number"
                          placeholder="Enter maintenance fees"
                          value={listingData.maintenanceFees || ''}
                          onChange={(e) => updateField('maintenanceFees', Number(e.target.value))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="propertyTaxes">Property Taxes (Optional)</Label>
                        <Input
                          id="propertyTaxes"
                          type="number"
                          placeholder="Enter property taxes"
                          value={listingData.propertyTaxes || ''}
                          onChange={(e) => updateField('propertyTaxes', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Property Metrics */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Label>Area Unit</Label>
                      <div className="flex space-x-2">
                        <Button
                          variant={listingData.areaUnit === 'sqm' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateField('areaUnit', 'sqm')}
                        >
                          m²
                        </Button>
                        <Button
                          variant={listingData.areaUnit === 'sqft' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateField('areaUnit', 'sqft')}
                        >
                          ft²
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="totalArea">Total Area</Label>
                        <Input
                          id="totalArea"
                          type="number"
                          placeholder="Enter total area"
                          value={listingData.totalArea || ''}
                          onChange={(e) => updateField('totalArea', Number(e.target.value))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="livingArea">Living Area</Label>
                        <Input
                          id="livingArea"
                          type="number"
                          placeholder="Enter living area"
                          value={listingData.livingArea || ''}
                          onChange={(e) => updateField('livingArea', Number(e.target.value))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lotSize">Lot Size</Label>
                        <Input
                          id="lotSize"
                          type="number"
                          placeholder="Enter lot size"
                          value={listingData.lotSize || ''}
                          onChange={(e) => updateField('lotSize', Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="yearBuilt">Year Built</Label>
                        <Input
                          id="yearBuilt"
                          type="number"
                          placeholder="Enter year built"
                          value={listingData.yearBuilt || ''}
                          onChange={(e) => updateField('yearBuilt', Number(e.target.value))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="floorNumber">Floor Number</Label>
                        <Input
                          id="floorNumber"
                          type="number"
                          placeholder="Enter floor number"
                          value={listingData.floorNumber || ''}
                          onChange={(e) => updateField('floorNumber', Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          placeholder="0"
                          value={listingData.bedrooms || ''}
                          onChange={(e) => updateField('bedrooms', Number(e.target.value))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          placeholder="0"
                          value={listingData.bathrooms || ''}
                          onChange={(e) => updateField('bathrooms', Number(e.target.value))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="floors">Floors</Label>
                        <Input
                          id="floors"
                          type="number"
                          placeholder="0"
                          value={listingData.floors || ''}
                          onChange={(e) => updateField('floors', Number(e.target.value))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="parkingSpaces">Parking Spaces</Label>
                        <Input
                          id="parkingSpaces"
                          type="number"
                          placeholder="0"
                          value={listingData.parkingSpaces || ''}
                          onChange={(e) => updateField('parkingSpaces', Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="furnishing">Furnishing Status</Label>
                        <Select value={listingData.furnishingStatus} onValueChange={(value) => updateField('furnishingStatus', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unfurnished">Unfurnished</SelectItem>
                            <SelectItem value="partially">Partially Furnished</SelectItem>
                            <SelectItem value="furnished">Furnished</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="view">View</Label>
                        <Select value={listingData.view} onValueChange={(value) => updateField('view', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select view type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sea">Sea View</SelectItem>
                            <SelectItem value="mountain">Mountain View</SelectItem>
                            <SelectItem value="city">City View</SelectItem>
                            <SelectItem value="garden">Garden View</SelectItem>
                            <SelectItem value="pool">Pool View</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="energyRating">Energy Efficiency Rating</Label>
                        <Select value={listingData.energyEfficiencyRating} onValueChange={(value) => updateField('energyEfficiencyRating', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                            <SelectItem value="D">D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="elevator">Elevator Access</Label>
                        <p className="text-sm text-gray-600">Building has elevator</p>
                      </div>
                      <Switch
                        id="elevator"
                        checked={listingData.hasElevator}
                        onCheckedChange={(checked) => updateField('hasElevator', checked)}
                      />
                    </div>
                  </div>
                )}

                {/* Step 5: Features & Amenities */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Property Features</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {features.map(feature => (
                          <div key={feature} className="flex items-center space-x-2">
                            <Checkbox
                              id={feature}
                              checked={listingData.features.includes(feature)}
                              onCheckedChange={() => handleFeatureToggle(feature)}
                            />
                            <Label htmlFor={feature} className="text-sm">{feature}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Nearby Places</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {nearbyPlaces.map(place => (
                          <div key={place} className="flex items-center space-x-2">
                            <Checkbox
                              id={place}
                              checked={listingData.nearbyPlaces.includes(place)}
                              onCheckedChange={() => handleNearbyPlaceToggle(place)}
                            />
                            <Label htmlFor={place} className="text-sm">{place}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 6: Media Uploads */}
                {step === 6 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Property Images</h3>
                      <p className="text-sm text-gray-600">
                        Upload property images with room/subject tagging for better SEO. At least one image is required.
                      </p>
                      <ImageUploader
                        onImagesChange={handleImagesChange}
                        maxImages={20}
                        disabled={isLoading}
                      />
                      {imageKeys.length > 0 && (
                        <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
                          <p className="text-sm text-green-700">
                            ✓ {imageKeys.length} image{imageKeys.length > 1 ? 's' : ''} uploaded successfully
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="videoTour">Video Tour URL (Optional)</Label>
                        <Input
                          id="videoTour"
                          placeholder="YouTube or Vimeo URL"
                          value={listingData.videoTourUrl}
                          onChange={(e) => updateField('videoTourUrl', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="virtualTour">Virtual Tour URL (Optional)</Label>
                        <Input
                          id="virtualTour"
                          placeholder="360° virtual tour URL"
                          value={listingData.virtualTourUrl}
                          onChange={(e) => updateField('virtualTourUrl', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Floor Plan (Optional)</h3>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        {listingData.floorPlanImage ? (
                          <div className="mb-4">
                            <img src={listingData.floorPlanImage} alt="Floor plan" className="mx-auto max-h-48 rounded" />
                          </div>
                        ) : (
                          <>
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">Upload floor plan image</p>
                          </>
                        )}
                        <input
                          ref={floorPlanInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const url = URL.createObjectURL(file)
                              updateField('floorPlanImage', url)
                            }
                          }}
                        />
                        <Button variant="outline" onClick={() => floorPlanInputRef.current?.click()}>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 7: Availability & Legal */}
                {step === 7 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="availableFrom">Available From</Label>
                      <Input
                        id="availableFrom"
                        type="date"
                        value={listingData.availableFrom}
                        onChange={(e) => updateField('availableFrom', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ownershipType">Ownership Type</Label>
                      <Select value={listingData.ownershipType} onValueChange={(value) => updateField('ownershipType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ownership type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="freehold">Freehold</SelectItem>
                          <SelectItem value="leasehold">Leasehold</SelectItem>
                          <SelectItem value="shared">Shared Ownership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="titleDeed">Title Deed Available</Label>
                          <p className="text-sm text-gray-600">Property has clear title deed</p>
                        </div>
                        <Switch
                          id="titleDeed"
                          checked={listingData.titleDeedAvailable}
                          onCheckedChange={(checked) => updateField('titleDeedAvailable', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="exclusive">Exclusive Listing</Label>
                          <p className="text-sm text-gray-600">This is an exclusive listing</p>
                        </div>
                        <Switch
                          id="exclusive"
                          checked={listingData.isExclusive}
                          onCheckedChange={(checked) => updateField('isExclusive', checked)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 8: Agent & Agency Information */}
                {step === 8 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="agentName">Agent Name</Label>
                        <Input
                          id="agentName"
                          value={listingData.agentName}
                          onChange={(e) => updateField('agentName', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="agentPhone">Agent Phone</Label>
                        <Input
                          id="agentPhone"
                          value={listingData.agentPhone}
                          onChange={(e) => updateField('agentPhone', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="agentEmail">Agent Email</Label>
                        <Input
                          id="agentEmail"
                          type="email"
                          value={listingData.agentEmail}
                          onChange={(e) => updateField('agentEmail', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="agencyName">Agency Name (Optional)</Label>
                        <Input
                          id="agencyName"
                          placeholder="Enter agency name"
                          value={listingData.agencyName}
                          onChange={(e) => updateField('agencyName', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">License Number (Optional)</Label>
                        <Input
                          id="licenseNumber"
                          placeholder="Enter license number"
                          value={listingData.licenseNumber}
                          onChange={(e) => updateField('licenseNumber', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp Link (Optional)</Label>
                      <Input
                        id="whatsapp"
                        placeholder="https://wa.me/1234567890"
                        value={listingData.whatsappLink}
                        onChange={(e) => updateField('whatsappLink', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Languages Spoken</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {languages.map(language => (
                          <div key={language} className="flex items-center space-x-2">
                            <Checkbox
                              id={language}
                              checked={listingData.languagesSpoken.includes(language)}
                              onCheckedChange={() => handleLanguageToggle(language)}
                            />
                            <Label htmlFor={language} className="text-sm">{language}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 9: Review & Publishing */}
                {step === 9 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Listing Preview</h3>
                      <Card>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-xl font-semibold">{listingData.title || 'Property Title'}</h4>
                              <p className="text-gray-600">{listingData.description || 'Property description will appear here...'}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Price</p>
                                <p className="font-semibold">
                                  {listingData.price ? `${listingData.currency} ${listingData.price.toLocaleString()}` : 'Price not set'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Type</p>
                                <p className="font-semibold">{listingData.propertyType || 'Property type not set'}</p>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-600">Location</p>
                              <p className="font-semibold">
                                {[listingData.streetAddress, listingData.city, listingData.country].filter(Boolean).join(', ') || 'Location not set'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Publishing Options</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status">Initial Status</Label>
                        <Select value={listingData.status} onValueChange={(value) => updateField('status', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Save as Draft</SelectItem>
                            <SelectItem value="published">Publish Immediately</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={listingData.acceptTerms}
                          onCheckedChange={(checked) => updateField('acceptTerms', checked as boolean)}
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I accept the platform's terms and conditions and confirm that all information provided is accurate
                        </Label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>

                  <div className="flex space-x-2">
                    {step < 9 ? (
                      <Button
                        onClick={nextStep}
                        disabled={!canProceedToNextStep()}
                      >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={!canProceedToNextStep() || isLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Publishing...
                          </div>
                        ) : (
                          'Publish Listing'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Progress</span>
                      <span>{Math.round((step / 9) * 100)}%</span>
                    </div>
                    <Progress value={(step / 9) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(stepNum => (
                      <div key={stepNum} className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${
                          step >= stepNum ? 'bg-green-600' : 'bg-gray-300'
                        }`} />
                        <span className={`text-sm ${
                          step >= stepNum ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {getStepTitle(stepNum)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  {step === 1 && (
                    <>
                      <p>• Use a descriptive title that highlights key features</p>
                      <p>• Write detailed descriptions to attract more buyers</p>
                      <p>• Choose the correct listing and property types</p>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <p>• Ensure the address is accurate for better search results</p>
                      <p>• The map will help buyers locate the property</p>
                      <p>• Double-check postal code for accuracy</p>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <p>• Set competitive prices based on market research</p>
                      <p>• Be transparent about additional fees</p>
                      <p>• Consider offering negotiation options</p>
                    </>
                  )}
                  {step === 4 && (
                    <>
                      <p>• Provide accurate measurements</p>
                      <p>• Include all relevant property metrics</p>
                      <p>• Energy ratings can attract eco-conscious buyers</p>
                    </>
                  )}
                  {step === 5 && (
                    <>
                      <p>• Highlight unique features that set your property apart</p>
                      <p>• Mention nearby amenities and attractions</p>
                      <p>• Be honest about property conditions</p>
                    </>
                  )}
                  {step === 6 && (
                    <>
                      <p>• High-quality photos increase engagement significantly</p>
                      <p>• Use well-lit, professional-looking images</p>
                      <p>• Video tours can boost conversion rates</p>
                    </>
                  )}
                  {step === 7 && (
                    <>
                      <p>• Clear availability dates help manage expectations</p>
                      <p>• Legal transparency builds trust with buyers</p>
                      <p>• Exclusive listings may get premium promotion</p>
                    </>
                  )}
                  {step === 8 && (
                    <>
                      <p>• Complete contact information is essential</p>
                      <p>• Multiple language options expand your reach</p>
                      <p>• Professional details build credibility</p>
                    </>
                  )}
                  {step === 9 && (
                    <>
                      <p>• Review all information carefully before publishing</p>
                      <p>• Draft mode allows you to save and edit later</p>
                      <p>• Published listings become immediately visible</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}