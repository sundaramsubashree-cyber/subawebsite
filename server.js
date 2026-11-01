
require("dotenv").config();

const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const path = require("path");

const app = express();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get("/api", (req, res) => {
    res.json({ message: "Wildheart backend is running!" });
});

app.post("/api/bookings", async (req, res) => {
    const { name, email, safari, visit_date, guests } = req.body;

    if (
        typeof name !== "string" || !name.trim() ||
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        typeof safari !== "string" || !safari.trim() ||
        typeof visit_date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(visit_date) ||
        !Number.isInteger(guests) || guests < 1 || guests > 20
    ) {
        return res.status(400).json({
            message: "Please enter valid booking details."
        });
    }

    try {
        const { data, error } = await supabase
            .from("bookings")
            .insert([{
                name: name.trim(),
                email: email.trim(),
                safari: safari.trim(),
                visit_date,
                guests
            }])
            .select("id")
            .single();

        if (error) throw error;

        res.status(201).json({
            message: "Booking saved successfully!",
            bookingId: data.id
        });
    } catch (error) {
        console.error("Booking error:", error.message);
        res.status(500).json({
            message: "Unable to save booking. Please try again."
        });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Wildheart server is running.");
});
