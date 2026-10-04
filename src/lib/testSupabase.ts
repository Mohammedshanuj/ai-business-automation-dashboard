import { supabase } from "./supabase";

export async function testSupabaseConnection() {
  if (typeof window === "undefined") {
    return;
  }

  const { data, error } = await supabase
    .from("leads")
    .select("id, name, lead_category")
    .limit(3);

  console.log("Supabase test data:", data);
  console.log("Supabase test error:", error);
}