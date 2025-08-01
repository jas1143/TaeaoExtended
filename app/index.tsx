import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Session } from '@supabase/supabase-js'
import Account from './(auth)/account';
import Auth from './(auth)/login';

export default function Index() {
  const [session, setSession] = useState<Session | null>(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-white">
        <Text className="text-2xl font-semibold mb-6">Welcome to Taeao</Text>
        <Link href="/login" asChild>
          <Pressable className="bg-blue-600 py-3 px-6 rounded-lg">
            <Text className="text-white font-bold">Go to Login</Text>
          </Pressable>
        </Link>
      </View>
    )
  }

  return <Account session={session} />
}