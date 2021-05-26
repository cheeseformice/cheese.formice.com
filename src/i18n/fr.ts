export default {
  languageName: "Français",
  home: "Accueil",
  translation: "Traduction",
  language: "Langage",
  welcome: "Bienvenue sur CheeseForMice!",
  lastTenPlayers: "Derniers 10 joueurs vus",
  lastTenTribes: "Dernières 10 tribus vues",
  topTenPlayers: "Meilleurs 10 joueurs",
  login: "Se connecter",
  register: "Créer un compte",
  username: "Pseudonyme",
  password: "Mot de Passe",
  nothingHere: "Oups. Y'a rien ici...",
  redirect: "Si vous n'êtes pas redirigé(e), {open}cliquez ici{close}",
  members: "Membres",
  normal: "Normal",
  shaman: "Chamane",
  profile: "Profil",
  racing: "Racing",
  survivor: "Survivor",
  defilante: "Défilante",
  bootcamp: "Bootcamp",
  badges: "Badges",
  search: "Rechercher",
  contribute: "Soutenir",
  contactUs: "Nous contacter",
  information: "Informations",
  preference: "Préférences",
  sourceCode: "Code source",
  faq: "Foire aux questions",
  serverStatus: "Statut du serveur",
  period: "Période",
  leaderboard: "Classement",
  player: "Joueur",
  tribe: "Tribu",
  rank: "Rang",
  name: "Nom",
  score: "Score",
  playerLeaderboards: "Classement des Joueurs",
  tribeLeaderboards: "Classement des Tribus",
  periods: { overall: "Indéfini", daily: "Quotidien", weekly: "Hebdomadaire", monthly: "Mensuel" },
  sorts: {
    none: "Aucun classement",
    rounds: "Parties jouées",
    cheese: "Fromages récupérés",
    first: "Firsts",
    bootcamp: "Bootcamps",
    stats: "Score en Normal",
    shaman: "Score en Chamane",
    survivor: "Score en Survivor",
    racing: "Score en Racing",
    defilante: "Score en Défilante",
    overall: "Score global",
  },
  statValue: {
    rounds: "Parties jouées: {stat}",
    cheese: "Fromages récupérés: {stat}",
    first: "Fromages rapportés en premier: {stat}",
    bootcamp: "Bootcamps: {stat}",
    stats: "Score en Normal: {stat}",
    shaman: "Score en Chamane: {stat}",
    survivor: "Score en Survivor: {stat}",
    racing: "Score en Racing: {stat}",
    defilante: "Score en Défilante: {stat}",
    overall: "Score Global: {stat}",
  },
  level: "Niveau {level}",
  miceSavedNormal: "Souris Sauvées (mode normal)",
  miceSavedHard: "Souris Sauvées (mode difficile)",
  miceSavedDivine: "Souris Sauvées (mode divin)",
  roundsPlayed: "Parties Jouées",
  completedRounds: "Parties Complétées",
  gatheredCheese: "Fromages Récupérés",
  cheeseGatheredFirst: "Fromages Rapportés en Premier",
  numberOfPodiums: "Nombre de Podiums",
  numberOfFirsts: "Nombre de Firsts",
  roundsAsShaman: "Parties en tant que Chamane",
  killedMice: "Souris Tuées",
  roundsSurvived: "Parties survécues",
  pointsGathered: "Points Récupérés",
  totalMemberCount: "Nombre total de membres",
  activeMemberCount: "Nombre de membres actifs",
  sinceLastSevenDays: "{sign}{value} depuis les 7 derniers jours",
  help: {
    api: "L'API est responsable du fonctionnement du site",
    changelogs: "Service dédié au suivi du progrès des joueurs & tribus",
    profile: "Service dédié à montrer des joueurs & tribus",
    auth: "Service dédié à l'authentification au site",
    router: "Service dédié au traitement des requêtes",
    lookup: "Service dédié aux classements et à la recherche de joueurs",
    dressroom: "Service dédié à l'affichage des tenues des joueurs",
  },
  status: {
    operational: "Opérationnel",
    partialOutage: "Panne temporaire",
    majorOutage: "Panne majeure",
  },
  chart: { ping: "Délai", success: "Requêtes validées", errors: "Erreurs" },
  questions: {
    update: {
      title: "À quelle fréquence ceci est-il mis à jour?",
      answer: "Tout les jours à 14h00 UTC.",
    },
    leaderboard: {
      title: "Comment sont calculés les classements?",
      answer:
        "Tout les jours, après que les statistiques se mettent à jour, nous calculons différents scores.<br>Le score <b>Normal</b> est calculé en utilisant vos fromages récupérés, vos firsts et vos parties jouées.<br>Tout autre score prend en considération ses propres statistiques.<br>Le score <b>Global</b> est obtenu en prenant en compte tout les autres scores générés",
    },
    moduleStats: {
      title: "Est-ce que les stats des modules comptent?",
      answer: "Actuellement, non. Mais il est prévu de les prendre en compte d'ici peu.",
    },
    suggestion: {
      title: "J'ai une suggestion / un rapport de bug",
      answer: "Veuillez le signaler dans notre {open}serveur Discord{close}.",
    },
    dislikeLeaderboard: {
      title: "Je n'aime pas les classements",
      answer:
        "Nous sommes actuellement dans une phase bêta, donc ils seront ajustés au fil du temps.<br>Si vous avez des suggestions pour les améliorer, veuillez rejoindre notre {open}serveur Discord{close}.",
    },
    weirdTribeStats: {
      title: "Les stats de ma tribu sont bizarres",
      answer:
        "Les stats des tribus sont calculés en divisant le total des stats par la racine carrée du nombre de joueurs dans la tribu.<br>Cela signifie qu'elles peuvent beaucoup fluctuer quand quelqu'un rejoint ou quitte la tribu",
    },
    activeMembers: {
      title: 'Qu\'est-ce qui est considéré un "membre de tribu actif"?',
      answer:
        "Un membre de tribu actif est quelqu'un qui s'est connecté sur le jeu dans les dernières 24 heures.",
    },
    contribute: {
      title: "Comment je peux contribuer?",
      answer:
        "Ceci est un projet open-source et nous acceptons tout genres de contributions.<br>Si vous savez comment coder, vous pouvez {ghopen}visiter notre GitHub{close}.<br>Si vous souhaitez traduire le site, vous pouvez utiliser notre {tropen}panneau de traduction{close}.<br>Si vous souhaitez contribuer de quelque autre façon, veuillez nous le faire savoir sur {dopen}Discord{close}.",
    },
  },
};
