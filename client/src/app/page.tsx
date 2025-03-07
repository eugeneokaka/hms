"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";

// Authentication Hook
function useAuthCheck() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:4000/check", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  return user;
}

export default function Home() {
  const user = useAuthCheck();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center rounded-lg">
        <div
          className="absolute inset-0 z-0 rounded-lg"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6">
              Advanced Healthcare Management System
            </h1>
            <p className="text-xl mb-8">
              Streamlining healthcare delivery with cutting-edge technology and
              compassionate care.
            </p>
            <div className="flex gap-4">
              <Button size="lg">Book Appointment</Button>
              <Button size="lg">Emergency Contact</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <h1 className="text-2xl text-center my-8">Services</h1>
      <div>
        <Card className="w-full max-w-md mx-auto text-center shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Book an Appointment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Schedule a consultation with our healthcare professionals at your
              convenience.
            </p>
            <Link href={user ? "/appointment" : "/login"}>
              <Button className="w-full flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" /> Book Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Working Hours Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-6 mb-8">
                  <Clock className="w-12 h-12 text-primary" />
                  <div>
                    <h2 className="text-3xl font-bold">Working Hours</h2>
                    <p className="text-muted-foreground">
                      We are available 24/7 for emergencies
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { day: "Monday - Friday", hours: "8:00 AM - 9:00 PM" },
                    { day: "Saturday", hours: "9:00 AM - 7:00 PM" },
                    { day: "Sunday", hours: "9:00 AM - 5:00 PM" },
                    { day: "Emergency", hours: "24/7 Available" },
                  ].map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 border rounded-lg"
                    >
                      <span className="font-medium">{schedule.day}</span>
                      <span className="text-muted-foreground">
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="mb-2">Emergency: 911</p>
              <p className="mb-2">Reception: (555) 123-4567</p>
              <p>Email: contact@hospital.com</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Location</h3>
              <p>123 Healthcare Avenue</p>
              <p>Medical District</p>
              <p>City, State 12345</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {["About Us", "Services", "Doctors", "Appointments"].map(
                  (link) => (
                    <li key={link}>
                      <Link href="#" className="hover:underline">
                        {link}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <ul className="space-y-2">
                {["Facebook", "Twitter", "LinkedIn", "Instagram"].map(
                  (social) => (
                    <li key={social}>
                      <Link href="#" className="hover:underline">
                        {social}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center">
            <p>&copy; 2025 Hospital Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
