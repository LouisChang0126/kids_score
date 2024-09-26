const today = new Date().toISOString().slice(2, 10).replace(/-/g, '');

async function load_signin_stuff() {
  var students = [];
  const snapshot = await db.collection('serve').doc(today).get();
  if (snapshot.exists) {
    students = Object(snapshot.data());  // 提取所有字段名稱（鍵）並存為數組
  }
  return students;
}

async function creatTable() {
  var signin_stuff = await load_signin_stuff();
  const studentsScoresDiv = document.getElementById('panel');
  
  if (Object.keys(signin_stuff).length === 0) {
    alert("今天尚未點名！");
  } else {
    // 按照键（学生名字）进行排序
    const sortedEntries = Object.entries(signin_stuff).sort(([studentA], [studentB]) => studentA.localeCompare(studentB));
    
    sortedEntries.forEach(([student, point]) => {
      const studentDiv = document.createElement('tr');
      studentDiv.className = 'tr';

      const studentName = document.createElement('td');
      studentName.className = 'title is-3';
      studentName.textContent = student;
      studentDiv.appendChild(studentName);

      const score = document.createElement('td');
      score.className = 'subtitle is-3';
      score.textContent = `+ ${point}`;
      studentDiv.appendChild(score);

      // 加分按鈕
      const addtd = document.createElement('td');
      const addButton = document.createElement('button');
      addButton.className = 'button is-large is-success';
      addButton.textContent = '+1';
      addButton.onclick = async () => {
        await db.collection('serve').doc(today).update({ [student]: point + 1 });
        // alert(`${student} 加 1 分`);
        // location.reload(); // 重新整理頁面
        point = point + 1;
        score.textContent = `+ ${point}`;
      };
      addtd.appendChild(addButton);
      studentDiv.appendChild(addtd);

      // 加 3 分按鈕
      const add3td = document.createElement('td');
      const add3Button = document.createElement('button');
      add3Button.className = 'button is-large is-info';
      add3Button.textContent = '+3';
      add3Button.onclick = async () => {
        await db.collection('serve').doc(today).update({ [student]: point + 3 });
        // alert(`${student} 加 3 分`);
        // location.reload();
        point = point + 3;
        score.textContent = `+ ${point}`;
      };
      add3td.appendChild(add3Button);
      studentDiv.appendChild(add3td);

      // 歸零按鈕
      const resetTd = document.createElement('td');
      const resetButton = document.createElement('button');
      resetButton.className = 'button is-large is-danger';
      resetButton.textContent = '歸零';
      resetButton.onclick = async () => {
        await db.collection('serve').doc(today).update({ [student]: 0 });
        // alert(`${student} 分數歸零`);
        // location.reload();
        point = 0;
        score.textContent = `+ ${point}`;
      };
      resetTd.appendChild(resetButton);
      studentDiv.appendChild(resetTd);

      // 輸入
      const inputTd = document.createElement('td');
      const inputD1 = document.createElement('div');
      const inputD2 = document.createElement('div');
      const inputD3 = document.createElement('div');
      const inputInp = document.createElement('input');
      const inputBtn = document.createElement('button');
      inputD1.className = 'field has-addons';
      inputD2.className = 'control';
      inputD3.className = 'control';

      inputInp.className = 'input is-large';
      inputInp.type = 'text';
      inputInp.placeholder = '加分';
      inputInp.style.width = '85px';

      inputBtn.className = 'button is-primary is-large';
      inputBtn.textContent = '送出';
      inputBtn.onclick = async () => {
        await db.collection('serve').doc(today).update({ [student]: point +  Number(inputInp.value)});
        point = point + Number(inputInp.value);
        score.textContent = `+ ${point}`;
        inputInp.value = "";
      };
      
      // inputTd.innerHTML = `
      // <div class="field has-addons">
      //   <div class="control">
      //     <input class="input is-large" style="width: 85px;" type="text" placeholder="加分">
      //   </div>
      //   <div class="control" onclick="additionalAdd('${student}', ${point}, this.previousElementSibling.firstElementChild.value)">
      //     <button class="button is-primary is-large">送出</button>
      //   </div>
      // </div>
      // `;
      inputTd.appendChild(inputD1);
      inputD1.appendChild(inputD2);
      inputD1.appendChild(inputD3);
      inputD2.appendChild(inputInp);
      inputD3.appendChild(inputBtn);
      studentDiv.appendChild(inputTd);

      studentsScoresDiv.appendChild(studentDiv);
    });
  }
}

// async function additionalAdd(name, point, value) {
//   await db.collection('serve').doc(today).update({ [name]: point + Number(value) });
//   // alert(`${name} + ${value}`);
//   location.reload();
// }

function parameter() {
  // 解析 URL 中的參數
  const urlParams = new URLSearchParams(window.location.search);
  const group = urlParams.get('group');

  // 將參數附加到各個鏈接上
  document.getElementById("signinLink").href = "signin.html?group=" + group;
  document.getElementById("newFriendLink").href = "newfriend.html?group=" + group;
  document.getElementById("displayLink").href = "display.html?group=" + group;
}

document.addEventListener("DOMContentLoaded", async function() {
  parameter();

  creatTable();
});