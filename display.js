const today = new Date().toISOString().slice(2, 10).replace(/-/g, '');
// 解析 URL 中的參數
const urlParams = new URLSearchParams(window.location.search);
const group = urlParams.get('group');

async function display() {
  doc = await db.collection('serve').doc(today+group).get()
  if (doc.exists) {
    const data = doc.data();
    const studentsScoresDiv = document.getElementById('scores-display');

    Object.entries(data).sort(([, valueA], [, valueB]) => valueB - valueA) // 按照值從大到小排序
      .forEach(([student, point]) => {
        const studentDiv = document.createElement('div');
        studentDiv.className = 'box py-5 mx-6';
        const studentName = document.createElement('h2');
        studentName.className = 'title is-3 mx-6';
        studentName.textContent = student;
        studentDiv.appendChild(studentName);
  
        const score = document.createElement('h2');
        score.className = 'subtitle is-3 mx-6';
        score.textContent = `點數: ➡️ ${point}`;
        //<h2 class="subtitle is-3 mx-3">點數: 12 + 40 ➡️ <b>52</b></h2>
        studentDiv.appendChild(score);
  
        studentsScoresDiv.appendChild(studentDiv);
    });
  }
  else {
    alert("今天尚未點名！");
  }
}

function parameter() {
  // 將參數附加到各個鏈接上
  document.getElementById("signinLink").href = "signin.html?group=" + group;
  document.getElementById("scoreLink").href = "score.html?group=" + group;
  document.getElementById("newFriendLink").href = "newfriend.html?group=" + group;
}

document.addEventListener("DOMContentLoaded", async function() {
  parameter();

  display();
});