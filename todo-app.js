
(function () {
    let todoItems = [];

    const toDoStorage = {
        load(key) {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        },
        save(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify(data));
            } catch (e) {
                console.error("Error saving to localStorage:", e);
            }
        }
    };

    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.type = 'submit';
        button.disabled = true;

        buttonWrapper.append(button);
        form.append(input, buttonWrapper);

        input.addEventListener('input', function () {
            button.disabled = !input.value.trim();
        });

        return {
            form,
            input,
            button
        };

    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;

    }

    function createTodoItem({ id, name, done }, localStorageKey) {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        if (done) {
            item.classList.add('list-group-item-success');
        }

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        doneButton.addEventListener('click', function () {
            item.classList.toggle('list-group-item-success');
            let todoItem = todoItems.find(todo => todo.id === id);
            if (todoItem) {
                todoItem.done = !todoItem.done;
                toDoStorage.save(localStorageKey, todoItems);
            }
        });


        deleteButton.addEventListener('click', function () {
            if (confirm('Точно?')) {
                item.remove();
                todoItems = todoItems.filter(todo => todo.id !== id);
                toDoStorage.save(localStorageKey, todoItems);
            }
        });


        return {
            item,
            doneButton,
            deleteButton,
        };

    }


    function createTodoApp(container, title = 'Список дел', listName = 'default') {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        const localStorageKey = `todo-${listName}`;
        todoItems = toDoStorage.load(localStorageKey);

        todoList.innerHTML = '';


        todoItems.forEach(item => {
            let todoListItem = createTodoItem(item, localStorageKey);
            todoList.append(todoListItem.item);
        });

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        todoItemForm.form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!todoItemForm.input.value) {
                return;
            }
            let newId = todoItems.length > 0 ? Math.max(...todoItems.map(item => item.id)) + 1 : 1;

            let todoItem = {
                id: newId,
                name: todoItemForm.input.value,
                done: false
            };

            todoItems.push(todoItem);

            let todoListItem = createTodoItem(todoItem);
            todoList.append(todoListItem.item);
            toDoStorage.save(localStorageKey, todoItems);

            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;
        });
    }

    window.createTodoApp = createTodoApp;

})();



