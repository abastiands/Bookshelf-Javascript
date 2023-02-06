// variable inisialisasi
const books = [];
const RENDER_EVENT = "render-book";

// untuk menjalankan kode javascript apabila HTML sudah dimuat menjadi DOM
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

// start add book to list
// fungsi untuk menambahkan buku pada array books
function addBook() {
  const judul = document.getElementById("inputJudul").value;
  const penulis = document.getElementById("inputPenulis").value;
  const tahun = document.getElementById("inputTahun").value;
  const isChecked = document.getElementById("inputChecked");

  const generatedID = generateId();

  if (isChecked.checked != true) {
    const bookObject = generateBookObject(
      generatedID,
      judul,
      penulis,
      tahun,
      false
    );

    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  } else {
    const bookObject = generateBookObject(
      generateId,
      judul,
      penulis,
      tahun,
      true
    );

    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

// fungsi untuk menghasilkan unik id
function generateId() {
  return +new Date();
}

// fungsi untuk menghasilkan object buku
function generateBookObject(id, judul, penulis, tahun, isRead) {
  return {
    id,
    judul,
    penulis,
    tahun,
    isRead,
  };
}

// membuat custom event bernama RENDER_EVENT
document.addEventListener(RENDER_EVENT, function () {
  const unRead = document.getElementById("bukuBelumDibaca");
  unRead.innerHTML = "";

  const read = document.getElementById("bukuSelesaiDibaca");
  read.innerHTML = "";

  //   mengambil nilai array dari variable books
  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isRead) {
      unRead.append(bookElement);
    } else {
      read.append(bookElement);
    }
  }
});

// fungsi untuk membuat menampilkan buku
function makeBook(bookObject) {
  // start bookDescriptionItem
  const descriptionJudul = document.createElement("h3");
  descriptionJudul.innerText = "Judul Buku";

  const descriptionPenulis = document.createElement("p");
  descriptionPenulis.innerText = "Penulis Buku";

  const descriptionTahun = document.createElement("p");
  descriptionTahun.innerText = "Tahun Buku";

  const titikDuaJudul = document.createElement("h3");
  titikDuaJudul.innerText = ":";

  const titikDuaPenulis = document.createElement("p");
  titikDuaPenulis.innerText = ":";

  const titikDuaTahun = document.createElement("p");
  titikDuaTahun.innerText = ":";

  const td1 = document.createElement("td");
  td1.append(descriptionJudul, descriptionPenulis, descriptionTahun);

  const td2 = document.createElement("td");
  td2.append(titikDuaJudul, titikDuaPenulis, titikDuaTahun);

  const tr = document.createElement("tr");
  tr.append(td1, td2);

  const divBookDescriptionItem = document.createElement("div");
  divBookDescriptionItem.classList.add("book-description");
  divBookDescriptionItem.append(tr);

  // start bookItem
  const showJudul = document.createElement("h3");
  showJudul.innerText = bookObject.judul;

  const showPenulis = document.createElement("p");
  showPenulis.innerText = bookObject.penulis;

  const showTahun = document.createElement("p");
  showTahun.innerText = bookObject.tahun;

  const divBookItem = document.createElement("div");
  divBookItem.classList.add("book-item");
  divBookItem.append(showJudul, showPenulis, showTahun);
  // end book-item

  //   membuat artikel book sesuai dengan id
  const articleBook = document.createElement("article");
  articleBook.classList.add("book");
  articleBook.setAttribute("id", `book-${bookObject.id}`);
  articleBook.append(divBookDescriptionItem, divBookItem);

  // start book-action
  if (bookObject.isRead) {
    const unReadButton = document.createElement("button");
    unReadButton.setAttribute("type", "submit");
    unReadButton.setAttribute("id", "bookshelfUnRead");
    unReadButton.innerText = "Belum dibaca";

    unReadButton.addEventListener("click", function () {
      unReadBookFromRead(bookObject.id);
    });

    const unReadClass = document.createElement("div");
    unReadClass.classList.add("unread");
    unReadClass.append(unReadButton);

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "submit");
    deleteButton.setAttribute("id", "bookshelfDelete");
    deleteButton.innerText = "Hapus Buku";

    deleteButton.addEventListener("click", function () {
      const dialog = document.querySelector(".dialog");
      dialog.style.display = "block";

      const dialogDeleteButton = document.querySelector(".dialog-red");
      dialogDeleteButton.addEventListener("click", function () {
        deleteBook(bookObject.id);
      });

      const dialogCancelButton = document.querySelector(".dialog-green");
      dialogCancelButton.addEventListener("click", function () {
        dialog.style.display = "none";
      });
    });

    const deleteClass = document.createElement("div");
    deleteClass.classList.add("delete");
    deleteClass.append(deleteButton);

    const divBookAction = document.createElement("div");
    divBookAction.classList.add("book-action");
    divBookAction.append(unReadClass, deleteClass);

    articleBook.append(divBookAction);
  } else {
    const readButton = document.createElement("button");
    readButton.setAttribute("type", "submit");
    readButton.setAttribute("id", "bookshelfRead");
    readButton.innerText = "Selesai dibaca";

    readButton.addEventListener("click", function () {
      addBookFromRead(bookObject.id);
    });

    const readClass = document.createElement("div");
    readClass.classList.add("read");
    readClass.append(readButton);

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "submit");
    deleteButton.setAttribute("id", "bookshelfDelete");
    deleteButton.innerText = "Hapus Buku";

    deleteButton.addEventListener("click", function () {
      const dialog = document.querySelector(".dialog");
      dialog.style.display = "block";

      const dialogDeleteButton = document.querySelector(".dialog-red");
      dialogDeleteButton.addEventListener("click", function () {
        deleteBook(bookObject.id);
      });

      const dialogCancelButton = document.querySelector(".dialog-green");
      dialogCancelButton.addEventListener("click", function () {
        dialog.style.display = "none";
      });
    });

    const deleteClass = document.createElement("div");
    deleteClass.classList.add("delete");
    deleteClass.append(deleteButton);

    const divBookAction = document.createElement("div");
    divBookAction.classList.add("book-action");
    divBookAction.append(readClass, deleteClass);

    articleBook.append(divBookAction);
  }
  // end book-action

  return articleBook;
}

