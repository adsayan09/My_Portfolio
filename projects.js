const PROJECTS = {
  "shima-rms": {
    slug: "shima-rms",
    index: "00",
    title: "SHIMA RMS",
    eyebrow: ["Full-Stack System", "Multi-Tenant RBAC"],
    category: "Foreign Employment Agency Recruitment Management System",
    summary:
      "I built this recruitment system for an agency that sends workers abroad. It follows one person through every stage — registration, documents, medical, training, visa, deployment — so nobody has to guess where a candidate is stuck. Eight kinds of user share the same app, and each one only sees what they are meant to see.",
    tags: ["Next.js 16", "TypeScript", "Supabase", "Postgres RLS", "Tailwind 4", "Gemini AI"],
    meta: [
      { label: "CLIENT", value: "Shima International Agency" },
      { label: "ROLE", value: "Full-Stack Development, Database &amp; UI Design" },
      { label: "STACK", value: "Next.js 16 &middot; React 19 &middot; Supabase &middot; TypeScript" },
      { label: "STATUS", value: "In active development" }
    ],
    stats: [
      { value: "08", label: "User Roles" },
      { value: "13", label: "RLS-Protected Tables" },
      { value: "32", label: "Routes" },
      { value: "03", label: "Languages" }
    ],
    hero: {
      src: "projects/shima-rms/img/brand-mark.jpg",
      alt: "Shima Recruitment Management System brand mark",
      constrained: true,
      caption: "Shima RMS identity mark"
    },

    sections: [
      {
        id: "idea",
        num: "01",
        heading: "The Idea",
        body: [
,
          "A foreign employment agency moves one person through six stages, and each stage blocks the next. If a document goes missing three weeks before a flight, someone needs to notice that early. Most agencies track this on spreadsheets and paper files, which means nobody can answer simple questions like where is this person stuck, or who approved this change.",
,
          "Shima International wanted that in one place. They also have sub-agents and overseas employers attached, so the system had to serve four different audiences without letting any of them see each other's data. That requirement is what decided most of what I built."
,
        ]
      },
      {
        id: "role",
        num: "02",
        heading: "My Role",
        body: [
,
          "I built this on my own — the database, the interface, the permission model and the AI assistant. I also did the diagrams and the setup documentation.",
,
          "The part that took the most time was deciding who should be able to see what. It would have been easier to build the screens first and add permissions afterwards, but that approach falls apart as soon as there are eight roles to keep apart."
,
        ]
      },
      {
        id: "process",
        num: "03",
        heading: "The Process",
        body: [
,
          "I started with the data model, because the stages are the whole system. Once the tables for candidates, documents and deployments existed, most of the screens were a matter of showing the right rows to the right person.",
,
          "Then I built it in layers: schema and roles first, then the four portals, then document uploads and the audit log, and the assistant last. Testing every role against the same screens turned up most of the bugs."
,
        ]
      },
      {
        id: "design",
        num: "04",
        heading: "Design",
        body: [
,
          "It is one app shell with a sidebar that changes depending on your role, so a candidate and an admin use the same layout but see different things. Data-heavy screens share a single table component, which meant search, sorting and pagination behaved the same everywhere instead of being rebuilt on each page.",
,
          "Candidates are recruited across Sri Lanka, so the whole interface runs in English, Sinhala and Tamil from one dictionary of 225 keys. Components read keys and never raw strings, so adding a language means adding one object."
,
        ]
      },
      {
        id: "development",
        num: "05",
        heading: "Development",
        body: [
,
          "The main decision was putting access control in the database instead of in the interface. Hiding a button is easy to bypass, so I wrote Postgres row-level security policies instead. They are enabled on all thirteen tables and work out the user's role from their JWT claims.",
,
          "Writing the policies per role rather than per screen means a page I add later cannot accidentally skip them. It took three passes to get right: fixing how the role was resolved, stopping a user changing their own role column, and correcting document visibility.",
,
          "The assistant is a Gemini endpoint with the agency's own process knowledge written into the system instruction. I deliberately kept it away from candidate records — anything about a specific person's file should come from the database, not from a language model."
,
        ]
      },
      {
        id: "result",
        num: "06",
        heading: "Result",
        body: [
,
          "It replaces spreadsheets and paper tracking for the agency. A recruiter can open a candidate and see which document is missing, who approved a change and when. Sub-agents see only the candidates they referred, plus their own commission ledger.",
,
          "It is still in development. The finance and reporting screens are running on mocked data until I finish those queries."
,
        ]
      },
      {
        id: "learned",
        num: "07",
        heading: "What I Learned",
        body: [
,
          "I learned that permissions are a data problem, not a UI problem. Writing the security policies early meant the screens afterwards were straightforward.",
,
          "I also got better at deciding what not to build. The AI assistant was the tempting feature, but the audit log and the document rules were what the agency actually needed every day."
,
        ]
      }
    ],

    featureGrid: {
      heading: "What Each Role Can Do",
      groups: [
        {
          role: "Candidate",
          points: [
            "Track own progress through all six stages",
            "Upload and manage required documents",
            "Ask the AI assistant about process requirements",
            "Message the agency directly",
            "Review own profile and history"
          ]
        },
        {
          role: "Sub-Agent",
          points: [
            "Refer candidates into the pipeline",
            "Track referred candidates only",
            "Monitor deployment stage status",
            "View personal commission ledger",
            "Submit payout and voucher requests"
          ]
        },
        {
          role: "Employer",
          points: [
            "Post vacancies with headcount and provisions",
            "Browse candidate search matches",
            "Track visa and flight status",
            "Review shortlists and request interviews",
            "Follow workers through deployment"
          ]
        }
      ]
    },

    securityNote:
      "Permissions are enforced in Postgres rather than in the interface, so a crafted request cannot skip them.",
    security: [
      "Row-level security enabled on all 13 tables",
      "Role resolved from JWT claims via SQL function",
      "Role columns protected against self-escalation",
      "Candidate records scoped to owner or referring agent",
      "Audit log restricted to admin and executive roles",
      "Password reset requests routed through an approval queue",
      "Security headers on every response",
      "Suspended accounts blocked at sign-in"
    ],

    comparison: {
      heading: "Enforcement by Layer",
      caption: "Why access control lives in the database rather than the interface",
      head: ["Control", "Interface only", "Database RLS"],
      rows: [
        ["Hides UI elements", "Yes", "Yes"],
        ["Survives a crafted HTTP request", "No", "Yes"],
        ["Applies to new pages automatically", "No", "Yes"],
        ["Covers server-to-server access", "No", "Yes"],
        ["Auditable in one place", "No", "Yes"],
        ["Testable without a browser", "No", "Yes"]
      ]
    },

    tests: {
      heading: "How I Verified This",
      body:
        "Playwright runs a route-health check across thirty-one signed-in screens, checking that each one loads and that its interactive elements are enabled. That caught broken routes more than once. It is smoke-level coverage rather than full business-flow testing, and the permission rules are checked separately at the database level, where they can be tested without a browser.",
      head: ["ID", "Layer", "Coverage", "Result"],
      rows: [
        ["V01", "Routing", "31 authenticated routes respond and render", "Pass"],
        ["V02", "Interaction", "Interactive elements enabled and attached", "Pass"],
        ["V03", "Authorisation", "RLS policies enforced per role claim", "Pass"],
        ["V04", "Account lifecycle", "Suspended accounts blocked at sign-in", "Pass"],
        ["V05", "Data integrity", "Finance and reporting screens on mocked data", "In progress"],
        ["V06", "Flow coverage", "End-to-end business-flow tests", "Planned"]
      ]
    },

    roadmap: [
      { label: "Live data", note: "Replace remaining mocked finance and reporting queries with Supabase." },
      { label: "Flow tests", note: "End-to-end coverage across the six-stage pipeline." },
      { label: "Candidate matching", note: "Score candidates against vacancy requirements." }
    ],

    gallery: [
      { src: "projects/shima-rms/img/login.jpg", alt: "Shima RMS sign-in screen with role selector for the eight system roles", caption: "Sign in &mdash; role-aware access across eight portals" },
      { src: "projects/shima-rms/img/candidate-profile.jpg", alt: "Candidate profile showing the six-stage pipeline, medical stage control, document vault and internal notes", caption: "Candidate profile &mdash; pipeline, medical stage control and internal notes" },
      { src: "projects/shima-rms/img/chatbot.jpg", alt: "AI recruitment assistant listing ranked candidate matches with experience and availability", caption: "AI assistant &mdash; grounded process guidance for candidates" },
      { src: "projects/shima-rms/img/document-verification.jpg", alt: "Document verification screen with passport preview and approve or reject actions", caption: "Document verification &mdash; preview, approve or reject" },
      { src: "projects/shima-rms/img/audit-logs.jpg", alt: "System audit log showing timestamp, user, action, IP address and status with CSV export", caption: "Audit log &mdash; every privileged action, with IP and outcome" },
      { src: "projects/shima-rms/img/password-queue.jpg", alt: "Password reset approval queue listing claimant details with approve and deny actions", caption: "Reset queue &mdash; claims verified before any credential change" },
      { src: "projects/shima-rms/img/candidate-directory.jpg", alt: "Master candidate directory with stage, country of interest, job category and referring agent filters", caption: "Candidate directory &mdash; filterable across the full pipeline" },
      { src: "projects/shima-rms/img/executive-overview.jpg", alt: "Executive overview with revenue, deployments, success rate, revenue growth chart and top performing agents", caption: "Executive overview &mdash; revenue, deployment and agent performance" },
      { src: "projects/shima-rms/img/localization.jpg", alt: "Localization editor showing interface keys with English, Sinhala and Tamil columns", caption: "Localization &mdash; one key set, three languages" },
      { src: "projects/shima-rms/img/reports.jpg", alt: "Reports generator configured by report type, date range and target country", caption: "Reports &mdash; parameterised export to PDF and Excel" }
    ]
  },

  "medicare-plus": {
    slug: "medicare-plus",
    index: "01",
    title: "MEDICARE PLUS",
    eyebrow: ["Development", "Healthcare Portal"],
    category: "Hospital Appointment Booking &amp; Records System",
    summary:
      "I built this for MediCare Plus, a private clinic. Patients can find a doctor, book an open time slot and download their reports, while doctors and admins work in their own dashboards. It was my first full-stack project where I had to design the screens as well as build them.",
    tags: ["PHP", "MySQL", "Bootstrap", "JavaScript"],
    meta: [
      { label: "CLIENT", value: "MediCare Plus" },
      { label: "ROLE", value: "UI Design &amp; Full-Stack Development" },
      { label: "MODULE", value: "CSE5009 &middot; Web Application Development" },
      { label: "ASSESSMENT", value: "WRIT1 &middot; Academic Project" }
    ],
    stats: [
      { value: "03", label: "User Roles" },
      { value: "06", label: "Interface Pages" },
      { value: "05", label: "Test Scenarios" },
      { value: "02/02", label: "Test Cases Passing" }
    ],
    hero: { src: "projects/medicare-plus/img/home.jpg", alt: "MediCare Plus home page" },

    sections: [
      {
        id: "idea",
        num: "01",
        heading: "The Idea",
        body: [
,
          "The brief was an appointment system for MediCare Plus, a private clinic. Patients needed to see which doctors were free and book a slot. Doctors needed to see their day. The clinic needed to manage both without the two getting in each other's way.",
,
          "Before I started I looked at how the Apollo Clinics, Mayo Clinic and NHS websites handle booking online. I wanted to know what already worked before deciding what to build."
,
        ]
      },
      {
        id: "role",
        num: "02",
        heading: "My Role",
        body: [
,
          "I did the interface design and the PHP/MySQL build on my own for this module. That covered the wireframes, the database, the pages for all three roles, and the test plan.",
,
          "It was an assessed piece of work, so part of the job was being able to show what I had tested and explain why."
,
        ]
      },
      {
        id: "process",
        num: "03",
        heading: "The Process",
        body: [
,
          "I sketched the pages on paper first, then built the database around the booking flow, because everything else depends on appointments being saved and read back correctly. After that it was mostly forms and dashboards.",
,
          "I wrote the test plan before I finished the build, so I was not just testing whatever happened to be broken by then."
,
        ]
      },
      {
        id: "design",
        num: "04",
        heading: "Design",
        body: [
,
          "Three roles means three different starting points, so the navigation changes per role. I kept the underlying layout identical between them, so the only thing that changes is what you can actually reach.",
,
          "The booking flow got the most attention, because choosing a doctor, choosing a slot and confirming is three separate steps and it is easy to lose someone halfway through."
,
        ]
      },
      {
        id: "development",
        num: "05",
        heading: "Development",
        body: [
,
          "PHP and MySQL, with Bootstrap handling the layout. Every protected page checks the session and the role on the server rather than only in the page, and all form input is validated before it reaches the database.",
,
          "Passwords are hashed instead of stored as plain text. That part is basic, but I did not want to leave it out just because it was not the interesting bit."
,
        ]
      },
      {
        id: "result",
        num: "06",
        heading: "Result",
        body: [
,
          "Patients can register, find a doctor by specialisation, book an open slot, see their appointment history and download their reports. Doctors can confirm, reschedule or cancel appointments and upload reports for patients. Admins manage doctor and patient records.",
,
          "Five test scenarios were defined in the plan and all five pass, including appointment booking and report download."
,
        ]
      },
      {
        id: "learned",
        num: "07",
        heading: "What I Learned",
        body: [
,
          "I learned that designing the screens first made the build much faster. Writing the booking flow out on paper meant I barely redesigned anything while coding.",
,
          "I also learned how much work accessibility is if you leave it to the end. I added focus states and keyboard support late, and that is the part I would do earlier next time."
,
        ]
      }
    ],

    featureGrid: {
      heading: "What Each Role Can Do",
      groups: [
        {
          role: "Patient",
          points: [
            "Register an account with personal and contact details",
            "Browse and filter doctors by specialisation and availability",
            "Select an open time slot and confirm a booking",
            "Review appointment history and download medical reports",
            "Message doctors and submit feedback"
          ]
        },
        {
          role: "Doctor",
          points: [
            "View the day's scheduled appointments",
            "Act on appointments &mdash; confirm, reschedule, cancel",
            "Manage personal schedule availability",
            "Upload reports and prescriptions for patient access",
            "Communicate directly with patients"
          ]
        },
        {
          role: "Admin",
          points: [
            "Add and manage doctor records",
            "Manage patient accounts",
            "Maintain the services catalogue",
            "Oversee system data and reports"
          ]
        }
      ]
    },

    securityNote:
      "Patient details are sensitive, so I treated these as the minimum rather than something to add later.",
    security: [
      "Password encryption at rest",
      "Role-based access control on every protected route",
      "Server-side input validation on all forms",
      "Structured error handling"
    ],

    comparison: {
      caption: "Feature comparison across the three platforms analysed",
      head: ["Feature", "Apollo", "Mayo Clinic", "NHS"],
      rows: [
        ["Appointment Booking", "Available", "Available", "Available"],
        ["Doctor Profiles", "Detailed information", "Basic profiles", "Limited"],
        ["Service Information", "Categorized", "Detailed medical articles", "Categorized"],
        ["Search Function", "Available", "Available", "Available"],
        ["Patient Portal", "Available", "Available", "Limited"],
        ["Mobile Friendly", "Yes", "Yes", "Yes"]
      ]
    },

    tests: {
      heading: "How I Tested This",
      body:
        "I tested this in three ways: checking each feature actually works, asking people whether they could finish the tasks easily, and a short acceptance check with real users. Five scenarios were written into the test plan and two are documented end to end.",
      head: ["ID", "Feature", "Expected Result", "Result"],
      rows: [
        ["T01", "User Login", "User successfully logs into system", "Pass"],
        ["T02", "Patient Registration", "New patient account created", "Pass"],
        ["T03", "Appointment Booking", "Appointment saved in database", "Pass"],
        ["T04", "Doctor Search", "Correct doctor list displayed", "Pass"],
        ["T05", "Medical Report Access", "Patient can download report", "Pass"]
      ]
    },

    roadmap: [
      { label: "Online payments", note: "Settle consultation fees at the point of booking." },
      { label: "Telemedicine", note: "Extend consultations beyond in-person visits." },
      { label: "Native mobile app", note: "Carry the existing web functionality to mobile." }
    ],

    gallery: [
      { src: "projects/medicare-plus/img/home.jpg", alt: "MediCare Plus home page", caption: "Home &mdash; services, doctors and booking entry" },
      { src: "projects/medicare-plus/img/doctors.jpg", alt: "Doctor listing page with specialisation, experience and fee filters", caption: "Doctor listing &mdash; filterable by specialisation and schedule" },
      { src: "projects/medicare-plus/img/booking.jpg", alt: "Appointment booking page showing available time slots", caption: "Appointment booking against live slot availability" },
      { src: "projects/medicare-plus/img/patient-dash.jpg", alt: "Patient dashboard with appointment history and messages", caption: "Patient dashboard &mdash; history, doctors and messages" },
      { src: "projects/medicare-plus/img/admin-dash.jpg", alt: "Admin dashboard for managing doctors, patients and services", caption: "Admin dashboard &mdash; doctors, patients and services" },
      { src: "projects/medicare-plus/img/schema.jpg", alt: "MySQL database schema showing the Users and Appointments tables", caption: "MySQL schema &mdash; Users and Appointments tables" }
    ]
  },

  "techcare-services": {
    slug: "techcare-services",
    index: "02",
    title: "TECHCARE SERVICES",
    eyebrow: ["Mobile App", "Service Booking"],
    category: "On-Demand Device Repair &amp; Service Booking",
    summary:
      "I built this Android app for booking device repairs. Customers browse the service list, describe what is wrong with their device and submit a request, and a technician picks it up and updates the status as the repair moves along. Firebase handles the accounts and the live updates.",
    tags: ["Android Java", "XML", "Firebase", "Android Studio"],
    meta: [
      { label: "CLIENT", value: "TechCare Services" },
      { label: "ROLE", value: "UI Design &amp; Android Development" },
      { label: "MODULE", value: "CSE5011 &middot; Mobile Application Development" },
      { label: "ASSESSMENT", value: "WRIT1 &middot; Academic Project" }
    ],
    stats: [
      { value: "06", label: "Interface Screens" },
      { value: "04", label: "UML &amp; ER Diagrams" },
      { value: "06", label: "Test Scenarios" },
      { value: "06/06", label: "Test Cases Passing" }
    ],
    hero: { src: "projects/techcare-services/img/home-mock.jpg", alt: "TechCare Services home screen" },

    sections: [
      {
        id: "idea",
        num: "01",
        heading: "The Idea",
        body: [
,
          "TechCare Services repairs phones and laptops, and they were taking bookings over the phone. I wanted an app where a customer could pick a service, describe what is wrong with the device and follow the repair as it happens.",
,
          "It was also a mobile development module, so part of the point was learning how Android apps are actually put together rather than only reading about it."
,
        ]
      },
      {
        id: "role",
        num: "02",
        heading: "My Role",
        body: [
,
          "I designed the screens and wrote the Java. Firebase Authentication, the Realtime Database, the input validation and the UML diagrams were all mine.",
,
          "I also wrote the technical documentation at the end, which turned out to be a useful way of finding the gaps I had left."
,
        ]
      },
      {
        id: "process",
        num: "03",
        heading: "The Process",
        body: [
,
          "I made the screens on paper first, then drew the ER and UML diagrams, then started coding. Deciding what each screen needed from the database before writing any Java saved me a lot of rewriting later.",
,
          "I wrote six test cases against the finished app, pairing a valid action with an invalid one for each module so I could show that the validation works and not just the happy path."
,
        ]
      },
      {
        id: "design",
        num: "04",
        heading: "Design",
        body: [
,
          "Six screens in total: login, register, the service catalogue with search, the booking form, the customer's job list, and the technician's job list. I kept it to that because more screens meant more to test.",
,
          "Services are shown as cards rather than a plain list, since the catalogue is the screen people use most and it needs to be quick to scan."
,
        ]
      },
      {
        id: "development",
        num: "05",
        heading: "Development",
        body: [
,
          "Java with XML layouts. Firebase Authentication handles the accounts and the Realtime Database holds bookings and status, so a status change shows up for the customer without them refreshing.",
,
          "Validation runs before anything is written to the database, and each authenticated task sits in its own Activity so they do not bleed into each other."
,
        ]
      },
      {
        id: "result",
        num: "06",
        heading: "Result",
        body: [
,
          "A working booking flow end to end. A customer registers, finds a service, submits the fault along with their device details, and watches the status change as the technician moves the job along.",
,
          "All six test cases pass, covering both valid submissions and rejected input."
,
        ]
      },
      {
        id: "learned",
        num: "07",
        heading: "What I Learned",
        body: [
,
          "I learned that the Realtime Database is genuinely useful for this kind of job. I did not expect live updates to be that quick to set up.",
,
          "I also got better at estimating. I planned for two screens and ended up building six, which meant the last few were done in a hurry."
,
        ]
      }
    ],

    featureGrid: {
      heading: "What Each Role Can Do",
      groups: [
        {
          role: "Customer",
          points: [
            "Register an account with name, email and password",
            "Browse available repair services as a card catalogue",
            "Search across service categories",
            "Submit a repair request with a fault description",
            "Track repair status and review booking history",
            "Log out of the application"
          ]
        },
        {
          role: "Technician",
          points: [
            "View assigned repair jobs",
            "Review the reported fault and device details",
            "Update repair status as work progresses",
            "Close completed jobs against the booking record"
          ]
        },
        {
          role: "Admin",
          points: [
            "Maintain the repair service catalogue",
            "Manage user accounts and bookings",
            "Assign technicians to incoming jobs",
            "Review service activity across the platform"
          ]
        }
      ]
    },

    securityNote:
      "Passwords and repair history are personal information, so I set these up as I went rather than adding them at the end.",
    security: [
      "Firebase Authentication for email and password accounts",
      "Client-side validation on login, registration and booking",
      "Database writes performed only after validation passes",
      "Discrete Activities keep each authenticated task isolated",
      "Technical documentation covering setup, stack and data model"
    ],

    comparison: {
      heading: "Android vs iOS",
      caption: "Platform decision criteria researched before implementation",
      head: ["Feature", "Android", "iOS"],
      rows: [
        ["Developer", "Google", "Apple"],
        ["Source Type", "Open-source", "Closed-source"],
        ["Device Support", "Multiple brands", "Apple devices only"],
        ["Customization", "Highly customizable", "Limited customization"],
        ["App Publishing Cost", "Lower", "Higher"],
        ["Market Share", "Higher global share", "Lower global share"],
        ["Security", "Good security", "Strong security"],
        ["Flexibility", "More flexible", "Less flexible"]
      ]
    },

    tests: {
      heading: "How I Tested This",
      body:
        "I wrote six test cases against the finished app, pairing a valid action with an invalid one for each module so I could show that validation works and not just the happy path. All six pass.",
      head: ["ID", "Feature", "Expected Result", "Result"],
      rows: [
        ["TC01", "Login", "Correct credentials &rarr; login successful", "Pass"],
        ["TC02", "Login", "Empty email &rarr; error message displayed", "Pass"],
        ["TC03", "Registration", "Invalid email &rarr; validation error displayed", "Pass"],
        ["TC04", "Booking", "Empty issue field &rarr; error message displayed", "Pass"],
        ["TC05", "Booking", "Valid details &rarr; booking submitted successfully", "Pass"],
        ["TC06", "Logout", "Logout button &rarr; user session ended", "Pass"]
      ]
    },

    roadmap: [
      { label: "Payments", note: "Collect repair deposits at the point of booking." },
      { label: "Push notifications", note: "Alert customers when a job is assigned and completed." },
      { label: "Technician app", note: "Give field technicians their own job list and status controls." }
    ],

    gallery: [
      { src: "projects/techcare-services/img/home.jpg", alt: "TechCare Services home screen listing repair service categories", caption: "Home &mdash; repair services as a RecyclerView card catalogue" },
      { src: "projects/techcare-services/img/splash.jpg", alt: "Splash screen with TechCare Services branding", caption: "Splash &mdash; branding and launch screen" },
      { src: "projects/techcare-services/img/login.jpg", alt: "Login screen with email and password fields", caption: "Login &mdash; email and password with inline validation" },
      { src: "projects/techcare-services/img/register.jpg", alt: "Registration screen for creating a new account", caption: "Registration &mdash; validated account creation" },
      { src: "projects/techcare-services/img/booking.jpg", alt: "Booking screen for submitting a repair request", caption: "Booking &mdash; fault description and service submission" },
      { src: "projects/techcare-services/img/profile.jpg", alt: "Profile screen showing user details and logout", caption: "Profile &mdash; customer details and logout" }
    ]
  },

  "packaging-labels": {
    slug: "packaging-labels",
    index: "06",
    title: "PACKAGING LABELS",
    eyebrow: ["Print Craft", "Small Format"],
    category: "Packaging &amp; Label Design",
    summary:
      "These are six container labels for skincare, food and personal care products. I worked under one rule across all of them: the product name is the loudest thing on the label and everything else stays quiet. It is practice work, but it is the part of my portfolio that is not software.",
    tags: ["Photoshop", "Illustrator", "Typography", "Packaging", "Print"],
    meta: [
      { label: "SCOPE", value: "Container &amp; Jar Labels" },
      { label: "TOOLS", value: "Photoshop &amp; Illustrator" },
      { label: "PIECES", value: "6 label designs" },
      { label: "DISCIPLINE", value: "Typography &amp; Composition" }
    ],
    stats: [
      { value: "06", label: "Works" },
      { value: "03", label: "Product Categories" },
      { value: "Small", label: "Format Discipline" },
      { value: "01", label: "Dominant Type Rule" }
    ],
    hero: {
      src: "projects/graphic-design/img/label-01.jpg",
      alt: "Product packaging label artwork",
      constrained: true,
      caption: "Packaging label &mdash; hierarchy set for small-format reading"
    },

    sections: [
      {
        id: "idea",
        num: "01",
        heading: "The Idea",
        body: [
,
          "I wanted to practise typography at a genuinely small size. Most of what I do visually is on screens, where there is always more room, so a label was a useful constraint — a few square centimetres where everything competes for attention.",
,
          "I picked six products across skincare, food and personal care so the set had to hold together as a range rather than as six unrelated designs."
,
        ]
      },
      {
        id: "role",
        num: "02",
        heading: "My Role",
        body: [
,
          "Concept, typography, colour and the final artwork, all in Photoshop and Illustrator. I did not use any templates — every label was built from scratch.",
,
          "I also worked at the real printed size instead of designing at screen size and hoping it would survive."
,
        ]
      },
      {
        id: "process",
        num: "03",
        heading: "The Process",
        body: [
,
          "I worked out the information order first: product name, then supporting claims, then the small mandatory copy. Once that order was fixed, the type sizes followed from it rather than the other way around.",
,
          "I reused the same margin logic and the same restrained palette across all six so they read as a set when lined up on a shelf."
,
        ]
      },
      {
        id: "design",
        num: "04",
        heading: "Design",
        body: [
,
          "Each label got one dominant type treatment, and the rest of the composition stayed quiet around it. Small labels fail when everything is shouting, so most of the work was deciding what to leave out.",
,
          "Legibility won over decoration throughout. If a claim could not be read clearly at actual size, it went smaller or came out."
,
        ]
      },
      {
        id: "result",
        num: "05",
        heading: "Result",
        body: [
,
          "Six finished labels across three product categories. I checked every one both at printed size and as a thumbnail, because a label on a shelf is often seen from a step back before it is read properly."
,
        ]
      },
      {
        id: "learned",
        num: "06",
        heading: "What I Learned",
        body: [
,
          "I learned that constraints help. Working inside a fixed small format made me decide faster than a blank canvas does.",
,
          "I also stopped making sets where every piece is slightly different. Consistency turned out to be most of what makes a range look intentional rather than random."
,
        ]
      }
    ],

    featureGrid: {
      heading: "What Is In The Set",
      groups: [
        {
          role: "Products",
          points: [
            "Skincare &mdash; single dominant treatment, quiet claims",
            "Personal care &mdash; restrained supporting palette",
            "Food &mdash; regulatory copy present but visually quiet",
            "Supporting claim sets beneath the product name",
            "One range, read as a set"
          ]
        },
        {
          role: "Craft",
          points: [
            "Typographic hierarchy at constrained sizes",
            "Palette discipline held across three categories",
            "Grid and margin consistency between labels",
            "Legibility prioritised over decoration",
            "Artwork scaled for the real printed format"
          ]
        },
        {
          role: "Tools",
          points: [
            "Adobe Photoshop for raster and composite work",
            "Adobe Illustrator for vector type and layout",
            "Print export and colour handling",
            "Artwork proofed against small-format legibility",
            "Mockup presentation for review"
          ]
        }
      ]
    },

    securityNote:
      "There is nothing access-controlled on this one. It is design work, so this is just the process behind it.",
    security: [
      "Original artwork only, no stock templates",
      "Original design files retained per label",
      "Consistent grid and type scale across the range",
      "Limited palette held across all six labels"
    ],

    comparison: {
      heading: "Label Constraints",
      caption: "The three things competing for the same few square centimetres",
      head: ["Information", "Role", "Handled By"],
      rows: [
        ["Product name", "Loudest voice", "Dominant type treatment"],
        ["Supporting claims", "Second read", "Smaller, looser tracking"],
        ["Mandatory copy", "Present, not read", "Smallest size, edge placement"],
        ["Shelf competition", "Neighbouring products", "One consistent palette logic"]
      ]
    },

    tests: {
      heading: "How I Built These",
      body:
        "I built each label around the thing that actually governs small-format work: hierarchy that reads at the real printed size. Three information tiers stayed in order on every piece, and the same margin logic was reused so the set holds together.",
      head: ["ID", "Element", "Criterion", "Approach"],
      rows: [
        ["L01", "Hierarchy order", "Three tiers legible in order", "Enforced on all six"],
        ["L02", "Display size", "Product name dominant", "One treatment per label"],
        ["L03", "Claim legibility", "Readable without competing", "Smaller, tracked looser"],
        ["L04", "Palette logic", "Range reads as one set", "Held across categories"],
        ["L05", "Margin system", "Consistent between labels", "Reused grid"]
      ],
    },

    roadmap: [
      { label: "Identity systems", note: "Extend the label hierarchy into full packaging guidelines." },
      { label: "Range expansion", note: "Extend the set into additional product categories." },
      { label: "Print production", note: "Take the range to physical press proofing." }
    ],

    galleryOpen: true,
    galleryNoun: "works",
    galleryKicker: "The Range",
    galleryTitle: "Works",
    galleryNote: "All six label designs, displayed in full.",

    gallery: [
      { src: "projects/graphic-design/img/label-01.jpg", alt: "Product packaging label artwork", caption: "Label 01 &mdash; hierarchy set for small-format reading" },
      { src: "projects/graphic-design/img/label-02.jpg", alt: "Skincare product label artwork", caption: "Label 02 &mdash; skincare, single dominant type treatment" },
      { src: "projects/graphic-design/img/label-03.jpg", alt: "Personal care product label artwork", caption: "Label 03 &mdash; personal care, restrained supporting palette" },
      { src: "projects/graphic-design/img/label-04.jpg", alt: "Food product packaging label artwork", caption: "Label 04 &mdash; food, regulatory copy present but quiet" },
      { src: "projects/graphic-design/img/label-06.jpg", alt: "Additional product packaging label artwork", caption: "Label 06 &mdash; supporting claim set beneath the product name" },
      { src: "projects/graphic-design/img/label-07.jpg", alt: "Additional packaging label artwork in the archive range", caption: "Label 07 &mdash; one range, read as a set" }
    ]
  },

  "promotional-posters": {
    slug: "promotional-posters",
    index: "07",
    title: "PROMOTIONAL POSTERS",
    eyebrow: ["Large Format", "Campaign Typography"],
    category: "Promotional Poster Design",
    summary:
      "These are seven posters for product launches, beauty campaigns and institutional announcements. Each one has a single job: stop someone walking, hold them long enough to get one idea across, and still work when someone photographs it on a phone. Design practice rather than client work.",
    tags: ["Photoshop", "Illustrator", "Typography", "Posters", "Print"],
    meta: [
      { label: "SCOPE", value: "Product, Event &amp; Institutional" },
      { label: "TOOLS", value: "Photoshop &amp; Illustrator" },
      { label: "PIECES", value: "7 poster designs" },
      { label: "DISCIPLINE", value: "Typography &amp; Layout" }
    ],
    stats: [
      { value: "07", label: "Works" },
      { value: "03", label: "Poster Categories" },
      { value: "Large", label: "Format Discipline" },
      { value: "01", label: "Focal Point Per Piece" }
    ],
    hero: {
      src: "projects/graphic-design/img/poster-221355.jpg",
      alt: "Editorial promotional poster artwork",
      constrained: true,
      caption: "Poster 04 &mdash; editorial, single focal point"
    },

    sections: [
      {
        id: "idea",
        num: "01",
        heading: "The Idea",
        body: [
,
          "I wanted to practise designing for distance. On a screen you can always add another element, but a poster has one job and only a few seconds to do it.",
,
          "I made seven of them across product launches, beauty campaigns and institutional announcements so I could test the same approach against different subject matter."
,
        ]
      },
      {
        id: "role",
        num: "02",
        heading: "My Role",
        body: [
,
          "Everything on these is mine: concept, typography, layout and the final files, in Photoshop and Illustrator. No stock templates were used.",
,
          "I exported each one at large format and checked it again after reducing it, because that is usually how a poster gets seen first."
,
        ]
      },
      {
        id: "process",
        num: "03",
        heading: "The Process",
        body: [
,
          "I picked one focal point per poster before I placed anything else, then built the type hierarchy around it. Deciding the focus first stopped me from adding elements out of habit later.",
,
          "I kept the same margin logic across the set so the seven of them read as one body of work instead of seven unrelated sheets."
,
        ]
      },
      {
        id: "design",
        num: "04",
        heading: "Design",
        body: [
,
          "Type was sized for the viewing distance rather than for the page. I worked at full size, then scaled the whole composition down and checked whether it still held together.",
,
          "Contrast did most of the work. Where a sheet felt weak I changed the contrast before adding anything new to it."
,
        ]
      },
      {
        id: "result",
        num: "05",
        heading: "Result",
        body: [
,
          "Seven finished posters across three categories. Each one was checked at full size, at thumbnail size and printed small, and the composition was adjusted until it survived all three."
,
        ]
      },
      {
        id: "learned",
        num: "06",
        heading: "What I Learned",
        body: [
,
          "I learned to reduce a composition before adding to it. Most of my early posters had too many competing elements and the fix was subtraction, not more design.",
,
          "I also started treating a set as a set. Reusing margin and scale logic across pieces made them look related without me having to force it."
,
        ]
      }
    ],

    featureGrid: {
      heading: "What Is In The Set",
      groups: [
        {
          role: "Categories",
          points: [
            "Product launch &mdash; herbal skincare",
            "Beauty campaign &mdash; purity-led typography",
            "Editorial &mdash; single focal point",
            "Institutional announcement",
            "Heading and layout studies"
          ]
        },
        {
          role: "Craft",
          points: [
            "Type scaled for distance reading",
            "Contrast over decoration",
            "Single focal point per composition",
            "Hierarchy that survives a photo thumbnail",
            "Consistent margin logic between pieces"
          ]
        },
        {
          role: "Tools",
          points: [
            "Adobe Photoshop for raster and composite work",
            "Adobe Illustrator for vector type and layout",
            "Large-format export and colour handling",
            "Composition checked at reduced scale",
            "Mockup presentation for review"
          ]
        }
      ]
    },

    securityNote:
      "There is nothing access-controlled on this one. It is design work, so this is just the process behind it.",
    security: [
      "Original artwork only, no stock templates",
      "Original design files retained per poster",
      "Consistent margin and type scale system",
      "Limited palette held across the set"
    ],

    comparison: {
      heading: "Poster Constraints",
      caption: "What a poster has to survive, and what handles each case",
      head: ["Situation", "Risk", "Handled By"],
      rows: [
        ["Seen from across a room", "Type set too timidly to register", "Large display scale"],
        ["Read at thirty centimetres", "Detail competing with the message", "One focal point"],
        ["Photographed on a phone", "Composition breaks as a thumbnail", "Single strong silhouette"],
        ["Seen beside other posters", "Sheet disappears into the wall", "Contrast, not decoration"]
      ]
    },

    tests: {
      heading: "How I Built These",
      body:
        "I built each poster around the viewing distance that actually governs it: type sized to register from across a room, then re-checked at thumbnail scale, because that is how most posters are first seen. One focal point per composition, and the same margin logic across the set.",
      head: ["ID", "Element", "Criterion", "Approach"],
      rows: [
        ["P01", "Display scale", "Type registers at distance", "Enforced on all seven"],
        ["P02", "Focal point", "One dominant element per sheet", "Held on every piece"],
        ["P03", "Thumbnail read", "Silhouette survives reduction", "Checked per composition"],
        ["P04", "Contrast", "Sheet separates from the wall", "Value over decoration"],
        ["P05", "Margin logic", "Consistent between posters", "Reused grid"]
      ],
    },

    roadmap: [
      { label: "Campaign series", note: "Extend one launch into a matched poster series." },
      { label: "Motion", note: "Adapt the poster system into animated social formats." },
      { label: "Large format", note: "Produce the set at full wall dimensions." }
    ],

    galleryOpen: true,
    galleryNoun: "works",
    galleryKicker: "The Set",
    galleryTitle: "Works",
    galleryNote: "All seven poster designs, displayed in full.",

    gallery: [
      { src: "projects/graphic-design/img/poster-herbal-goodness-for-everyday-glow-224629.jpg", alt: "Herbal skincare promotional poster", caption: "Poster 01 &mdash; herbal skincare, product launch" },
      { src: "projects/graphic-design/img/poster-where-purity-meets-prestige-065821.jpg", alt: "Beauty campaign poster with purity-led typography", caption: "Poster 02 &mdash; beauty campaign, purity-led composition" },
      { src: "projects/graphic-design/img/poster-untitled-design-114010.jpg", alt: "Promotional poster design", caption: "Poster 03 &mdash; promotional, scale set for distance" },
      { src: "projects/graphic-design/img/poster-221355.jpg", alt: "Editorial poster artwork", caption: "Poster 04 &mdash; editorial, single focal point" },
      { src: "projects/graphic-design/img/poster-add-a-heading-063636.jpg", alt: "Poster layout study with heading composition", caption: "Poster 05 &mdash; layout study, heading hierarchy exploration" },
      { src: "projects/graphic-design/img/poster-add-a-heading-122236.jpg", alt: "Alternate poster heading layout study", caption: "Poster 06 &mdash; layout study, alternate heading composition" },
      { src: "projects/graphic-design/img/poster-2-020722.jpg", alt: "Institutional announcement poster", caption: "Poster 07 &mdash; institutional announcement typography" }
    ]
  },

  "apparel-prints": {
    slug: "apparel-prints",
    index: "08",
    title: "APPAREL PRINTS",
    eyebrow: ["Streetwear", "Production Craft"],
    category: "Apparel &amp; Streetwear Print Design",
    summary:
      "These are nine prints for garments, across institutional references and streetwear graphics. Bold shapes and heavy type, because the canvas is irregular, the fabric distorts and the garment moves — anything depending on a hairline detail dies in production. Design practice rather than client work.",
    tags: ["Photoshop", "Typography", "Apparel", "Streetwear", "Print"],
    meta: [
      { label: "SCOPE", value: "Streetwear &amp; Institutional" },
      { label: "TOOLS", value: "Photoshop &amp; Illustrator" },
      { label: "PIECES", value: "9 apparel prints" },
      { label: "DISCIPLINE", value: "Graphic Design for Garments" }
    ],
    stats: [
      { value: "09", label: "Works" },
      { value: "02", label: "Themes" },
      { value: "Garment", label: "Format Discipline" },
      { value: "01", label: "Colour Priority" }
    ],
    hero: {
      src: "projects/graphic-design/img/tee-20260510-223711.jpg",
      alt: "Apparel graphic print design",
      constrained: true,
      caption: "Print 09 &mdash; latest addition to the apparel set"
    },

    sections: [
      {
        id: "idea",
        num: "01",
        heading: "The Idea",
        body: [
,
          "Clothing is a harder canvas than a screen. The fabric distorts, the garment moves, and anything built on a hairline detail tends to disappear in production.",
,
          "I wanted to test whether I could design something that survives being stitched, washed and printed again, so I made nine prints across institutional and streetwear references."
,
        ]
      },
      {
        id: "role",
        num: "02",
        heading: "My Role",
        body: [
,
          "I drew every print and prepared the files for production, in Photoshop and Illustrator. Nothing here came from a template.",
,
          "I worked with the garment in mind throughout — which shapes had to hold when the fabric folded, and which type would survive being washed."
,
        ]
      },
      {
        id: "process",
        num: "03",
        heading: "The Process",
        body: [
,
          "I built each print from large shapes first and added detail only where it would still read. Working small and adding precision early is what makes garment prints fall apart.",
,
          "I tested each one by reducing it and imagining it on fabric, since the reduction is closer to what a screen print actually produces than the artwork on my monitor."
,
        ]
      },
      {
        id: "design",
        num: "04",
        heading: "Design",
        body: [
,
          "Bold shapes and heavy type, because both survive reproduction. If it needed a thin line or a small detail to work, it was probably too subtle for a garment.",
,
          "Institutional pieces use structure and grid, while the streetwear references lean on heavier shapes and looser type. Keeping those two languages separate made each set feel intentional."
,
        ]
      },
      {
        id: "result",
        num: "05",
        heading: "Result",
        body: [
,
          "Nine finished prints across two directions, each checked at garment scale rather than as flat artwork on a screen."
,
        ]
      },
      {
        id: "learned",
        num: "06",
        heading: "What I Learned",
        body: [
,
          "I learned that the medium decides the design. Working for fabric made me simplify automatically, which is a habit I have carried back into my UI work.",
,
          "I also noticed I enjoy this kind of work most when I can see the constraint clearly. Blank canvas briefs are much harder for me than a rule to push against."
,
        ]
      }
    ],

    featureGrid: {
      heading: "What Is In The Set",
      groups: [
        {
          role: "Themes",
          points: [
            "Institutional &mdash; collegiate and school marks",
            "Streetwear &mdash; aggressive cropping and scale",
            "Type-led graphic apparel prints",
            "Single-colour separation work",
            "Alternate colourways of one design"
          ]
        },
        {
          role: "Craft",
          points: [
            "Composition that survives garment movement",
            "Heavy type and solid shapes",
            "No detail below reproduction threshold",
            "Palette limited per print",
            "Artwork scaled to the real garment"
          ]
        },
        {
          role: "Tools",
          points: [
            "Adobe Photoshop for raster and composite work",
            "Adobe Illustrator for vector type and layout",
            "Separation and spot-colour preparation",
            "Garment mockups for presentation",
            "Print export and colour handling"
          ]
        }
      ]
    },

    securityNote:
      "There is nothing access-controlled on this one. It is design work, so this is just the process behind it.",
    security: [
      "Original artwork only, no stock templates",
      "Original design files retained per print",
      "Consistent shape and type logic across the set",
      "Limited palette held per garment"
    ],

    comparison: {
      heading: "Apparel Constraints",
      caption: "What a garment does to a graphic, and what handles each case",
      head: ["Constraint", "Effect", "Handled By"],
      rows: [
        ["Fabric distortion", "Straight edges bow on the body", "Shapes sized to the chest panel"],
        ["Garment movement", "Fine detail blurs in motion", "Heavy type, solid fills"],
        ["Reproduction threshold", "Hairlines drop out on press", "No detail below print minimum"],
        ["Restricted palette", "Limited separation choices", "One dominant colour per print"]
      ]
    },

    tests: {
      heading: "How I Built These",
      body:
        "I built each print around the thing that actually governs garment work: staying legible while the garment is worn, washed and reproduced. I checked every print at garment scale, not just flat on the monitor.",
      head: ["ID", "Element", "Criterion", "Approach"],
      rows: [
        ["A01", "Form count", "Few enough shapes to hold", "Limited per print"],
        ["A02", "Type weight", "Legible while moving", "Heavy throughout"],
        ["A03", "Detail threshold", "Survives production minimum", "Hairlines removed"],
        ["A04", "Palette", "Separation stays practical", "One dominant colour"],
        ["A05", "Placement logic", "Reads on the garment, not flat", "Set to garment panels"]
      ],
    },

    roadmap: [
      { label: "Colourways", note: "Expand the strongest prints into full colourway sets." },
      { label: "Garment mockups", note: "Build presentation mockups across garment types." },
      { label: "Print production", note: "Take selected designs to physical sampling." }
    ],

    galleryOpen: true,
    galleryNoun: "works",
    galleryKicker: "The Set",
    galleryTitle: "Works",
    galleryNote: "All nine apparel prints, displayed in full.",

    gallery: [
      { src: "projects/graphic-design/img/tee-centralites-20250728-120720-0000.jpg", alt: "Streetwear apparel print design", caption: "Print 01 &mdash; streetwear, type-led graphic" },
      { src: "projects/graphic-design/img/tee-they-hate-us-cause-20250922-155507.jpg", alt: "Bold typographic streetwear apparel print", caption: "Print 02 &mdash; streetwear, bold typographic treatment" },
      { src: "projects/graphic-design/img/tee-they-hate-us-cause-20250922-155816.jpg", alt: "Alternate colourway of a streetwear typographic print", caption: "Print 03 &mdash; streetwear, alternate colourway" },
      { src: "projects/graphic-design/img/tee-methodist-central-college-20250728.jpg", alt: "Institutional apparel print for a college", caption: "Print 04 &mdash; institutional, collegiate mark" },
      { src: "projects/graphic-design/img/tee-v-g-h-s-20250908-173919-0000.jpg", alt: "Institutional apparel graphic print design", caption: "Print 05 &mdash; institutional, single-colour separation" },
      { src: "projects/graphic-design/img/tee-batch-of-20250908-201919-0000.jpg", alt: "Apparel print graphic design", caption: "Print 06 &mdash; graphic composition, bold shapes" },
      { src: "projects/graphic-design/img/tee-1-20250923-160020-0000.jpg", alt: "Streetwear tee graphic artwork", caption: "Print 07 &mdash; streetwear, oversized type crop" },
      { src: "projects/graphic-design/img/tee-mikes-20250923-160621-0000.jpg", alt: "Apparel print with bold graphic treatment", caption: "Print 08 &mdash; bold shape, minimal detail" },
      { src: "projects/graphic-design/img/tee-20260510-223711.jpg", alt: "Apparel graphic print design", caption: "Print 09 &mdash; latest addition to the set" }
    ]
  }
};

const PROJECT_ORDER = ["shima-rms", "medicare-plus", "techcare-services", "packaging-labels", "promotional-posters", "apparel-prints"];
