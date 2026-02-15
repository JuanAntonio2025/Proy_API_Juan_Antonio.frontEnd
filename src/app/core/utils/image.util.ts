import { Petition } from '../../models/petition';

export function resolvePetitionImage(apiUrl: string, p: Petition): string {
  const filePath = p.files?.[0]?.file_path;
  if (!filePath) return 'assets/images/placeholder.webp';

  // si ya viene absoluta
  if (/^https?:\/\//i.test(filePath)) return filePath;

  const cleaned = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  return `${apiUrl}/storage/${cleaned}`;
}
