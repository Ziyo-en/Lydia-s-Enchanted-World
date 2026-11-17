document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // -----------------------------
  // BASIC SETTINGS
  // -----------------------------

  const STORAGE_KEY = "lydia_fairytale_v1";

  let savedData = {};

  try {
    savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    savedData = {};
  }

  const state = {
    achievements: savedData.achievements || [],
    diary: Array.isArray(savedData.diary) ? savedData.diary : [],
    bunnyClicks: 0,
    quizCompleted: false,
    openedLetters: []
  };

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        achievements: state.achievements,
        diary: state.diary
      }));
    } catch {
      showToast("Your browser could not save this yet 💗");
    }
  }

  // -----------------------------
  // TOAST NOTIFICATIONS
  // -----------------------------

  let toastTimer;

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }

  // -----------------------------
  // MOBILE NAVIGATION
  // -----------------------------

  const menuToggle = $("#menuToggle");
  const navigation = $("#navigation");

  menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });

  // -----------------------------
  // DINO KINGDOM
  // -----------------------------

  const dinoMessages = [
    "Lydia.exe has stopped working. Too much cuteness detected.",
    "Excuse me, who allowed you to be this adorable?",
    "I ate your homework. You're welcome.",
    "Breaking news: A suspiciously cute creature has entered the kingdom.",
    "My tiny dinosaur brain has only two thoughts: snacks and you.",
    "I am 97% dinosaur and 3% professional princess.",
    "Your brain has 47 tabs open. One of them is probably a dinosaur.",
    "Roar means hello. I am very sophisticated.",
    "I would challenge a dragon for your last cookie.",
    "Attention! A legendary human has appeared!",
    "You're so cool that even my fossils are blushing.",
    "I tried to be normal today. It was absolutely terrible."
  ];

  let lastDinoMessage = -1;

  $("#dinoButton").addEventListener("click", () => {
    let index;

    do {
      index = Math.floor(Math.random() * dinoMessages.length);
    } while (index === lastDinoMessage);

    lastDinoMessage = index;

    $("#dinoSpeech").textContent = dinoMessages[index];
    $("#dinoCharacter").textContent =
      Math.random() > 0.5 ? "🦖" : "🦕";

    unlockAchievement("achDino", "Dino Friend");
  });

  // -----------------------------
  // BUNNY GAME
  // -----------------------------

  const bunny = $("#bunnyTarget");
  const bunnyStage = $("#bunnyStage");
  const bunnyMessage = $("#bunnyMessage");

  const bunnyMessages = [
    "Hehe! Too slow! 🐰",
    "You almost got me!",
    "I am a very professional escape artist.",
    "Nooo! My little bunny legs!",
    "Okay, you're getting suspiciously good at this."
  ];

  function moveBunny() {
    const maxX = Math.max(0, bunnyStage.clientWidth - bunny.offsetWidth);
    const maxY = Math.max(0, bunnyStage.clientHeight - bunny.offsetHeight);

    bunny.style.left = Math.floor(Math.random() * (maxX + 1)) + "px";
    bunny.style.top = Math.floor(Math.random() * (maxY + 1)) + "px";
  }

  bunny.addEventListener("click", () => {
    state.bunnyClicks++;
    if (state.bunnyClicks >= 5) {
      bunny.textContent = "🐰💗";
      bunny.style.left = "43%";
      bunny.style.top = "35%";

      bunnyMessage.textContent =
        "YOU CAUGHT ME! Fine... you're my favourite human. 🎀";

      unlockAchievement("achBunny", "Bunny Catcher");
      showToast("Bunny captured! Secret unlocked! 💗");

      state.bunnyClicks = 0;
      return;
    }

    bunnyMessage.textContent =
      bunnyMessages[Math.floor(Math.random() * bunnyMessages.length)];

    moveBunny();
  });

  $("#resetBunny").addEventListener("click", () => {
    state.bunnyClicks = 0;
    bunny.textContent = "🐰";
    bunny.style.left = "45%";
    bunny.style.top = "38%";
    bunnyMessage.textContent =
      "The bunny has returned. Try catching it again!";
  });

  // -----------------------------
  // GALAXY
  // -----------------------------

  const planets = {
    venus: {
      emoji: "🌸",
      title: "Pink Planet",
      text: "A planet where everything is pink, flowers grow on clouds and every bunny has a tiny crown."
    },
    moon: {
      emoji: "🌙",
      title: "Moon Kingdom",
      text: "A quiet kingdom where the stars whisper stories and the moon keeps everyone's little secrets."
    },
    saturn: {
      emoji: "🪐",
      title: "Dream Planet",
      text: "A planet made of dreams, music, galaxies and endless possibilities. Your imagination lives here."
    }
  };

  $$(".planet").forEach(button => {
    button.addEventListener("click", () => {
      const planet = planets[button.dataset.planet];

      $("#planetInfo").html(`
    <span class="planet-big">${planet.emoji}</span>
    <h3>${planet.title}</h3>
    <p></p>
`);
      ;

      $("#planetInfo").querySelector("p").textContent = planet.text;

      unlockAchievement("achGalaxy", "Space Explorer");
    });
  });

  // -----------------------------
  // MAGICAL QUIZ
  // -----------------------------

  const quizQuestions = [
    {
      question: "What would you do if you found a tiny dragon?",
      answers: [
        "Adopt it immediately. 🐉",
        "Ask it about the universe. 🌌",
        "Give it a pink bow. 🎀"
      ],
      result: "Congratulations! You're officially a magical creature. ✨"
    },
    {
      question: "Choose your perfect magical home:",
      answers: [
        "A pink castle in the clouds. 🏰",
        "A cozy house near the stars. 🌙",
        "A garden full of tiny bunnies. 🐰"
      ],
      result: "Your magical home has been reserved. Rent is paid in cookies. 🍪"
    },
    {
      question: "Which creature would be your best friend?",
      answers: [
        "A chaotic dinosaur. 🦖",
        "A sleepy moon rabbit. 🐇",
        "A tiny fairy with attitude. 🧚"
      ],
      result: "Your magical companion has chosen you! 💗"
    },
    {
      question: "What is the most important thing in a kingdom?",
      answers: [
        "Unlimited snacks. 🍓",
        "A very large library. 📚",
        "A royal dinosaur. 🦕"
      ],
      result: "The royal council approves your excellent decision. 👑"
    }
  ];

  let quizIndex = 0;

  function loadQuiz() {
    const question = quizQuestions[quizIndex];

    $("#quizQuestion").textContent = question.question;
    $("#quizResult").textContent = "";
    $("#nextQuiz").classList.add("hidden");

    const options = $("#quizOptions");
    options.innerHTML = "";

    question.answers.forEach((answer, index) => {
      const button = document.createElement("button");

      button.className = "quiz-option";
      button.textContent = answer;

      button.addEventListener("click", () => {
        options.querySelectorAll("button").forEach(option => {
          option.disabled = true;
        });

        $("#quizResult").textContent = question.result;
        $("#nextQuiz").classList.remove("hidden");

        state.quizCompleted = true;
        unlockAchievement("achQuiz", "Little Genius");
      });

      options.appendChild(button);
    });
  }
  $("#nextQuiz").addEventListener("click", () => {
    quizIndex = (quizIndex + 1) % quizQuestions.length;
    loadQuiz();
  });

  loadQuiz();

  // -----------------------------
  // SECRET LETTERS
  // -----------------------------

  const letters = [
    {
      title: "A tiny reminder 💗",
      message: "You don't have to be productive every second. You deserve quiet moments, rest, happiness and space to simply exist."
    },
    {
      title: "Official announcement 🎀",
      message: "The Royal Kingdom has officially declared you too adorable to be a normal citizen. Please accept your imaginary crown."
    },
    {
      title: "A little truth 🌷",
      message: "I'm glad our paths crossed. I hope this little corner makes you smile whenever you visit it."
    }
  ];

  $$(".letter").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.letter);
      const letter = letters[index];

      $("#letterResult").innerHTML = "";

      const heading = document.createElement("h3");
      heading.textContent = letter.title;

      const paragraph = document.createElement("p");
      paragraph.textContent = letter.message;

      $("#letterResult").append(heading, paragraph);

      if (!state.openedLetters.includes(index)) {
        state.openedLetters.push(index);
        unlockAchievement("achLetter", "Secret Keeper");
      }

      showToast("A little letter just for you 💌");
    });
  });

  // -----------------------------
  // ACHIEVEMENTS
  // -----------------------------

  function unlockAchievement(id, name) {
    const element = document.getElementById(id);

    if (!element) return;

    if (!state.achievements.includes(id)) {
      state.achievements.push(id);
      saveData();

      element.classList.add("unlocked");
      showToast("Achievement unlocked: " + name + " ⭐");
    }
  }

  function restoreAchievements() {
    state.achievements.forEach(id => {
      const element = document.getElementById(id);

      if (element) {
        element.classList.add("unlocked");
      }
    });
  }

  // -----------------------------
  // MAGIC DIARY
  // -----------------------------

  const diaryInput = $("#diaryInput");
  const diaryEntries = $("#diaryEntries");

  function renderDiary() {
    diaryEntries.innerHTML = "";

    state.diary.forEach(entry => {
      const card = document.createElement("div");
      card.className = "diary-entry";

      const date = document.createElement("small");
      date.textContent = entry.date;

      const content = document.createElement("p");
      content.textContent = entry.text;

      card.append(date, content);
      diaryEntries.appendChild(card);
    });
  }

  $("#saveDiary").addEventListener("click", () => {
    const text = diaryInput.value.trim();

    if (!text) {
      showToast("Write a tiny thought first! 🌷");
      return;
    }

    const entry = {
      text: text,
      date: new Date().toLocaleString()
    };

    state.diary.unshift(entry);

    if (state.diary.length > 30) {
      state.diary.length = 30;
    }

    saveData();
    renderDiary();

    diaryInput.value = "";
    $("#diaryStatus").textContent = "Your little thought is saved. 💗";

    unlockAchievement("achDiary", "Story Writer");
  });

  // -----------------------------
  // SPARKLE EFFECT
  // -----------------------------

  const sparkleLayer = $("#sparkles");
  const sparkleSymbols = ["✦", "✧", "⋆", "♡"];

  let sparkleTimer = null;

  function createSparkle() {
    if (document.body.classList.contains("no-motion")) return;

    const sparkle = document.createElement("span");

    sparkle.className = "sparkle";
    sparkle.textContent =
      sparkleSymbols[Math.floor(Math.random() * sparkleSymbols.length)];

    sparkle.style.left = Math.random() * 100 + "%";
    sparkle.style.top = Math.random() * 100 + "%";
    sparkle.style.fontSize = (10 + Math.random() * 13) + "px";

    sparkleLayer.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 7000);
  }
  function startSparkles() {
    if (!sparkleTimer) {
      sparkleTimer = setInterval(createSparkle, 1200);
    }
  }

  function stopSparkles() {
    clearInterval(sparkleTimer);
    sparkleTimer = null;
    sparkleLayer.innerHTML = "";
  }

  // -----------------------------
  // ACCESSIBILITY
  // -----------------------------

  const motionToggle = $("#motionToggle");
  const contrastToggle = $("#contrastToggle");

  const systemReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let motionDisabled = systemReducedMotion;

  function updateMotion() {
    document.body.classList.toggle("no-motion", motionDisabled);

    motionToggle.setAttribute("aria-pressed", String(motionDisabled));
    motionToggle.textContent = motionDisabled
      ? "✨ Motion off"
      : "✨ Motion on";

    if (motionDisabled) {
      stopSparkles();
    } else {
      startSparkles();
    }
  }

  motionToggle.addEventListener("click", () => {
    motionDisabled = !motionDisabled;
    updateMotion();
  });

  contrastToggle.addEventListener("click", () => {
    const active = document.body.classList.toggle("soft-mode");

    contrastToggle.setAttribute("aria-pressed", String(active));
    contrastToggle.textContent = active
      ? "🌷 Soft mode on"
      : "🌷 Soft mode";
  });

  // -----------------------------
  // BACK TO TOP
  // -----------------------------

  $("#backToTop").addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: motionDisabled ? "instant" : "smooth"
    });
  });

  // -----------------------------
  // INITIALIZE
  // -----------------------------

  restoreAchievements();
  renderDiary();
  updateMotion();

  console.log("🎀 Lydia's Enchanted World is ready!");
});
// -----------------------------
  // MOOD KINGDOM
  // -----------------------------

  const moodMessages = {
    morning: "The kingdom is wearing Pink Morning. 💗",
    moonlight: "The moon has taken over the kingdom. 🌙",
    chaos: "WARNING: Fairy chaos has been activated! 🧚"
  };

  const moodButtons = $$(".mood-card");

  function setMood(mood) {
    document.body.classList.remove(
      "mood-morning",
      "mood-moonlight",
      "mood-chaos"
    );

    document.body.classList.add("mood-" + mood);

    moodButtons.forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.mood === mood
      );
    });

    $("#moodStatus").textContent = moodMessages[mood];

    try {
      localStorage.setItem("lydia_mood", mood);
    } catch {
      showToast("Mood changed for this visit! 🌷");
    }
  }

  moodButtons.forEach(button => {
    button.addEventListener("click", () => {
      setMood(button.dataset.mood);
    });
  });

  let savedMood = "morning";

  try {
    savedMood = localStorage.getItem("lydia_mood") || "morning";
  } catch {
    savedMood = "morning";
  }

  if (!moodMessages[savedMood]) {
    savedMood = "morning";
  }

  setMood(savedMood);

  // -----------------------------
  // SECRET ROOM
  // -----------------------------

  const secretAnswer = $("#secretAnswer");
  const unlockSecret = $("#unlockSecret");
  const secretFeedback = $("#secretFeedback");
  const secretContent = $("#secretContent");

  function checkSecretAnswer() {
    const answer = secretAnswer.value
      .trim()
      .toLowerCase()
      .replace(/[.!?]/g, "");

    const correctAnswers = [
      "dinosaur",
      "a dinosaur",
      "dino"
    ];

    if (correctAnswers.includes(answer)) {
      secretContent.classList.remove("hidden");
      $("#secretDoor").textContent = "🏰";

      secretFeedback.textContent =
        "The guardian recognizes you. Welcome! ✨";

      unlockSecret.textContent = "The door is open! 💗";
      unlockSecret.disabled = true;
      secretAnswer.disabled = true;

      showToast("Secret room unlocked! 🔓");
    } else {
      secretFeedback.textContent =
        "Hmm... the guardian is still sleeping. Try again! 🦖";
    }
  }

  unlockSecret.addEventListener("click", checkSecretAnswer);

  secretAnswer.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      checkSecretAnswer();
    }
  });

  // -----------------------------
  // MYSTERY GIFT
  // -----------------------------

  const giftMissions = [
    "Tell the royal dinosaur one silly joke. 🦖",
    "Name three things you love about the universe. 🌌",
    "Imagine a name for a tiny pink dragon. 🐉",
    "Give your imaginary bunny a royal title. 🐰"
  ];

  const giftMessages = [
    "SURPRISE! You have officially received an imaginary royal crown. 👑",
    "A tiny dragon has adopted you. Its name is now your responsibility. 🐉",
    "Your reward: unlimited imaginary strawberry cake. 🍓",
    "Congratulations! You are the official Queen of the Bunny Kingdom. 🐰",
    "A magical star has chosen you. May your days be full of lovely discoveries. ⭐",
    "Your very own certificate of being wonderfully weird and absolutely iconic. 🎀"
  ];

  const giftBox = $("#giftBox");
  const giftTitle = $("#giftTitle");
  const giftDescription = $("#giftDescription");
  const completeMission = $("#completeMission");
  const openGift = $("#openGift");
  const giftResult = $("#giftResult");

  let giftUnlocked = false;
  let giftOpened = false;

  completeMission.addEventListener("click", () => {
    if (giftUnlocked) return;

    giftUnlocked = true;

    giftTitle.textContent = "Mission completed! ⭐";

    giftDescription.textContent =
      "The royal council is impressed. Your mystery gift is ready!";

    giftBox.textContent = "🎀";
    completeMission.disabled = true;
    completeMission.textContent = "Mission completed ✓";

    openGift.classList.remove("hidden");

    showToast("A mysterious gift is waiting! 🎁");
  });
  openGift.addEventListener("click", () => {
    if (!giftUnlocked || giftOpened) return;

    giftOpened = true;

    const randomIndex = Math.floor(
      Math.random() * giftMessages.length
    );

    giftBox.textContent = "🎉";
    giftBox.classList.add("opened");

    giftTitle.textContent = "Your magical surprise!";
    giftDescription.textContent = "A gift from the kingdom.";

    giftResult.textContent = giftMessages[randomIndex];

    openGift.disabled = true;
    openGift.textContent = "Gift opened 💗";

    showToast("A new magical surprise! ✨");
  });

  // -----------------------------
  // END OF VERSION 2.0
  // -----------------------------
