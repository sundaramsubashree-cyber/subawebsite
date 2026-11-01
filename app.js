
const myWhatsApp = "919080657988";

// Your Supabase project URL
const supabaseUrl =
    "https://kfaxnhnudrzckmefvkas.supabase.co";

// IMPORTANT:
// Replace this with your Supabase PUBLISHABLE key.
// Do not use your sb_secret_ key here.
const supabaseKey = "sb_publishable_dWJVBS7dCl3gCK3E82vSdQ_6pdP17Qw";

const form = document.getElementById("booking-form");

if (form) {
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const result = document.getElementById("booking-result");
        const button = form.querySelector('button[type="submit"]');

        if (!window.supabase) {
            result.textContent =
                "Supabase library failed to load. Check your internet connection.";
            return;
        }

        if (supabaseKey === "YOUR_SUPABASE_PUBLISHABLE_KEY") {
            result.textContent =
                "Please add your Supabase publishable key in app.js.";
            return;
        }

        const data = new FormData(form);

        const booking = {
            name: data.get("Full name").trim(),
            email: data.get("Email").trim(),
            phone: data.get("Phone").trim(),
            safari: data.get("Safari package"),
            visit_date: data.get("Travel date"),
            guests: Number(data.get("Guests")),
            message: data.get("Message").trim() || null
        };

        const whatsappMessage =
            "New Wildheart Jungle Safari Booking\n\n" +
            "Name: " + booking.name + "\n" +
            "Email: " + booking.email + "\n" +
            "Phone: " + booking.phone + "\n" +
            "Safari: " + booking.safari + "\n" +
            "Travel date: " + booking.visit_date + "\n" +
            "Guests: " + booking.guests + "\n" +
            "Message: " + (booking.message || "None");

        const whatsappUrl =
            "https://wa.me/" + myWhatsApp +
            "?text=" + encodeURIComponent(whatsappMessage);

        // Open a tab directly from the submit action.
        // This helps avoid popup blockers.
        const whatsappTab = window.open("about:blank", "_blank");

        button.disabled = true;
        result.textContent = "Saving your booking...";

        try {
            const supabaseClient = window.supabase.createClient(
                supabaseUrl,
                supabaseKey
            );

            const { error } = await supabaseClient
                .from("bookings")
                .insert([booking]);

            if (error) {
                throw error;
            }

            result.textContent =
                "Booking saved successfully! Opening WhatsApp...";

            if (whatsappTab && !whatsappTab.closed) {
                whatsappTab.location.href = whatsappUrl;
            } else {
                window.location.href = whatsappUrl;
            }

            form.reset();

        } catch (error) {
            console.error("Booking error:", error);

            if (whatsappTab && !whatsappTab.closed) {
                whatsappTab.close();
            }

            result.textContent =
                "Booking could not be saved: " + error.message;

        } finally {
            button.disabled = false;
        }
    });
}
