import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ADMIN } from "../constants/constants";
import { RenderMounted } from "@/components/render-mounted";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import UnauthorizedToast from "@/components/unauthorized-toast";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
      } else {
        return redirect("/auth");
      }
    }

    if (data.type !== ADMIN) {
      return <UnauthorizedToast />;
    }
  }

  return (
    <RenderMounted>
      <Header />
      <main className="min-h-[calc(100svh-128px)]">{children}</main>
      <Footer />
    </RenderMounted>
  );
}
