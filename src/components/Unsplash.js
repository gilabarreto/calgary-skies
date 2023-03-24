import axios from "axios";
import { memo, useEffect, useState } from "react";

function UnsplashImg() {
  const [photos, setPhotos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const randomPage = Math.floor(Math.random() * 100) + 1;
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=calgary&page=${randomPage}&per_page=30&orientation=squarish&client_id=${process.env.REACT_APP_UNSPLASH_KEY}`;

    axios
      .get(unsplashUrl)
      .then((response) => {
        const photosArray = response.data.results.map((photo) => photo.urls?.small);
        setPhotos(photosArray);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {photos && photos.length > 0 && (
          <img src={photos[Math.floor(Math.random() * photos.length)]} alt="Calgary sky" style={{ height: "15em"}} />
      )}
    </>
  );
}

export default memo(UnsplashImg);
