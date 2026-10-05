const PROJECTS = {
  "shima-rms": {
    slug: "shima-rms",
    index: "00",
    title: "SHIMA RMS",
    eyebrow: ["Full-Stack System", "Multi-Tenant RBAC"],
    category: "Foreign Employment Agency Recruitment Management System",
    summary:
      "A multi-tenant recruitment management system for an SLBFE-licensed foreign employment agency, built to move a candidate through a six-stage deployment pipeline &mdash; registration, documentation, medical, training, visa and deployment. Eight distinct roles share one interface through Postgres row-level security, with a trilingual AI assistant answering candidate questions and an append-only audit trail over every privileged action.",
    tags: ["Next.js 16", "TypeScript", "Supabase", "Postgres RLS", "Tailwind 4", "Gemini AI"],
    meta: [
      { label: "CLIENT", value: "Shima International Agency" },
      { label: "ROLE", value: "Architecture, Full-Stack &amp; UI Design" },
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
        id: "brief",
        num: "01",
        heading: "The Problem",
        body: [
          "A foreign employment agency moves a person through six gated stages &mdash; registration, documentation, medical, training, visa, deployment &mdash; where each stage blocks the next and a missed document can strand a candidate weeks before departure. Doing that on spreadsheets and paper files means no one can answer simple questions: where is this person stuck, which documents are outstanding, who approved this, what does this sub-agent still get paid.",
          "Shima International Agency operates under an SLBFE licence with sub-agents and overseas employers attached, so the system had to serve four separate audiences at once without any of them seeing each other's data. A candidate sees their own file. A sub-agent sees only candidates they referred and their own commission ledger. Recruiters see the whole pipeline. Employers post vacancies and review matches. Finance sees receipts but not medical data.",
          "That requirement &mdash; eight roles, four portals, one database, zero leakage &mdash; is what shaped every technical decision that followed."
        ]
      },
      {
        id: "architecture",
        num: "02",
        heading: "Security as the Foundation",
        body: [
          "The central decision was enforcing access control in the database rather than in application code. Client-side route checks are trivially bypassed, so authorisation was pushed down into Postgres row-level security: RLS is enabled on all thirteen tables, and policies resolve the caller's role through a SQL function reading their JWT claims.",
          "The policies are written per role, not per screen. A candidate can select their own row in <code>candidates</code> and nothing else. A sub-agent can additionally select rows where they are the referring agent. Staff roles widen that. Admin-only surfaces &mdash; the user directory, audit log, password queue &mdash; are gated again in the policy itself. Because the rule lives in the database, a new page added later cannot accidentally bypass it.",
          "Three hardening passes followed the initial schema: fixing role resolution, protecting role columns from self-escalation, and correcting document-vault visibility. Audit logging was designed in from the start rather than retrofitted, since privileged actions on candidate records are exactly what an agency needs to be able to account for."
        ]
      },
      {
        id: "ai",
        num: "03",
        heading: "The AI Layer",
        body: [
          "Candidates ask the same operational questions constantly: what documents are still needed, where is my visa, when is my medical. Answering them through office staff does not scale, and most candidates would not know to ask.",
          "The assistant is a Gemini-backed endpoint with the agency's own process knowledge injected as a grounded system instruction &mdash; GAMCA medical sequencing, SLBFE training requirements, embassy stamping timelines, and what to bring to a clinic appointment. Conversation history is passed through so follow-up questions resolve against earlier turns, and the model is instructed to say so when it does not know rather than invent an answer about a real person's deployment.",
          "It is deliberately scoped to process knowledge rather than candidate records. Answers that concern an individual's file should come from the database, not from a language model."
        ]
      },
      {
        id: "craft",
        num: "04",
        heading: "Interface &amp; i18n",
        body: [
          "The interface is one app shell with a role-aware sidebar &mdash; eight roles route to one of four portals, and navigation items resolve per role rather than being duplicated per layout. Data-heavy screens use a shared table component built on TanStack Table, giving search, sorting and pagination consistently across every list in the system instead of reimplemented per page.",
          "The second requirement was language. Candidates are recruited across Sri Lanka, so the entire interface runs in English, Sinhala and Tamil from a single typed dictionary of 225 keys. Adding a language means adding one dictionary object &mdash; components read keys, never strings &mdash; and an admin surface edits translations against the key table directly.",
          "Accessibility and motion preferences are respected throughout: the theme respects <code>prefers-color-scheme</code>, animation respects <code>prefers-reduced-motion</code>, and focus states are preserved rather than suppressed."
        ]
      }
    ],

    featureGrid: {
      heading: "Capability by Role",
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
      "Authorisation is enforced in Postgres, not in the interface &mdash; a policy cannot be bypassed by a crafted request.",
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
      heading: "Verification",
      body:
        "Playwright drives a route-health suite across thirty-one authenticated screens, asserting each responds successfully, renders, and exposes enabled interactive elements &mdash; catching broken routes and render failures across all four portals. The authorisation model itself is verified at the database layer, where policies can be asserted directly with and without a matching role. Honest scope: the UI suite is smoke-level, not end-to-end business-flow coverage, and the finance and reporting screens are still on mocked data pending their Supabase queries.",
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
      "A database-driven healthcare web application for MediCare Plus, a private provider of general and specialist care. Patients browse doctor profiles, book appointments against live availability, and download medical reports. Doctors and administrators work from dedicated dashboards behind role-based access control.",
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
        id: "brief",
        num: "01",
        heading: "The Brief",
        body: [
          "MediCare Plus provides general consultations, specialist treatment, diagnostic services and emergency care. As demand for digital healthcare services grew, the provider needed to replace phone-and-paper scheduling with a system that let patients, doctors and administrators work from one integrated platform.",
          "The brief was to build a database-driven dynamic web application rather than a brochure site. Patients had to register, find the right specialist, book a real available slot and reach their own medical reports afterwards. Doctors needed their day-to-day schedule and patient messaging in one place. Administrators needed to be the single point of control for doctors, patients and services."
        ]
      },
      {
        id: "research",
        num: "02",
        heading: "Competitive Analysis",
        body: [
          "Before designing anything I analysed three live healthcare platforms &mdash; Apollo Hospitals, Mayo Clinic and the NHS &mdash; comparing them across appointment booking, doctor profiles, service information, search, patient portal and mobile responsiveness. All three supported booking, so booking was table stakes rather than a differentiator.",
          "The useful differences were elsewhere. Apollo carried the deepest doctor profiles, including specialisation, experience and consultation fee. Mayo Clinic led on information density and readability. The NHS, serving the widest and oldest audience, drove the accessibility decisions that shaped this project: larger type, simpler navigation and unambiguous content order."
        ]
      },
      {
        id: "design",
        num: "03",
        heading: "Interface Design",
        body: [
          "The interface follows four principles carried through every page: consistency of layout and style, obvious affordances on navigation and buttons, accessible contrast and type sizes, and a responsive layout that adapts from phone to desktop. Bootstrap handled the responsive grid so the same markup serves all three breakpoints.",
          "The palette is deliberately restrained &mdash; blue for trust and clinical professionalism, white for cleanliness, light grey to separate background sections. Six pages were designed and built: Home, Doctor Listing, Appointment Booking, and separate dashboards for Patient, Doctor and Admin."
        ]
      },
      {
        id: "build",
        num: "04",
        heading: "Under the Hood",
        body: [
          "The front end is HTML, CSS and vanilla JavaScript on Bootstrap, with JavaScript carrying the interactive layer &mdash; client-side form validation, doctor search filters, and dynamic content updates. The back end is PHP on MySQL, split across a small set of focused scripts: an entry point, authentication, a database layer, and one dashboard per role.",
          "The database stores login credentials and doctor/patient records in a Users table and booking data in an Appointments table. Because the system holds identifiable patient information, security was treated as a first-class requirement rather than an afterthought: password encryption, role-based access control, input validation on every write path, and error handling that fails closed."
        ]
      }
    ],

    featureGrid: {
      heading: "Capabilities by Role",
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
      "Patient data required these controls as baseline, not enhancement.",
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
      heading: "Testing &amp; Evaluation",
      body:
        "Validation ran at three levels: functional testing to confirm each feature behaves correctly, usability testing on how easily users complete tasks, and user acceptance testing with real users. Five scenarios were defined up front in the test plan, then two were documented end to end.",
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
      "A native Android application for booking electronic device repairs. Customers register, browse the repair service catalogue, search by category and submit a repair request against a description of the fault. Firebase Authentication and Realtime Database handle accounts, bookings and notifications, with every input validated before it reaches the database.",
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
        id: "brief",
        num: "01",
        heading: "The Brief",
        body: [
          "Electronic device repair was still being arranged over phone calls and paper notebooks. Technicians found work by word of mouth, customers had no way to confirm a repair had actually been booked, and once a job was finished neither side kept a record.",
          "TechCare Services was built as a native Android application that puts that whole journey on the phone. A customer registers, browses the repair services on offer, books a repair against a description of the fault, and follows the status of the work. The module required a full delivery rather than a prototype &mdash; platform research, UML and database design, interface design, the working application, a formal test pass, and both user and technical documentation."
        ]
      },
      {
        id: "research",
        num: "02",
        heading: "Platform Selection",
        body: [
          "The platform decision was made against reach and toolchain rather than preference. Android was chosen over iOS primarily on reach: it is open-source, runs across multiple manufacturers rather than Apple hardware alone, and carries the larger global market share. For a service business that is decisive &mdash; customers can install the app on whatever phone they already own.",
          "The IDE decision followed the same logic. Android Studio was selected over Xcode because it offers the easier Firebase integration this project depends on, a mature XML layout editor for the interface layer, and support for Windows, Linux and macOS rather than macOS alone. Android's flexibility also made it the more practical choice for a service built around heterogeneous hardware."
        ]
      },
      {
        id: "design",
        num: "03",
        heading: "Interface Design",
        body: [
          "Six screens were designed and built: Splash, Login, Registration, Home, Booking and Profile. The splash screen carries branding and sets the first impression of the application. Login and Registration handle authentication with inline validation. Home presents the repair catalogue as a RecyclerView of cards, so long service lists scroll efficiently rather than inflating the layout. Booking captures the fault description and submits the request, and Profile shows the customer's own details with logout.",
          "The screens follow the Android convention of one clear task per Activity, with navigation between them handled by Intents. That keeps every screen a focused, independently testable unit instead of one monolithic Activity, which is what made the six-case test pass practical to write."
        ]
      },
      {
        id: "build",
        num: "04",
        heading: "Under the Hood",
        body: [
          "Java carries all application logic, validation and backend behaviour, while XML defines every layout. That separation keeps presentation independent of logic and makes the interface straightforward to restyle. Firebase supplies both Authentication, handling secure email-and-password sign-in, and Realtime Database storage for user records, repair bookings and notifications, with full create, read, update and delete implemented against it.",
          "Input validation was treated as a security requirement rather than polish. Login, Registration and Booking all validate before anything is written, so empty fields and malformed email addresses are rejected on the device instead of being persisted. That behaviour was then confirmed against a written test plan covering both the valid and the invalid path through each module."
        ]
      }
    ],

    featureGrid: {
      heading: "Capabilities by Role",
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
      "Credentials and repair history are sensitive, so these controls were specified before implementation rather than added afterwards.",
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
      heading: "Testing &amp; Evaluation",
      body:
        "A test plan of six cases was written against the built application, deliberately pairing a valid path with an invalid one for each module so that both the success behaviour and the validation behaviour were proven. All six passed.",
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
      "Six container labels across skincare, food and personal care, built around one rule: the product name wins, the supporting claims support it, and everything else stays quiet. A range that reads as one body of work from a shelf rather than as six unrelated clients.",
    tags: ["Photoshop", "Illustrator", "Typography", "Packaging", "Print"],
    meta: [
      { label: "SCOPE", value: "Container &amp; Jar Labels" },
      { label: "TOOLS", value: "Photoshop &amp; Illustrator" },
      { label: "PIECES", value: "6 label designs" },
      { label: "DISCIPLINE", value: "Visual Identity &amp; Typography" }
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
        id: "problem",
        num: "01",
        heading: "Hierarchy in a Very Small Box",
        body: [
          "A label is a hierarchy problem inside a very small area. Three kinds of information compete for the same few square centimetres: the product name, the supporting claims that justify it, and the mandatory copy that has to be present without being read at arm's length.",
          "Most label work fails by treating all three as equally important. Everything is legible, nothing is first. The fix is not more space or smaller type &mdash; it is deciding which of the three gets to be the loudest voice and committing to it."
        ]
      },
      {
        id: "rule",
        num: "02",
        heading: "One Dominant Treatment Per Label",
        body: [
          "Every label in this set uses a single dominant type treatment. The product name carries the personality; the supporting claims are set quieter, usually smaller and tracked looser; the mandatory copy sits at the edge of legibility.",
          "That single rule is what makes six labels from three different product categories read as one range. The palettes differ because the products differ, but the hierarchy does not &mdash; so a shelf of them looks systematic instead of accidental."
        ]
      },
      {
        id: "small-format",
        num: "03",
        heading: "Set Smaller Than Instinct Suggests",
        body: [
          "Label scale punishes timid typography. Type set at the size instinct suggests is usually too large, because it crowds out the supporting copy that has to share the space. Working small means setting the display type tighter and the supporting type looser than feels natural.",
          "The result is labels that hold their hierarchy at printed size, which is the only size that matters once the artwork is on a bottle or a jar."
        ]
      }
    ],

    featureGrid: {
      heading: "What This Range Covers",
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
      "This section carries no access controls &mdash; it is a public design portfolio entry.",
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
      heading: "How the Range Was Built",
      body:
        "Each label was built against the constraint that actually governs small-format work rather than against a generic standard: hierarchy read at the real printed size. Three information tiers were held in order on every piece &mdash; product name, supporting claims, mandatory copy &mdash; and the same margin logic was reused so the range stays consistent.",
      head: ["ID", "Element", "Criterion", "Approach"],
      rows: [
        ["L01", "Hierarchy order", "Three tiers legible in order", "Enforced on all six"],
        ["L02", "Display size", "Product name dominant", "One treatment per label"],
        ["L03", "Claim legibility", "Readable without competing", "Smaller, tracked looser"],
        ["L04", "Palette logic", "Range reads as one set", "Held across categories"],
        ["L05", "Margin system", "Consistent between labels", "Reused grid"]
      ]
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
      "Seven promotional posters spanning product launches, beauty campaigns and institutional announcements. Each one has a single job: stop someone walking, hold them long enough to deliver one idea, and survive being photographed on a phone and read later as a thumbnail.",
    tags: ["Photoshop", "Illustrator", "Typography", "Posters", "Print"],
    meta: [
      { label: "SCOPE", value: "Product, Event &amp; Institutional" },
      { label: "TOOLS", value: "Photoshop &amp; Illustrator" },
      { label: "PIECES", value: "7 poster designs" },
      { label: "DISCIPLINE", value: "Typography &amp; Composition" }
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
        id: "distance",
        num: "01",
        heading: "A Poster Is a Distance Problem",
        body: [
          "A poster is judged at three metres before it is judged at thirty centimetres. It has to interrupt a moving person, hold attention long enough to deliver a single idea, and then get out of the way.",
          "That distance changes what design decisions matter. Type that looks refined and elegant on screen is invisible on a wall. Contrast, scale and a single focal point do nearly all of the work; everything else is detail that only pays off once someone has already stopped."
        ]
      },
      {
        id: "one-idea",
        num: "02",
        heading: "One Piece, One Focal Point",
        body: [
          "Every poster in this set resolves to one focal point. On the herbal skincare and purity-led beauty pieces that is the product; on the editorial and institutional announcements it is the headline block.",
          "One focal point is not a limitation, it is the reason the other elements survive. A second competing centre turns a poster into a page &mdash; legible, but only to someone already standing in front of it."
        ]
      },
      {
        id: "formats",
        num: "03",
        heading: "Campaign, Event, Institution",
        body: [
          "The set covers three brief types. Product launches need the pack shot to carry the persuasion. Beauty campaigns lead with typography and mood. Institutional announcements need the date and the issuing body to be unmissable without becoming the whole design.",
          "The same underlying system handles all three because the focal-point rule is format-independent: decide what the poster is about, give it the largest element on the sheet, and set everything else in support of it."
        ]
      }
    ],

    featureGrid: {
      heading: "What the Poster Set Covers",
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
      "This section carries no access controls &mdash; it is a public design portfolio entry.",
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
      heading: "How the Posters Were Built",
      body:
        "Each poster was built around the viewing distance that actually governs it rather than against a generic standard: type sized to register from across a room, then re-checked at thumbnail scale because that is how most posters are first encountered. One focal point was held per composition and the same margin logic was reused across the set.",
      head: ["ID", "Element", "Criterion", "Approach"],
      rows: [
        ["P01", "Display scale", "Type registers at distance", "Enforced on all seven"],
        ["P02", "Focal point", "One dominant element per sheet", "Held on every piece"],
        ["P03", "Thumbnail read", "Silhouette survives reduction", "Checked per composition"],
        ["P04", "Contrast", "Sheet separates from the wall", "Value over decoration"],
        ["P05", "Margin logic", "Consistent between posters", "Reused grid"]
      ]
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
      "Nine apparel prints spanning institutional references and streetwear graphics. Built from bold shapes and heavy type, because the canvas is irregular, the fabric distorts and the garment moves &mdash; anything depending on a hairline detail dies in production.",
    tags: ["Photoshop", "Typography", "Apparel", "Streetwear", "Print"],
    meta: [
      { label: "SCOPE", value: "Streetwear &amp; Institutional" },
      { label: "TOOLS", value: "Photoshop &amp; Illustrator" },
      { label: "PIECES", value: "9 apparel prints" },
      { label: "DISCIPLINE", value: "Graphic Composition for Garments" }
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
        id: "canvas",
        num: "01",
        heading: "An Irregular Canvas That Moves",
        body: [
          "Apparel print is the harshest test a graphic idea faces. The surface is irregular, the fabric distorts around a body, and the whole thing moves every time the wearer does. A composition that works perfectly as a flat rectangle stops working the moment it is stitched.",
          "Hairlines break. Small text disappears into the weave. Centred compositions drift once the garment is worn rather than laid flat. Designing for apparel means accepting all three from the start rather than discovering them at the sampling stage."
        ]
      },
      {
        id: "bold",
        num: "02",
        heading: "Bold Shapes and Heavy Type",
        body: [
          "Everything in this set is built from forms that survive reproduction: solid shapes, heavy type, hard edges. Nothing depends on a delicate detail being resolved by eye, because in production nobody will be looking closely enough.",
          "Working with a restricted palette and a small number of forms produced more distinctive results than a full-colour brief would have. The constraint removed the option of hiding a weak composition behind detail."
        ]
      },
      {
        id: "themes",
        num: "03",
        heading: "Institutional and Streetwear",
        body: [
          "The archive splits into two themes. The institutional references &mdash; collegiate and school marks &mdash; need authority and legibility at garment scale, and lean on heraldic structure and heavy lettering.",
          "The streetwear prints take the opposite route: aggressive cropping, oversized type and blunt single-colour graphics. Both are working the same constraint, garment scale, from opposite directions."
        ]
      }
    ],

    featureGrid: {
      heading: "What the Print Set Covers",
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
      "This section carries no access controls &mdash; it is a public design portfolio entry.",
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
      heading: "How the Prints Were Built",
      body:
        "Each print was built against the constraint that actually governs garment work rather than against a generic standard: legibility while the garment is moving, and reproduction at press threshold. Forms were kept to a small number of solid shapes per print, and the palette limited so the separation work stays practical.",
      head: ["ID", "Element", "Criterion", "Approach"],
      rows: [
        ["A01", "Form count", "Few enough shapes to hold", "Limited per print"],
        ["A02", "Type weight", "Legible while moving", "Heavy throughout"],
        ["A03", "Detail threshold", "Survives production minimum", "Hairlines removed"],
        ["A04", "Palette", "Separation stays practical", "One dominant colour"],
        ["A05", "Placement logic", "Reads on the garment, not flat", "Set to garment panels"]
      ]
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
