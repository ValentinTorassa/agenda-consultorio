import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";

import { api } from "@auralis/backend/api";
import { AuralisConvexProvider } from "@/lib/convex";

void SplashScreen.preventAutoHideAsync();

function AuthenticatedRouter() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const ensureSeeded = useMutation(api.users.ensureSeeded);
  const seeded = useRef(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    void SplashScreen.hideAsync();

    const onLogin = segments[0] === "login";
    if (!isAuthenticated && !onLogin) router.replace("/login");
    if (isAuthenticated && onLogin) router.replace("/");
  }, [isAuthenticated, isLoading, router, segments]);

  useEffect(() => {
    if (!isAuthenticated || seeded.current) return;
    seeded.current = true;
    void ensureSeeded().catch(() => {
      seeded.current = false;
    });
  }, [ensureSeeded, isAuthenticated]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuralisConvexProvider>
      <AuthenticatedRouter />
    </AuralisConvexProvider>
  );
}
