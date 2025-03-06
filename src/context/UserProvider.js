"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [storeData, setStoreData] = useState(null)
  const [eventsData, setEventsData] = useState([])
  const [loading, setLoading] = useState(true);

  async function getStoreAndEventData(userEmail){

    const { data: store, error: strError } = await supabase.from("store").select("*").eq("email", userEmail).single();
    const { data: events, error: evntError } = await supabase.from("event").select("*").eq("store_id", store.store_id);


if(strError || evntError) return alert(strError.message || evntError.message)

  setStoreData(store)
  setEventsData(events)

  }

  async function fetchUserData() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
console.log(user,error)

    setUser(user);
    if(user){
await getStoreAndEventData(user.email)
    }

    setLoading(false);
  }

  useEffect(() => {

    fetchUserData();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, storeData, eventsData, setEventsData, setStoreData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
