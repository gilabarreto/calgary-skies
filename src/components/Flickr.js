import axios from "axios";
import { memo, useEffect, useState } from "react";

function FlickrImg() {
  const [photos, setPhotos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const flickrUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=7dec62a6d2adc0219da732407978d2e9&tags=calgary,sky&sort=relevance&format=json&nojsoncallback=1`;

    axios
      .get(flickrUrl)
      .then((response) => {
        const photosArray = response.data.photos.photo.map((photo) => ({
          url: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_c.jpg`,
          link: `https://www.flickr.com/photos/${photo.owner}/${photo.id}`,
        }));
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

  const selectedPhoto = photos[Math.floor(Math.random() * photos.length)];

  return (
    <>
      {photos && photos.length > 0 && (
        <a href={selectedPhoto.link} target="_blank" rel="noreferrer">
          <img src={selectedPhoto.url} alt="Calgary sky" />
        </a>
      )}
    </>
  );
}

export default memo(FlickrImg);
