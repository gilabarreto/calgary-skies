import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api"

import { useEffect } from "react";

import { benches } from "../benches"

export default function Map(props) {

  const { userCoords, closestBench, setUserCoords, setClosestBench } = props;
  
  // Load the Google Maps API using the useLoadScript hook
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY
  })

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error(error);
      }
    );
  },[]);

  // console.log("userCoords", userCoords)
  
  useEffect(() => {
    if (userCoords) {
      // Calculate the distance between the user's location and each bench
      const distances = benches.map((bench) => {
        const latDiff = userCoords.lat - bench.lat;
        const lngDiff = userCoords.lng - bench.lng;
        const distance = Math.sqrt(latDiff ** 2 + lngDiff ** 2);
        return { coords: bench, distance };
      });
      
      // Find the closest bench
      const sortedDistances = distances.sort(
        (a, b) => a.distance - b.distance
        );
        const sortedBench = sortedDistances[0].coords;
        setClosestBench(sortedBench);
        // console.log("closest bench:", closestBench);
      }
    }, [userCoords, closestBench]);
    
    // If the Google Maps API is not loaded yet, display a loading message
    if (!isLoaded) return <div>Loading...</div>
    
    // Render the ArtistMap component with the coordinates as props
    return <BenchesMap userCoords={userCoords} />
  }
  
// ArtistMap component that displays the GoogleMap with a marker at a specific location
function BenchesMap() {

  return (
    // Render the GoogleMap component with the latitude and longitude as center
    <GoogleMap
      zoom={12}
      center={{ lat: 51.0447, lng: -114.0719 }}
      mapContainerClassName="map-container"
    >
      {/* Add a marker to the map at the latitude and longitude */}

      {benches.map((bench) => (
        <MarkerF position={bench} />
      ))}
    </GoogleMap>
  );
}