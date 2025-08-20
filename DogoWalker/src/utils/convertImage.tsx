
function convertImage(
  imageFile: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.95
): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      let { width, height } = img;
      if (width > height) {
        if (width > maxWidth) {
          height = height * (maxWidth / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = width * (maxHeight / height);
          height = maxHeight;
        }
      }
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;
      if (ctx) ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Błąd konwersji obrazu"));
          }
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => reject(new Error("Błąd ładowania obrazu"));
    img.src = URL.createObjectURL(imageFile);
  });
}

export default convertImage;