
/** Selectors */
let addBtn = document.getElementById('add');
let modal = document.querySelector('.modal');
// let closeBtn = document.querySelector('.close-button');
let form = document.getElementById('addBookForm');
let booksGrid = document.getElementById('books-grid');
let bookTitle = document.getElementById('title');
let bookAuthor = document.getElementById('author');
let bookPages = document.getElementById('pages');
let hasRead = document.getElementById('hasRead');
let errorMsg = document.getElementById('errorMsg');

/** Class declarations */
class Book {
    constructor(
        title = 'Unknown',
        author = 'Unknown',
        pages = '0',
        isRead = false
    ){
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = isRead;
    }
}

class Library {
    constructor() {
        this.books = [];
    }

    addBook(newBook) {
        if (!this.isInLibrary(newBook)) {
            this.books.push(newBook);
        }
    }

    removeBook(title) {
        this.books = this.books.filter((book) => book.title !== title)
    }

    getBook(title) {
       return this.books.find((book) => book.title === title);
    }

    isInLibrary(newBook) {
        return this.books.some((book) => book.title === newBook.title);
    }
}

const library = new Library();

/** Helper functions */
function toggleModal () {
    form.reset();
    errorMsg.textContent = '';
    errorMsg.classList.remove('active');
    modal.classList.toggle('show-modal');
}

function windowOnClick(e) {
    e.target === modal ? toggleModal() : null;
}

function createBookCard(book) {
    const bookCard = document.createElement('li');
    const link = document.createElement('a');

    const title = document.createElement('h2');
    const author = document.createElement('p');
    const pages = document.createElement('p');
    const label = document.createElement('label');
    const closeBtn = document.createElement('span');

    closeBtn.textContent = '×';
    closeBtn.classList.add('close-button');
    title.textContent = `${book.title}`;
    author.textContent = book.author;
    pages.textContent = `${book.pages} pages`;
    label.textContent = `read it?`;
    book.isRead ?
        label.style.textDecoration = 'line-through' : label.style.textDecoration = 'none';

    label.onclick = (e) => toggleRead(e);
    closeBtn.onclick = () => removeBook(title);

    link.appendChild(closeBtn);
    link.appendChild(title);
    link.appendChild(author);
    link.appendChild(pages);
    link.appendChild(label);
    bookCard.appendChild(link);

    booksGrid.appendChild(bookCard);
}

function toggleRead(e) {
    const title = e.target.parentNode.firstChild.innerText;
    const book = library.getBook(title);

    book.isRead = !book.isRead;
    saveLocal();
    updateBooksGrid();
}

function getBookFromInput() {
    let title = bookTitle.value;
    let author = bookAuthor.value;
    let pages = bookPages.value;
    let isRead = hasRead.checked;

    return new Book(title, author, pages, isRead);
}

function resetBooksGrid() {
    // console.log(booksGrid);
    booksGrid.innerHTML = ''
}

function updateBooksGrid() {
    resetBooksGrid();
    for(let book of library.books) {
        createBookCard(book);
        // console.log(book);
    }
}

function addBook(e) {
    e.preventDefault();
    const newBook = getBookFromInput();

    if(library.isInLibrary(newBook)) {
        errorMsg.textContent = `Book already exists in your library`;
        errorMsg.classList.add('active');
        return
    }

    library.addBook(newBook);
    saveLocal();
    updateBooksGrid();

    toggleModal();
}

function removeBook(title) {
    library.removeBook(title.textContent);
    saveLocal();
    updateBooksGrid();
}

/** Event listeners */

addBtn.onclick = () => toggleModal();
form.onsubmit = (e) => addBook(e);

// closeBtn.onclick = () => toggleModal();
window.onclick = (e) => windowOnClick(e);

/** Local storage */
function saveLocal() {
    localStorage.setItem('library', JSON.stringify(library.books));
}

function restoreLocal() {
    const books = JSON.parse(localStorage.getItem('library'))
    if(books) {
        library.books = books.map((book) => JSONtoBook(book));
    }
}

function JSONtoBook (book) {
    return new Book(book.title, book.author, book.pages, book.isRead)
}


window.onload = () => {
    restoreLocal();
    updateBooksGrid();
}