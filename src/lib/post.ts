export type ContentBlock =
    | { type: "paragraph"; text: string }
    | { type: "heading"; text: string }
    | { type: "pullquote"; text: string; attribution: string }
    | { type: "stat-row"; stats: { value: string; label: string }[] };

export type Post = {
    slug: string;
    tag: string;
    title: string;
    desc: string;
    readTime: string;
    image: string;
    content: ContentBlock[];
};

export const posts: Post[] = [
    {
        slug: "sok-dara-journey",
        tag: "SUCCESS STORY",
        title: "From Errands to Full-Time: Sok Dara's Journey",
        desc: "Discover how Sok Dara turned a weekend side hustle into a thriving full-time career.",
        readTime: "6 MIN READ",
        image: "/images/teams/blog1.png",
        content: [
            { type: "paragraph", text: "Three years ago, Sok Dara was working a desk job he described as \"comfortable but slowly suffocating.\" On weekends he started accepting small errands on TaskExchange." },
            { type: "pullquote", text: "I didn't quit my job. My job quit me.", attribution: "Sok Dara" },
            { type: "heading", text: "The First 90 Days" },
            { type: "paragraph", text: "His strategy was simple: accept every task within 5km, even small ones. By day 90 he had 47 five-star reviews." },
            { type: "stat-row", stats: [{ value: "47", label: "5-Star Reviews" }, { value: "98%", label: "Profile Score" }, { value: "$1,240", label: "Month 3 Earnings" }] },
        ],
    },
    {
        slug: "securing-digital-identity",
        tag: "SAFETY TIPS",
        title: "Securing Your Digital Identity on the Marketplace",
        desc: "Our guide to keeping your account safe and ensuring every transaction is secure.",
        readTime: "4 MIN READ",
        image: "/images/teams/blog2.png",
        content: [
            { type: "paragraph", text: "Your TaskExchange account is your livelihood. Losing access — or worse, having it compromised — can cost you reviews, earnings, and client trust built over months." },
            { type: "heading", text: "Use a Strong, Unique Password" },
            { type: "paragraph", text: "Never reuse passwords across platforms. Use a password manager to generate and store a unique password for your TaskExchange account." },
            { type: "pullquote", text: "Most account takeovers aren't hacks — they're credential stuffing from other breached sites.", attribution: "TaskExchange Security Team" },
            { type: "heading", text: "Enable Two-Factor Authentication" },
            { type: "paragraph", text: "Go to Settings → Security and enable 2FA. This single step blocks over 99% of automated account takeover attempts." },
            { type: "stat-row", stats: [{ value: "99%", label: "Attacks Blocked by 2FA" }, { value: "3x", label: "More Likely to Be Targeted Without It" }, { value: "2 min", label: "To Set Up 2FA" }] },
        ],
    },
    {
        slug: "mastering-your-profile",
        tag: "TASKER GUIDES",
        title: "Mastering Your Profile for High-Value Clients",
        desc: "How to structure your portfolio and biography to attract enterprise-level tasks.",
        readTime: "8 MIN READ",
        image: "/images/teams/blog3.png",
        content: [
            { type: "paragraph", text: "Your profile is your storefront. High-value clients spend less than 10 seconds deciding whether to contact you — everything on your profile needs to earn that click." },
            { type: "heading", text: "Write a Biography That Sells Results" },
            { type: "paragraph", text: "Don't describe what you do — describe what clients get. Instead of \"I do furniture assembly,\" write \"I assemble flat-pack furniture with zero callbacks and a 100% satisfaction rate.\"" },
            { type: "pullquote", text: "Your bio isn't your resume. It's your pitch.", attribution: "TaskExchange Growth Team" },
            { type: "heading", text: "Build a Portfolio With Before & After Photos" },
            { type: "paragraph", text: "Clients booking high-value tasks want proof. Add photos to every completed job. Accounts with 10+ portfolio images earn 3x more than those without." },
            { type: "stat-row", stats: [{ value: "3x", label: "More Earnings With Photos" }, { value: "10s", label: "Time Clients Spend on Your Profile" }, { value: "68%", label: "Book Based on Bio Alone" }] },
        ],
    },
    {
        slug: "taskexchange-groups",
        tag: "MARKETPLACE NEWS",
        title: "Introducing TaskExchange Groups: Local Networking",
        desc: "We're launching local hubs to help taskers connect, share equipment, and collaborate.",
        readTime: "3 MIN READ",
        image: "/images/teams/blog4.png",
        content: [
            { type: "paragraph", text: "Today we're launching TaskExchange Groups — local hubs where taskers in the same city can connect, share equipment, split large jobs, and support each other." },
            { type: "heading", text: "What Are Groups?" },
            { type: "paragraph", text: "Groups are city-based communities inside TaskExchange. Join your city's group to see local job alerts, post equipment you're willing to lend, and find collaborators for jobs too big to handle alone." },
            { type: "pullquote", text: "The taskers who grow fastest are the ones who treat each other as allies, not competition.", attribution: "TaskExchange Community Team" },
            { type: "heading", text: "How to Join" },
            { type: "paragraph", text: "Go to Community → Groups in your dashboard, search for your city, and hit Join. Groups are free for all verified taskers." },
            { type: "stat-row", stats: [{ value: "12", label: "Cities at Launch" }, { value: "Free", label: "For All Verified Taskers" }, { value: "500+", label: "Taskers Already Joined" }] },
        ],
    },
    {
        slug: "how-to-earn-first-500",
        tag: "FEATURED",
        title: "How to Earn Your First $500 on TaskExchange",
        desc: "A step-by-step breakdown of exactly how new taskers can reach their first $500.",
        readTime: "5 MIN READ",
        image: "/images/teams/luy.png",
        content: [
            { type: "paragraph", text: "Every experienced tasker remembers earning their first $500. It's the milestone that proves the platform works — and the moment most people decide to take it seriously." },
            { type: "heading", text: "Step 1: Complete Your Profile 100%" },
            { type: "paragraph", text: "Before accepting a single task, fill every profile field. Add a photo, write a bio, and list your skills. Incomplete profiles are filtered out by most clients before they even see your name." },
            { type: "heading", text: "Step 2: Accept Everything in Your First Week" },
            { type: "paragraph", text: "Your first week is about reviews, not money. Accept every task you can physically do, deliver excellent work, and politely ask clients to leave a review. Five reviews changes your visibility overnight." },
            { type: "pullquote", text: "The first $500 is the hardest. After that, the platform works for you.", attribution: "TaskExchange Community" },
            { type: "stat-row", stats: [{ value: "5", label: "Reviews to Boost Visibility" }, { value: "100%", label: "Profile Completion Target" }, { value: "$500", label: "First Milestone" }] },
        ],
    },
];