// fungsi menambahkan buku yang belum dibaca menjadi selesai dibaca
function addBookFromRead(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isRead = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// fungsi untuk mencari id buku
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }

  return null;
}

// fungsi untuk menghapus buku
function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// fungsi untuk mengembalikan buku yang sudah dibaca kembali menjadi buku belum dibaca
function unReadBookFromRead(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isRead = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// fungsi untuk mencari index buku
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}
// end add book to list

// start local storage

// fungsi untuk menyimpan data ke local storage pada server komputer
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

// fungsi mengecek apakah browser support local storage
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

// membuat custom event bernama SAVED_EVENT
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

// fungsi untuk mendapatkan data dari local storage
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
// end local storage

// start search book
// ketika tombol cari diklik maka judul buku yang dicari akan ditampilkan
const inputSearch = document.getElementById("inputSearch");

inputSearch.addEventListener("submit", function (event) {
  searchTitleBook();

  event.preventDefault();
});

const searchOnInput = document.getElementById("searchTitle");

searchOnInput.addEventListener("input", function (event) {
  searchTitleBook();

  event.preventDefault();
});

// membuat fungsi untuk mencari judul buku pada daftar buku yang tersedia(baik sudah dibaca maupun belum dibaca)
function searchTitleBook() {
  const searchTitle = document
    .getElementById("searchTitle")
    .value.toLowerCase();
  const searchBook = document.querySelectorAll(".book");

  searchBook.forEach((book) => {
    const titleBook = book.childNodes[1].firstChild.textContent.toLowerCase();

    if (titleBook.indexOf(searchTitle) > -1) {
      book.style.display = "flex";
    } else {
      book.style.display = "none";
    }
  });
}
// end search book
