"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { useUser } from "@/context/UserProvider";

export default function Dashboard() {
  
  const router = useRouter();
  
  const {user,loading,storeData,eventsData, setStoreData} = useUser()

  const [storeName, setStoreName] = useState("")

  async function onStoreDetailsSubmit(){
    // const {data:savedStoreData,error} = await supabase.from("store").upsert([{
    //   store_name : storeName,
    //   email : user.email
    // }])

    // if(error)return alert(error.message)

    // alert('stored sucessfully')
    //   setStoreData(savedStoreData)
  }

  useEffect(() => {

if(loading)return;

if(!user)router.push('/login')

  }, [loading]);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {!loading ? <div>
        <p>Welcome, {user.email}!</p>
        <div>
        <div>{storeData.store_domain}</div>
        <br></br>
        <hr></hr>
          <div>{eventsData?.length ? eventsData.map((event,index)=>{
          return <div key={index} onClick={()=>{router.push(`/raffle-dashboard/create-edit-event/${event.event_id}`)}}>{event.title}</div>
        }) : <p>no events created yet</p>}</div>

        <button onClick={()=>{router.push('/raffle-dashboard/create-edit-event/new')}}>create</button>
        </div>
        
      </div> : <Loader2Icon></Loader2Icon>}

    </div>
  );
}
