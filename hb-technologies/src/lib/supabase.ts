import { createClient } from '@supabase/supabase-js';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

export const BUCKET = 'vizia-media';

/** Upload a File to Supabase Storage and return its public URL. */
export async function uploadToSupabase(
  file: File,
  folder: 'hero' | 'team'
): Promise<string> {
  const ext  = file.name.split('.').pop();
  const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(name, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(name);
  return data.publicUrl;
}

// ── Database helpers ──────────────────────────────────────────

export type HeroSlide = {
  id?: string;
  image_url: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  cta_label?: string;
  cta_href?: string;
  sort_order?: number;
  active?: boolean;
};

export type TeamMember = {
  id?: string;
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
  sort_order?: number;
  active?: boolean;
};

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('active', true)
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

export async function upsertHeroSlide(slide: HeroSlide): Promise<HeroSlide> {
  const { data, error } = await supabase
    .from('hero_slides')
    .upsert(slide)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteHeroSlide(id: string): Promise<void> {
  const { error } = await supabase.from('hero_slides').delete().eq('id', id);
  if (error) throw error;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('active', true)
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

export async function upsertTeamMember(member: TeamMember): Promise<TeamMember> {
  const { data, error } = await supabase
    .from('team_members')
    .upsert(member)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTeamMember(id: string): Promise<void> {
  const { error } = await supabase.from('team_members').delete().eq('id', id);
  if (error) throw error;
}
