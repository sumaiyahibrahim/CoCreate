import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { ref, push, onValue, serverTimestamp } from 'firebase/database';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AuthForm from './AuthForm'; // Adjust path if needed
import logo from './logo.svg';
import './App.css';

function App() {
  const [user, setUser] = useState(null);             // Track logged-in user
  const [messages, setMessages] = useState([]);       // Messages array
  const [input, setInput] = useState('');             // Input field
  const [saved, setSaved] = useState(false);          // Save confirmation
  const [loading, setLoading] = useState(false);      // Loading state for saving

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Function to send a message including user info and server timestamp
  async function writeToFirebase() {
    if (!user) {
      alert('You must be logged in to send messages.');
      return;
    }
    if (input.trim() === '') return;

    setLoading(true);
    try {
      const messagesRef = ref(db, 'messages');
      await push(messagesRef, {
        text: input,
        uid: user.uid,
        email: user.email,
        timestamp: serverTimestamp(),
      });
      setInput('');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      alert('Error saving message. Please try again.');
      console.error('Firebase write error:', error);
    }
    setLoading(false);
  }

  // Real-time listener for messages
  useEffect(() => {
    const messagesRef = ref(db, 'messages');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages = Object.entries(data).map(([key, val]) => ({
          id: key,
          ...val,
        }));

        // Sort by timestamp (oldest first), supporting serverTimestamp format
        loadedMessages.sort((a, b) => {
          const tA = a.timestamp?.seconds ? a.timestamp.seconds : a.timestamp || 0;
          const tB = b.timestamp?.seconds ? b.timestamp.seconds : b.timestamp || 0;
          return tA - tB;
        });

        setMessages(loadedMessages);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Show auth form if not logged in
  if (!user) {
    return <AuthForm />;
  }

  // Logged-in UI with chat and sign out
  return (
    <div className="App">
      <header className="App-header">

        <img src={logo} className="App-logo" alt="logo" />

        <div style={{ marginBottom: '20px', width: '90%', textAlign: 'left', color: '#ddd' }}>
          <p>Welcome, {user.email}</p>
          <button
            onClick={() => signOut(auth)}
            style={{
              padding: '6px 12px',
              fontSize: '14px',
              marginBottom: '15px',
              cursor: 'pointer',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: '#FF4C4C',
              color: 'white',
            }}
          >
            Sign Out
          </button>
        </div>

        {/* Message list */}
        <div style={{
          maxHeight: '250px',
          overflowY: 'auto',
          marginBottom: '20px',
          width: '90%',
          textAlign: 'left'
        }}>
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  backgroundColor: '#222',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '6px',
                  border: '1px solid #444',
                }}
              >
                <div style={{ color: '#fff' }}>{msg.text}</div>
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                  From: <strong>{msg.email || 'Anonymous'}</strong> <br />
                  🕒 {' '}
                  {msg.timestamp
                    ? msg.timestamp.seconds
                      ? new Date(msg.timestamp.seconds * 1000).toLocaleString()
                      : new Date(msg.timestamp).toLocaleString()
                    : ''}
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: '#ddd' }}>No messages yet.</p>
          )}
        </div>

        {/* Instruction */}
        <h3 style={{ color: '#ddd', marginBottom: '10px' }}>
          Type your message and press Enter or Save 👇
        </h3>

        {/* Input field */}
        <input
          type="text"
          placeholder="Type your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading) writeToFirebase();
          }}
          disabled={loading}
          style={{
            padding: '10px',
            fontSize: '16px',
            borderRadius: '6px',
            marginBottom: '12px',
            width: '220px',
          }}
        />

        {/* Save button */}
        <button
          onClick={writeToFirebase}
          disabled={loading || input.trim() === ''}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            marginLeft: '10px',
            cursor: loading || input.trim() === '' ? 'not-allowed' : 'pointer',
            backgroundColor: loading || input.trim() === '' ? '#A9A9A9' : '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          {loading ? 'Saving...' : 'Save to Firebase'}
        </button>

        {/* Save confirmation */}
        {saved && (
          <p style={{ color: 'lightgreen', marginTop: '10px' }}>
            ✅ Message saved!
          </p>
        )}

        {/* Learn React link */}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: '20px' }}
        >
          Learn React
        </a>

      </header>
    </div>
  );
}

export default App;
