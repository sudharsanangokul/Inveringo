document.addEventListener("DOMContentLoaded", () => {
    const questions = [
    { question: "The instruction set architecture used by modern processors, such as Intel's x86 and AMD64, is classified as ", answer: "CISC" },
    { question: "The __________ algorithm is widely used for public-key encryption and relies on the difficulty of factoring large prime numbers.", answer: "RSA" },
    { question: "The process of finding patterns in a dataset without pre-labeled outcomes is called __________ learning.", answer: "Unsupervised" },
    { question: "void *ptr;\nint main() {\n    ptr = malloc(______);\n    if (ptr == NULL) {\n        printf(\"Memory allocation failed.\\n\");\n        return 1;\n    }\n}",
      answer: "sizeof(int)" },
    { question: "def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * __________",
      answer: "factorial(n-1)" },
    { question: "The process of dividing a disk into logical sections that can store data is called __________.", answer: "Partitioning" },
    { question: "In a binary search tree, the time complexity for searching for a node in the worst case is ______________.", answer: "O(n)" },
    { question: "The ______________ is the protocol used to securely encrypt communications over a computer network, typically used in HTTPS.", answer: "SSL" },
    {
      question: "$multiplier = 5;\n$multiply = function ($value) use ($multiplier) {\n    return $value * $multiplier;\n};\n$array = [1, 2, 3, 4, 5];\n$result = array_map($multiply, $array);\nprint_r($result);\n?>",
      answer: "5,10,15,20,25"
    }
];


    let currentIndex = 0;
    const questionBox = document.getElementById("current-question");
    const answerInput = document.getElementById("answer-input");
    const nextButton = document.getElementById("next-button");
    const backButton = document.getElementById("back-button");
    const submitButton = document.getElementById("submit-button");
    const resetButton = document.getElementById("reset-button");
    const generatedWords = document.getElementById("generated-words");
    const cells = document.querySelectorAll(".cell");

    let answers = Array(9).fill(false);
    let answeredQuestions = Array(9).fill(false);
    let lettersGenerated = [];
    const noWordsMessage = document.getElementById("no-words");

    const winningPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const savedOrder = localStorage.getItem("bingoGridOrder");
    const gridOrder = savedOrder
        ? JSON.parse(savedOrder)
        : shuffleArray(Array.from({ length: 9 }, (_, i) => (i + 1).toString()));
    localStorage.setItem("bingoGridOrder", JSON.stringify(gridOrder));

    cells.forEach((cell, index) => {
        cell.textContent = gridOrder[index];
    });

    const questionToBoxMap = gridOrder.reduce((map, boxValue, index) => {
        map[boxValue] = index;
        return map;
    }, {});

    function loadQuestion(index) {
        questionBox.textContent = `${index + 1}. ${questions[index].question}`;
        answerInput.value = "";
        answerInput.disabled = answeredQuestions[index];
        submitButton.disabled = answeredQuestions[index];
    }

    submitButton.addEventListener("click", () => {
        const userAnswer = answerInput.value.trim();

        if (userAnswer === "") {
            alert("Please enter an answer.");
            return;
        }

        if (answeredQuestions[currentIndex]) return;

        const correctAnswer = questions[currentIndex].answer;
        const boxIndex = questionToBoxMap[(currentIndex + 1).toString()];
        const cell = cells[boxIndex];

        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            if (!cell.classList.contains("strike")) {
                cell.classList.add("strike");
                answers[boxIndex] = true;
            }
        } else {
            if (!cell.classList.contains("strike")) {
                cell.classList.add("disabled");
            }
        }

        answeredQuestions[currentIndex] = true;
        answerInput.disabled = true;
        submitButton.disabled = true;
        checkBingo();
    });

    nextButton.addEventListener("click", () => {
        if (currentIndex < questions.length - 1) {
            currentIndex++;
            loadQuestion(currentIndex);
        }
    });

    backButton.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            loadQuestion(currentIndex);
        }
    });

    resetButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to reset the game? All progress will be lost.")) {
            localStorage.removeItem("bingoGridOrder");
            window.location.reload();
        }
    });

    function checkBingo() {
        winningPatterns.forEach((pattern, index) => {
            if (pattern.every((idx) => answers[idx]) && !lettersGenerated.includes(index)) {
                lettersGenerated.push(index);
                const newLetter = generateLetter(index);
                const newWordSpan = document.createElement("span");
                newWordSpan.textContent = `${newLetter} `;
                generatedWords.appendChild(newWordSpan);

                if (lettersGenerated.length > 0 && noWordsMessage) {
                    noWordsMessage.remove();
                }

                setTimeout(() => {
                    if (lettersGenerated.length <= 3) {
                        showPseudocodeNotification(lettersGenerated.length);
                    }
                }, 500);
            }
        });
    }

    function generateLetter(index) {
        const letters = ["D", "S", "A", "B", "I", "N", "G", "O"];
        return letters[index];
    }

    function showPseudocodeNotification(letterCount) {
        const fileNames = ["Pseudocode1.html", "Pseudocode2.html", "Pseudocode3.html"];
        if (letterCount <= 3) {
            const userConfirmed = confirm(
                `You have generated a new letter! Would you like to proceed to the pseudocode for it?`
            );
            if (userConfirmed) {
                window.location.href = fileNames[letterCount - 1];
            }
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    loadQuestion(currentIndex);
});
