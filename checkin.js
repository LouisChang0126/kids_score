const today = new Date().toISOString().slice(2, 10).replace(/-/g, '');

async function load_signin() {
  var students = [];
  const snapshot = await db.collection('serve').doc(today).get();
  if (snapshot.exists) {
    students = Object.keys(snapshot.data());  // 提取所有字段名稱（鍵）並存為數組
  }
  return students;
}

async function load_all_students() {
  var students = [];  // 使用 const 以保持不可变性
  // 从 kids collection 中抓取学生名单
  const snapshot = await db.collection('kids').get();  // 使用 await 等待 Promise 完成
  snapshot.forEach(doc => {
    const studentName = doc.id;
    students.push(studentName);
  });
  return students;
}

function createButton(studentNames) {
  const studentsDiv = document.getElementById('students');
  studentsDiv.innerHTML = '';  // 清空之前的按钮，以便重新创建
  studentNames.forEach(studentName => {
    const studentButton = document.createElement('button');
    studentButton.className = 'button is-large is-info m-2';
    studentButton.textContent = studentName;

    // 點名按鈕功能
    studentButton.onclick = async () => {
      const snapshot = await db.collection('serve').doc(today).set({ [studentName]: 0 }, { merge: true });
      alert(`${studentName} 簽到成功!`);
      window.location.reload();
    };

    studentsDiv.appendChild(studentButton);
    // studentsDiv.appendChild(document.createElement('br'));
  });
}

async function printDifference() {
  const allStudents = await load_all_students();  // 获取所有学生名单
  const notSigninStudents = await load_signin();  // 获取签到学生名单
  // 计算差集
  const difference = allStudents.filter(student => !notSigninStudents.includes(student));
  return difference;
}

document.addEventListener("DOMContentLoaded", async function() {
  var difference = await printDifference();
  createButton(difference);
});