export function formatDateES(d: Date) {
  return d.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
}

export async function filesToBase64Joined(files: File[]): Promise<string> {
  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string) || '');
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  const list = await Promise.all(files.map(toBase64));
  return list.join('||');
}
