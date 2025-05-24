"use client"
import { useEffect } from 'react'
import { LatLngExpression } from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import type { Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'

type MapProps = {
  center: [number, number]
  zoom: number
  address: string
}

// Helper component to control map view
function MapController({ center }: { center: LatLngExpression }) {
  const map = useMap()
  
  useEffect(() => {
    if (map) map.setView(center)
  }, [map, center])
  
  return null
}

export default function Map({ center, zoom, address }: MapProps) {
  const defaultCenter: LatLngExpression = [26.8467, 80.9462] // Lucknow coordinates

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <MapContainer
        key={center.join(',')} // Force remount when center changes
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={center as LatLngExpression}>
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
