const today = new Date().toISOString().slice(2, 10).replace(/-/g, '');

// 從 serve collection 抓取當天資料
db.collection('serve').doc(today).get().then(doc => {
  if (doc.exists) {
    const data = doc.data();
    const studentsScoresDiv = document.getElementById('students-scores-display');

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
});