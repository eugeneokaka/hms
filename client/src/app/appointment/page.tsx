"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const TIME_SLOTS = ["07:00", "08:00", "09:00", "10:00", "11:00"];

export default function BookingForm() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:4000/check", {
          credentials: "include", // Send cookies with request
        });

        if (res.ok) {
          const data = await res.json();
          setUserId(data.userId); // Ensure backend sends userId
        } else {
          setUserId(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserId(null);
      }
    };

    fetchUser();
  }, []);

  const handleBooking = async () => {
    if (!userId || !date || !time) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, date, time }),
      });

      const data = await res.json();
      if (res.ok) {
        return alert("Booking successful!");
      }
      if (res.status === 401) {
        alert("booking limit reached");
        setUserId(null);
      }
      if (res.status === 402) {
        alert("time slot not available");
      } else {
        alert("something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto p-4">
      <CardContent className="flex flex-col gap-4">
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Select onValueChange={setTime}>
          <SelectTrigger>
            <SelectValue placeholder="Select Time Slot" />
          </SelectTrigger>
          <SelectContent>
            {TIME_SLOTS.map((slot) => (
              <SelectItem key={slot} value={slot}>
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleBooking} disabled={loading || !userId}>
          {loading ? "Booking..." : "Book Appointment"}
        </Button>
      </CardContent>
    </Card>
  );
}
