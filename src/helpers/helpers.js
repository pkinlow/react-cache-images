export async function precacheImages(imageUrls) {
  const promises = imageUrls.map(src => new Promise((resolve, reject) => {
    const image = new Image();
    function onLoad() {
      resolve(src);
      image.removeEventListener("load", onLoad);
      image.removeEventListener("error", onError);
    }

    function onError() {
      reject(src);
      image.removeEventListener("load", onLoad);
      image.removeEventListener("error", onError);
    }

    image.addEventListener("load", onLoad);
    image.addEventListener("error", onError);

    image.src = src;
  }));

  const allSettled = await Promise.allSettled(promises).then(results => results.reduce(({images, errors}, {value, reason}) => {
    if (value) {
      images.push(value);
    } else {
      errors.push(reason);
    }

    return {images, errors};
  }, {images:[], errors:[]}));

  return allSettled;
}
