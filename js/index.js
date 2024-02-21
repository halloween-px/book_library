//Это главный файл нашего проекта, тут я запускаю и тестовый клас Book, и сам GUE / Этот же файл подключается в html
import {Book, filterBooksByGenre, findBookByTitle, sortBooksByRating} from "./modules/book.js"; // Импортируем сам класс и функции
import StoryBook from "./modules/storyBook.js"; // Мой сторибук (Тут вся логика по второму заданию)

const App = {
    init() {
        this.testBook();
        this.storyBook();
    },

    storyBook() {
      new StoryBook().init();
    },

    //Сделано по правилам первого задания. Импортируем класс и функции, создаем массив, выполняем результат в консоли
    testBook() {
        const books = [
            new Book('Things Fall Apart', 'Chinua Achebe', '1958', 'horror', '8'),
            new Book('Fairy tales', 'Hans', '1836', 'adventures', '6'),
            new Book('The Divine Comedy', 'Dante Alighieri', '1315', 'сomedy', '7'),
        ];

        console.log(sortBooksByRating(books))
        console.log(filterBooksByGenre(books, 'horror'))
        console.log(findBookByTitle(books, 'The Divine Comedy'))
    },
}

//Запуск! :)
App.init();