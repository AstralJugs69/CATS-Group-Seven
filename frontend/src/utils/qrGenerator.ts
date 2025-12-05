export const generateQRData = (batchId: string, policyId?: string) => {
  return JSON.stringify({
    batchId,
    policyId,
    platform: 'Ethio-Origin',
    timestamp: new Date().toISOString()
  });
};

export const parseQRData = (data: string) => {
  try {
    return JSON.parse(data);
  } catch {
    return { batchId: data };
  }
};