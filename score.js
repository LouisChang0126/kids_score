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
  // const studentsScoresDiv = document.getElementById('students-scores');
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
        alert(`${student} 加 1 分`);
        location.reload(); // 重新整理頁面
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
        alert(`${student} 加 3 分`);
        location.reload();
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
        alert(`${student} 分數歸零`);
        location.reload();
      };
      resetTd.appendChild(resetButton);
      studentDiv.appendChild(resetTd);

      studentsScoresDiv.appendChild(studentDiv);
    });
  }
}


document.addEventListener("DOMContentLoaded", async function() {
  creatTable();
});