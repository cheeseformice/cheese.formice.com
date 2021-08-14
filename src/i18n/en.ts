export default {
  languageName: "English",

  home: "Home",
  translation: "Translation",
  language: "Language",

  welcome: "Welcome to CheeseForMice!",
  lastTenPlayers: "Last 10 seen players",
  lastTenTribes: "Last 10 seen tribes",
  topTenPlayers: "Top 10 players",

  login: "Login",
  register: "Register",
  username: "Username",
  password: "Password",

  cookies: {
    alert:
      "This website uses cookies to improve user experience. By using our website you consent to " +
      "all cookies in accordance with our {open}Cookie Policy{close}.",
    acceptAll: "Accept all",
    acceptEssentials: "Accept essentials",
  },

  nothingHere: "Oops. Nothing here...",
  redirect: "If you are not being redirected, {open}click here{close}",

  members: "Members",
  mouse: "Normal",
  shaman: "Shaman",
  profile: "Profile",
  racing: "Racing",
  survivor: "Survivor",
  defilante: "Defilante",
  bootcamp: "Bootcamp",
  badges: "Badges",
  search: "Search",

  // footer
  contribute: "Contribute",
  contactUs: "Contact Us",
  information: "Information",
  preference: "Preference",
  sourceCode: "Source Code",
  faq: "Frequently Asked Questions",
  serverStatus: "Server Status",

  // Leaderboards
  period: "Period",
  leaderboard: "Leaderboard",
  player: "Player",
  tribe: "Tribe",
  rank: "Rank",
  name: "Name",
  playerName: "Player name",
  tribeName: "Tribe name",
  score: "Score",
  playerLeaderboards: "Player Leaderboards",
  tribeLeaderboards: "Tribe Leaderboards",
  periods: {
    overall: "All time",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
  },
  sorts: {
    none: "No leaderboard",
    rounds: "Rounds played",
    cheese: "Cheese gathered",
    first: "Firsts",
    bootcamp: "Bootcamps",
    stats: "Normal score",
    shaman: "Shaman score",
    survivor: "Survivor score",
    racing: "Racing score",
    defilante: "Defilante score",
    overall: "Overall score",
  },
  statValue: {
    rounds: "{stat} rounds played",
    cheese: "{stat} cheese gathered",
    first: "{stat} firsts",
    bootcamp: "{stat} bootcamps",
    stats: "Normal score: {stat}",
    shaman: "Shaman score: {stat}",
    survivor: "Survivor score: {stat}",
    racing: "Racing score: {stat}",
    defilante: "Defilante score: {stat}",
    overall: "Overall score: {stat}",
  },

  // For stats
  date: "Date",
  level: "Level {level}",
  miceSavedNormal: "Mice Saved (Normal)",
  miceSavedNormalShort: "Normal Saves",
  miceSavedHard: "Mice Saved (Hard)",
  miceSavedHardShort: "Hard Saves",
  miceSavedDivine: "Mice Saved (Divine)",
  miceSavedDivineShort: "Divine Saves",
  roundsPlayed: "Rounds Played",
  completedRounds: "Completed Rounds",
  gatheredCheese: "Gathered Cheese",
  cheeseGatheredFirst: "Cheese Gathered First",
  cheeseGatheredShaman: "Cheese Gathered as Shaman",
  cheeseGatheredShamanShort: "Shaman Cheese",
  experience: "Experience",
  numberOfPodiums: "Number of Podiums",
  numberOfFirsts: "Number of Firsts",
  roundsAsShaman: "Rounds as Shaman",
  killedMice: "Killed Mice",
  roundsSurvived: "Rounds Survived",
  pointsGathered: "Points Gathered",
  totalMemberCount: "Total member count",
  activeMemberCount: "Active member count",
  noMembers: "This tribe has no members",
  sinceLastSevenDays: "{sign}{value} since last 7 days",

  // Server healthcheck
  help: {
    api: "The API is responsible for the functionality of the website",
    changelogs: "Service responsible of tracking the progress of players & tribes",
    profile: "Service responsible of showing the profile of players & tribes",
    auth: "Service responsible of the website authentication",
    router: "Service responsible of handling requests",
    lookup: "Service responsible of leaderboards and searching players",
    dressroom: "Service responsible of drawing players' outfits",
  },
  status: {
    operational: "Operational",
    partialOutage: "Partial outage",
    majorOutage: "Major outage",
  },
  chart: {
    ping: "Ping",
    success: "Successful responses",
    errors: "Errors",
  },

  questions: {
    update: {
      title: "How often does this update?",
      answer: "Everyday at 14:00 UTC.",
    },
    leaderboard: {
      title: "How are the leadearboards calculated?",
      answer:
        "Everyday, right after the stats update, we calculate different scores.<br>" +
        "<b>Normal</b> score is obtained using your cheese gathered, firsts and rounds played.<br>" +
        "Any other score just takes into consideration their own statistics.<br>" +
        "<b>Overall</b> score is obtained using all the other generated scores.",
    },
    moduleStats: {
      title: "Do module stats count?",
      answer: "Currently, no. But there is a plan to make them count in the near future.",
    },
    suggestion: {
      title: "I have a suggestion / bug report",
      answer: "Please report it in our {open}discord server{close}.",
    },
    dislikeLeaderboard: {
      title: "I don't like the leaderboards",
      answer:
        "We are currently in the beta version, so they will be tweaked around later down the road.<br>" +
        "If you have any suggestion or specific feedback about how to improve them, " +
        "please head over to our {open}discord server{close}.",
    },
    weirdTribeStats: {
      title: "My tribe stats are weird",
      answer:
        "Tribe stats are calculated by dividing the total of the stat over the " +
        "square root of the amount of members in the tribe.<br>" +
        "This means, they may fluctuate a lot when a member joins or leaves the tribe.",
    },
    activeMembers: {
      title: "What is considered an 'active tribe member'?",
      answer:
        "An active tribe member is someone who has connected to the game in the previous 24 hours.",
    },
    contribute: {
      title: "How can I contribute?",
      answer:
        "This is an open-source project and we accept any kind of contribution.<br>" +
        "If you know how to code, you can {ghopen}go to our github{close}.<br>" +
        "If you want to translate the site, you can use our {tropen}translation panel{close}.<br>" +
        "If you want to contribute in any other way, please let us know via {dopen}discord{close}.",
    },
  },
};
