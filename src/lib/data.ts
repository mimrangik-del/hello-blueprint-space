// src/lib/data.ts (production version)
export async function getSpares() {
  const { data } = await supabase.from('spares').select('*');
  return data;
}

export async function getEquipment() {
  const { data } = await supabase.from('equipment').select('*');
  return data;
}
// ... etc
