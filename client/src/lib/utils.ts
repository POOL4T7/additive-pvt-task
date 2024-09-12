import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MAX_WIDTH = 500;
export const MAX_HEIGHT = 500;
export const MAX_SIZE_MB = 1;
export const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

import { toast } from 'react-toastify';
import axios from 'axios';

export const uploadImage = async (file: File) => {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', 'additive');

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUD_NAME
      }/image/upload`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress(progressEvent) {
          console.log(
            'progressEvent',
            Math.round((progressEvent.progress || 0) * 100)
          );
          // const percentCompleted = Math.round(
          //   (progressEvent.loaded * 100) / progressEvent.total
          // );
        },
      }
    );

    return res.data;
  } catch (error: any) {
    console.log(error);
    toast.error(error.message);
  }
};
