import { loadActiveConfig } from "@/lib/config/repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BinatApp } from "@/components/public/BinatApp";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const activeConfig = await loadActiveConfig(supabase);

  return <BinatApp initialConfig={activeConfig} />;
}
