"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([])

const router = useRouter()

  useEffect(() => {
    setLoading(true)
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if(!user){
        //display message
        router.push('/auth/login')
      }else{
        setUser(user);
        await getUserEventsAndPrizes(user.email)
        setLoading(false);
      }
    };

    const getUserEventsAndPrizes = async (userEmail)=>{
      const {data, error} = await supabase.from("event").select("*").eq("created_by",userEmail)

      if(error){
        console.log("while fetching events",error)
        return;
      }

      setEvents(data)
    }

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
      setLoading(false)
    });

    return () => authListener?.subscription.unsubscribe();
  }, []);

  if(loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-white text-lg">Loading...</p>
      </div>
    </div>
  );

  return (
    <AuthContext.Provider value={{ user, setUser, events, setEvents }}>
      {loading ? <div className="text-center p-4">Loading...</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
