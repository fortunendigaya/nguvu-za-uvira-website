// Firebase Configuration and Initialization
// Using CDN imports instead of ES6 modules for compatibility

// Complete Language Configuration
const translations = {
  fr: {
    // Navigation & General
    accueil: "Accueil",
    actualites: "Actualités",
    programmes: "Programmes",
    ecouter: "Écouter",
    articles: "Articles",
    seConnecter: "Connexion",
    tous: "Tous",
    musique: "Musique",
    discussion: "Discussion",
    religieux: "Religieux",
    educational: "Éducatif",
    entertainment: "Divertissement",

    // Hero Section
    heroTitle: "Votre Radio<br>Communautaire",
    heroSubtitle:
      "La voix de la communauté d'Uvira. Votre source d'information locales et internationales. Restez branché sur 107.0 MHz",
    ecouterEnDirect: "Écouter en direct",
    voirProgrammes: "Voir les programmes",

    // Current Show
    enCeMoment: "En ce moment",
    enDirect: "EN DIRECT",

    // Sections
    dernieresActualites: "Dernières actualités",
    programmesPopulaires: "Programmes populaires",
    programmation: "Programmation d'aujourd'hui",

    // Buttons & Actions
    voirPlus: "Voir plus",
    voirTout: "Voir tout",
    ecouter: "Écouter",
    mettreEnPause: "Mettre en pause",

    // Login
    email: "Email",
    motDePasse: "Mot de passe",
    motDePasseOublie: "Mot de passe oublié?",
    creerCompte: "Créer un compte",

    // Footer
    liensRapides: "Liens rapides",
    contact: "Contact",
    telephone: "Téléphone",
    newsletter: "Newsletter",
    tousDroitsReserves: "Tous droits réservés.",
    footerText: "Votre radio communautaire à Uvira. 107.0 MHz",

    // Article/News
    retour: "Retour",
    partager: "Partager",
    articlesSimilaires: "Articles similaires",
    commentaires: "Commentaires",
    ajouterCommentaire: "Ajouter un commentaire",
    connectezVousPourCommenter: "Connectez-vous pour ajouter un commentaire",
    poster: "Poster",
    pasDeCommentaires: "Aucun commentaire pour le moment",
    connexion: "Connexion",

    // Categories
    general: "Général",
    news: "Actualités",
    talk: "Discussion",
    music: "Musique",
    religious: "Religieux",
    educational: "Éducatif",
    entertainment: "Divertissement",

    // Empty States
    aucunProgramme: "Aucun programme disponible",
    aucuneActualite: "Aucune actualité disponible",
    aucunArticle: "Aucun article disponible",

    // Time
    aLInstant: "À l'instant",
    ilYa: "Il y a",
    min: "min",
    h: "h",
    j: "j",
  },
  en: {
    // Navigation & General
    accueil: "Home",
    actualites: "News",
    programmes: "Programs",
    ecouter: "Listen",
    articles: "Articles",
    seConnecter: "Login",
    tous: "All",
    musique: "Music",
    discussion: "Talk",
    religieux: "Religious",
    educational: "Educational",
    entertainment: "Entertainment",

    // Hero Section
    heroTitle: "Your Community<br>Radio",
    heroSubtitle:
      "The voice of the Uvira community. Your source for local and international information. Tune in to 107.0 MHz",
    ecouterEnDirect: "Listen Live",
    voirProgrammes: "View Programs",

    // Current Show
    enCeMoment: "Currently Playing",
    enDirect: "LIVE",

    // Sections
    dernieresActualites: "Latest News",
    programmesPopulaires: "Popular Programs",
    programmation: "Today's Schedule",

    // Buttons & Actions
    voirPlus: "Read more",
    voirTout: "View all",
    ecouter: "Listen",
    mettreEnPause: "Pause",

    // Login
    email: "Email",
    motDePasse: "Password",
    motDePasseOublie: "Forgot password?",
    creerCompte: "Create account",

    // Footer
    liensRapides: "Quick Links",
    contact: "Contact",
    telephone: "Phone",
    newsletter: "Newsletter",
    tousDroitsReserves: "All rights reserved.",
    footerText: "Your community radio in Uvira. 107.0 MHz",

    // Article/News
    retour: "Back",
    partager: "Share",
    articlesSimilaires: "Related articles",
    commentaires: "Comments",
    ajouterCommentaire: "Add a comment",
    connectezVousPourCommenter: "Login to add a comment",
    poster: "Post",
    pasDeCommentaires: "No comments yet",
    connexion: "Login",

    // Categories
    general: "General",
    news: "News",
    talk: "Talk",
    music: "Music",
    religious: "Religious",
    educational: "Educational",
    entertainment: "Entertainment",

    // Empty States
    aucunProgramme: "No programs available",
    aucuneActualite: "No news available",
    aucunArticle: "No articles available",

    // Time
    aLInstant: "Just now",
    ilYa: "",
    min: "min",
    h: "h",
    j: "d",
  },
};

// Current language (default to French)
let currentLang = "fr";

// Global state
let programs = [];
let news = [];
let articles = [];
let currentUser = null;

// DOM Elements
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");
const langButtons = document.querySelectorAll(".lang-btn");
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const navMenu = document.querySelector(".nav-menu");
const playBtns = document.querySelectorAll(
  "#playBtn, #mainPlayBtn, #currentShowPlay"
);
const radioStream = document.getElementById("radioStream");
const volumeSlider = document.getElementById("volumeSlider");
const programBtn = document.getElementById("programBtn");
const loginForm = document.getElementById("loginForm");
const filterBtns = document.querySelectorAll(".filter-btn");

// Initialize the website
async function init() {
  setupNavigation();
  setupLanguageSwitcher();
  setupAudioPlayer();
  setupEventListeners();

  await initializeFirebase();
  await Promise.all([
    loadPrograms(),
    loadNews(),
    loadArticles(),
    updateCurrentShow(),
  ]);

  // Set initial language
  updateLanguage("fr");

  // Check URL params for shared article
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("article");
  if (articleId) {
    // Wait until articles/news are loaded
    const articleExists =
      articles.find((a) => a.id == articleId) ||
      news.find((n) => n.id == articleId);
    if (articleExists) {
      showArticleDetail(articleId, "article");
    }
  }

  // Setup logo click to return to home
  setupLogoClick();
}

