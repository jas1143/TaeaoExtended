import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Session } from "@supabase/supabase-js";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe(); // Cleanup!
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Welcome to Taeao 👋🏽</Text>

      {!session ? (
        <>
          <Link href="/login" asChild>
            <Pressable
              style={{
                backgroundColor: "#2563eb",
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Log In</Text>
            </Pressable>
          </Link>

          <Link href="/login" asChild>
            <Pressable
              style={{
                backgroundColor: "#22c55e",
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Sign Up</Text>
            </Pressable>
          </Link>
        </>
      ) : (
        <>
          <Text style={{ marginBottom: 12 }}>You are logged in as {session.user.email}</Text>
          <Link href="/account" asChild>
            <Pressable
              style={{
                backgroundColor: "#6b21a8",
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Go to Account</Text>
            </Pressable>
          </Link>
        </>
      )}
    </View>
  );
}