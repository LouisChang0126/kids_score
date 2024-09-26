const today = new Date().toISOString().slice(2, 10).replace(/-/g, '');

async function display() {
  // 從 serve collection 抓取當天資料
  doc = await db.collection('serve').doc(today).get()
  if (doc.exists) {
    const data = doc.data();
    const studentsScoresDiv = document.getElementById('scores-display');

    Object.keys(data).forEach(student => {
      const studentDiv = document.createElement('div');
      studentDiv.className = 'box';

      const studentName = document.createElement('h2');
      studentName.className = 'title is-4';
      studentName.textContent = student;
      studentDiv.appendChild(studentName);

      const score = document.createElement('p');
      score.textContent = `分數: ${data[student]}`;
      studentDiv.appendChild(score);

      studentsScoresDiv.appendChild(studentDiv);
    });
  }
  else {
    alert("今天尚未點名！");
  }
}

function parameter() {
  // 解析 URL 中的參數
  const urlParams = new URLSearchParams(window.location.search);
  const group = urlParams.get('group');

  // 將參數附加到各個鏈接上
  document.getElementById("signinLink").href = "signin.html?group=" + group;
  document.getElementById("scoreLink").href = "score.html?group=" + group;
  document.getElementById("newFriendLink").href = "newfriend.html?group=" + group;
}

document.addEventListener("DOMContentLoaded", async function() {
  parameter();

  display();
});