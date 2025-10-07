export const cropImage = async (
  imageUrl: string,
  aspectRatio: number,
  x: number,
  y: number,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Canvas context not available'));
      }

      // Calculate the dimensions of the cropped area
      const imgAspectRatio = img.width / img.height;
      let cropWidth = img.width;
      let cropHeight = img.height;

      if (imgAspectRatio > aspectRatio) {
        cropWidth = img.height * aspectRatio;
      } else {
        cropHeight = img.width / aspectRatio;
      }

      const cropX = (x / 100) * (img.width - cropWidth);
      const cropY = (y / 100) * (img.height - cropHeight);

      // Set canvas dimensions to match the desired aspect ratio
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      // Draw the cropped image onto the canvas
      ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas blob conversion failed'));
        }
      }, 'image/png');
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
};

export const cropImageAsCanvas = async (
  imageUrl: string,
  aspectRatio: number,
  x: number,
  y: number,
): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Canvas context not available'));
      }

      // Calculate the dimensions of the cropped area
      const imgAspectRatio = img.width / img.height;
      let cropWidth = img.width - 6;
      let cropHeight = img.height - 6;

      if (imgAspectRatio > aspectRatio) {
        cropWidth = img.height * aspectRatio;
      } else {
        cropHeight = img.width / aspectRatio;
      }

      const cropX = (x / 100) * (img.width - cropWidth);
      const cropY = (y / 100) * (img.height - cropHeight);

      // Set canvas dimensions to match the desired aspect ratio
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      // Draw the cropped image onto the canvas
      ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);

      resolve(canvas);
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
};
