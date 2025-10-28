import { storage } from "@/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// Upload an image to Firebase Storage (React Native compatible)
async function upload(uri: string, name: string) {
  // Convert the image URI to a blob (React Native compatible)
  const blob = await new Promise<Blob>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.error("Error reading file:", e);
      reject(new TypeError("Failed to read file"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  // Upload to Firebase Storage
  const imageRef = ref(storage, name);
  const result = await uploadBytes(imageRef, blob);
  const downloadUrl = await getDownloadURL(result.ref);
  const metadata = result.metadata;

  return { downloadUrl, metadata };
}

export default {
  upload,
};
