const API_BASE_URL = 'http://localhost:5000/api';

export const analyzeText = async (text) => {
  const response = await fetch(`${API_BASE_URL}/analyze/text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to analyze text');
  }
  
  return await response.json();
};

export const analyzeVideo = async (url) => {
  const response = await fetch(`${API_BASE_URL}/analyze/video`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to analyze video');
  }
  
  return await response.json();
};

export const analyzeAudio = async (url) => {
  const response = await fetch(`${API_BASE_URL}/analyze/audio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to analyze audio');
  }
  
  return await response.json();
};
