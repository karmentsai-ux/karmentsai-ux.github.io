//以下程式碼片段用於設定通知中所欲顯示的內容

function notifyUser(task, time) {
    if (Notification.permission === "granted") {
        new Notification("Reminder", { body: `Time for: ${task} at ${time}` });
    }                                          // $表示傳遞變數值
}

//以下程式碼片段用於設定何時跳出通知(即時間計算)

function scheduleReminder(task, time) {
    const now = new Date(); // new 才不會導致Date變成字串
    const reminderTime = new Date(time);
    const delay = reminderTime - now;

    if (delay > 0) {
        setTimeout(() => notifyUser(task, time), delay);
    }
}

function addTodo() {
    const input = document.getElementById('todo-input');
    const timeInput = document.getElementById('todo-time');
    const newTodoText = input.value.trim(); // trim() 去除輸入框中首尾的空白
    const reminderTime = timeInput.value;

    if (newTodoText !== '') {
        const li = document.createElement('li');
        li.className = 'todo-item'; //用於事後加上class，而非事前。

        const textSpan = document.createElement('span');
        textSpan.textContent = newTodoText; //僅取出文字部分

        const timeSpan = document.createElement('span');
        timeSpan.textContent = reminderTime ? `提醒日期與時間: ${new Date(reminderTime).toLocaleString()}` : '沒有設定提醒時間';
        // ?表示判斷


        li.appendChild(textSpan);
        li.appendChild(timeSpan);

        li.onclick = function() {
            this.classList.toggle('completed');
            // classList.toggle如果不存在則添加、如果存在則移除。
        };

        li.ondblclick = function() {
            this.remove();
        };

        //每設定好一條提醒之後，把原本輸入的內容與時間清空以利下次使用。

        document.getElementById('todo-list').appendChild(li);
        input.value = ''; // 清空代辦事項輸入框
        timeInput.value = ''; //清空時間輸入框

        // 若提醒時間存在，則表示要啟動scheduleReminder

        if (reminderTime) {
            scheduleReminder(newTodoText, reminderTime);
        }
    
    }
}