// Setup logo click to return to home
function setupLogoClick() {
  const logoContainer = document.querySelector(".logo-container");
  const footerLogo = document.querySelector(".footer-logo");

  if (logoContainer) {
    logoContainer.style.cursor = "pointer";
    logoContainer.addEventListener("click", function () {
      goToHomepage();
    });
  }

  if (footerLogo) {
    footerLogo.style.cursor = "pointer";
    footerLogo.addEventListener("click", function () {
      goToHomepage();
    });
  }
}

function goToHomepage() {
  // Hide article detail if open
  const articleDetailSection = document.getElementById("articleDetail");
  if (articleDetailSection) {
    articleDetailSection.classList.remove("active");
  }

  // Reset meta tags to homepage
  resetMetaTagsToHomepage();

  // Show home section
  navLinks.forEach((nav) => nav.classList.remove("active"));
  sections.forEach((section) => section.classList.remove("active"));

  document.querySelector('[data-section="accueil"]').classList.add("active");
  document.getElementById("accueil").classList.add("active");

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Update URL
  window.history.pushState({}, "", window.location.pathname);
}

// Firebase Initialization
async function initializeFirebase() {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
}

// Navigation Setup
function setupNavigation() {
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Reset meta tags when navigating away from articles
      if (!link.getAttribute("data-section").includes("article")) {
        resetMetaTagsToHomepage();
      }

      // Remove active class from all links and sections
      navLinks.forEach((nav) => nav.classList.remove("active"));
      sections.forEach((section) => section.classList.remove("active"));

      // Add active class to clicked link
      link.classList.add("active");

      // Show corresponding section
      const sectionId = link.getAttribute("data-section");
      document.getElementById(sectionId).classList.add("active");

      // Close mobile menu if open
      navMenu.classList.remove("active");
    });
  });

  // View all links
  document.querySelectorAll(".view-all[data-section]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const section = link.getAttribute("data-section");

      navLinks.forEach((nav) => nav.classList.remove("active"));
      sections.forEach((section) => section.classList.remove("active"));

      document
        .querySelector(`[data-section="${section}"]`)
        .classList.add("active");
      document.getElementById(section).classList.add("active");
    });
  });

  // Footer links
  document.querySelectorAll("footer a[data-section]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const section = link.getAttribute("data-section");

      navLinks.forEach((nav) => nav.classList.remove("active"));
      sections.forEach((section) => section.classList.remove("active"));

      document
        .querySelector(`[data-section="${section}"]`)
        .classList.add("active");
      document.getElementById(section).classList.add("active");

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Mobile menu toggle
  mobileMenuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}

// Language Switcher
function setupLanguageSwitcher() {
  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.id === "langFr" ? "fr" : "en";
      updateLanguage(lang);

      // Update active button
      langButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

function updateLanguage(lang) {
  currentLang = lang;

  // Update all elements with lang data-key
  document.querySelectorAll(".lang").forEach((element) => {
    const key = element.getAttribute("data-key");
    if (translations[lang][key]) {
      element.innerHTML = translations[lang][key];
    }
  });

  // Update page title
  document.title =
    lang === "fr"
      ? "Nguvu Za Uvira - Radio Communautaire 107.0 MHz"
      : "Nguvu Za Uvira - Community Radio 107.0 MHz";

  // Update category tags and other dynamic content
  updateCategoryTags();
  updateCurrentShow();
  updateTodaysSchedule();
}

function updateCategoryTags() {
  // Update category tags in programs
  document.querySelectorAll(".category-tag").forEach((tag) => {
    const category = tag.className.split(" ")[1]; // Get the category class
    if (category && translations[currentLang][category]) {
      tag.textContent = translations[currentLang][category];
    }
  });
}

// Audio Player Setup
function setupAudioPlayer() {
  // Set initial volume
  if (radioStream) {
    radioStream.volume = volumeSlider.value / 100;
  }

  // Volume control
  volumeSlider.addEventListener("input", () => {
    if (radioStream) {
      radioStream.volume = volumeSlider.value / 100;
    }
  });

  // Play buttons
  playBtns.forEach((btn) => {
    btn.addEventListener("click", togglePlayback);
  });

  // Program button - navigate to programs section
  if (programBtn) {
    programBtn.addEventListener("click", () => {
      navLinks.forEach((nav) => nav.classList.remove("active"));
      sections.forEach((section) => section.classList.remove("active"));

      document
        .querySelector('[data-section="programmes"]')
        .classList.add("active");
      document.getElementById("programmes").classList.add("active");
    });
  }
}

function togglePlayback() {
  if (!radioStream) return;

  if (radioStream.paused) {
    // REPLACE WITH YOUR ACTUAL RADIO STREAM URL
    radioStream.src = "https://example.com/your-radio-stream.mp3";
    radioStream
      .play()
      .then(() => {
        console.log("Radio stream started");
        updatePlayButtons(true);
      })
      .catch((error) => {
        console.error("Error playing radio stream:", error);
        alert(
          currentLang === "fr"
            ? "Impossible de se connecter au flux radio. Veuillez réessayer plus tard."
            : "Unable to connect to radio stream. Please try again later."
        );
      });
  } else {
    radioStream.pause();
    updatePlayButtons(false);
  }
}

function updatePlayButtons(isPlaying) {
  const playIcons = document.querySelectorAll(
    "#playBtn i, #mainPlayBtn i, #currentShowPlay i"
  );
  playIcons.forEach((icon) => {
    icon.className = isPlaying ? "fas fa-pause" : "fas fa-play";
  });

  // Update main play button text
  const playText = document.querySelector("#playBtn span");
  if (playText) {
    playText.textContent = isPlaying
      ? translations[currentLang].mettreEnPause
      : translations[currentLang].ecouterEnDirect;
  }
}

// Load Programs from Firebase
async function loadPrograms() {
  try {
    const db = firebase.firestore();
    const programsQuery = db.collection("radioSchedule").orderBy("startTime");

    const querySnapshot = await programsQuery.get();
    programs = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      programs.push({
        id: doc.id,
        title: data.title || (currentLang === "fr" ? "Sans titre" : "Untitled"),
        host:
          data.host ||
          (currentLang === "fr"
            ? "Animateur non spécifié"
            : "Host not specified"),
        description:
          data.description ||
          (currentLang === "fr"
            ? "Aucune description disponible."
            : "No description available."),
        category: data.category || "general",
        startTime: data.startTime || "00:00",
        endTime: data.endTime || "00:00",
        days: data.days || [],
        isFeatured: data.isFeatured || false,
        isCurrent: data.isCurrent || false,
        image: data.image || "",
      });
    });

    console.log("Programs loaded from Firebase:", programs.length);

    // Render featured programs
    renderFeaturedPrograms();

    // Render all programs
    renderAllPrograms();

    // Setup program filters
    setupProgramFilters();

    // Update current show and schedule
    updateCurrentShow();
    updateTodaysSchedule();
  } catch (error) {
    console.error("Error loading programs from Firebase:", error);
    // Fallback to mock data
    loadMockPrograms();
  }
}

