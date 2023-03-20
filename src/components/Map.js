import axios from "axios";

import { useState, useEffect, useCallback } from "react";
import { GoogleMap, useLoadScript, MarkerF, InfoWindow } from "@react-google-maps/api"
import { benches } from "../benches"

export default function Map(props) {

  const { userCoords, closestBench, setUserCoords, setClosestBench, closestBenchAddress, setClosestBenchAddress } = props;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY
  })

  const getUserCoords = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error(error);
      });
  }, [setUserCoords]);

  const distanceBetweenUserAndClosestBench = useCallback(() => {
    if (userCoords) {
      const distances = benches.map((bench) => {
        const latDiff = userCoords.lat - bench.lat;
        const lngDiff = userCoords.lng - bench.lng;
        const distance = Math.sqrt(latDiff ** 2 + lngDiff ** 2);
        return { coords: bench, distance };
      });

      const sortedDistances = distances.sort(
        (a, b) => a.distance - b.distance
      );
      const sortedBench = sortedDistances[0].coords;
      setClosestBench(sortedBench);
    }
  }, [userCoords, setClosestBench]);

  const getClosestBenchAddress = useCallback((lat, lng) => {
    if (closestBench) {
      const nominatim = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

      axios.get(nominatim)
        .then(response => {
          const nominatimData = response.data;
          const benchAddress = `${nominatimData.address.house_number}, ${nominatimData.address.road}, ${nominatimData.address.suburb}, ${nominatimData.address.postcode}.`;
          setClosestBenchAddress(benchAddress);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [closestBench, setClosestBenchAddress]);


  useEffect(() => {
    if (!userCoords) {
      getUserCoords();
    } else {
      distanceBetweenUserAndClosestBench();
      if (closestBench) {
        getClosestBenchAddress(closestBench.lat, closestBench.lng)
      }
    }
  }, [userCoords, closestBench, getUserCoords, distanceBetweenUserAndClosestBench, getClosestBenchAddress, setClosestBench, setClosestBenchAddress]);

  if (!isLoaded) return <div>Loading...</div>

  return <BenchesMap userCoords={userCoords} closestBenchAddress={closestBenchAddress} />
}

function BenchesMap() {
  const [selectedBench, setSelectedBench] = useState(null);

  const onMarkerClick = (bench) => {
    const nominatim = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${bench.lat}&lon=${bench.lng}`

    axios
      .get(nominatim)
      .then(response => {
        const benchAddress = `${response.data.address.house_number}, ${response.data.address.road}, ${response.data.address.suburb}, ${response.data.address.postcode}`;
        setSelectedBench({ ...bench, address: benchAddress });
      })
      .catch(error => {
        console.error(error);
      });
  };

  const onInfoWindowClose = () => {
    setSelectedBench(null);
  };

  return (
    <GoogleMap
      zoom={12}
      center={{ lat: 51.0447, lng: -114.0719 }}
      mapContainerClassName="map-container"
    >
      {benches.map((bench) => (
        <MarkerF
          key={`${bench.lat},${bench.lng}`}
          position={bench}
          onClick={() => onMarkerClick(bench)}
        />
      ))}

      {selectedBench && (
        <InfoWindow
          position={selectedBench}
          onCloseClick={onInfoWindowClose}
        >
          <div>
            <p>{selectedBench.address}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
