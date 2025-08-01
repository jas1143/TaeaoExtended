import { useState, useEffect } from 'react'
import { View, Text, TextInput, Alert, Pressable } from 'react-native'
import { supabase } from '../../lib/supabase'
import { Session } from '@supabase/supabase-js'

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session.user.id)
        .single()

      if (error && status !== 406) throw error

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string
    website: string
    avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="mt-10 px-4">
      <Text className="text-gray-700 mb-2 font-semibold">Email</Text>
      <TextInput
        className="border border-gray-300 rounded-md px-3 py-2 mb-4 bg-gray-100 text-gray-600"
        value={session?.user?.email}
        editable={false}
      />

      <Text className="text-gray-700 mb-2 font-semibold">Username</Text>
      <TextInput
        className="border border-gray-300 rounded-md px-3 py-2 mb-4"
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />

      <Text className="text-gray-700 mb-2 font-semibold">Website</Text>
      <TextInput
        className="border border-gray-300 rounded-md px-3 py-2 mb-6"
        value={website}
        onChangeText={setWebsite}
        placeholder="Website"
      />

      <Pressable
        onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
        className={`bg-blue-500 rounded-md p-3 mb-4 ${loading ? 'opacity-50' : ''}`}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold">
          {loading ? 'Loading...' : 'Update'}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => supabase.auth.signOut()}
        className="bg-red-500 rounded-md p-3"
      >
        <Text className="text-white text-center font-semibold">Sign Out</Text>
      </Pressable>
    </View>
  )
}