function loadMockPrograms() {
  programs = [
    {
      id: 1,
      title: currentLang === "fr" ? "Morning Vibes" : "Morning Vibes",
      host: "DJ Fortune",
      description:
        currentLang === "fr"
          ? "Commencez votre journée avec de la bonne musique et des nouvelles fraîches."
          : "Start your day with great music and fresh news.",
      category: "music",
      startTime: "06:00",
      endTime: "09:00",
      days: ["lundi", "mardi", "mercredi", "jeudi", "vendredi"],
      isFeatured: true,
      isCurrent: false,
      image: "",
    },
    {
      id: 2,
      title: currentLang === "fr" ? "Le Débat du Jour" : "Today's Debate",
      host: "Marie K.",
      description:
        currentLang === "fr"
          ? "Discussion sur les sujets d'actualité qui préoccupent notre communauté."
          : "Discussion on current issues that concern our community.",
      category: "talk",
      startTime: "10:00",
      endTime: "11:30",
      days: ["lundi", "mercredi", "vendredi"],
      isFeatured: true,
      isCurrent: false,
      image: "",
    },
  ];

  renderFeaturedPrograms();
  renderAllPrograms();
  setupProgramFilters();
}

function renderFeaturedPrograms() {
  const featuredContainer = document.getElementById("featuredPrograms");
  if (!featuredContainer) return;

  const featuredPrograms = programs.filter((p) => p.isFeatured).slice(0, 3);

  if (featuredPrograms.length === 0) {
    featuredContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-broadcast-tower"></i>
                <p>${translations[currentLang].aucunProgramme}</p>
            </div>
        `;
    return;
  }

  featuredContainer.innerHTML = featuredPrograms
    .map(
      (program) => `
        <div class="program-card">
            <div class="program-image">
                ${
                  program.image
                    ? `<img src="${program.image}" alt="${program.title}" style="width:100%;height:100%;object-fit:cover;">`
                    : `<i class="fas fa-broadcast-tower"></i>`
                }
            </div>
            <div class="program-content">
                <h4 class="program-title">${program.title}</h4>
                <div class="program-meta">
                    <span><i class="fas fa-user"></i> ${program.host}</span>
                    <span><i class="fas fa-clock"></i> ${formatTime24ToDisplay(
                      program.startTime
                    )} - ${formatTime24ToDisplay(program.endTime)}</span>
                </div>
                <p class="program-description">${program.description}</p>
                <div class="program-days">
                    ${program.days
                      .map(
                        (day) =>
                          `<span class="day-tag">${getDayName(
                            day,
                            currentLang
                          )}</span>`
                      )
                      .join("")}
                </div>
                <button class="btn-small" onclick="playProgram('${
                  program.id
                }')">
                    <i class="fas fa-play"></i> 
                    ${translations[currentLang].ecouter}
                </button>
            </div>
        </div>
    `
    )
    .join("");
}

function getDayName(day, lang) {
  const days = {
    fr: {
      lundi: "Lundi",
      mardi: "Mardi",
      mercredi: "Mercredi",
      jeudi: "Jeudi",
      vendredi: "Vendredi",
      samedi: "Samedi",
      dimanche: "Dimanche",
    },
    en: {
      lundi: "Monday",
      mardi: "Tuesday",
      mercredi: "Wednesday",
      jeudi: "Thursday",
      vendredi: "Friday",
      samedi: "Saturday",
      dimanche: "Sunday",
    },
  };
  return days[lang][day] || day;
}

function renderAllPrograms() {
  const programsContainer = document.getElementById("programsList");
  if (!programsContainer) return;

  if (programs.length === 0) {
    programsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-broadcast-tower"></i>
                <p>${translations[currentLang].aucunProgramme}</p>
            </div>
        `;
    return;
  }

  programsContainer.innerHTML = programs
    .map(
      (program) => `
        <div class="program-card" data-category="${program.category}">
            <div class="program-image">
                ${
                  program.image
                    ? `<img src="${program.image}" alt="${program.title}" style="width:100%;height:100%;object-fit:cover;">`
                    : `<i class="fas fa-broadcast-tower"></i>`
                }
            </div>
            <div class="program-content">
                <h4 class="program-title">${program.title}</h4>
                <div class="program-meta">
                    <span><i class="fas fa-user"></i> ${program.host}</span>
                    <span><i class="fas fa-clock"></i> ${formatTime24ToDisplay(
                      program.startTime
                    )} - ${formatTime24ToDisplay(program.endTime)}</span>
                    <span><i class="fas fa-calendar"></i> ${(program.days || [])
                      .map((d) => getDayName(d, currentLang))
                      .join(", ")}</span>
                </div>
                <p class="program-description">${program.description}</p>
                <div class="program-category">
                    <span class="category-tag ${
                      program.category
                    }">${getCategoryLabel(program.category)}</span>
                </div>
                <button class="btn-small" onclick="playProgram('${
                  program.id
                }')">
                    <i class="fas fa-play"></i> 
                    ${translations[currentLang].ecouter}
                </button>
            </div>
        </div>
    `
    )
    .join("");
}

