import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCoshFvTjCw3uTvkMICTng62OTelaQsRBc",
  authDomain: "thechat-46f93.firebaseapp.com",
  databaseURL: "https://thechat-46f93.firebaseio.com",
  projectId: "thechat-46f93",
  storageBucket: "thechat-46f93.appspot.com",
  messagingSenderId: "980073024812",
  appId: "1:980073024812:web:aca45454a6b6e91176f089",
  measurementId: "G-DNMER4M1L9",
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  
  const [user] = useAuthState(auth);
  
  return (
    <div className="App">
      <header>
        <h1>Chatty 2.0</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
        <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
        <div>
        <h2>Sign in to chat!</h2>
        <img id="sherlock" src="https://media.tenor.com/images/82d07e171797dcf0c20b95e829e1692c/tenor.gif" alt="sherlock"/>
        </div>
        
    </>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={()=> auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    
    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behaviour: 'smooth' });
  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
        <span ref={dummy}></span>
      </main>
      
      <form onSubmit={sendMessage}>

          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Say something nice" />
          <button type="submit" disabled={!formValue}>Send</button>

      </form>

    </>

    
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';



  return (
    
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="user-face" />
      <p>{text}</p>
    </div>
  
  )
}

export default App;
