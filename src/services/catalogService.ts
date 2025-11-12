 

export type CategoryRecord = {
  id: string;
  title: string;
  icon: string;
  subcategories: string[];
};

export async function ensureCategory(_category: CategoryRecord) {
  return;
}

export async function logSubcategorySelection(_args: {
  categoryId: string;
  categoryTitle: string;
  name: string;
  ticketNumber?: string;
  location?: { lat: number; lng: number } | null;
}) {
  return;
}