function setupProgramFilters() {
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active filter button
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Filter programs
      const filter = btn.getAttribute("data-filter");
      const programCards = document.querySelectorAll(".program-card");

      programCards.forEach((card) => {
        if (filter === "all" || card.getAttribute("data-category") === filter) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// Load News from Firebase
async function loadNews() {
  try {
    const db = firebase.firestore();
    const newsQuery = db
      .collection("news")
      .orderBy("createdAt", "desc")
      .limit(6); // Only load 6 latest news for homepage

    const querySnapshot = await newsQuery.get();
    news = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Handle both single image and multiple images format
      let imageUrl = "";
      if (data.images && data.images.length > 0) {
        imageUrl = data.images[0]; // Use first image
      } else if (data.image) {
        imageUrl = data.image; // Fallback to single image
      }

      news.push({
        id: doc.id,
        title: data.title || (currentLang === "fr" ? "Sans titre" : "Untitled"),
        content: data.content || "",
        excerpt: data.content
          ? data.content.substring(0, 150) + "..."
          : currentLang === "fr"
          ? "Aucun contenu"
          : "No content",
        image: imageUrl,
        images: data.images || [],
        createdAt: data.createdAt || new Date(),
        likes: data.likes || 0,
        comments: data.comments || 0,
        author:
          data.author ||
          (currentLang === "fr" ? "Équipe éditoriale" : "Editorial team"),
        category:
          data.category || (currentLang === "fr" ? "Actualités" : "News"),
        readTime: data.readTime || "5 min",
      });
    });

    console.log("News loaded from Firebase:", news.length);

    // Render latest news on homepage
    renderLatestNews();

    // Render all news in news section
    renderAllNews();
  } catch (error) {
    console.error("Error loading news from Firebase:", error);
    // Fallback to mock data
    loadMockNews();
  }
}

function loadMockNews() {
  news = [
    {
      id: 1,
      title:
        currentLang === "fr"
          ? "Nouveau programme éducatif pour les jeunes"
          : "New educational program for youth",
      content:
        currentLang === "fr"
          ? "La radio lance un nouveau programme dédié à l'éducation des jeunes sur les enjeux communautaires. Ce programme vise à sensibiliser la jeunesse aux défis actuels et à promouvoir l'engagement citoyen."
          : "The radio is launching a new program dedicated to youth education on community issues. This program aims to raise awareness among young people about current challenges and promote civic engagement.",
      excerpt:
        currentLang === "fr"
          ? "La radio lance un nouveau programme dédié à l'éducation des jeunes sur les enjeux communautaires..."
          : "The radio is launching a new program dedicated to youth education on community issues...",
      image: null,
      images: [],
      createdAt: new Date(),
      likes: 5,
      comments: 2,
      author: currentLang === "fr" ? "Équipe éditoriale" : "Editorial team",
      category: currentLang === "fr" ? "Actualités" : "News",
      readTime: "3 min",
    },
  ];

  renderLatestNews();
  renderAllNews();
}

function renderLatestNews() {
  const latestNewsContainer = document.getElementById("latestNews");
  if (!latestNewsContainer) return;

  const latestNews = news.slice(0, 3);

  if (latestNews.length === 0) {
    latestNewsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-newspaper"></i>
                <p>${translations[currentLang].aucuneActualite}</p>
            </div>
        `;
    return;
  }

  latestNewsContainer.innerHTML = latestNews
    .map(
      (item) => `
        <div class="news-card">
            <div class="news-image">
                ${
                  item.image
                    ? `<img src="${fixImageUrl(item.image)}" alt="${
                        item.title
                      }" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
                    : ""
                }
                <div class="news-image-placeholder" style="${
                  item.image ? "display:none;" : ""
                }">
                    <i class="fas fa-newspaper"></i>
                </div>
            </div>
            <div class="news-content">
                <h4 class="news-title">${item.title}</h4>
                <p class="news-excerpt">${item.excerpt}</p>
                <div class="news-meta">
                    <span><i class="far fa-calendar"></i> ${formatTimeAgo(
                      item.createdAt
                    )}</span>
                    <a href="#" onclick="showArticleDetail('${
                      item.id
                    }', 'news')">${translations[currentLang].voirPlus}</a>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

function renderAllNews() {
  const newsContainer = document.getElementById("newsContainer");
  if (!newsContainer) return;

  if (news.length === 0) {
    newsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-newspaper"></i>
                <p>${translations[currentLang].aucuneActualite}</p>
            </div>
        `;
    return;
  }

  newsContainer.innerHTML = news
    .map(
      (item) => `
        <div class="news-card">
            <div class="news-image">
                ${
                  item.image
                    ? `<img src="${fixImageUrl(item.image)}" alt="${
                        item.title
                      }" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
                    : ""
                }
                <div class="news-image-placeholder" style="${
                  item.image ? "display:none;" : ""
                }">
                    <i class="fas fa-newspaper"></i>
                </div>
            </div>
            <div class="news-content">
                <h4 class="news-title">${item.title}</h4>
                <p class="news-excerpt">${item.excerpt}</p>
                <div class="news-meta">
                    <span><i class="far fa-calendar"></i> ${formatTimeAgo(
                      item.createdAt
                    )}</span>
                    <span><i class="far fa-heart"></i> ${item.likes}</span>
                    <span><i class="far fa-comment"></i> ${item.comments}</span>
                    <a href="#" onclick="showArticleDetail('${
                      item.id
                    }', 'news')">${translations[currentLang].voirPlus}</a>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

// Load Articles from Firebase (using news collection for now)
async function loadArticles() {
  try {
    const db = firebase.firestore();
    const articlesQuery = db.collection("news").orderBy("createdAt", "desc");

    const querySnapshot = await articlesQuery.get();
    articles = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Handle both single image and multiple images format
      let imageUrl = "";
      if (data.images && data.images.length > 0) {
        imageUrl = data.images[0]; // Use first image
      } else if (data.image) {
        imageUrl = data.image; // Fallback to single image
      }

      articles.push({
        id: doc.id,
        title: data.title || (currentLang === "fr" ? "Sans titre" : "Untitled"),
        content: data.content || "",
        excerpt: data.content
          ? data.content.substring(0, 200) + "..."
          : currentLang === "fr"
          ? "Aucun contenu"
          : "No content",
        image: imageUrl,
        images: data.images || [],
        createdAt: data.createdAt || new Date(),
        author:
          data.author ||
          (currentLang === "fr" ? "Équipe éditoriale" : "Editorial team"),
        category:
          data.category || (currentLang === "fr" ? "Général" : "General"),
        readTime: data.readTime || "5 min",
        likes: data.likes || 0,
        comments: data.comments || 0,
      });
    });

    console.log("Articles loaded from Firebase:", articles.length);

    // Render articles
    renderArticles();
  } catch (error) {
    console.error("Error loading articles from Firebase:", error);
    // Fallback to mock data
    loadMockArticles();
  }
}

