export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatGPS = (gps: string): string => {
  const [lat, lng] = gps.split(', ');
  return `${lat}, ${lng}`;
};

export const generateBatchId = (cropType: string): string => {
  const prefix = cropType === 'coffee' ? 'ETH-COFFEE' : 
                 cropType === 'tea' ? 'ETH-TEA' : 'ETH-FLOWERS';
  const random = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `${prefix}-${random}`;
};