import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';

const uploadImageAndGetUrl = async (file: File | Blob, fileName: string) => {
  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};

export default uploadImageAndGetUrl;