function loadMockArticles() {
  articles = [
    {
      id: 1,
      title:
        currentLang === "fr"
          ? "L'impact des radios communautaires dans le développement local"
          : "The Impact of Community Radio in Local Development",
      content:
        currentLang === "fr"
          ? "Les radios communautaires jouent un rôle crucial dans le développement des régions rurales. À Uvira, Nguvu Za Uvira Radio sert de plateforme essentielle pour l'éducation, l'information et le divertissement. Notre analyse explore comment les médias locaux contribuent à renforcer la cohésion sociale et à promouvoir le développement durable.\n\nDans un contexte où l'accès à l'information reste limité, la radio demeure le média le plus accessible pour les populations rurales. Elle permet de diffuser des connaissances essentielles en matière de santé, d'agriculture, d'éducation et de droits civiques."
          : "Community radios play a crucial role in the development of rural regions. In Uvira, Nguvu Za Uvira Radio serves as an essential platform for education, information, and entertainment. Our analysis explores how local media contributes to strengthening social cohesion and promoting sustainable development.\n\nIn a context where access to information remains limited, radio remains the most accessible medium for rural populations. It allows for the dissemination of essential knowledge in health, agriculture, education, and civil rights.",
      excerpt:
        currentLang === "fr"
          ? "Les radios communautaires jouent un rôle crucial dans le développement des régions rurales. À Uvira, Nguvu Za Uvira Radio sert de plateforme essentielle pour l'éducation, l'information et le divertissement..."
          : "Community radios play a crucial role in the development of rural regions. In Uvira, Nguvu Za Uvira Radio serves as an essential platform for education, information, and entertainment...",
      image: null,
      images: [],
      createdAt: new Date(),
      author: "Dr. Samuel K.",
      category: currentLang === "fr" ? "Développement" : "Development",
      readTime: "8 min",
      likes: 15,
      comments: 3,
    },
    {
      id: 2,
      title:
        currentLang === "fr"
          ? "L'éducation par les ondes : une révolution en RDC"
          : "Education Through Radio Waves: A Revolution in DRC",
      content:
        currentLang === "fr"
          ? "Dans les régions où l'accès à l'éducation formelle est limité, la radio devient un outil pédagogique puissant. Notre article examine comment Nguvu Za Uvira utilise la diffusion radio pour éduquer les populations sur la santé, l'agriculture et les droits civiques.\n\nLes programmes éducatifs diffusés touchent des milliers d'auditeurs chaque jour, contribuant à l'alphabétisation et au développement des compétences pratiques."
          : "In regions where access to formal education is limited, radio becomes a powerful educational tool. Our article examines how Nguvu Za Uvira uses radio broadcasting to educate populations about health, agriculture, and civil rights.\n\nThe educational programs broadcast reach thousands of listeners every day, contributing to literacy and the development of practical skills.",
      excerpt:
        currentLang === "fr"
          ? "Dans les régions où l'accès à l'éducation formelle est limité, la radio devient un outil pédagogique puissant. Notre article examine comment Nguvu Za Uvira utilise la diffusion radio pour éduquer les populations..."
          : "In regions where access to formal education is limited, radio becomes a powerful educational tool. Our article examines how Nguvu Za Uvira uses radio broadcasting to educate populations...",
      image: null,
      images: [],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      author: "Marie B.",
      category: currentLang === "fr" ? "Éducation" : "Education",
      readTime: "6 min",
      likes: 8,
      comments: 1,
    },
  ];

  renderArticles();
}

