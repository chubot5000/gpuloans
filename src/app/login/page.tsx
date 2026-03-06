"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, [router]);

  return (
    <div className="flex min-h-main items-center justify-center">
      <p className="text-lg text-muted-foreground">Redirecting...</p>
    </div>
  );
}
