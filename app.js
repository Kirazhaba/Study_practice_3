document.addEventListener('DOMContentLoaded', () => {
    const loadBtn = document.getElementById('loadBtn');
    const createForm = document.getElementById('createForm');
    const titleInput = document.getElementById('title');
    const bodyInput = document.getElementById('body');
    const publicationsList = document.getElementById('publicationsList');
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const createBtn = document.getElementById('createBtn');

    const GET_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=5';
    const POST_URL = 'https://jsonplaceholder.typicode.com/posts';

    function renderPost(post) {
        const postElement = document.createElement('div');
        postElement.className = 'publication-item';

        const titleElement = document.createElement('h3');
        titleElement.textContent = post.title;

        const bodyElement = document.createElement('p');
        bodyElement.textContent = post.body;

        postElement.appendChild(titleElement);
        postElement.appendChild(bodyElement);
        publicationsList.appendChild(postElement);
    }

    function showLoading(isLoading, message = 'Загрузка...') {
        if (isLoading) {
            loadingMessage.textContent = message;
            loadingMessage.classList.remove('hidden');
            loadBtn.disabled = true;
            createBtn.disabled = true;
        } else {
            loadingMessage.classList.add('hidden');
            loadBtn.disabled = false;
            createBtn.disabled = false;
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        successMessage.classList.add('hidden');
    }

    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.classList.remove('hidden');
        errorMessage.classList.add('hidden');
    }

    function clearMessages() {
        errorMessage.classList.add('hidden');
        successMessage.classList.add('hidden');
        loadingMessage.classList.add('hidden');
    }

    loadBtn.addEventListener('click', async () => {
        clearMessages();
        showLoading(true, 'Загрузка публикаций...');
        publicationsList.textContent = '';

        try {
            const response = await fetch(GET_URL);

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
            }

            const posts = await response.json();
            posts.forEach(renderPost);
        } catch (error) {
            showError(`Не удалось загрузить публикации: ${error.message}. Попробуйте еще раз.`);
        } finally {
            showLoading(false);
        }
    });

    createForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearMessages();

        const title = titleInput.value.trim();
        const body = bodyInput.value.trim();

        if (!title || !body) {
            showError('Заголовок и текст не могут быть пустыми или состоять только из пробелов.');
            return;
        }

        showLoading(true, 'Отправка публикации...');

        const postData = {
            title: title,
            body: body,
            userId: 1
        };

        try {
            const response = await fetch(POST_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();

            renderPost(result);

            showSuccess(`Публикация успешно создана! ID: ${result.id}, Заголовок: "${result.title}"`);
            createForm.reset();

        } catch (error) {
            showError(`Не удалось создать публикацию: ${error.message}. Попробуйте еще раз.`);
        } finally {
            showLoading(false);
        }
    });
});
