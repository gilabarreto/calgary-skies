import axios from "axios";

import { useState, useEffect, useCallback } from "react";
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from "@react-google-maps/api"
import { benches } from "../benches"

export default function Map(props) {

  const { userCoords, closestBench, setUserCoords, setClosestBench, closestBenchAddress, setClosestBenchAddress } = props;
  const [mapCenter, setMapCenter] = useState({ lat: 51.0447, lng: -114.0719 });

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
          const houseNumber = nominatimData.address.house_number ? `${nominatimData.address.house_number}, ` : '';
          const road = nominatimData.address.road ? `${nominatimData.address.road}, ` : '';
          const suburb = nominatimData.address.suburb ? `${nominatimData.address.suburb}, ` : '';
          const postcode = nominatimData.address.postcode ? `${nominatimData.address.postcode}` : '';
          const benchAddress = `${houseNumber}${road}${suburb}${postcode}`;
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

  return <BenchesMap userCoords={userCoords} closestBenchAddress={closestBenchAddress} center={mapCenter} />;
}

function BenchesMap({ center }) {
  const [selectedBench, setSelectedBench] = useState(null);

  const onMarkerClick = (bench) => {
    const nominatim = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${bench.lat}&lon=${bench.lng}`

    axios
      .get(nominatim)
      .then(response => {
        const nominatimData = response.data;
        const houseNumber = nominatimData.address.house_number ? `${nominatimData.address.house_number}, ` : '';
        const road = nominatimData.address.road ? `${nominatimData.address.road}, ` : '';
        const suburb = nominatimData.address.suburb ? `${nominatimData.address.suburb}, ` : '';
        const postcode = nominatimData.address.postcode ? `${nominatimData.address.postcode}` : '';
        const benchAddress = `${houseNumber}${road}${suburb}${postcode}`;
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
      center={center}
      mapContainerClassName="map-container"
    >
      {benches.map((bench) => (
        <MarkerF
          key={`${bench.lat},${bench.lng}`}
          position={bench}
          onClick={() => onMarkerClick(bench)}
        />
      ))}

      {selectedBench && selectedBench.address && (
        <InfoWindowF
          position={selectedBench}
          onCloseClick={onInfoWindowClose}
        >
          <div>
            <p><a href={`https://www.google.com/maps/place/${selectedBench.lat},${selectedBench.lng}`} target={"_blank"} rel={"noreferrer"}>{selectedBench.address}</a></p>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}
