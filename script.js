const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyMessage = document.getElementById('empty-message');
const remainingCount = document.getElementById('remaining-count');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');

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
