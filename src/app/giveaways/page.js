"use client"
import { supabase } from "@/lib/supabase"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import GiveawayEntryForm from "@/components/giveaway/EntryForm" // Import the form component
import { ConfigProvider, theme } from 'antd' // Import Ant Design ConfigProvider

export default function Giveaways() {
  const searchParams = useSearchParams()
  const [giveaway, setGiveaway] = useState(null)
  const [loading, setLoading] = useState(false)
  const [existingEntry, setExistingEntry] = useState(null)
  const [notDisplayedReason, setNotDisplayedReason] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    async function fetchGiveaway() {
      setLoading(true)
      const qr = searchParams.get("qr")
      const { data: qrExistsInDb, error: qrError } = await supabase
        .from('qr_instance')
        .select("*")
        .eq("instance_id", qr)

      const { data: existingEntry, error: existingEntryError } = await supabase
        .from("event_entry")
        .select("*")
        .eq("qr_code_id", qr)

      if (existingEntry.length) {
        setLoading(false)
        setExistingEntry(existingEntry[0])
      }

      if(qr){
        if (!qrExistsInDb || qrExistsInDb.length === 0 || qrError || existingEntryError) {
          setLoading(false)
          setNotDisplayedReason("error")
          return
        } else if (qrExistsInDb[0].end < Date.now()) {
          setLoading(false)
          setNotDisplayedReason("expired")
          return
        }
      }

      const { data: activeEvent, error: err } = await supabase
        .from("event")
        .select("*")
        .lte('start_date', Date.now())
        .order('start_date', { ascending: false })
        .limit(1)
        .single()

      if (err || !activeEvent) {
        setLoading(false)
        setNotDisplayedReason("noActiveEvent")
        return
      }

      if (activeEvent.end_date < Date.now()) {
        setLoading(false)
        setNotDisplayedReason("noActiveEvent")
        return
      }

      const { data: activeEventPrizes, error: err1 } = await supabase
        .from("prize")
        .select("*")
        .eq("event_id", activeEvent.event_id)
        .order("position", { ascending: true })

      setLoading(false)
      setGiveaway({
        ...activeEvent,
        prizes: activeEventPrizes || []
      })
    }

    fetchGiveaway()
  }, [searchParams])

  // Set up the countdown timer with useEffect
  useEffect(() => {
    if (!giveaway) return

    // Function to calculate time remaining
    function calculateTimeRemaining() {
      const remaining = giveaway.end_date - Date.now()

      if (remaining <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds }
    }

    // Update time immediately
    setTimeRemaining(calculateTimeRemaining())

    // Set up interval to update time every second
    const timer = setInterval(() => {
      const newTimeRemaining = calculateTimeRemaining()
      setTimeRemaining(newTimeRemaining)

      // If countdown is complete, clear the interval
      if (newTimeRemaining.days === 0 &&
        newTimeRemaining.hours === 0 &&
        newTimeRemaining.minutes === 0 &&
        newTimeRemaining.seconds === 0) {
        clearInterval(timer)
      }
    }, 1000)

    // Clean up interval on component unmount
    return () => clearInterval(timer)
  }, [giveaway])

  // Format date from milliseconds to readable format
  const formatDate = (milliseconds) => {
    return new Date(milliseconds).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-white text-lg">Loading your giveaway...</p>
      </div>
    </div>
  )

  if (notDisplayedReason) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="bg-red-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              {notDisplayedReason === "error" && "Oops.. something went wrong, please make sure you have a valid QR Code!"}
              {notDisplayedReason === "expired" && "QR Code Expired"}
              {notDisplayedReason === "noActiveEvent" && "No Active Giveaway"}
            </h2>
            <p className="mt-2 text-gray-600">
              {notDisplayedReason === "error" && "The QR code you scanned is invalid or doesn't exist."}
              {notDisplayedReason === "expired" && "This QR code has expired and is no longer valid."}
              {notDisplayedReason === "noActiveEvent" && "There are no active giveaways at this time. Please check back later."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!giveaway) return null

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#a855f7',
          colorBgContainer: 'rgba(255, 255, 255, 0.05)',
          colorBgElevated: 'rgba(255, 255, 255, 0.1)',
          colorBorder: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 12,
        },
        components: {
          Input: {
            colorBgContainer: 'rgba(255, 255, 255, 0.1)',
            colorBorder: 'rgba(255, 255, 255, 0.2)',
          },
          Button: {
            colorPrimary: '#a855f7',
            colorPrimaryHover: '#9333ea',
          },
          Card: {
            colorBgContainer: 'rgba(255, 255, 255, 0.05)',
          },
          Collapse: {
            colorBgContainer: 'transparent',
            colorBorder: 'rgba(255, 255, 255, 0.2)',
          }
        }
      }}
    >
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
        {/* Confetti decoration elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 left-1/4 w-8 h-8 bg-yellow-300 rotate-12 opacity-70"></div>
          <div className="absolute top-12 right-1/3 w-6 h-6 bg-pink-500 rotate-45 opacity-70"></div>
          <div className="absolute top-32 left-10 w-4 h-12 bg-blue-400 -rotate-12 opacity-60"></div>
          <div className="absolute top-40 right-8 w-10 h-4 bg-green-400 rotate-12 opacity-60"></div>
          <div className="absolute bottom-20 left-1/5 w-8 h-8 bg-indigo-300 rotate-45 opacity-60"></div>
          <div className="absolute bottom-40 right-1/4 w-6 h-10 bg-red-400 -rotate-12 opacity-70"></div>
        </div>

        <div className="max-w-md mx-auto p-6 relative">
          {/* Header */}
          <div className="text-center mb-6 pt-6">
            <div className="inline-block px-4 py-1 bg-indigo-600 text-white text-sm rounded-full mb-2">
              Exclusive Giveaway
            </div>
            <h1 className="text-3xl font-bold mb-2">{giveaway.title}</h1>
            <p className="text-indigo-200">
              {formatDate(giveaway.start_date)} - {formatDate(giveaway.end_date)}
            </p>

            {/* Countdown Timer */}
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm mb-2">Time Remaining</p>
              <div className="flex justify-center gap-3">
                <div className="text-center">
                  <div className="bg-white/20 rounded p-2 w-14">
                    <div className="text-2xl font-bold">{timeRemaining.days}</div>
                  </div>
                  <div className="text-xs text-indigo-200 mt-1">Days</div>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded p-2 w-14">
                    <div className="text-2xl font-bold">{timeRemaining.hours}</div>
                  </div>
                  <div className="text-xs text-indigo-200 mt-1">Hours</div>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded p-2 w-14">
                    <div className="text-2xl font-bold">{timeRemaining.minutes}</div>
                  </div>
                  <div className="text-xs text-indigo-200 mt-1">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded p-2 w-14">
                    <div className="text-2xl font-bold">{timeRemaining.seconds}</div>
                  </div>
                  <div className="text-xs text-indigo-200 mt-1">Seconds</div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-3">About This Giveaway</h2>
            <p className="text-indigo-100">{giveaway.description}</p>
          </div>

          {/* Prizes */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Awesome Prizes</h2>
            <div className="space-y-4">
              {giveaway.prizes && giveaway.prizes.map((prize, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
                  <div className="relative">
                    {prize.img_url ? (
                      <div className="relative h-48 w-full">
                        <img
                          src={prize.img_url}
                          alt={prize.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                      Prize {index + 1}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{prize.name}</h3>
                    <p className="text-sm text-indigo-200 mt-1">{prize.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Entry Form */}
          <div className="mb-6">
            {!searchParams.get("qr") ? (
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg text-center">
                <p className="text-indigo-200">
                  <span className="font-semibold text-white">Scan a valid QRcode to participate</span>
                </p>
              </div>
            ) : (
              existingEntry ? (
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg text-center">
                  <p className="text-indigo-200 mt-2">
                    <span className="font-semibold text-white">{existingEntry.name}</span>, your participation has been successfully recorded.
                  </p>
                  <p className="text-indigo-300 mt-1">
                    Please check your SMS for your <span className="font-semibold text-indigo-100">Participation-ID</span>.
                  </p>
                </div>
              ) : (
                <GiveawayEntryForm
                  event={giveaway}
                  qr_code_id={searchParams.get("qr")}
                />
              )
            )}

          </div>

          {/* Rules */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3">Rules & Conditions</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-indigo-100">
              <li>One entry per person</li>
              <li>Winners will be announced after the giveaway ends</li>
              <li>Prizes cannot be exchanged for cash</li>
              <li>Employees and their families are not eligible</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="text-center text-indigo-300 text-sm pb-8">
            <p>© 2025 {giveaway.title} Giveaway. All rights reserved.</p>
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}