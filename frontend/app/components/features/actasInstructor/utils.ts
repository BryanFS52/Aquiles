export function formatDateES(d: Date) {
  return d.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
}

export async function filesToBase64Joined(files: File[]): Promise<string> {
  if (!files || files.length === 0) {
    return '';
  }

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Extraer solo la parte base64, removiendo el prefijo "data:...;base64,"
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64 || '');
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const list = await Promise.all(files.map(toBase64));
  // Filtrar strings vacíos y unir con ';' como delimitador
  const validBase64s = list.filter(b64 => b64.trim() !== '');
  return validBase64s.join(';');
}
