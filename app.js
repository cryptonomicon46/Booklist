//Book constructor
class Book {
  constructor(title, author, isbn) {
    this.book = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI constructor
class UI {
  addBookToList(book) {
    const list = document.getElementById("book-list");
    //create tr element
    const row = document.createElement("tr");
    //insert cols
    row.innerHTML = `<td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href = "#" class ="delete">X</a></td>
    `;
    list.appendChild(row);
  }

  deleteBook(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
  showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert ${className}`;
    //Add text
    div.appendChild(document.createTextNode(message));
    //Get parent
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    //timeout after 3 seconds
    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }
}

//Local Storage Class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => {
      const ui = new UI();
      //Add book to the UI
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, idx) => {
      if (book.isbn === isbn) {
        books.splice(idx, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}
document.getElementById("book-form").addEventListener("submit", function (e) {
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;
  console.log(title, author, isbn);

  const book = new Book(title, author, isbn);

  const ui = new UI();
  //Validate
  if (title === "" || author === "" || isbn === "") {
    //Error alert
    ui.showAlert("Please fill in all fields", "error");
  } else {
    //   console.log(ui);

    //Add book to list
    ui.addBookToList(book);

    //Add book to Local Storage
    Store.addBook(book);

    //Show Alert
    ui.showAlert("Book added!", "success");

    //Clear Fields
    ui.clearFields();
  }

  e.preventDefault();
});

//Event Listener: Delete
document.getElementById("book-list").addEventListener("click", function (e) {
  const ui = new UI();
  ui.deleteBook(e.target);

  //Remove book from LS -Get the ISBN number
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  //show message
  ui.showAlert("Book Removed", "success");
  e.preventDefault();
});

//DOM load event
document.addEventListener("DOMContentLoaded", Store.displayBooks);
