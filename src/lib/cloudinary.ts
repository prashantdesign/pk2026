'use client';

export const uploadToCloudinary = async (file: File): Promise<string> => {
  // 1. Get signature from our API
  const signatureResponse = await fetch('/api/sign-image', {
      method: 'POST',
  });

  if (!signatureResponse.ok) {
    throw new Error('Failed to get upload signature from the server.');
  }

  const { signature, timestamp } = await signatureResponse.json();

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  
  // 2. Prepare form data for Cloudinary
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey!);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('folder', 'portfolio-uploads'); // Must match the folder signed on the server

  // 3. Upload to Cloudinary
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  
  const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
  });

  if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      console.error('Cloudinary upload error response:', errorData);
      throw new Error(`Cloudinary upload failed: ${errorData.error.message}`);
  }
  
  const uploadData = await uploadResponse.json();
  return uploadData.secure_url;
};