function renderArticles() {
  const articlesContainer = document.getElementById("articlesContainer");
  if (!articlesContainer) return;

  if (articles.length === 0) {
    articlesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <p>${translations[currentLang].aucunArticle}</p>
            </div>
        `;
    return;
  }

  articlesContainer.innerHTML = articles
    .map(
      (article) => `
        <div class="article-item" onclick="showArticleDetail('${
          article.id
        }', 'article')">
            <div class="article-header">
                <div class="article-image">
                    ${
                      article.image
                        ? `<img src="${fixImageUrl(article.image)}" alt="${
                            article.title
                          }">`
                        : `<i class="fas fa-file-alt"></i>`
                    }
                </div>
                <div class="article-title-content">
                    <h4 class="article-title">${article.title}</h4>
                    <div class="article-meta">
                        <span><i class="far fa-calendar"></i> ${formatTimeAgo(
                          article.createdAt
                        )}</span>
                        <span><i class="fas fa-user"></i> ${
                          article.author
                        }</span>
                        <span><i class="fas fa-tag"></i> ${
                          article.category
                        }</span>
                        <span><i class="fas fa-clock"></i> ${
                          article.readTime
                        }</span>
                    </div>
                    <p class="article-excerpt">${article.excerpt}</p>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

// Show Article Detail Page (replaces modal)
window.showArticleDetail = function (id, type) {
  const item =
    type === "news"
      ? news.find((n) => n.id === id)
      : articles.find((a) => a.id === id);

  if (!item) return;

  // Update social media meta tags for this article
  updateMetaTagsForArticle(item);

  // Hide all sections
  sections.forEach((section) => section.classList.remove("active"));

  // Create or show article detail section
  let articleDetailSection = document.getElementById("articleDetail");
  if (!articleDetailSection) {
    articleDetailSection = document.createElement("section");
    articleDetailSection.id = "articleDetail";
    articleDetailSection.className = "section active";
    document.querySelector("main").appendChild(articleDetailSection);
  } else {
    articleDetailSection.classList.add("active");
  }

  // Populate article detail content
  articleDetailSection.innerHTML = `
    <div class="container">
      <div class="article-detail-header">
        <button class="back-btn" onclick="goBackToArticles()">
          <i class="fas fa-arrow-left"></i>
          <span class="lang" data-key="retour">${
            translations[currentLang].retour
          }</span>
        </button>
        <div class="article-breadcrumb">
          <a href="#" onclick="goToSection('${
            type === "news" ? "actualites" : "articles"
          }')">${
    type === "news"
      ? translations[currentLang].actualites
      : translations[currentLang].articles
  }</a>
          <i class="fas fa-chevron-right"></i>
          <span>${item.title}</span>
        </div>
      </div>
      
      <article class="article-detail-content">
        <header class="article-header">
          <h1 class="article-detail-title">${item.title}</h1>
          <div class="article-meta-large">
            <span><i class="far fa-calendar"></i> ${formatDetailedDate(
              item.createdAt
            )}</span>
            <span><i class="fas fa-user"></i> ${
              item.author ||
              (currentLang === "fr" ? "Équipe éditoriale" : "Editorial team")
            }</span>
            <span><i class="fas fa-tag"></i> ${
              item.category || (currentLang === "fr" ? "Général" : "General")
            }</span>
            <span><i class="fas fa-clock"></i> ${
              item.readTime || "5 min"
            }</span>
          </div>
        </header>

        ${
          item.image || (item.images && item.images.length > 0)
            ? `
          <div class="article-hero-image">
            <img src="${fixImageUrl(
              item.images && item.images.length > 0
                ? item.images[0]
                : item.image
            )}" alt="${item.title}">
          </div>
        `
            : ""
        }

        ${
          item.images && item.images.length > 1
            ? `
          <div class="article-gallery">
            ${item.images
              .slice(1)
              .map(
                (img, index) => `
              <div class="gallery-item">
                <img src="${fixImageUrl(img)}" alt="${item.title} - Image ${
                  index + 2
                }">
              </div>
            `
              )
              .join("")}
          </div>
        `
            : ""
        }

        <div class="article-body">
          ${item.content
            .split("\n")
            .map(
              (paragraph) => `
            <p>${paragraph}</p>
          `
            )
            .join("")}
        </div>

        <footer class="article-footer">
          <div class="article-actions">
            <button class="share-btn" onclick="shareArticle('${item.id}')">
                <i class="fas fa-share-alt"></i>
                <span class="lang" data-key="partager">${
                  translations[currentLang].partager
                }</span>
            </button>
            <button class="like-btn" onclick="likeArticle('${item.id}')">
                <i class="far fa-heart"></i>
                <span>${item.likes || 0}</span>
            </button>
            </div>

            <!-- Social Sharing Buttons -->
            <div class="social-share">
            <a href="#" class="social-share-btn facebook" onclick="shareOnFacebook('${
              item.id
            }')">
                <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="social-share-btn twitter" onclick="shareOnTwitter('${
              item.id
            }')">
                <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-share-btn linkedin" onclick="shareOnLinkedIn('${
              item.id
            }')">
                <i class="fab fa-linkedin-in"></i>
            </a>
</div>
        </footer>
      </article>

      <!-- Comments Section -->
      <div class="comments-section">
        <h3 class="lang" data-key="commentaires">${
          translations[currentLang].commentaires
        }</h3>
        
        ${
          currentUser
            ? `
          <div class="comment-form">
            <textarea placeholder="${translations[currentLang].ajouterCommentaire}..." rows="4"></textarea>
            <button class="btn-primary">
              <span class="lang" data-key="poster">${translations[currentLang].poster}</span>
            </button>
          </div>
        `
            : `
          <div class="login-prompt">
            <p>${translations[currentLang].connectezVousPourCommenter}</p>
            <button class="btn-primary" onclick="goToSection('login')">
              <span class="lang" data-key="connexion">${translations[currentLang].connexion}</span>
            </button>
          </div>
        `
        }

        <div class="comments-list">
          <div class="empty-comments">
            <i class="far fa-comments"></i>
            <p>${translations[currentLang].pasDeCommentaires}</p>
          </div>
        </div>
      </div>

      ${
        getRelatedArticles(item).length > 0
          ? `
        <div class="related-articles">
          <h3 class="lang" data-key="articlesSimilaires">${
            translations[currentLang].articlesSimilaires
          }</h3>
          <div class="related-grid">
            ${getRelatedArticles(item)
              .map(
                (related) => `
              <div class="related-card" onclick="showArticleDetail('${
                related.id
              }', 'article')">
                ${
                  related.image
                    ? `
                  <div class="related-image">
                    <img src="${fixImageUrl(related.image)}" alt="${
                        related.title
                      }">
                  </div>
                `
                    : ""
                }
                <div class="related-content">
                  <h4>${related.title}</h4>
                  <p>${related.excerpt}</p>
                  <div class="related-meta">
                    <span>${formatTimeAgo(related.createdAt)}</span>
                  </div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
          : ""
      }
    </div>
  `;

  // Setup clickable images
  setTimeout(() => {
    setupArticleImages();
  }, 100);

  // Update navigation
  navLinks.forEach((nav) => nav.classList.remove("active"));

  // Update URL for sharing (without page reload)
  const newUrl = `${window.location.origin}${window.location.pathname}?article=${id}`;
  window.history.pushState({ articleId: id }, "", newUrl);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Navigation functions
window.goBackToArticles = function () {
  const articleDetailSection = document.getElementById("articleDetail");
  if (articleDetailSection) {
    articleDetailSection.classList.remove("active");
  }

  // Reset meta tags to homepage
  resetMetaTagsToHomepage();

  // Show the articles section by default
  document.getElementById("articles").classList.add("active");
  document.querySelector('[data-section="articles"]').classList.add("active");

  // Update URL
  window.history.pushState({}, "", window.location.pathname);
};

window.goToSection = function (sectionId) {
  // Hide article detail
  const articleDetailSection = document.getElementById("articleDetail");
  if (articleDetailSection) {
    articleDetailSection.classList.remove("active");
  }

  // Reset meta tags to homepage
  resetMetaTagsToHomepage();

  // Show requested section
  navLinks.forEach((nav) => nav.classList.remove("active"));
  sections.forEach((section) => section.classList.remove("active"));

  document
    .querySelector(`[data-section="${sectionId}"]`)
    .classList.add("active");
  document.getElementById(sectionId).classList.add("active");
};

// Helper functions
function getRelatedArticles(currentArticle) {
  return articles
    .filter(
      (article) =>
        article.id !== currentArticle.id &&
        article.category === currentArticle.category
    )
    .slice(0, 3);
}

window.shareArticle = function (articleId) {
  const article =
    articles.find((a) => a.id === articleId) ||
    news.find((n) => n.id === articleId);
  if (!article) return;

  // Use the new Netlify function URL
  const shareUrl = `https://nguvuza-uvira.com/articles/article-${articleId}.html`;
  const shareText = `${article.title} - Nguvu Za Uvira Radio`;

  if (navigator.share) {
    navigator.share({
      title: shareText,
      text: article.excerpt,
      url: shareUrl,
    });
  } else {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert(
        currentLang === "fr"
          ? "Lien copié dans le presse-papier!"
          : "Link copied to clipboard!"
      );
    });
  }
};

