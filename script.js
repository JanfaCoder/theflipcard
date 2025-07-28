let cards = [];
let current = 0;
let showingFront = true;
let deleteMode = false;

// ✅ 로그인 여부 확인
function checkLogin() {
  const user = localStorage.getItem('loggedInUser');
  if (!user) {
    window.location.href = 'login.html';
  } else {
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
      userInfo.textContent = `👤 ${user}`;
    }
  }
}

// ✅ 로그인
function login() {
  const username = document.getElementById('loginUser').value;
  const password = document.getElementById('loginPass').value;
  const stored = localStorage.getItem(`user_${username}`);

  if (!stored) {
    alert('존재하지 않는 사용자입니다.');
    return;
  }

  const parsed = JSON.parse(stored);
  if (parsed.password !== password) {
    alert('비밀번호가 틀렸습니다.');
    return;
  }

  localStorage.setItem('loggedInUser', username);
  window.location.href = 'index.html';
}

// ✅ 회원가입
function signup() {
  const username = document.getElementById('signupUser').value;
  const password = document.getElementById('signupPass').value;

  if (localStorage.getItem(`user_${username}`)) {
    alert('이미 존재하는 아이디입니다.');
    return;
  }

  const userData = { username, password };
  localStorage.setItem(`user_${username}`, JSON.stringify(userData));
  alert('회원가입 완료! 로그인 해주세요.');
  window.location.href = 'login.html';
}

// ✅ 로그아웃
function logout() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'login.html';
}

// ✅ 단어 추가
function addCard() {
  const word = document.getElementById('wordInput').value.trim();
  const meaning = document.getElementById('meaningInput').value.trim();

  if (!word || !meaning) {
    alert('단어와 뜻을 모두 입력해주세요.');
    return;
  }

  if (cards.length >= 50) {
    alert("❗ 단어는 최대 50개까지만 추가할 수 있습니다.");
    return;
  }

  cards.push({ word, meaning });
  document.getElementById('wordInput').value = '';
  document.getElementById('meaningInput').value = '';

  saveCards();
  renderCardList();
  updateWordCount();
}

// ✅ 카드 삭제 모드 토글
function toggleDeleteMode() {
  deleteMode = !deleteMode;
  renderCardList();
}

// ✅ 카드 삭제
function deleteCard(index) {
  cards.splice(index, 1);
  saveCards();
  renderCardList();

  if (!document.getElementById("cardSection").classList.contains("hidden")) {
    if (current >= cards.length) current = cards.length - 1;
    if (cards.length > 0) {
      showCard();
    } else {
      document.getElementById("cardSection").classList.add("hidden");
    }
  }
}

// ✅ 카드 리스트 렌더링
function renderCardList() {
  const listContainer = document.getElementById("cardList");
  if (!listContainer) return;

  if (!deleteMode) {
    listContainer.classList.add("hidden");
    return;
  } else {
    listContainer.classList.remove("hidden");
  }

  listContainer.innerHTML = "";
  cards.forEach((card, index) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "list-card";
    cardDiv.innerHTML = `
      <span><strong>${card.word}</strong>: ${card.meaning}</span>
      ${
        deleteMode
          ? `<button class="delete-btn" onclick="deleteCard(${index})">❌</button>`
          : ""
      }
    `;
    listContainer.appendChild(cardDiv);
  });

  updateWordCount();
}

// ✅ 학습 시작
function startStudy() {
  if (cards.length === 0) {
    alert("단어를 먼저 추가해주세요.");
    return;
  }

  document.getElementById("cardSection").classList.remove("hidden");
  current = 0;
  showingFront = true;
  showCard();
}

// ✅ 카드 표시
function showCard() {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const card = cards[current];
  const front = document.getElementById("cardFront");
  const back = document.getElementById("cardBack");
  const cardEl = document.getElementById("flashCard");

  if (!card) return;

  if (mode === "word") {
    front.textContent = card.word;
    back.textContent = card.meaning;
  } else {
    front.textContent = card.meaning;
    back.textContent = card.word;
  }

  cardEl.classList.remove("flipped");
  showingFront = true;
}

// ✅ 카드 뒤집기
function flipCard() {
  const cardEl = document.getElementById("flashCard");
  showingFront = !showingFront;
  cardEl.classList.toggle("flipped");
}

// ✅ 이전 카드
function prevCard() {
  if (current > 0) {
    current--;
    showCard();
  } else {
    alert("첫 번째 카드입니다.");
  }
}

// ✅ 다음 카드
function nextCard() {
  if (current < cards.length - 1) {
    current++;
    showCard();
  } else {
    alert("마지막 카드입니다.");
  }
}

// ✅ 카드 저장
function saveCards() {
  const user = localStorage.getItem('loggedInUser');
  if (user) {
    localStorage.setItem(`cards_${user}`, JSON.stringify(cards));
  }
}

// ✅ 카드 불러오기
function loadCards() {
  const user = localStorage.getItem('loggedInUser');
  if (user) {
    const saved = localStorage.getItem(`cards_${user}`);
    if (saved) {
      cards = JSON.parse(saved);
    }
  }
}

// ✅ 단어 수 표시
function updateWordCount() {
  const count = cards.length;
  const wordCountDiv = document.getElementById("wordCount");
  if (wordCountDiv) {
    wordCountDiv.textContent = `단어 수: ${count} / 50`;
  }
} 
