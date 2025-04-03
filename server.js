const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const fs = require("fs");

//Connecting mongoose
mongoose.set("strictQuery", false);

mongoose.connect("mongodb://localhost:27017/foodDonation")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// Define Donation schema and model using GeoJSON for location
const donationSchema = new mongoose.Schema({
    item: String,
    description: String,
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], index: "2dsphere" } // [longitude, latitude]
    },
    image: String,
    createdAt: { type: Date, default: Date.now },
    username: String, // Add username
    email: String // Add email
});


// Explicitly create a 2dsphere index for GeoJSON
donationSchema.index({ location: "2dsphere" });
const Donation = mongoose.model("Donation", donationSchema);

Donation.createIndexes();

// Define Donation schema and model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    username: { type: String, unique: true },
    password: String // (Note: In production, never store plain text passwords.)
});
const User = mongoose.model("User", userSchema);

// Set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
    session({
        secret: "secretKey",
        resave: false,
        saveUninitialized: true,
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable file uploads with express-fileupload
app.use(
    fileUpload({
        createParentPath: true,
    })
);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "home.html"));
});

// SignUp
app.post("/signup", async (req, res) => {
    try {
        const { name, email, username, password } = req.body;

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send("Username is already taken.");
        }

        // If username is unique, proceed with user creation
        const user = new User({ name, email, username, password });
        await user.save();
        res.send("User Details submitted successfully!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving user.");
    }
});

// Login route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Look for a user with the given username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send("Invalid username");
        }

        // In production, you should hash passwords. Here, we're doing a plain text comparison.
        if (user.password !== password) {
            return res.status(400).send("Invalid password.");
        }

        // Optional: Set up a session or token if needed
        req.session.user = user;  // For example, storing the user in session

        res.send("Login successful!");
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).send("Internal server error.");
    }
});


app.get("/users", async (req, res) => {
    try {
        const users = await User.find(); // Get all users
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/items", async (req, res) => {
    try {
        const donations = await Donation.find(); // Get all users
        res.json(donations);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Donor page
app.get("/donor", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "donor.html"))
});

// Receiver page
app.get("/receiver", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "receiver.html"));
});

// Donation submission route
app.post("/donor", async (req, res) => {

    // Ensure the user is logged in
    if (!req.session.user) {
        return res.status(401).send("You must be logged in to donate.");
    }

    const { item, description, latitude, longitude } = req.body;
    let imagePath = "";
    const { username, email } = req.session.user; // Fetch username & email from session

    // Handle file upload
    if (req.files && req.files.image) {
        const image = req.files.image;
        const uploadDir = path.join(__dirname, "public", "uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const fileName = Date.now() + path.extname(image.name);
        imagePath = "/uploads/" + fileName;
        const uploadPath = path.join(uploadDir, fileName);
        try {
            await image.mv(uploadPath);
        } catch (err) {
            return res.status(500).send("Error uploading image.");
        }
    }

    // Save donation with donor details
    const donation = new Donation({
        item,
        description,
        location: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        image: imagePath,
        username, // Store username
        email // Store email
    });
    donation
        .save()
        .then(() => res.send("Donation submitted successfully!")) // This message is sent to the frontend
        .catch(() => res.status(500).send("Error saving donation."));

});


// Receive request route
app.post("/receiver", async (req, res) => {
    console.log("Received body:", req.body);
    const { latitude, longitude, itemNeeded } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).send("Latitude and longitude are required.");
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).send("Invalid latitude or longitude.");
    }

    const maxDistance = 10000; // 10 km in meters

    try {
        const query = {
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [lon, lat] },
                    $maxDistance: maxDistance
                }
            }
        };

        // Apply item filter only if provided
        if (itemNeeded && itemNeeded.trim() !== "") {
            query.item = new RegExp(itemNeeded, "i");
        }

        const donations = await Donation.find(query);
        res.json(donations);
    } catch (err) {
        console.error("Error in /receiver:", err);
        res.status(500).send("Error retrieving donations.");
    }
});


const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
