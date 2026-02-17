/**
 * Utility functions for file handling
 */

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:image/jpeg;base64, prefix if needed
      const base64 = result.split(',')[1] || result;
      resolve(base64);
    };
    reader.onerror = reject;
  });
};

export const dataUrlToBase64 = (dataUrl: string): string => {
  return dataUrl.split(',')[1] || dataUrl;
};

export const base64ToDataUrl = (base64: string, mimeType = 'image/jpeg'): string => {
  return `data:${mimeType};base64,${base64}`;
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Por favor, selecione uma imagem válida.' };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'A imagem é muito grande. Selecione uma imagem de até 5MB.' };
  }

  return { valid: true };
};
