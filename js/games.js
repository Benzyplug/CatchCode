class GameSystem {
    constructor() {
        this.triviaQuestions = [
            {
                question: "What does HTML stand for?",
                options: [
                    "Hyper Text Markup Language",
                    "High Tech Modern Language", 
                    "Hyper Transfer Markup Language",
                    "Home Tool Markup Language"
                ],
                correct: 0,
                category: "Web Development",
                xp: 10
            },
            {
                question: "Which programming language is known as the 'language of the web'?",
                options: ["Python", "Java", "JavaScript", "C++"],
                correct: 2,
                category: "Programming",
                xp: 15
            },
            {
                question: "What is the time complexity of binary search?",
                options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
                correct: 2,
                category: "Algorithms",
                xp: 20
            },
            {
                question: "Which CSS property is used to change text color?",
                options: ["text-color", "font-color", "color", "text-style"],
                correct: 2,
                category: "CSS",
                xp: 10
            },
            {
                question: "What is React?",
                options: [
                    "A programming language",
                    "A JavaScript library for building user interfaces",
                    "A database management system",
                    "An operating system"
                ],
                correct: 1,
                category: "Frontend",
                xp: 15
            }
        ];
        
        this.miniGames = {
            'code-typing': this.codeTypingGame,
            'memory-match': this.memoryMatchGame,
            'quick-quiz': this.quickQuizGame
        };
        
        this.init();
    }

    init() {
        this.setupTriviaPopups();
        this.setupMiniGames();
    }

    setupTriviaPopups() {
        // Random trivia during learning sessions
        setInterval(() => {
            if (Math.random() < 0.3 && document.querySelector('.learning-content')) {
                this.showTriviaPopup();
            }
        }, 120000); // Every 2 minutes
    }

    showTriviaPopup() {
        const randomQuestion = this.triviaQuestions[Math.floor(Math.random() * this.triviaQuestions.length)];
        
        const popup = document.createElement('div');
        popup.className = 'trivia-popup';
        popup.innerHTML = `
            <div class="trivia-content">
                <div class="trivia-header">
                    <h3>Quick Knowledge Check! 🧠</h3>
                    <span class="trivia-category">${randomQuestion.category}</span>
                </div>
                <div class="trivia-question">
                    <p>${randomQuestion.question}</p>
                </div>
                <div class="trivia-options">
                    ${randomQuestion.options.map((option, index) => `
                        <button class="trivia-option" data-index="${index}">
                            ${option}
                        </button>
                    `).join('')}
                </div>
                <div class="trivia-footer">
                    <span class="trivia-xp">+${randomQuestion.xp} XP</span>
                    <button class="btn-secondary skip-trivia">Skip</button>
                </div>
            </div>
        `;

        document.body.appendChild(popup);
        
        // Add animations
        setTimeout(() => popup.classList.add('show'), 100);
        
        // Handle option clicks
        popup.querySelectorAll('.trivia-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedIndex = parseInt(e.target.dataset.index);
                this.handleTriviaAnswer(selectedIndex, randomQuestion, popup);
            });
        });
        
        // Handle skip
        popup.querySelector('.skip-trivia').addEventListener('click', () => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        });
    }

    handleTriviaAnswer(selectedIndex, question, popup) {
        const options = popup.querySelectorAll('.trivia-option');
        const isCorrect = selectedIndex === question.correct;
        
        options.forEach(option => {
            option.disabled = true;
            const index = parseInt(option.dataset.index);
            
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                option.classList.add('incorrect');
            }
        });

        if (isCorrect) {
            this.awardXP(question.xp);
            this.showNotification(`Correct! +${question.xp} XP earned!`, 'success');
        } else {
            this.showNotification('Try again next time!', 'error');
        }

        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        }, 2000);
    }

    setupMiniGames() {
        // Add game buttons to practice page
        const practiceContainer = document.querySelector('.practice-content');
        if (practiceContainer) {
            const gamesSection = document.createElement('div');
            gamesSection.className = 'mini-games-section';
            gamesSection.innerHTML = `
                <h2>Mini Games 🎮</h2>
                <div class="games-grid">
                    <div class="game-card" data-game="code-typing">
                        <div class="game-icon">⌨️</div>
                        <h3>Code Typing</h3>
                        <p>Test your typing speed with code snippets</p>
                        <button class="btn-primary play-game">Play</button>
                    </div>
                    <div class="game-card" data-game="memory-match">
                        <div class="game-icon">🧠</div>
                        <h3>Memory Match</h3>
                        <p>Match programming concepts with their definitions</p>
                        <button class="btn-primary play-game">Play</button>
                    </div>
                    <div class="game-card" data-game="quick-quiz">
                        <div class="game-icon">❓</div>
                        <h3>Quick Quiz</h3>
                        <p>Answer as many questions as you can in 60 seconds</p>
                        <button class="btn-primary play-game">Play</button>
                    </div>
                </div>
            `;
            
            practiceContainer.appendChild(gamesSection);
            
            // Add game event listeners
            practiceContainer.querySelectorAll('.play-game').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const gameCard = e.target.closest('.game-card');
                    const gameType = gameCard.dataset.game;
                    this.startMiniGame(gameType);
                });
            });
        }
    }

    startMiniGame(gameType) {
        if (this.miniGames[gameType]) {
            this.miniGames[gameType].call(this);
        }
    }

    codeTypingGame() {
        const codeSnippets = [
            `function helloWorld() {\n  console.log("Hello, World!");\n}`,
            `const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);`,
            `class Person {\n  constructor(name) {\n    this.name = name;\n  }\n  greet() {\n    return "Hello, " + this.name;\n  }\n}`,
            `const fetchData = async () => {\n  try {\n    const response = await fetch('/api/data');\n    return response.json();\n  } catch (error) {\n    console.error('Error:', error);\n  }\n};`
        ];
        
        const randomSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        
        const gameModal = this.createGameModal('Code Typing Challenge ⌨️');
        gameModal.innerHTML += `
            <div class="typing-game">
                <div class="code-display">
                    <pre>${randomSnippet}</pre>
                </div>
                <textarea class="code-input" placeholder="Start typing the code above..."></textarea>
                <div class="game-stats">
                    <div class="stat">
                        <span class="stat-label">Time:</span>
                        <span class="stat-value" id="typingTime">60s</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Accuracy:</span>
                        <span class="stat-value" id="typingAccuracy">100%</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">WPM:</span>
                        <span class="stat-value" id="typingWPM">0</span>
                    </div>
                </div>
                <button class="btn-primary" id="startTyping">Start Game</button>
            </div>
        `;
        
        this.setupTypingGame(gameModal, randomSnippet);
    }

    setupTypingGame(modal, snippet) {
        let timeLeft = 60;
        let gameStarted = false;
        let startTime, timer;
        
        const timeDisplay = modal.querySelector('#typingTime');
        const accuracyDisplay = modal.querySelector('#typingAccuracy');
        const wpmDisplay = modal.querySelector('#typingWPM');
        const startBtn = modal.querySelector('#startTyping');
        const textarea = modal.querySelector('.code-input');
        
        startBtn.addEventListener('click', () => {
            if (!gameStarted) {
                gameStarted = true;
                startTime = Date.now();
                textarea.disabled = false;
                textarea.focus();
                startBtn.textContent = 'Playing...';
                startBtn.disabled = true;
                
                timer = setInterval(() => {
                    timeLeft--;
                    timeDisplay.textContent = `${timeLeft}s`;
                    
                    if (timeLeft <= 0) {
                        this.endTypingGame(modal, snippet, textarea.value, startTime);
                    }
                }, 1000);
            }
        });
        
        textarea.addEventListener('input', () => {
            if (gameStarted) {
                const typedText = textarea.value;
                const originalWords = snippet.split(' ').length;
                const typedWords = typedText.split(' ').length;
                const elapsedMinutes = (Date.now() - startTime) / 60000;
                const wpm = Math.round(typedWords / elapsedMinutes);
                
                // Calculate accuracy
                let correctChars = 0;
                for (let i = 0; i < Math.min(typedText.length, snippet.length); i++) {
                    if (typedText[i] === snippet[i]) correctChars++;
                }
                const accuracy = Math.round((correctChars / snippet.length) * 100);
                
                wpmDisplay.textContent = wpm;
                accuracyDisplay.textContent = `${accuracy}%`;
            }
        });
        
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && textarea.value === snippet) {
                this.endTypingGame(modal, snippet, textarea.value, startTime);
            }
        });
    }

    endTypingGame(modal, original, typed, startTime) {
        clearInterval(modal.timer);
        
        const endTime = Date.now();
        const timeTaken = (endTime - startTime) / 1000;
        const originalWords = original.split(' ').length;
        const wpm = Math.round((originalWords / timeTaken) * 60);
        
        let correctChars = 0;
        for (let i = 0; i < Math.min(typed.length, original.length); i++) {
            if (typed[i] === original[i]) correctChars++;
        }
        const accuracy = Math.round((correctChars / original.length) * 100);
        
        const xpEarned = Math.round((wpm * accuracy) / 10);
        
        modal.querySelector('.typing-game').innerHTML = `
            <div class="game-result">
                <h3>Game Over! 🎯</h3>
                <div class="result-stats">
                    <div class="result-stat">
                        <span class="stat-label">Words per Minute:</span>
                        <span class="stat-value">${wpm}</span>
                    </div>
                    <div class="result-stat">
                        <span class="stat-label">Accuracy:</span>
                        <span class="stat-value">${accuracy}%</span>
                    </div>
                    <div class="result-stat">
                        <span class="stat-label">Time:</span>
                        <span class="stat-value">${Math.round(timeTaken)}s</span>
                    </div>
                    <div class="result-stat xp-earned">
                        <span class="stat-label">XP Earned:</span>
                        <span class="stat-value">+${xpEarned}</span>
                    </div>
                </div>
                <button class="btn-primary" onclick="this.closest('.game-modal').remove()">Close</button>
            </div>
        `;
        
        this.awardXP(xpEarned);
    }

    memoryMatchGame() {
        const cards = [
            { concept: 'HTML', definition: 'HyperText Markup Language' },
            { concept: 'CSS', definition: 'Cascading Style Sheets' },
            { concept: 'JavaScript', definition: 'Programming language for the web' },
            { concept: 'API', definition: 'Application Programming Interface' },
            { concept: 'DOM', definition: 'Document Object Model' },
            { concept: 'JSON', definition: 'JavaScript Object Notation' }
        ];
        
        const gameModal = this.createGameModal('Memory Match 🧠');
        gameModal.innerHTML += `
            <div class="memory-game">
                <div class="memory-grid" id="memoryGrid"></div>
                <div class="game-info">
                    <div class="stat">
                        <span class="stat-label">Moves:</span>
                        <span class="stat-value" id="moveCount">0</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Matches:</span>
                        <span class="stat-value" id="matchCount">0/6</span>
                    </div>
                </div>
            </div>
        `;
        
        this.setupMemoryGame(gameModal, cards);
    }

    setupMemoryGame(modal, cards) {
        const grid = modal.querySelector('#memoryGrid');
        const moveCount = modal.querySelector('#moveCount');
        const matchCount = modal.querySelector('#matchCount');
        
        let gameCards = [];
        let flippedCards = [];
        let moves = 0;
        let matches = 0;
        
        // Duplicate and shuffle cards
        cards.forEach(card => {
            gameCards.push({ type: 'concept', content: card.concept, pair: card.definition });
            gameCards.push({ type: 'definition', content: card.definition, pair: card.concept });
        });
        
        gameCards = this.shuffleArray(gameCards);
        
        // Create card elements
        gameCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'memory-card';
            cardElement.dataset.index = index;
            cardElement.dataset.type = card.type;
            cardElement.dataset.content = card.content;
            cardElement.dataset.pair = card.pair;
            
            cardElement.innerHTML = `
                <div class="card-front">?</div>
                <div class="card-back">${card.content}</div>
            `;
            
            cardElement.addEventListener('click', () => this.flipMemoryCard(cardElement));
            grid.appendChild(cardElement);
        });
        
        modal.moveCount = moveCount;
        modal.matchCount = matchCount;
        modal.moves = moves;
        modal.matches = matches;
        modal.flippedCards = flippedCards;
    }

    flipMemoryCard(card) {
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
        
        card.classList.add('flipped');
        const modal = card.closest('.game-modal');
        modal.flippedCards.push(card);
        
        if (modal.flippedCards.length === 2) {
            modal.moves++;
            modal.moveCount.textContent = modal.moves;
            
            const [card1, card2] = modal.flippedCards;
            const isMatch = 
                (card1.dataset.type === 'concept' && card2.dataset.pair === card2.dataset.content) ||
                (card2.dataset.type === 'concept' && card1.dataset.pair === card1.dataset.content);
            
            if (isMatch) {
                card1.classList.add('matched');
                card2.classList.add('matched');
                modal.matches++;
                modal.matchCount.textContent = `${modal.matches}/6`;
                
                if (modal.matches === 6) {
                    const xpEarned = Math.max(50 - (modal.moves * 2), 10);
                    setTimeout(() => this.endMemoryGame(modal, xpEarned), 500);
                }
            } else {
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                }, 1000);
            }
            
            modal.flippedCards = [];
        }
    }

    endMemoryGame(modal, xp) {
        modal.querySelector('.memory-game').innerHTML = `
            <div class="game-result">
                <h3>Congratulations! 🎉</h3>
                <p>You completed the memory match in ${modal.moves} moves!</p>
                <div class="result-stat xp-earned">
                    <span class="stat-label">XP Earned:</span>
                    <span class="stat-value">+${xp}</span>
                </div>
                <button class="btn-primary" onclick="this.closest('.game-modal').remove()">Close</button>
            </div>
        `;
        this.awardXP(xp);
    }

    quickQuizGame() {
        const gameModal = this.createGameModal('Quick Quiz Challenge ❓');
        gameModal.innerHTML += `
            <div class="quiz-game">
                <div class="quiz-header">
                    <div class="stat">
                        <span class="stat-label">Time:</span>
                        <span class="stat-value" id="quizTime">60s</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Score:</span>
                        <span class="stat-value" id="quizScore">0</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Question:</span>
                        <span class="stat-value" id="quizQuestionCount">1/${this.triviaQuestions.length}</span>
                    </div>
                </div>
                <div class="quiz-content" id="quizContent"></div>
                <button class="btn-primary" id="startQuiz">Start Quiz</button>
            </div>
        `;
        
        this.setupQuizGame(gameModal);
    }

    setupQuizGame(modal) {
        let timeLeft = 60;
        let score = 0;
        let currentQuestion = 0;
        let timer;
        
        const startBtn = modal.querySelector('#startQuiz');
        const quizContent = modal.querySelector('#quizContent');
        
        startBtn.addEventListener('click', () => {
            startBtn.style.display = 'none';
            this.showNextQuizQuestion(modal, currentQuestion, score);
            
            timer = setInterval(() => {
                timeLeft--;
                modal.querySelector('#quizTime').textContent = `${timeLeft}s`;
                
                if (timeLeft <= 0) {
                    this.endQuizGame(modal, score);
                }
            }, 1000);
        });
    }

    showNextQuizQuestion(modal, questionIndex, score) {
        if (questionIndex >= this.triviaQuestions.length) {
            this.endQuizGame(modal, score);
            return;
        }
        
        const question = this.triviaQuestions[questionIndex];
        modal.querySelector('#quizQuestionCount').textContent = `${questionIndex + 1}/${this.triviaQuestions.length}`;
        
        const quizContent = modal.querySelector('#quizContent');
        quizContent.innerHTML = `
            <div class="quiz-question">
                <h3>${question.question}</h3>
            </div>
            <div class="quiz-options">
                ${question.options.map((option, index) => `
                    <button class="quiz-option" data-index="${index}">
                        ${option}
                    </button>
                `).join('')}
            </div>
        `;
        
        quizContent.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedIndex = parseInt(e.target.dataset.index);
                if (selectedIndex === question.correct) {
                    score += question.xp;
                    modal.querySelector('#quizScore').textContent = score;
                    e.target.classList.add('correct');
                } else {
                    e.target.classList.add('incorrect');
                    quizContent.querySelector(`.quiz-option[data-index="${question.correct}"]`).classList.add('correct');
                }
                
                quizContent.querySelectorAll('.quiz-option').forEach(opt => {
                    opt.disabled = true;
                });
                
                setTimeout(() => {
                    this.showNextQuizQuestion(modal, questionIndex + 1, score);
                }, 1500);
            });
        });
    }

    endQuizGame(modal, score) {
        clearInterval(modal.timer);
        
        modal.querySelector('.quiz-game').innerHTML = `
            <div class="game-result">
                <h3>Quiz Complete! 📚</h3>
                <div class="result-stats">
                    <div class="result-stat">
                        <span class="stat-label">Final Score:</span>
                        <span class="stat-value">${score}</span>
                    </div>
                    <div class="result-stat">
                        <span class="stat-label">Questions Answered:</span>
                        <span class="stat-value">${this.triviaQuestions.length}</span>
                    </div>
                    <div class="result-stat xp-earned">
                        <span class="stat-label">Total XP Earned:</span>
                        <span class="stat-value">+${score}</span>
                    </div>
                </div>
                <button class="btn-primary" onclick="this.closest('.game-modal').remove()">Close</button>
            </div>
        `;
        
        this.awardXP(score);
    }

    createGameModal(title) {
        const modal = document.createElement('div');
        modal.className = 'game-modal';
        modal.innerHTML = `
            <div class="game-modal-content">
                <div class="game-modal-header">
                    <h2>${title}</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="game-modal-body"></div>
            </div>
        `;
        
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        document.body.appendChild(modal);
        
        return modal;
    }

    awardXP(amount) {
        const auth = new AuthSystem();
        if (auth.currentUser) {
            auth.currentUser.progress.totalXP += amount;
            localStorage.setItem('learnsphere_current_user', JSON.stringify(auth.currentUser));
            
            // Update users array
            const userIndex = auth.users.findIndex(u => u.id === auth.currentUser.id);
            if (userIndex !== -1) {
                auth.users[userIndex].progress.totalXP += amount;
                auth.saveUsers();
            }
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    showNotification(message, type) {
        const auth = new AuthSystem();
        auth.showNotification(message, type);
    }
}

// Initialize game system
document.addEventListener('DOMContentLoaded', () => {
    new GameSystem();
});
