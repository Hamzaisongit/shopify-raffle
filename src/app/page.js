"use client";

import { useState, useEffect } from "react";
import { Truck, Headset, ShieldCheck, CreditCard, LogIn } from "lucide-react"; // Import Lucide Icons
import { useRouter } from "next/navigation";

export default function Home() {

const router = useRouter()

  const images = [
    "/sarees/img10.jpg",
    "/sarees/img8.jpg"
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-sans text-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold tracking-wide">SAREEIFY</h1>
          <ul className="flex space-x-8">
            {["About", "Sarees", "Collections", "Contact-us"].map((item, idx) => (
              <li
                key={idx}
                className="cursor-pointer hover:text-gray-600 transition duration-300 relative group"
              >
                {item}
                {/* Underline Hover Effect */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
              </li>
            ))}
          </ul>

          <LogIn onClick={()=>{router.push('/auth/login')}} className="w-7 h-7 text-gray-700 cursor-pointer hover:text-red-500 transition duration-300" />
        </div>
      </nav>

      {/* Hero Section - Static Banner */}
      <div className="relative w-full h-[500px] mt-16">
        <img
          src="/sarees/dvsh-banner.jpg"
          alt="Wedding Collection Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center text-white text-center">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg">
            <h2 className="text-4xl font-semibold">Wedding Collection</h2>
            <p className="mt-2">Celebrate Love. Discover Our Wedding Collection.</p>
            <button className="mt-4 px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition">
              SHOP NOW
            </button>
          </div>
        </div>
      </div>

      {/* Product Cards - New Arrivals */}
      <section className="mt-28 px-10 py-10 bg-gray-200">
        <h2 className="text-4xl font-bold text-center mb-10">New Arrivals</h2>
        <div className="grid grid-cols-4 gap-6">
          {[
            { img: "/sarees/bbdl.jpg", name: "Baby Doll", price: "$2,999.00" },
            { img: "/sarees/bbdl2.jpg", name: "Blue Embroidered Saree", price: "$2,499.00" },
            { img: "/sarees/bbdl3.jpg", name: "Red Bridal Saree", price: "$2,799.00" },
            { img: "/sarees/bbdl4.jpg", name: "Golden Royal Saree", price: "$2,699.00" },
          ].map((product, idx) => (
            <div
              key={idx}
              className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-[500px] object-cover rounded-md"
              />
              <h3 className="mt-3 text-lg font-medium">{product.name}</h3>
              <p className="text-gray-600">{product.price}</p>
              <button className="mt-3 px-4 py-2 w-full bg-black text-white rounded-lg hover:bg-gray-800 transition">
                SHOP NOW
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Icons (Lucide React) */}
      <div className="grid grid-cols-4 gap-6 my-20 text-center px-20">
        {[
          { icon: Truck, text: "Free Shipping" },
          { icon: Headset, text: "Support 24/7" },
          { icon: ShieldCheck, text: "100% Money Back" },
          { icon: CreditCard, text: "Secure Payments" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="shadow-2xl rounded-2xl py-6 flex flex-col items-center gap-3 hover:bg-gray-100 transition duration-300 cursor-pointer"
          >
            <item.icon className="w-12 h-12 text-gray-700 group-hover:text-black transition duration-300" />
            <span className="text-md font-medium">{item.text}</span>
          </div>
        ))}
      </div>

      {/* Carousel Section - Moved Below */}
      <section className="px-10 py-10">
        <h2 className="text-2xl font-semibold text-center mb-6">Featured Collections</h2>
        <div className="relative w-full h-[700px] overflow-hidden">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt="Carousel Image"
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p>&copy; 2025 Sareeify Fashion. All rights reserved.</p>
      </footer>
    </div>
  );
}
