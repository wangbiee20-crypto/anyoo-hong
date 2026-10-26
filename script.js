const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyMessage = document.getElementById('empty-message');
const remainingCount = document.getElementById('remaining-count');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');

let deletedLog = JSON.parse(localStorage.getItem('deletedLog') || '[]');
const deletedList = document.getElementById('deleted-list');
const deletedEmpty = document.getElementById('deleted-empty');

function renderDeleted() {
  deletedList.innerHTML = '';
  deletedLog.slice().reverse().forEach(function (item) {
    const li = document.createElement('li');
    const text = document.createElement('span');
    text.textContent = item.text;
    const time = document.createElement('time');
    time.textContent = new Date(item.at).toLocaleString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
    li.append(text, time);
    deletedList.append(li);
  });
  deletedEmpty.hidden = deletedLog.length > 0;
}

function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function render() {
  list.innerHTML = '';
  const order = todos.map(function (todo, index) { return index; });
  order.sort(function (a, b) {
    return Number(!!todos[b].starred) - Number(!!todos[a].starred) || a - b;
  });
  order.forEach(function (index) {
    const todo = todos[index];
    const li = document.createElement('li');
    if (todo.done) li.className = 'done';

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = todo.done;
    check.addEventListener('change', function () {
      todos[index].done = check.checked;
      save();
      render();
    });

    const star = document.createElement('button');
    star.type = 'button';
    star.className = 'star' + (todo.starred ? ' on' : '');
    star.textContent = '★';
    star.addEventListener('click', function () {
      todos[index].starred = !todos[index].starred;
      save();
      render();
    });

    const text = document.createElement('span');
    text.textContent = todo.text;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = '삭제';
    remove.addEventListener('click', function () {
      deletedLog.push({ text: todos[index].text, at: Date.now() });
      localStorage.setItem('deletedLog', JSON.stringify(deletedLog));
      renderDeleted();
      todos.splice(index, 1);
      save();
      render();
    });

    li.append(check, star, text, remove);
    list.append(li);
  });
  emptyMessage.hidden = todos.length > 0;
  const remaining = todos.filter(function (todo) { return !todo.done; }).length;
  remainingCount.textContent = '남은 할 일: ' + remaining + '개';
}

form.addEventListener('submit', function (event) {
  event.preventDefault();
  const text = input.value.trim();
  if (text === '') return;
  todos.push({ text: text, done: false });
  input.value = '';
  save();
  render();
});

render();
renderDeleted();

const todayDate = new Date();
let viewYear = todayDate.getFullYear();
let viewMonth = todayDate.getMonth();

function renderCalendar() {
  const grid = document.getElementById('calendar-grid');
  document.getElementById('calendar-title').textContent = viewYear + '년 ' + (viewMonth + 1) + '월';
  grid.innerHTML = '';

  ['일', '월', '화', '수', '목', '금', '토'].forEach(function (name) {
    const head = document.createElement('div');
    head.className = 'day-name';
    head.textContent = name;
    grid.append(head);
  });

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const lastDate = new Date(viewYear, viewMonth + 1, 0).getDate();
  const isThisMonth = viewYear === todayDate.getFullYear() && viewMonth === todayDate.getMonth();
  for (let i = 0; i < firstDay; i++) {
    grid.append(document.createElement('div'));
  }
  for (let date = 1; date <= lastDate; date++) {
    const cell = document.createElement('div');
    cell.className = 'day' + (isThisMonth && date === todayDate.getDate() ? ' today' : '');
    cell.textContent = date;
    grid.append(cell);
  }
}

document.getElementById('prev-month').addEventListener('click', function () {
  viewMonth -= 1;
  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear -= 1;
  }
  renderCalendar();
});

document.getElementById('next-month').addEventListener('click', function () {
  viewMonth += 1;
  if (viewMonth > 11) {
    viewMonth = 0;
    viewYear += 1;
  }
  renderCalendar();
});

renderCalendar();