// Update all social sharing functions similarly
window.shareOnFacebook = function (articleId) {
  const shareUrl = `https://nguvuza-uvira.com/articles/article-${articleId}.html`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;
  window.open(facebookUrl, "_blank", "width=600,height=400");
};

window.shareOnTwitter = function (articleId) {
  const article =
    articles.find((a) => a.id === articleId) ||
    news.find((n) => n.id === articleId);
  const shareUrl = `https://nguvuza-uvira.com/articles/article-${articleId}.html`;
  const text = encodeURIComponent(article?.title || "");
  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(
    shareUrl
  )}`;
  window.open(twitterUrl, "_blank", "width=600,height=400");
};

window.likeArticle = function (articleId) {
  // Implement like functionality
  console.log("Liking article:", articleId);
};

// Handle browser back/forward buttons
window.addEventListener("popstate", (event) => {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("article");

  if (articleId) {
    showArticleDetail(articleId, "article");
  } else {
    goBackToArticles();
  }
});

// Make article images clickable & downloadable
function setupArticleImages() {
  document
    .querySelectorAll(".article-body img, .article-content img")
    .forEach((img) => {
      // Skip if already wrapped in a link
      if (img.parentNode.tagName.toLowerCase() === "a") return;

      // Create download link
      const link = document.createElement("a");
      link.href = img.src;
      link.target = "_blank";
      link.download = ""; // This enables download
      link.title =
        currentLang === "fr"
          ? "Cliquer pour voir en taille réelle ou télécharger"
          : "Click to view full size or download";
      link.style.cursor = "zoom-in";

      // Wrap the image with the link
      img.parentNode.insertBefore(link, img);
      link.appendChild(img);

      // Add hover effect
      img.style.transition = "transform 0.3s ease";
      link.addEventListener("mouseenter", () => {
        img.style.transform = "scale(1.02)";
      });
      link.addEventListener("mouseleave", () => {
        img.style.transform = "scale(1)";
      });
    });
}

function updateMetaTagsForArticle(article) {
  if (!article) return;

  const baseUrl = "https://nguvuza-uvira.com";
  const articleUrl = `${baseUrl}?article=${article.id}`;

  // Improved image selection with fallbacks
  let articleImage = "";

  // Priority 1: First image from images array
  if (article.images && article.images.length > 0) {
    articleImage = fixImageUrl(article.images[0]);
  }

  // Priority 2: Single image property
  if (!articleImage && article.image) {
    articleImage = fixImageUrl(article.image);
  }

  // Priority 3: Website default OG image
  if (!articleImage) {
    articleImage = `${baseUrl}/images/og-thumbnail.jpg`;
  }

  const articleDescription =
    article.excerpt ||
    (article.content
      ? article.content.substring(0, 160) + "..."
      : currentLang === "fr"
      ? "Découvrez cet article sur Nguvu Za Uvira Radio"
      : "Discover this article on Nguvu Za Uvira Radio");

  // Update all required meta tags
  const metaTags = {
    "og:title": article.title,
    "og:description": articleDescription,
    "og:image": articleImage,
    "og:url": articleUrl,
    "og:type": "article",
    "og:image:width": "1200",
    "og:image:height": "630",

    "twitter:title": article.title,
    "twitter:description": articleDescription,
    "twitter:image": articleImage,
    "twitter:card": "summary_large_image",
    "twitter:site": "@nguvuza_uvira",
  };

  // Update each meta tag
  Object.entries(metaTags).forEach(([property, content]) => {
    updateMetaTag(property, content);
  });

  // Update canonical link
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.href = articleUrl;
  }

  // Update page title
  document.title = `${article.title} - Nguvu Za Uvira Radio`;

  console.log("Updated meta tags for article:", {
    title: article.title,
    image: articleImage,
    url: articleUrl,
  });
}

function updateMetaTag(property, content) {
  let metaTag =
    document.querySelector(`meta[property="${property}"]`) ||
    document.querySelector(`meta[name="${property}"]`);

  if (!metaTag) {
    metaTag = document.createElement("meta");
    if (property.startsWith("og:") || property.startsWith("twitter:")) {
      metaTag.setAttribute("property", property);
    } else {
      metaTag.setAttribute("name", property);
    }
    document.head.appendChild(metaTag);
  }

  metaTag.setAttribute("content", content);
}

// Reset meta tags to homepage defaults
function resetMetaTagsToHomepage() {
  const baseUrl = "https://nguvuza-uvira.com";
  const title =
    currentLang === "fr"
      ? "Nguvu Za Uvira — Radio Communautaire 107.0 MHz"
      : "Nguvu Za Uvira — Community Radio 107.0 MHz";
  const description =
    currentLang === "fr"
      ? "Découvrez Nguvu Za Uvira, la radio communautaire 107.0 MHz d'Uvira. Écoutez nos programmes, actualités locales et articles culturels en direct."
      : "Discover Nguvu Za Uvira, the community radio 107.0 MHz in Uvira. Listen to our programs, local news and cultural articles live.";

  updateMetaTag("og:title", title);
  updateMetaTag("og:description", description);
  updateMetaTag("og:image", `${baseUrl}/assets/images/og-thumbnail.jpg`);
  updateMetaTag("og:url", baseUrl);
  updateMetaTag("og:type", "website");

  updateMetaTag("twitter:title", title);
  updateMetaTag("twitter:description", description);
  updateMetaTag("twitter:image", `${baseUrl}/assets/images/og-thumbnail.jpg`);
  updateMetaTag("twitter:card", "summary_large_image");

  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.href = baseUrl;
  }

  document.title = title;
}

// Utility Functions
function formatTime24ToDisplay(time24) {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return translations[currentLang].aLInstant;

  try {
    let date;
    if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return translations[currentLang].aLInstant;
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${translations[currentLang].ilYa} ${minutes} ${translations[currentLang].min}`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${translations[currentLang].ilYa} ${hours} ${translations[currentLang].h}`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${translations[currentLang].ilYa} ${days} ${translations[currentLang].j}`;
    }

    return date.toLocaleDateString(currentLang === "fr" ? "fr-FR" : "en-US", {
      day: "numeric",
      month: "short",
    });
  } catch (error) {
    return translations[currentLang].aLInstant;
  }
}

