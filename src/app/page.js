"use client"

import SiteHome from "@/components/SIteHome"
import { SiteProvider } from "@/components/SiteProvider"

export default function Home(){
  return (
    <div>
    <SiteProvider>
      <SiteHome></SiteHome>
    </SiteProvider>
    </div>
  )
}