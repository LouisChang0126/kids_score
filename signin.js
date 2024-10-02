const today = new Date().toISOString().slice(2, 10).replace(/-/g, '');
// 解析 URL 中的參數
const urlParams = new URLSearchParams(window.location.search);
const group = urlParams.get('group');

async function load_signin() {
  var students = [];
  const group_name = ['小寶','中寶','大寶'];
  for(let group of group_name){
    const snapshot = await db.collection('serve').doc(today+group).get();
    if (snapshot.exists) {
      students = students.concat(Object.keys(snapshot.data()));  // 提取所有字段名稱（鍵）並存為數組
    }
  }
  return students;
}

async function load_all_students() {
  let students = {};
  // 从 kids collection 中抓取学生名单
  const snapshot = await db.collection('kids').get();  // 使用 await 等待 Promise 完成
  snapshot.forEach(doc => {
    const studentName = doc.id;
    students[studentName] = doc.data()['group'];
  });
  // console.log(students);
  return students;
}

function createButton(studentNames) {
  var studentsDiv = document.getElementById('students');
  studentsDiv.innerHTML = '';  // 清空之前的按钮，以便重新创建
  if(Object.keys(studentNames).length === 0){
    const nobody = document.createElement('h1');
    nobody.className = 'title is-1';
    nobody.textContent = "大家都到囉!!!";
    studentsDiv.appendChild(nobody);
  }
  else{
    Object.entries(studentNames).forEach(([name, group]) => {
      const studentButton = document.createElement('button');
      if(group == '小寶'){
        studentButton.className = 'button is-large is-success m-2';
        studentsDiv = document.getElementById('group1');
      }
      else if(group == '中寶'){
        studentButton.className = 'button is-large is-info m-2';
        studentsDiv = document.getElementById('group2');
      }
      else{
        studentButton.className = 'button is-large is-danger m-2';
        studentsDiv = document.getElementById('group3');
      }
      studentButton.textContent = name;

      // 點名按鈕功能
      studentButton.onclick = async () => {
        const snapshot = await db.collection('serve').doc(today+group).set({ [name]: 0 }, { merge: true });
        // window.location.reload();
        studentButton.remove();
      };

      studentsDiv.appendChild(studentButton);
      // studentsDiv.appendChild(document.createElement('br'));
    });
  }
}

async function getDifference() {
  var allStudents = await load_all_students();  // 获取所有学生名单
  var SigninStudents = await load_signin();  // 获取签到学生名单
  // 计算差集
  // 删除已签到学生
  console.log(allStudents);
  console.log(SigninStudents);
  SigninStudents.forEach(student => {
    delete allStudents[student];
  });
  console.log(allStudents);
  return allStudents;
}

function parameter() {
  // 將參數附加到各個鏈接上
  document.getElementById("scoreLink").href = "score.html?group=" + group;
  document.getElementById("newFriendLink").href = "newfriend.html?group=" + group;
  document.getElementById("displayLink").href = "display.html?group=" + group;
}

document.addEventListener("DOMContentLoaded", async function() {
  parameter();
  
  var difference = await getDifference();
  createButton(difference);
});