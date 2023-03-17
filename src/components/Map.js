import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api"

export default function Map() {

  // Load the Google Maps API using the useLoadScript hook
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY
  })

  // If the Google Maps API is not loaded yet, display a loading message
  if (!isLoaded) return <div>Loading...</div>

  // Render the ArtistMap component with the coordinates as props
  return <BenchesMap />
}

// ArtistMap component that displays the GoogleMap with a marker at a specific location
function BenchesMap(props) {

  return (
    // Render the GoogleMap component with the latitude and longitude as center
    <GoogleMap
      zoom={11}
      center={{ lat: 51.0447, lng: -114.0719 }}
      mapContainerClassName="map-container"
    >
      {/* Add a marker to the map at the latitude and longitude */}
      <MarkerF position={{ lat: 51.0447, lng: -114.0719 }}></MarkerF>
    </GoogleMap>
  );
}