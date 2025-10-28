import { storage } from "@/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

async function upload(uri: string, name: string) {
  const response = await fetch(uri);
  const blob = await response.blob();
  const imageRef = ref(storage, `images/${name}`);
  const result = await uploadBytes(imageRef, blob);
  const downloadUrl = await getDownloadURL(result.ref);
  const metadata = result.metadata;

  return { downloadUrl, metadata };
}

export default {
  upload,
};
