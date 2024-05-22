document.addEventListener('DOMContentLoaded', () => {
    const randomJokeButton = document.getElementById('random-joke');
    const chooseCategoryButton = document.getElementById('choose-category');
    const buttonsDiv = document.getElementById('buttons');
    const jokeTypeButtonsDiv = document.getElementById('joke-type-buttons');
    const singlePartButton = document.getElementById('single-part');
    const twoPartButton = document.getElementById('two-part');
    const jokeContainer = document.getElementById('joke-container');
    const jokeText = document.getElementById('joke');
    const jokeButtons = document.getElementById('joke-buttons');
    const anotherJokeButton = document.getElementById('another-joke');
    const chooseAgainButton = document.getElementById('choose-again');
    const categoriesDiv = document.getElementById('categories');

    let lastAction = null;
    let jokeType = 'single'; // default to single part joke

    randomJokeButton.addEventListener('click', () => {
        fadeOut(buttonsDiv, () => {
            jokeTypeButtonsDiv.classList.remove('hidden');
            jokeTypeButtonsDiv.classList.add('fade');
            lastAction = fetchRandomJoke;
        });
    });

    chooseCategoryButton.addEventListener('click', () => {
        fadeOut(buttonsDiv, () => {
            jokeTypeButtonsDiv.classList.remove('hidden');
            jokeTypeButtonsDiv.classList.add('fade');
            lastAction = displayCategories;
        });
    });

    singlePartButton.addEventListener('click', () => {
        jokeType = 'single';
        handleJokeTypeSelection();
    });

    twoPartButton.addEventListener('click', () => {
        jokeType = 'twopart';
        handleJokeTypeSelection();
    });

    anotherJokeButton.addEventListener('click', () => {
        if (lastAction) lastAction();
    });

    chooseAgainButton.addEventListener('click', () => {
        fadeOut(jokeContainer, () => {
            jokeContainer.classList.add('hidden');
            buttonsDiv.classList.remove('hidden');
            buttonsDiv.classList.add('fade');
        });
        fadeOut(categoriesDiv, () => {
            categoriesDiv.classList.add('hidden');
        });
        fadeOut(jokeTypeButtonsDiv, () => {
            jokeTypeButtonsDiv.classList.add('hidden');
        });
    });

    function fetchRandomJoke() {
        fetch(`https://v2.jokeapi.dev/joke/Any?type=${jokeType}`)
            .then(response => response.json())
            .then(data => displayJoke(data));
    }

    function displayCategories() {
        fetch('https://v2.jokeapi.dev/categories')
            .then(response => response.json())
            .then(data => {
                categoriesDiv.innerHTML = data.categories.map(category =>
                    `<button class="category-button">${category}</button>`
                ).join('');
                document.querySelectorAll('.category-button').forEach(button => {
                    button.addEventListener('click', () => {
                        fetchJokeByCategory(button.textContent);
                    });
                });
                fadeOut(jokeTypeButtonsDiv, () => {
                    categoriesDiv.classList.remove('hidden');
                    categoriesDiv.classList.add('fade');
                });
            });
    }

    function fetchJokeByCategory(category) {
        fetch(`https://v2.jokeapi.dev/joke/${category}?type=${jokeType}`)
            .then(response => response.json())
            .then(data => {
                fadeOut(categoriesDiv, () => {
                    categoriesDiv.classList.add('hidden');
                    jokeContainer.classList.remove('hidden');
                    jokeContainer.classList.add('fade');
                    displayJoke(data);
                    lastAction = () => fetchJokeByCategory(category);
                });
            });
    }

    function displayJoke(data) {
        jokeText.textContent = data.joke || `${data.setup} - ${data.delivery}`;
    }

    function handleJokeTypeSelection() {
        if (lastAction === fetchRandomJoke) {
            fadeOut(jokeTypeButtonsDiv, () => {
                jokeContainer.classList.remove('hidden');
                jokeContainer.classList.add('fade');
                fetchRandomJoke();
            });
        } else if (lastAction === displayCategories) {
            fadeOut(jokeTypeButtonsDiv, () => {
                categoriesDiv.classList.remove('hidden');
                categoriesDiv.classList.add('fade');
                displayCategories();
            });
        }
    }

    function fadeOut(element, callback) {
        element.classList.add('fade');
        setTimeout(() => {
            element.classList.add('hidden');
            element.classList.remove('fade');
            callback();
        }, 500);
    }
});
