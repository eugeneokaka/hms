const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// POST route for booking an appointment with a time slot
router.post("/book", async (req, res) => {
    try {
        const { patientId, date, time } = req.body;

        if (!patientId || !date || !time) {
            return res.status(400).json({ message: "Patient ID, date, and time are required" });
        }

        // Convert date and time into a Date object (UTC format)
        const bookingDate = new Date(`${date}T${time}:00.000Z`); // e.g., "2025-02-14T09:00:00.000Z"

        // Count existing bookings for the selected date
        const dailyBookings = await prisma.booking.count({
            where: { date: new Date(date) }
        });

        if (dailyBookings >= 5) {
            return res.status(400).json({ message: "Booking limit reached for this day" });
        }

        // Check if the selected time slot is already booked
        const existingSlot = await prisma.booking.findFirst({
            where: { date: bookingDate }
        });

        if (existingSlot) {
            return res.status(400).json({ message: "Time slot already booked" });
        }

        // Create a new booking
        const newBooking = await prisma.booking.create({
            data: {
                patientId,
                date: bookingDate
            }
        });

        return res.status(201).json({ message: "Booking successful", booking: newBooking });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
