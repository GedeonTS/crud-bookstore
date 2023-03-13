import React, { useState, useEffect } from "react";
import { db, RealtimeDatabase } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { onValue, ref, set, remove } from "firebase/database";
import "./App.css";

function App() {
  // const booksCollectionRef = collection(db, "books");
  const [books, setBooks] = useState([]);

  const [rtbBooks, setRtbBooks] = useState([]);
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");

  // Get Books from the realtime database
  useEffect(() => {
    onValue(ref(RealtimeDatabase, "books"), (snapshot) => {
      const data = snapshot.val();
      const booksRtb = [];

      for (let id in data) {
        booksRtb.push({ ...data[id] });
      }
      console.log("remote data", booksRtb);
      setRtbBooks(booksRtb);
    });
  }, []);

  // Add book to Realtime DB
  const addBookToRealtimeDB = async (bookTitle, bookAuthor) => {
    console.log("added");
    try {
      const bookRef = ref(RealtimeDatabase, "books/" + bookTitle);
      await set(bookRef, {
        bookTitle: bookTitle,
        bookAuthor: bookAuthor,
      });
    } catch (error) {
      console.log("Error Posting:", error);
    }
  };

  // Remove Book form Realtime DB
  const deleteBookFromRealtimeDB = async (bookTitle) => {
    try {
      const bookRef = ref(RealtimeDatabase, "books/" + bookTitle);
      await remove(bookRef);
    } catch (error) {
      console.log("Error Deleting:", error);
    }
  };

  const handleSumbit = (e) => {
    e.preventDefault();
    addBookToRealtimeDB(bookTitle, bookAuthor);

    setBookTitle("");
    setBookAuthor("");
  };

  return (
    <div className="App">
      <h1>Crud-Bookstore</h1>

      <div>
        <h2>Realtime Database</h2>

        <form onSubmit={e=>handleSumbit(e)}>
          <input
            type="text"
            name="bookTitle"
            placeholder="book name"
            onChange={(e) => setBookTitle(e.target.value)}
          />
          <input
            type="text"
            name="bookAuthor"
            placeholder="book author"
            onChange={(e) => {
              setBookAuthor(e.target.value);
            }}
          />
          <button type="submit">Add Book</button>
        </form>

        <ul>
          {rtbBooks.map((book) => (
            <li key={book.bookTitle}>
              <p>{book.bookTitle} by {book.bookAuthor}</p>{console.log(book)}
              <button
                type="button"
                onClick={() => deleteBookFromRealtimeDB(book.bookTitle)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
