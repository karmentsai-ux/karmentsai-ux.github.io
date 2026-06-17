// 網頁載入時，主動詢問瀏覽器通知權限
document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
    }

    // 讓輸入框支援按下 Enter 鍵直接新增
    document.getElementById('todo-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
});

// 設定通知中所欲顯示的內容
function notifyUser(task, time) {
    if (Notification.permission === "granted") {
        new Notification("⏰ 任務提醒", { 
            body: `記得做：${task}\n設定時間：${new Date(time).toLocaleString()}`,
            icon: 'https://cdn-icons-png.flaticon.com/512/1792/1792931.png' // 可自訂通知小圖示
        });
    }
}

// 設定何時跳出通知 (時間計算)
function scheduleReminder(task, time) {
    const now = new Date();
    const reminderTime = new Date(time);
    const delay = reminderTime - now;

    if (delay > 0) {
        setTimeout(() => notifyUser(task, time), delay);
    }
}

// 新增代辦事項
function addTodo() {
    const input = document.getElementById('todo-input');
    const timeInput = document.getElementById('todo-time');
    const newTodoText = input.value.trim();
    const reminderTime = timeInput.value;

    // 防呆機制：若未輸入內容，輸入框閃爍紅框提示
    if (newTodoText === '') {
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 400);
        return;
    }

    // 建立裝載內容的 li 容器
    const li = document.createElement('li');
    li.className = 'todo-item';

    // 建立文字與時間的包裹區塊
    const contentDiv = document.createElement('div');
    contentDiv.className = 'todo-content';

    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = newTodoText;

    const timeSpan = document.createElement('span');
    timeSpan.className = 'todo-time';
    timeSpan.textContent = reminderTime ? `🔔 提醒: ${new Date(reminderTime).toLocaleString()}` : '無設定提醒';

    contentDiv.appendChild(textSpan);
    contentDiv.appendChild(timeSpan);
    li.appendChild(contentDiv);

    // 建立獨立的刪除按鈕 (🗑️)
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.title = '刪除此事項';
    
    // 點擊刪除按鈕時移除該項目
    deleteBtn.onclick = function(e) {
        e.stopPropagation(); // 阻止事件冒泡，避免觸發 li 的完成狀態
        li.remove();
    };
    li.appendChild(deleteBtn);

    // 點擊整條項目切換「已完成/未完成」
    li.onclick = function() {
        this.classList.toggle('completed');
    };

    // 將新項目加入列表並清空輸入框
    document.getElementById('todo-list').appendChild(li);
    input.value = '';
    timeInput.value = '';

    // 若有設定提醒時間，啟動計時器
    if (reminderTime) {
        scheduleReminder(newTodoText, reminderTime);
    }
}