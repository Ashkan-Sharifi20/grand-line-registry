/********************************************************************************
* WEB322 - Assignment 02
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Ashkan Sharifi Student ID: 178960233 Date: Mar 12nd, 2026
*
********************************************************************************/

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// --- TASK 3.3: DATA ARRAY (In-Memory Data Store) ---
let crewMembers = [
  { id: 1, name: "Monkey D. Luffy", role: "Captain", bounty: "3,000,000,000", devilFruit: "Hito Hito no Mi, Model: Nika", status: "active" },
  { id: 2, name: "Roronoa Zoro", role: "Swordsman", bounty: "1,111,000,000", devilFruit: "None", status: "active" },
  { id: 3, name: "Nami", role: "Navigator", bounty: "366,000,000", devilFruit: "None", status: "active" },
  { id: 4, name: "Usopp", role: "Sniper", bounty: "500,000,000", devilFruit: "None", status: "active" },
  { id: 5, name: "Vinsmoke Sanji", role: "Cook", bounty: "1,032,000,000", devilFruit: "None", status: "active" },
  { id: 6, name: "Tony Tony Chopper", role: "Doctor", bounty: "1,000", devilFruit: "Hito Hito no Mi", status: "inactive" },
  { id: 7, name: "Nico Robin", role: "Archaeologist", bounty: "930,000,000", devilFruit: "Hana Hana no Mi", status: "active" },
  { id: 8, name: "Franky", role: "Shipwright", bounty: "394,000,000", devilFruit: "None", status: "active" },
  { id: 9, name: "Brook", role: "Musician", bounty: "383,000,000", devilFruit: "Yomi Yomi no Mi", status: "active" },
  { id: 10, name: "Jinbe", role: "Helmsman", bounty: "1,100,000,000", devilFruit: "None", status: "active" }
];

// --- VIEW ENGINE & STATIC FILES ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// --- TASK 2.1: CUSTOM LOGGER MIDDLEWARE ---
app.use((req, res, next) => {
    const userAgent = req.get('User-Agent');
    const timestamp = new Date().toString();
    req.log = `Request from: ${userAgent} at ${timestamp}`;
    console.log(`[LOG]: ${req.url} visited`);
    next();
});

// --- TASK 2.2: RANDOM RESTRICTION MIDDLEWARE (The Marine Checkpoint) ---
const verifyBounty = (req, res, next) => {
    const isAllowed = Math.random() > 0.5; // 50% chance
    if (isAllowed) {
        next();
    } else {
        res.status(403).send("403 - The Marines have blocked your path. Your bounty is too high!");
    }
};

// --- ROUTES ---

// Home Page - Cards View
app.get('/', (req, res) => {
    res.render('index', { 
        crew: crewMembers, 
        title: 'The Crew' 
    });
});

// Crew Table Page
app.get('/crew', (req, res) => {
    res.render('crew', { 
        crew: crewMembers, 
        title: 'Official Roster' 
    });
});

// Recruit Form Page (GET)
app.get('/recruit', (req, res) => {
    res.render('recruit', { 
        title: 'Join the Crew', 
        error: null 
    });
});

// Recruit Form Submission (POST)
app.post('/recruit', (req, res) => {
    const { applicantName, role, skill } = req.body;

    // Basic Validation
    if (!applicantName || !role) {
        return res.render('recruit', { 
            title: 'Join the Crew', 
            error: 'Name and Role are required to join the Straw Hats!' 
        });
    }

    // Add new member to array
    const newMember = {
        id: crewMembers.length + 1,
        name: applicantName,
        role: role,
        bounty: "0",
        devilFruit: "Unknown",
        status: 'pending'
    };

    crewMembers.push(newMember);
    res.redirect('/crew');
});

// Log Pose Route (Protected by verifyBounty)
app.get('/log-pose', verifyBounty, (req, res) => {
    res.render('logPose', { 
        title: 'Secret Log Pose', 
        log: req.log,
        crew: crewMembers
    });
});

// --- TASK 2.4: ERROR TESTING ---
app.get('/error-test', (req, res) => {
    throw new Error("Engine malfunction!");
});

// --- TASK 2.3: 404 CATCH-ALL (Must be second to last) ---
app.use((req, res) => {
    res.status(404).render('404', { 
        title: 'Lost at Sea', 
        message: '404 - We couldn\'t find what you\'re looking for...' 
    });
});

// --- TASK 2.4: GLOBAL ERROR HANDLER (Must be last) ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`500 - Something went wrong on the Thousand Sunny: ${err.message}`);
});

app.listen(PORT, () => {
    console.log(`The Thousand Sunny is sailing on http://localhost:${PORT}`);
});