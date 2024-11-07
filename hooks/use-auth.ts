"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/types";

export function useAuth() {
  const [user, setUser] = useState<Tables<"users"> | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = await createClient();

      const { data: authData } = await supabase.auth.getUser();

      if (authData?.user) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (error || !data) {
          if (error) {
            console.log("Error fetching user data", error);
            return;
          }
        }

        if (data) {
          setUser(data);
        }
      }
    };

    fetchUser();
  }, []);

  return user;
}
