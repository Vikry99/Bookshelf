const books = [];
const STORAGE_KEY = 'BOOKS_APP';
const RENDER_EVENT = 'render_book';
const SAVED_EVENT = 'saved-books';

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('form');
    const searchForm = document.getElementById('search-form');
    const backButton = document.getElementById('back-button');
    
    submitForm.addEventListener('submit', function (e){
        e.preventDefault();
        addTodo();
        this.reset();
    });

    searchForm.addEventListener('submit', function (e){
        e.preventDefault();
        searchBook();
        this.reset();
    });
    
    backButton.addEventListener('click', function (){
        location.reload();
    });


    if(checkStorage()){
        loadDataFromStorage();
    }
});

function getUserList() {
    if(checkStorage !== false){
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || []);
    } else {
        return [];
    } 
}


document.addEventListener(RENDER_EVENT, function(){
    const unComplatedBOOKList = document.getElementById('books');
    unComplatedBOOKList.innerHTML = '';

    const compalatedBOOKList = document.getElementById('complate-books');
    compalatedBOOKList.innerHTML = '';

    for(const bookItem of books){
        const bookElement = makeBook(bookItem);
        if(bookItem.isComplated == false){
            unComplatedBOOKList.appendChild(bookElement);
        } else {
            compalatedBOOKList.appendChild(bookElement);
        }
    }
});


document.addEventListener(SAVED_EVENT, function(){
    const section = document.querySelector("section");
    const closeBtn = document.querySelector(".close-btn");
    section.classList.add("active");
      closeBtn.addEventListener("click", () =>
        section.classList.remove("active")
      ); 
});

function generateId() {
    return +new Date();
};

function generateBookObject(id, title, writer, years, isComplated) {
    return {
        id,
        title,
        writer,
        years,
        isComplated
    }
};


function checkStorage() {
    if(typeof (Storage) === undefined){
        alert('Browser kamu tidak mendukung local storage');
        return false;
    } else {
        return true;
    }
}

function saveData() {
    if(checkStorage()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

function findBook(bookId) {
    for(const bookItem of books) {
        if(bookItem.id === bookId){
            return bookItem;
        }
    }
}

function findBookIndex(bookId) {
    for(const index in books) {
        if(books[index].id === bookId){
            return index;
        }
    }
    return -1;
}

function addTodo() {
    const idBook = generateId();
    const titleBook = document.getElementById('title').value;
    const writerBook = document.getElementById('writer').value;
    const yearBook = document.getElementById('year').value;
    const checkBook = document.getElementById('toggleSwitch').checked;

    console.log(checkBook);

    const bookObject = generateBookObject(idBook, titleBook, writerBook, yearBook, checkBook);
    books.push(bookObject);

    
    document.dispatchEvent(new Event(RENDER_EVENT));
    document.dispatchEvent(new Event(SAVED_EVENT));
    saveData();
}

function searchBook() {
    const keyword = document.getElementById('search-keyword').value.toLowerCase();
    const findBook = JSON.parse(localStorage.getItem(STORAGE_KEY));

    const uncompletedContainer = document.getElementById('books');
    const completedContainer = document.getElementById('complate-books');

    uncompletedContainer.innerHTML = '';
    completedContainer.innerHTML = '';

    for(const book of findBook){
        if(book.title.toLowerCase() === keyword || book.writer.toLowerCase() === keyword){

            const bookElement = makeBook(book);
            if(book.isComplated){
                completedContainer.appendChild(bookElement);
            } else {
                uncompletedContainer.appendChild(bookElement);
            }
        }
    }
}


function addTaskToComplated(bookId) {
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return

    bookTarget.isComplated = true;
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return

    bookTarget.isComplated = false
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeTaskFormComplated(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return

    books.splice(bookTarget, 1);
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
    
}

function makeBook(bookObject){
    const textTitle = document.createElement('h3');
    textTitle.innerHTML = `<b>Judul -</b> ${bookObject.title}`;

    const textWriter = document.createElement('p');
    textWriter.innerHTML = `<b>Penulis - </b> ${bookObject.writer}`;

    const textYear = document.createElement('p');
    textYear.innerHTML = `<b>Tahun - </b> ${bookObject.years}`;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textWriter, textYear);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if(bookObject.isComplated){
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function(){
            undoTaskFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function(){
            removeTaskFormComplated(bookObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function(){
            removeTaskFormComplated(bookObject.id);
        });

        checkButton.addEventListener('click', function(){
            addTaskToComplated(bookObject.id);
        });

        container.append(checkButton, trashButton);
    }

    return container
}

function loadDataFromStorage() {
    const bookStorage = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(bookStorage);
    if(data !== null){
        for(const book of data){
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}