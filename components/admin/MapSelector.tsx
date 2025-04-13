"use client"

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Building } from "@/lib/types"

// Fix for default marker icons
// This is required because Leaflet's assets get messed up in production builds
const icon = L.icon({
  iconUrl: '/user-location.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

// Create custom SVG building marker
const createBuildingIcon = (isSelected: boolean = false) => {
  const sizeFactor = isSelected ? 1.5 : 1.3;
  const baseSize = 32;
  const width = baseSize * sizeFactor;
  const height = baseSize * sizeFactor;
  
  return L.divIcon({
    html: `
      <svg width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.5));">
        <!-- Building Base -->
        <rect x="3" y="4" width="18" height="16" rx="1" 
              fill="${isSelected ? '#e74c3c' : '#3498db'}" 
              stroke="${isSelected ? '#c0392b' : '#2980b9'}" 
              stroke-width="2" />
        
        <!-- Windows -->
        <rect x="6" y="7" width="3" height="3" fill="white" />
        <rect x="6" y="12" width="3" height="3" fill="white" />
        <rect x="15" y="7" width="3" height="3" fill="white" />
        <rect x="15" y="12" width="3" height="3" fill="white" />
        
        <!-- Door -->
        <rect x="10.5" y="15" width="3" height="5" fill="white" rx="1" />
        
        <!-- Roof -->
        <polygon points="3,4 12,1 21,4" 
                fill="${isSelected ? '#c0392b' : '#2980b9'}" 
                stroke="${isSelected ? '#c0392b' : '#2980b9'}" />
      </svg>
    `,
    className: '',
    iconSize: [width, height],
    iconAnchor: [width/2, height],
    popupAnchor: [0, -height]
  });
};

// Create a custom pin marker for the active location
const createPinIcon = () => {
  return L.divIcon({
    html: `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.5));">
        <path d="M12 21C11.5 21 11 20.8 10.6 20.4C7.1 16.9 5 13.5 5 10.5C5 7.6 7.5 5 10.5 5C11.3 5 12 5.1 12.8 5.5C16.4 5.5 19 8 19 11C19 13.9 16.9 17.4 13.4 20.4C13 20.8 12.5 21 12 21Z" 
              fill="#e74c3c" 
              stroke="#c0392b" 
              stroke-width="2" />
        <circle cx="12" cy="11" r="3" fill="white" />
      </svg>
    `,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

interface MapSelectorProps {
  initialPosition?: { lat: number; lng: number }
  onLocationSelect: (location: { lat: number; lng: number }) => void
  buildings?: Building[]
}

// This component handles the map events
function LocationMarker({ 
  initialPosition, 
  onLocationSelect 
}: MapSelectorProps) {
  const [position, setPosition] = useState(initialPosition || { lat: 6.51771, lng: 3.37534 })

  const map = useMapEvents({
    click(e) {
      const newPos = { lat: e.latlng.lat, lng: e.latlng.lng }
      setPosition(newPos)
      onLocationSelect(newPos)
    },
  })

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition)
      map.flyTo(initialPosition, map.getZoom())
    }
  }, [initialPosition, map])

  return position ? (
    <Marker 
      position={position} 
      icon={icon}
    />
  ) : null
}

export default function MapSelector({ 
  initialPosition, 
  onLocationSelect,
  buildings = []
}: MapSelectorProps) {
  // Default to YabaTech coordinates if no initial position is provided
  const defaultPosition = initialPosition || { lat: 6.51771, lng: 3.37534 }
  const [selectedPosition, setSelectedPosition] = useState(defaultPosition)

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setSelectedPosition(location)
    onLocationSelect(location)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-300">
        <MapContainer 
          center={defaultPosition} 
          zoom={17} 
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            initialPosition={defaultPosition} 
            onLocationSelect={handleLocationSelect} 
          />
          
          {/* Existing buildings */}
          {buildings.map((building, index) => (
            <Marker
              key={building.name ? building.name : `map-building-${index}`}
              position={[building.coordinates.lat, building.coordinates.lng]}
              opacity={0.7}
              icon={createBuildingIcon(false)}
            />
          ))}
        </MapContainer>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MapPin className="h-4 w-4 text-[var(--yabatech-green)]" />
        <span>Click on the map to set the building location</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Latitude</label>
          <input
            type="number"
            step="0.000001"
            value={selectedPosition.lat}
            onChange={(e) => {
              const newLat = parseFloat(e.target.value);
              if (!isNaN(newLat)) {
                const newPos = { ...selectedPosition, lat: newLat };
                setSelectedPosition(newPos);
                onLocationSelect(newPos);
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Longitude</label>
          <input
            type="number"
            step="0.000001"
            value={selectedPosition.lng}
            onChange={(e) => {
              const newLng = parseFloat(e.target.value);
              if (!isNaN(newLng)) {
                const newPos = { ...selectedPosition, lng: newLng };
                setSelectedPosition(newPos);
                onLocationSelect(newPos);
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  )
} 