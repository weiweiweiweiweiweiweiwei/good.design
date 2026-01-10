// ==========================
// 1. 題庫資料 (基於 Good Energy)
// ==========================
const quizData = [
    {
        question: "根據食物產熱效應 (TEF) 的原理，哪一種常規營養素在消化過程中消耗的能量最多？",
        options: ["水", "脂肪", "蛋白質", "碳水化合物"],
        correct: 2,
        explanations: [
            "水雖然重要，但不含熱量，也沒有顯著的產熱效應。",
            "脂肪的產熱效應最低，僅約 0-3%。",
            "正確答案。蛋白質消化時會消耗其攝入熱量的 20-30%，是燃脂冠軍。",
            "碳水化合物的產熱效應居中，約 5-10%。"
        ]
    },
    {
        question: "關於基礎代謝率 (BMR)，下列描述何者正確？",
        options: ["BMR 佔每日總熱量消耗約 10%", "即使整天躺著不動，BMR 也會消耗大量熱量", "更年期後 BMR 會自然上升", "節食可以有效長期提升 BMR"],
        correct: 1,
        explanations: [
            "錯誤。佔 10% 的是食物熱效應，BMR 佔 60-70%。",
            "正確答案。BMR 是維持生命徵象所需的最低能量，佔消耗最大宗。",
            "錯誤。更年期後因荷爾蒙與肌肉流失，BMR 通常會下降。",
            "錯誤。長期節食會讓身體進入省電模式，降低 BMR。"
        ]
    },
    {
        question: "如果想要提升「代謝靈活性」，哪種飲食策略最有效？",
        options: ["只吃單一食物", "高頻率攝取精緻糖", "優先攝取優質蛋白質與纖維", "完全不吃脂肪"],
        correct: 2,
        explanations: [
            "營養不均會破壞代謝。",
            "精緻糖會導致胰島素阻抗，降低代謝靈活性。",
            "正確答案。蛋白質與纖維能穩定血糖，訓練身體切換燃料模式。",
            "好脂肪對荷爾蒙製造至關重要。"
        ]
    },
    {
        question: "為何睡眠不足會導致發胖？",
        options: ["因為皮質醇升高，促進脂肪堆積", "因為睡覺時不會燃燒熱量", "因為睡太少會讓代謝變快", "沒有關聯"],
        correct: 0,
        explanations: [
            "正確答案。睡眠不足會擾亂飢餓素與皮質醇，導致身體囤脂。",
            "錯誤。睡眠時身體仍在進行大量修復工作。",
            "錯誤。睡眠不足會降低代謝效率。",
            "關聯性非常高。"
        ]
    },
    {
        question: "哪種運動能產生顯著的「後燃效應 (EPOC)」？",
        options: ["散步", "瑜伽", "高強度間歇訓練 (HIIT)", "冥想"],
        correct: 2,
        explanations: [
            "強度過低，無法產生顯著後燃。",
            "主要為伸展放鬆。",
            "正確答案。HIIT 能造成氧債，讓身體在運動後持續燃燒熱量。",
            "靜態活動無後燃效應。"
        ]
    }
];

// ==========================
// 2. 狀態變數
// ==========================
let currentIdx = 0;
let score = 0;
let wrongCount = 0;
let isAnswered = false;

// DOM 元素
const views = {
    quiz: document.getElementById('quiz-view'),
    result: document.getElementById('result-view')
};
const ui = {
    progress: document.getElementById('progress-text'),
    question: document.getElementById('question-text'),
    options: document.getElementById('options-container'),
    nextBtn: document.getElementById('next-btn'),
    // Result UI
    score: document.getElementById('res-score'),
    accuracy: document.getElementById('res-accuracy'),
    correct: document.getElementById('res-correct'),
    wrong: document.getElementById('res-wrong'),
    skipped: document.getElementById('res-skipped')
};

// ==========================
// 3. 核心功能
// ==========================

function initQuiz() {
    currentIdx = 0;
    score = 0;
    wrongCount = 0;
    isAnswered = false;
    
    views.result.classList.add('hidden');
    views.quiz.classList.remove('hidden');
    
    renderQuestion();
}

function renderQuestion() {
    const data = quizData[currentIdx];
    
    // 更新 UI
    ui.progress.innerText = `${currentIdx + 1} / ${quizData.length}`;
    ui.question.innerText = data.question;
    ui.nextBtn.disabled = true;
    isAnswered = false;

    // 生成選項
    ui.options.innerHTML = '';
    data.options.forEach((opt, idx) => {
        const letter = String.fromCharCode(65 + idx); // A, B, C, D
        
        const card = document.createElement('div');
        card.className = 'option-card';
        card.onclick = () => handleAnswer(idx, card);
        
        card.innerHTML = `
            <span class="option-label">${letter}. ${opt}</span>
            <div class="status-msg"></div>
            <div class="explanation">${data.explanations[idx]}</div>
        `;
        ui.options.appendChild(card);
    });
}

function handleAnswer(selectedIdx, card) {
    if (isAnswered) return;
    isAnswered = true;
    ui.nextBtn.disabled = false;

    const data = quizData[currentIdx];
    const correctIdx = data.correct;
    const cards = ui.options.children;

    // 判定對錯
    if (selectedIdx === correctIdx) {
        score++;
        card.classList.add('correct');
        card.querySelector('.status-msg').innerHTML = '<i class="fas fa-check"></i> 正確答案';
    } else {
        wrongCount++;
        card.classList.add('wrong');
        card.querySelector('.status-msg').innerHTML = '<i class="fas fa-times"></i> 答錯了';
        
        // 顯示正確答案
        const correctCard = cards[correctIdx];
        correctCard.classList.add('correct');
        correctCard.querySelector('.status-msg').innerHTML = '<i class="fas fa-check"></i> 正確答案';
        correctCard.querySelector('.explanation').style.display = 'block';
    }

    // 顯示被點擊卡片的解釋
    card.querySelector('.explanation').style.display = 'block';

    // 鎖定所有卡片
    Array.from(cards).forEach(c => c.style.cursor = 'default');
}

function nextQuestion() {
    if (currentIdx < quizData.length - 1) {
        currentIdx++;
        renderQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    views.quiz.classList.add('hidden');
    views.result.classList.remove('hidden');

    const total = quizData.length;
    const accuracy = Math.round((score / total) * 100);
    const skipped = total - score - wrongCount; // 應該為 0，因為強制回答

    ui.score.innerText = `${score} / ${total}`;
    ui.accuracy.innerText = `${accuracy}%`;
    ui.correct.innerText = score;
    ui.wrong.innerText = wrongCount;
    ui.skipped.innerText = skipped;
}

function restartQuiz() {
    initQuiz();
}

// 啟動
initQuiz();