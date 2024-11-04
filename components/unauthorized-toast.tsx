"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const UnauthorizedToast = () => {
  const router = useRouter();

  useEffect(() => {
    toast.warning("UNAUTHORIZED: User is not an admin.");
    setTimeout(() => toast.loading("Redirecting to user page..."), 3000);
    setTimeout(
      () => router.push(`https://cnm-order-form.vercel.app/user`),
      5000
    );
  }, []);

  return <div>{/* Rest of your user page content */}</div>;
};

export default UnauthorizedToast;
