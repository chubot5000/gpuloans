"use client";

import { usePrivy } from "@privy-io/react-auth";
import { WelcomeBackLogin } from "logic/components";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Msg } from "ui/components";

export default function LoginPage() {
  const { authenticated, ready } = usePrivy();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (authenticated)
      router.push("/applications");
    else
      setIsLoading(false);
  }, [ready, authenticated, router]);

  if (!ready || isLoading) return <Msg className="my-auto">Loading...</Msg>;

  return <WelcomeBackLogin className="min-h-main justify-center relative -top-16" />;
}
