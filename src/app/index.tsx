import { FlatList, Text, View } from 'react-native';
import { styles } from '@/styles';
import {io} from 'socket.io-client'
import { Lead } from '@/types';
import { useEffect, useState } from 'react';

export default function HomeScreen() {

  const [leads, setLeads] = useState<Lead[]>([])
  const [connected, setConnected] = useState<boolean>(false)

  const backend_url = process.env.EXPO_PUBLIC_BACKEND_URL

  useEffect(() => {
    console.log(backend_url)
    const socket = io(backend_url)

    socket.on("connect", () => {
      console.log("socket connected:", socket.id)
      setConnected(true)
    })

    socket.on("disconnet", () => {
      console.log("socket disconnected")
      setConnected(false)
    })

    socket.on("connect_error", (error) => {
      console.log(backend_url)
      console.log("socket connection error:", error.message)
    })

    socket.on("lead.created", (newLead: Lead) => {
      console.log("lead created:", newLead)
      console.log(leads.some((lead) => lead.id === newLead.id))
      setLeads(
        (leads) => {
          if (leads.some((lead) => lead.id === newLead.id)) return leads
          return [...leads, newLead]
        })
    })

    return () => {
      socket.disconnect()
    }

  },[])

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Leads</Text>
      <Text style={styles.subtitle}>Your recent leads</Text>
      <FlatList
        data={leads}
        keyExtractor={(item) => item.id}
        renderItem={
          ({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
          )
        }
      />
    </View>
  );
}
