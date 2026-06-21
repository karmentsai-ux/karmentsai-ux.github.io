console.log('JavaScript已連結，準備進行互動...');

let visitorname = prompt('你好，我是你的助理，請問我應該要怎麼稱呼您：');
if (visitorname === '' || visitorname === null){
    visitorname = '訪客';
}

window.alert('Hello ' + visitorname +', 歡迎來到我的網站！');

const logoElement = document.getElementById('main-logo');
logoElement.innerText = visitorname + "'s Website";

const titleElement = document.getElementById('hero-title');
titleElement.innerHTML = `我的未來，由 <span class="highlight" style="color: #38bdf8;">${visitorname}</span> 主宰`;

function changeColor(){
    const highlight = document.querySelector('.highlight');
    if (highlight.style.color === 'red'){
        highlight.style.color = '#38bdf8';
    } else {
        highlight.style.color = 'red';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
    }
    loadTodos();
});

function notifyUser(task, time) {
    if (Notification.permission === "granted") {
        new Notification("⏰ 任務提醒", { 
            body: `記得做：${task}\n設定時間：${new Date(time).toLocaleString()}`
        });
    }
}

function scheduleReminder(task, time) {
    const now = new Date();
    const reminderTime = new Date(time);
    const delay = reminderTime - now;
    if (delay > 0) {
        setTimeout(() => notifyUser(task, time), delay);
    }
}

function addTodoItem(text, timeStr = '', isCompleted = false, save = true) {
    const todoList = document.getElementById('todo-list');
    
    const li = document.createElement('li');
    li.className = 'todo-item' + (isCompleted ? ' completed' : '');

    const contentDiv = document.createElement('div');
    contentDiv.className = 'todo-content';

    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = text;

    const timeSpan = document.createElement('span');
    timeSpan.className = 'todo-time';
    timeSpan.textContent = timeStr ? `🔔 提醒: ${new Date(timeStr).toLocaleString()}` : '無設定提醒';

    contentDiv.appendChild(textSpan);
    contentDiv.appendChild(timeSpan);
    li.appendChild(contentDiv);

    if(timeStr) li.dataset.time = timeStr;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.onclick = function(e) {
        e.stopPropagation();
        li.remove();
        saveTodos(); 
    };
    li.appendChild(deleteBtn);

    li.onclick = function() {
        this.classList.toggle('completed');
        saveTodos(); 
    };

    todoList.appendChild(li);

    if (timeStr) {
        scheduleReminder(text, timeStr);
    }

    if (save) saveTodos();
}

function handleManualAdd() {
    const input = document.getElementById('todo-input');
    const timeInput = document.getElementById('todo-time');
    const text = input.value.trim();
    const time = timeInput.value;

    if (text === '') {
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 400);
        return;
    }

    addTodoItem(text, time, false, true);
    input.value = '';
    timeInput.value = '';
}

function saveTodos() {
    const items = [];
    document.querySelectorAll('#todo-list .todo-item').forEach(li => {
        items.push({
            text: li.querySelector('.todo-text').textContent,
            time: li.dataset.time || '',
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('todos', JSON.stringify(items));
}

function loadTodos() {
    const stored = localStorage.getItem('todos');
    if (stored) {
        const items = JSON.parse(stored);
        items.forEach(item => {
            addTodoItem(item.text, item.time, item.completed, false);
        });
    }
}

function clearCompletedTodos() {
    document.querySelectorAll('#todo-list .todo-item.completed').forEach(li => li.remove());
    saveTodos();
}

const SendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const aiResponse = document.getElementById('ai-response');

userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') SendBtn.click();
});

SendBtn.addEventListener('click', function(){
    const userMessage = userInput.value.trim();

    if (userMessage === ""){
        alert('請先輸入指令唷！');
        return;
    }
    
    setTimeout(function() {
        if (userMessage.startsWith("新增待辦事項") || userMessage.startsWith("新增") || userMessage.startsWith("提醒我")) {
            let rawText = userMessage.replace("新增待辦事項", "").replace("新增", "").replace("提醒我", "").trim();
            
            if(rawText === "") {
                aiResponse.innerText = "AI 助理：請問您想要新增什麼待辦事項呢？請告訴我內容（例如：新增 14:30 開會）。";
                return;
            }

            const timeRegex = /(\d{1,2}):(\d{2})/;
            const match = rawText.match(timeRegex);
            
            let finalTimeStr = '';
            let taskText = rawText;

            if (match) {
                const matchedTime = match[0]; 
                const hours = parseInt(match[1], 10);
                const minutes = parseInt(match[2], 10);

                taskText = rawText.replace(matchedTime, "").replace(/\s+/g, " ").trim();

                const today = new Date();
                today.setHours(hours, minutes, 0, 0);

                if (today < new Date()) {
                    today.setDate(today.getDate() + 1);
                }

                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                const hh = String(today.getHours()).padStart(2, '0');
                const min = String(today.getMinutes()).padStart(2, '0');
                
                finalTimeStr = `${yyyy}-${mm}-${dd}T${hh}:${min}`;
            }

            addTodoItem(taskText, finalTimeStr, false, true);

            if (finalTimeStr) {
                const displayTime = new Date(finalTimeStr).toLocaleString();
                aiResponse.innerText = `AI 助理：偵測到時間！已自動幫您設定在【${displayTime}】提醒您做：「${taskText}」！`;
            } else {
                aiResponse.innerText = `AI 助理：已幫您將「${taskText}」加入清單（未設定時間）。`;
            }
        } 
        
        else if (userMessage.includes("清除已完成") || userMessage.includes("清除完成")) {
            clearCompletedTodos();
            aiResponse.innerText = "AI 助理：已幫您把所有標記為【已完成】的項目從清單中移除了！";
        }
        
        else if (userMessage.includes("你好") || userMessage.includes("哈囉")) {
            aiResponse.innerText = "AI 助理：您好呀～今天過得還好嗎？";
        } else if (userMessage.includes("功能") || userMessage.includes("做什麼")) {
            aiResponse.innerText = "AI 助理：我可以陪你聊天、下指令「新增 14:30 開會」來智慧記錄待辦、清除完成項目，以及切換主題喔！";
        } else if (userMessage.includes("學校") || userMessage.includes("東吳")) {
            aiResponse.innerText = "AI 助理：東吳大學是個學習網頁設計最棒的地方！";
        } else if (userMessage.includes("淺色") || userMessage.includes("白天")) {
            document.body.className = "theme-light";
            aiResponse.innerText = "AI 助理：已啟動【淺色模式】！";
        } else if (userMessage.includes("綠色") || userMessage.includes("駭客")) {
            document.body.className = "theme-matrix";
            aiResponse.innerText = "AI 助理：已啟動【駭客矩陣模式】！";
        } else if (userMessage.includes("深色") || userMessage.includes("晚上")) {
            document.body.className = "";
            aiResponse.innerText = "AI 助理：已為您恢復至【預設深色模式】。";
        } else {
            aiResponse.innerText = "AI 助理：我收到你的訊息 「" + userMessage + "」了！你可以試試對我說「新增 15:45 買珍奶」來測試我的智慧時間功能唷。";
        }
    }, 300);

    userInput.value = "";
});