//Создаем класс Списка наших книг
class StoryBook {
    constructor() {
        //В конструктор ничего не передаем так как незачем. Создаем наш главный масив this.book, проверка есть ли он в localstorage, либо пустой масив. Это нам поможет в дальнейшем рендерить и понимать какие данные у нас есть.
        //Так же находим все необходимые елементы для реализации задуманного.
        this.books = localStorage.getItem('books') ? JSON.parse(localStorage.getItem('books')) : [];
        this.bookList = document.querySelector('[data-book-list]');
        this.importFile = document.querySelector('#importLabel span');
        this.importInput = document.querySelector('#importInput');
        this.btnAddBook = document.querySelector('[data-add-book]');
        this.btnExport = document.querySelector('[data-btn-export]');
        this.btnImport = document.querySelector('[data-btn-import]');
        this.btnSortRating = document.querySelector('[data-sort-rating]');
        this.btnSortYear = document.querySelector('[data-sort-year]');
        //Так же ниже создал два флага, которые мне помогли реализовать функционал сортировки и редактирования.
        this.isEdited = false;
        this.isSort = false;

        //Все прослушки проекта.
        this.btnAddBook.addEventListener('click', this.addBook.bind(this));
        this.btnExport.addEventListener('click', this.exportBooks.bind(this));
        this.btnImport.addEventListener('click', this.importBooks.bind(this));
        this.btnSortRating.addEventListener('click', this.sortRating.bind(this, 'rating'));
        this.btnSortYear.addEventListener('click', this.sortRating.bind(this, 'year'));

        //Так как createBook генерирует html елементы а в этих элементах есть две кнопки которые нужны мне для удаления и редактирования,
        //и что бы не бегать циклом по каждой конопке и вешать обработчики событий, принял решение изначально повесеть один обработчик,
        //a далее уже отслеживать почему я кликнул (Избегаем циклов, навешивания обработчиков)
        this.bookList.addEventListener('click', (e) => {
            this.removeBook(e);
            this.updateBook(e);
        });

        //Повесиль слушатель на смену состояния инпута который принимает в себя загруженный документ, дефолтный инпут file выглядит не очень, и его сложно стилизовать
        //поэтому черезе прослушку реализую вывод закачанного файла.
        this.importInput.addEventListener('change', () => {
            this.importFile.textContent = `Файл: ${this.importInput.files[0].name}`
        })
    }

    init() {
        this.renderBook();
        this.addBook();
    }

    //Сохраняем в localStorage, что бы каждый раз не писать вынес в метод
    saveLocalStorage(){
        localStorage.setItem('books', JSON.stringify(this.books));
    }

    //Тут думаю понятно, перерводим массив в json, создаем блоб объект и узкаываем тип данных, устанавливаем ссылку на этот объект и название самого файла
    exportBooks() {
        const data = JSON.stringify(this.books);
        const blob = new Blob([data], { type: 'application/json' });
        this.btnExport.href = URL.createObjectURL(blob);
        this.btnExport.download = 'books.json';
    }

    //Добавление книги, (Решил каждый элемент искать отдельно без циклов и проверок по нейму. Все равно надо знать из какого инпута пришла данные)
    addBook() {
        const title = document.getElementById('book-name').value;
        const author = document.getElementById('book-author').value;
        const year = document.getElementById('book-year').value;
        const genre = document.getElementById('book-genre').value;
        const rating = document.getElementById('book-rating').value;

        //Подумал что title и author достаточно для создания книги
        if(title && author) {
            //Пушим
            this.books.push({title, author, year, genre, rating});
            //сохраняем в LocalStorage
            this.saveLocalStorage();
            //Рендерим блок
            this.renderBook();
            //Отчищаем введенные данные
            this.clearInputs();
            //Это тактика будет выполнятся везде напишу один раз :)
        }
    }

    clearInputs() {
        const inputs = document.querySelectorAll('.storybook-header input');
        inputs.forEach(input => input.value = '');
    }

    importBooks() {
        const file = this.importInput.files[0];
        const reader = new FileReader();
        const $this = this;
        reader.onload = function(e) {
            $this.books = JSON.parse(e.target.result);
            $this.saveLocalStorage();
            $this.renderBook();
        }
        if(!file) return;
        reader.readAsText(file);
    }

    //Удаление книги
    removeBook(e) {
        if(e.target && e.target.matches('[data-remove-book]')) {
            //Так как кноки удаления мы создаем, я решил что от это кнопки буду подниматься к родителю
            const bookId = e.target.closest('li').id;
            //с помощью фильтра сохранял в наш масив то что не соответствовало id
            this.books = this.books.filter(book => book.title !== bookId);
            //сохраняем
            this.saveLocalStorage();
            //рендерим
            this.renderBook();
        }
    }

    updateBook(e) {
        if(e.target && e.target.matches('[data-update-book]')) {
            this.isEdited = !this.isEdited;
            const book = e.target.closest('li');
            const bookId = e.target.closest('li').id;
            const index = this.books.findIndex(book => book.title === bookId);
            const changeableBook = this.books[index];
            const bookInfos= book.querySelectorAll('span');

            if(this.isEdited) {
                e.target.textContent = 'Сохранить'
                bookInfos.forEach(el => {
                    el.setAttribute('contenteditable', 'true');
                    el.classList.add('active');
                })
                return;
            }

            bookInfos.forEach((el) => {
                const edit = el.getAttribute('data-edit');
                changeableBook[edit] = el.textContent;
                el.setAttribute('contenteditable', 'false');
                el.classList.remove('active');
                e.target.textContent = 'Редактировать'
            });
            this.saveLocalStorage();
        }
    }

    sortRating(type) {
        this.isSort = !this.isSort;
        this.books = this.sortBooks(this.books, type);
        this.saveLocalStorage();
        this.renderBook();
    }

    sortBooks(books, type) {
        return books.sort((a, b) => this.isSort ? a[type] - b[type] : b[type] - a[type]);
    }

    //Решил создавать html элемент именно так , потому что нужно создать li потом в на него повесить класс атрбут,  это долго )
    createBook(title, author, year, genre, rating) {
        return `
            <li class="list-item" id="${title}">
                <span data-edit="title">${title}</span>
                <span data-edit="author">${author}</span>
                <span data-edit="genre">${genre ? genre : '-'}</span>
                <span data-edit="year">${year ? year : '-'}</span>
                <span data-edit="rating">${rating ? rating : '-'}</span>
               <button class="btn btn-additional btn-sm" data-remove-book>Удалить</button>
               <button class="btn btn-additional btn-sm" data-update-book>Редактировать</button>
             </li>`
    }

    renderBook() {
        if(!this.bookList) return;
        this.bookList.innerHTML = '';

        this.books.forEach(book => {
            const {title, author, year, genre, rating} = book;
            const li = this.createBook(title, author, year, genre, rating);
            this.bookList.insertAdjacentHTML('beforeend', li);
        })
    }
}

export default StoryBook;