import axios from 'axios';

// ImageKit configuration
const IMAGEKIT_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || 'public_jj7zLb2xwCFGNClu5621P3PZQNI=';
const IMAGEKIT_PRIVATE_KEY = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY || 'private_xzqw1dlaPqxzTbfxMqobMVn3T38=';
const IMAGEKIT_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/bebyyzofp';

// Generate authentication signature for ImageKit upload
const getAuthenticationSignature = async () => {
  try {
    // Call backend endpoint to generate token
    const response = await axios.get('/api/imagekit/auth');
    return response.data;
  } catch (error) {
    console.error('Failed to get ImageKit auth:', error);
    throw error;
  }
};

// Upload file to ImageKit
export const uploadToImageKit = async (file, folder = 'roadmaps') => {
  try {
    const auth = await getAuthenticationSignature();
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('publicKey', IMAGEKIT_PUBLIC_KEY);
    formData.append('signature', auth.signature);
    formData.append('expire', auth.expire);
    formData.append('token', auth.token);
    formData.append('folder', `/${folder}`);
    formData.append('fileName', `${Date.now()}-${file.name}`);

    const response = await axios.post(
      'https://upload.imagekit.io/api/v1/files/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return {
      url: response.data.url,
      fileId: response.data.fileId,
      name: file.name,
      size: file.size,
    };
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw error;
  }
};

// Batch upload multiple files
export const uploadMultipleFilesToImageKit = async (files, folder = 'roadmaps') => {
  try {
    const uploads = files.map((file) =>
      uploadToImageKit(file, folder).catch((error) => ({
        error: true,
        file: file.name,
        message: error.message,
      }))
    );

    const results = await Promise.all(uploads);
    return results;
  } catch (error) {
    console.error('Batch upload error:', error);
    throw error;
  }
};

// Get ImageKit URL with transformations
export const getImageKitUrl = (url, width, height, quality = 80) => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams();
    if (width) params.append('w', width);
    if (height) params.append('h', height);
    if (quality) params.append('q', quality);
    
    return `${url}?${params.toString()}`;
  } catch {
    return url;
  }
};

export default {
  uploadToImageKit,
  uploadMultipleFilesToImageKit,
  getImageKitUrl,
};
