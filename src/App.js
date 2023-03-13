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
  const [active, setActive]=useState({bookTitle:'',bookAuthor:'',postion:'',key:''})
  const [updated,setUpdated] = useState(null)

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

  // Submit book creation form
  const handleSumbit = (e) => {
    e.preventDefault();
    addBookToRealtimeDB(bookTitle, bookAuthor);

    setBookTitle("");
    setBookAuthor("");
  };

  //submit book update form

  const handleUpdate =async (active)=>{
    try {
      const bookRef = ref(RealtimeDatabase, "books/" + active.bookTitle);
   
        await set(bookRef, {
          bookTitle:active.bookTitle,
          bookAuthor: active.bookAuthor,
        });
      
     setActive({bookTitle:'',bookAuthor:'',postion:'',key:''})
    
    } catch (error) {
      console.log("Error Updating:", error);
    }

  
 
  }

  const handleKeyPress=(event,active) => {
    if(event.key === 'Enter'){
      handleUpdate(active)
      deleteBookFromRealtimeDB(updated)
      setUpdated(null)
      console.log('enter press here! ')
    }
  }

  return (
    <div className="App">
      <h1>Crud-Bookstore</h1>

      <div>
        <h2>Realtime Database</h2>

        <form onSubmit={e=>handleSumbit(e)}>
          <input
            type="text"
            name="bookTitle"
            value={bookTitle}
            placeholder="book name"
            onChange={(e) => setBookTitle(e.target.value)}
            required
          />
          <input
            type="text"
            name="bookAuthor"
            placeholder="book author"
            value={bookAuthor}
            onChange={(e) => {
              setBookAuthor(e.target.value);
            }}
            required
          />
          <button type="submit">Add Book</button>
        </form>

        <ul>
          {rtbBooks.map((book) => (
            <li key={rtbBooks.indexOf(book)}>
              <p >
                {
                active.key == rtbBooks.indexOf(book) && active.postion==='title'?
                <input className="border"
                type="text"
                value={active.bookTitle} 
                onChange={
                 
                  (e)=>{
                    e.preventDefault()
                    setActive({...active, bookTitle:e.target.value})
                }
                }
                onKeyPress={(e)=>{handleKeyPress(e,active)
                }}
                />:
                  <span onClick={()=>{setActive({bookTitle:book.bookTitle,bookAuthor:book.bookAuthor,postion:'title',key:rtbBooks.indexOf(book)})
                  setUpdated(book.bookTitle)
                }}>{book.bookTitle}</span>} {' '}
                  
                  <i>by</i> {' '}

                  {
                active.key == rtbBooks.indexOf(book) && active.postion==='author'?
                <input 
                className="border"
                type="text"
                value={active.bookAuthor} 
                onChange={
                 
                  (e)=>{
                    e.preventDefault()
                    setActive({...active, bookAuthor:e.target.value})
                }
                }
                onKeyPress={(e)=>{handleKeyPress(e,active)
                }}
                />: 
                  <span onClick={()=>setActive({bookTitle:book.bookTitle,bookAuthor:book.bookAuthor,postion:'author',key:rtbBooks.indexOf(book)})}>{book.bookAuthor}</span>}</p>
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
