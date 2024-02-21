class StoryBook {
    constructor() {
        this.books = localStorage.getItem('books') ? JSON.parse(localStorage.getItem('books')) : [];
        this.bookList = document.querySelector('[data-book-list]');
        this.importFile = document.querySelector('#importLabel span');
        this.importInput = document.querySelector('#importInput');
        this.btnAddBook = document.querySelector('[data-add-book]');
        this.btnExport = document.querySelector('[data-btn-export]');
        this.btnImport = document.querySelector('[data-btn-import]');
        this.btnSortRating = document.querySelector('[data-sort-rating]');
        this.btnSortYear = document.querySelector('[data-sort-year]');
        this.isEdited = false;
        this.isSort = false;

        this.btnAddBook.addEventListener('click', this.addBook.bind(this));
        this.btnExport.addEventListener('click', this.exportBooks.bind(this));
        this.btnImport.addEventListener('click', this.importBooks.bind(this));
        this.btnSortRating.addEventListener('click', this.sortRating.bind(this, 'rating'));
        this.btnSortYear.addEventListener('click', this.sortRating.bind(this, 'year'));

        this.bookList.addEventListener('click', (e) => {
            this.removeBook(e);
            this.updateBook(e);
        });

        this.importInput.addEventListener('change', () => {
            this.importFile.textContent = `Файл: ${this.importInput.files[0].name}`
        })
    }

    init() {
        this.renderBook();
        this.addBook();
    }

    saveLocalStorage(){
        localStorage.setItem('books', JSON.stringify(this.books));
    }

    exportBooks() {
        const data = JSON.stringify(this.books);
        const blob = new Blob([data], { type: 'application/json' });
        this.btnExport.href = URL.createObjectURL(blob);
        this.btnExport.download = 'books.json';
    }

    addBook() {
        const title = document.getElementById('book-name').value;
        const author = document.getElementById('book-author').value;
        const year = document.getElementById('book-year').value;
        const genre = document.getElementById('book-genre').value;
        const rating = document.getElementById('book-rating').value;

        if(title && author) {
            this.books.push({title, author, year, genre, rating});
            this.saveLocalStorage();
            this.renderBook();
            this.clearInputs();
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

    removeBook(e) {
        if(e.target && e.target.matches('[data-remove-book]')) {
            const bookId = e.target.closest('li').id;
            this.books = this.books.filter(book => book.title !== bookId);
            this.saveLocalStorage();
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