function formatDetailedDate(timestamp) {
  if (!timestamp) return "";

  try {
    let date;
    if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }

    return date.toLocaleDateString(currentLang === "fr" ? "fr-FR" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    return "";
  }
}

function fixImageUrl(url) {
  if (!url) return "";

  let fixedUrl = url.trim();

  // Ensure absolute URLs for social media crawlers
  if (fixedUrl.startsWith("/")) {
    fixedUrl = `https://nguvuza-uvira.com${fixedUrl}`;
  }

  // Handle external image services (like imgbb)
  if (fixedUrl.includes("ibb.co")) {
    // Ensure proper formatting for imgbb URLs
    fixedUrl = fixedUrl.replace(/\/$/, ""); // Remove trailing slashes
    if (!fixedUrl.startsWith("https://")) {
      fixedUrl = `https://${fixedUrl}`;
    }
  }

  // Ensure URL is properly encoded
  try {
    const urlObj = new URL(fixedUrl);
    return urlObj.href;
  } catch (e) {
    console.warn("Invalid image URL:", fixedUrl);
    return "";
  }
}

function getCategoryLabel(category) {
  return translations[currentLang][category] || category;
}

// Update Current Show
async function updateCurrentShow() {
  try {
    const currentDay = new Date()
      .toLocaleString("fr-fr", { weekday: "long" })
      .toLowerCase();
    const currentTime = getCurrentTime();

    const currentShow = programs.find((program) => {
      if (!program.days || !program.days.includes(currentDay)) return false;
      return program.startTime <= currentTime && program.endTime > currentTime;
    });

    if (currentShow) {
      document.getElementById("currentShowTitle").textContent =
        currentShow.title;
      document.getElementById("currentShowHost").textContent = currentShow.host;
      document.getElementById(
        "currentShowTime"
      ).textContent = `${formatTime24ToDisplay(
        currentShow.startTime
      )} - ${formatTime24ToDisplay(currentShow.endTime)}`;

      // Update now playing in the player
      document.getElementById("nowPlayingTitle").textContent =
        currentShow.title;
      document.getElementById(
        "nowPlayingShow"
      ).textContent = `${currentShow.host} - 107.0 MHz`;
    } else {
      document.getElementById("currentShowTitle").textContent =
        currentLang === "fr" ? "Programme régulier" : "Regular Program";
      document.getElementById("currentShowHost").textContent = "Nguvu Za Uvira";
      document.getElementById("currentShowTime").textContent =
        currentLang === "fr"
          ? "Musique et informations"
          : "Music and information";

      document.getElementById("nowPlayingTitle").textContent =
        "Nguvu Za Uvira Radio";
      document.getElementById("nowPlayingShow").textContent =
        currentLang === "fr" ? "En direct - 107.0 MHz" : "Live - 107.0 MHz";
    }
  } catch (error) {
    console.error("Error updating current show:", error);
  }
}

function updateTodaysSchedule() {
  const currentDay = new Date()
    .toLocaleString("fr-fr", { weekday: "long" })
    .toLowerCase();
  const todaysPrograms = programs
    .filter((program) => program.days && program.days.includes(currentDay))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const scheduleContainer = document.getElementById("todaySchedule");
  if (!scheduleContainer) return;

  if (todaysPrograms.length === 0) {
    scheduleContainer.innerHTML = `
            <div class="empty-schedule">
                <p>${
                  currentLang === "fr"
                    ? "Aucun programme aujourd'hui"
                    : "No programs today"
                }</p>
            </div>
        `;
    return;
  }

  scheduleContainer.innerHTML = todaysPrograms
    .map(
      (program) => `
        <div class="schedule-item">
            <span class="schedule-time">${formatTime24ToDisplay(
              program.startTime
            )}</span>
            <span class="schedule-title">${program.title}</span>
        </div>
    `
    )
    .join("");
}

// Social Sharing Functions
window.shareOnFacebook = function (articleId) {
  const shareUrl = `https://nguvuza-uvira.com/articles/article-${articleId}.html`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;
  window.open(facebookUrl, "_blank", "width=600,height=400");
};

window.shareOnTwitter = function (articleId) {
  const article =
    articles.find((a) => a.id === articleId) ||
    news.find((n) => n.id === articleId);
  const shareUrl = `https://nguvuza-uvira.com/articles/article-${articleId}.html`;
  const text = encodeURIComponent(article?.title || "");
  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(
    shareUrl
  )}`;
  window.open(twitterUrl, "_blank", "width=600,height=400");
};

window.shareOnTwitter = function (articleId) {
  const article =
    articles.find((a) => a.id === articleId) ||
    news.find((n) => n.id === articleId);
  if (!article) return;

  const shareUrl = `${window.location.origin}${window.location.pathname}?article=${articleId}`;
  const text = encodeURIComponent(article.title);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(
    shareUrl
  )}`;
  window.open(twitterUrl, "_blank", "width=600,height=400");
};

window.shareOnLinkedIn = function (articleId) {
  const article =
    articles.find((a) => a.id === articleId) ||
    news.find((n) => n.id === articleId);
  if (!article) return;

  const shareUrl = `${window.location.origin}${window.location.pathname}?article=${articleId}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl
  )}`;
  window.open(linkedinUrl, "_blank", "width=600,height=400");
};

// Global functions for HTML onclick events
window.playProgram = function (programId) {
  const program = programs.find((p) => p.id === programId);
  if (program) {
    alert(
      `${currentLang === "fr" ? "Lecture de" : "Playing"} ${program.title}`
    );
    // Implement actual program playback logic here
  }
};

// Login Form Handler
function setupEventListeners() {
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // In a real implementation, you would authenticate with Firebase
      // For now, we'll just show an alert
      alert(
        currentLang === "fr"
          ? "Fonction de connexion à implémenter"
          : "Login function to be implemented"
      );

      // Reset form
      loginForm.reset();
    });
  }
}

// Initialize the website when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
