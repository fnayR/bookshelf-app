const LOCAL_STORAGE_KEY = "BOOKS_LOCAL_DATA";
const title = document.querySelector("#input-title");
const author = document.querySelector("#input-author");
const year = document.querySelector("#input-year");
const isRead = document.querySelector("#input-is-complete");
const searchTitle = document.querySelector("#search-title");
const buttonSearch = document.querySelector("#search-submit");
const buttonSubmit = document.querySelector("#book-submit");
const inputHeader = document.querySelector("#input-header");

let checkTitle;
let checkAuthor;
let checkYear;

window.addEventListener("load", function(){
    if (localStorage.getItem(LOCAL_STORAGE_KEY) !== null) {    
        const booksData = getData();
        showData(booksData);
    }
});

buttonSearch.addEventListener("click",function(search) {
    search.preventDefault();
    const getTitle = getData().filter(get => get.title.toLowerCase() === searchTitle.value.toLowerCase().trim());
    if (getTitle.length === 0) {
        alert(`Buku yang berjudul "${searchTitle.value}" tidak ditemukan.`);
    } else {
        showSearchResult(getTitle);
        searchTitle.value = ""; 
    }
});

function resultValidator(check) {
    let checkResult = [];
    check.forEach((get, i) => {
        if (get === false) {
            if (i === 0) {
                checkResult.push(false);
            }else if (i === 1) {
                checkResult.push(false);
            }else{
                checkResult.push(false);
            }
        }
    });
    return checkResult;
}

buttonSubmit.addEventListener("click", function() {
    if (buttonSubmit.value === "") {
        let checkInput = [];

        if (title.value === "") {
            checkTitle = false;
        } else {
            checkTitle = true;
        }

        if (author.value === "") {
            checkAuthor = false;
        } else {
            checkAuthor = true;
        }

        if (year.value === "") {
            checkYear = false;
        } else {
            checkYear = true;
        }

        checkInput.push(checkTitle, checkAuthor, checkYear);
        let checkResult = resultValidator(checkInput);

        if (checkResult.includes(false)) {
            return false;
        } else {
            const newBook = {
                id: +new Date(),
                title: title.value.trim(),
                author: author.value.trim(),
                year: parseInt(year.value),
                isComplete: isRead.checked
            };
            insertData(newBook);
                title.value = "";
                author.value = "";
                year.value = "";
                isRead.checked = false;
        }    
    } else {
        const bookData = getData().filter(get => get.id != buttonSubmit.value);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookData));

        const newBook = {
            id: buttonSubmit.value,
            title: title.value.trim(),
            author: author.value.trim(),
            year: parseInt(year.value),
            isComplete: isRead.checked
        };
        insertData(newBook);
            inputHeader.innerHTML = "Tambahkan Buku Baru";
            buttonSubmit.innerHTML = "Tambahkan Buku";
            buttonSubmit.value = "";
            title.value = "";
            author.value = "";
            year.value = "";
            isRead.checked = false;
            alert("Buku telah berhasil diedit");
    }
});

function insertData(book) {
    let bookData = [];
    if (localStorage.getItem(LOCAL_STORAGE_KEY) === null) {
        localStorage.setItem(LOCAL_STORAGE_KEY, 0);
    }else{
        bookData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    }
    bookData.unshift(book);   
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookData));
    showData(getData());
}

function getData() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
}

function isCompleteBook(id) {
    let bookConfirm = confirm("Apakah anda ingin memindahkan buku ini ke bagian selesai?");
    if (bookConfirm === true) {
        const bookDataInfo = getData().filter(get => get.id == id);
        const newBook = {
            id: bookDataInfo[0].id,
            title: bookDataInfo[0].title,
            author: bookDataInfo[0].author,
            year: bookDataInfo[0].year,
            isComplete: true
        };
        const bookData = getData().filter(get => get.id != id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookData));
        insertData(newBook);
        alert(`Buku "${bookDataInfo[0].title}" telah dipindahkan ke bagian selesai`);
    }else{
        return 0;
    }
}

function isNotCompleteBook(id) {
    let bookConfirm = confirm("Apakah anda ingin memindahkan buku ini ke bagian belum selesai?");
    if (bookConfirm === true) {
        const bookDataInfo = getData().filter(get => get.id == id);
        const newBook = {
            id: bookDataInfo[0].id,
            title: bookDataInfo[0].title,
            author: bookDataInfo[0].author,
            year: bookDataInfo[0].year,
            isComplete: false
        };
        const bookData = getData().filter(get => get.id != id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookData));
        insertData(newBook);
        alert(`Buku "${bookDataInfo[0].title}" telah dipindahkan ke bagian belum selesai`);
    }else{
        return 0;
    }
}

function showData(book = []) {
    const uncomplete = document.querySelector("#uncomplete-list");
    const complete = document.querySelector("#complete-list");

    uncomplete.innerHTML = "";
    complete.innerHTML = "";

    book.forEach(book => {
        if (book.isComplete === false) {
            let bookEntry = `
            <article class="book-item">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>

                <div class="action">
                    <button onclick="isCompleteBook('${book.id}')">Selesai</button>
                    <button onclick="editBook('${book.id}')">Edit Buku</button>
                    <button onclick="deleteBook('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `;
            uncomplete.innerHTML += bookEntry;
        } else {
            let bookEntry = `
            <article class="book-item">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>

                <div class="action">
                    <button onclick="isNotCompleteBook('${book.id}')">Belum Selesai</button>
                    <button onclick="editBook('${book.id}')">Edit Buku</button>
                    <button onclick="deleteBook('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `;
            complete.innerHTML += bookEntry;
        }
    });
}

function deleteBook(id) {
    let bookConfirm = confirm("Apakah anda ingin menghapus buku ini?");
    if (bookConfirm === true) {
        const bookDataInfo = getData().filter(get => get.id == id);
        const bookData = getData().filter(get => get.id != id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookData));
        showData(getData());
        alert(`Buku "${bookDataInfo[0].title}" telah dihapus`);
    }else{
        return 0;
    }
}

function editBook(id) {
    const bookDataInfo = getData().filter(get => get.id == id);
    title.value = bookDataInfo[0].title;
    author.value = bookDataInfo[0].author;
    year.value = bookDataInfo[0].year;
    bookDataInfo[0].isComplete ? isRead.checked = true:isRead.checked = false;
    buttonSubmit.innerHTML = "Konfirmasi";
    inputHeader.innerHTML = "Edit Buku";
    buttonSubmit.value = bookDataInfo[0].id;
    alert("Pergi ke form paling atas untuk mengedit buku.");
    window.scrollTo(0, 0);
}

function showSearchResult(book) {
    const searchResult = document.querySelector("#search-result");
    searchResult.innerHTML = "";
    book.forEach(book => {
        let bookEntry = `
        <article class="book-item">
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
            <p>${book.isComplete ? "Status: Selesai" : "Status: Belum Selesai"}</p>
        </article>
        `;
        searchResult.innerHTML += bookEntry;
    });
}