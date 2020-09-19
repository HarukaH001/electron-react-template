import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const win = window.remote.getCurrentWindow()
  useEffect(()=>{
    window.ipc.on('ping', (event, message) => {
      console.log(message)
    })
  }, [])

  function screenHandle(e) {
      e.preventDefault()
      win.setFullScreen(!win.isFullScreen())
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button id="toggle-fullscreen" onClick={screenHandle}>Fullscreen</button>
      </header>
    </div>
  );
}

export default App;
