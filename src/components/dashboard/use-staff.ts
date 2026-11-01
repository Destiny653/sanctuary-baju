import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type StaffInfo = { userId: string; email: string; roles: ("admin" | "editor")[]; isStaff: boolean; isAdmin: boolean };

export const staffQuery = queryOptions({
  queryKey: ["me", "staff"],
  queryFn: async (): Promise<StaffInfo | null> => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return null;
    const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
    if (error) throw error;
    const roles = (data ?? []).map((r) => r.role);
    return {
      userId: u.user.id,
      email: u.user.email ?? "",
      roles,
      isStaff: roles.length > 0,
      isAdmin: roles.includes("admin"),
    };
  },
});

export function useStaff() {
  return useQuery(staffQuery);
}
