//Создаем класс
class Book {
    //Создаем публичные свойства
    constructor(title, author, year, genre, rating) {
        //Все что будет заходить в класс сохраняем как глобальные свойства объекта через this
        this.title = title;
        this.author = author;
        this.year = year;
        this.genre = genre;
        this.rating_ = rating;
    }

    //При вызове метода класс отдаст нам строку со всеми параметрами которые есть в классе
    get getAll() {
        return `Название книги: ${this.title}, Автор: ${this.author}, Год издания: ${this.year}, Жанр: ${this.genre}, Рейтинг: ${this.rating}`
    }

    //Надо будет поменять рейтинг книги вызываем этот метод и передаем новое значение рейтинга
    set rating(newRating) {
        if(newRating >= 0 && newRating <= 10) {
            this.rating_ = newRating
        } else {
            throw new Error('Рейтинг не находится в диапозоне от 0 до 10')
        }
    }

    toString() {
        return this.getAll;
    }
}

function sortBooksByRating(books) {
    return books.sort((a, b) => a.rating_ - b.rating_)
}

function filterBooksByGenre(books, genre) {
    return books.filter(book => book.genre === genre)
}

function findBookByTitle(books, title) {
    const book = books.find(book => book.title === title)
    return book !== undefined ? book : null
}

export {
    Book,
    sortBooksByRating,
    filterBooksByGenre,
    findBookByTitle,
}