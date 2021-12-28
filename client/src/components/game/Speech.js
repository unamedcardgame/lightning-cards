import React, { useState, useEffect } from 'react'

const SpeechRecognition =
  window.speechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()
mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

const Speech = () => {
  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState(null)
  const [savedNotes, setSavedNotes] = useState([])


  // navigator.permissions.query(
  //     // { name: 'camera' }
  //     { name: 'microphone' }
  //     // { name: 'geolocation' }
  //     // { name: 'notifications' } 
  //     // { name: 'midi', sysex: false }
  //     // { name: 'midi', sysex: true }
  //     // { name: 'push', userVisibleOnly: true }
  //     // { name: 'push' } // without userVisibleOnly isn't supported in chrome M45, yet
  //     ).then(function(permissionStatus){

  //         console.log(permissionStatus.state); // granted, denied, prompt

  //         permissionStatus.onchange = function(){
  //         console.log("Permission changed to " + this.state);
  //     }
  // })

  // if ("webkitSpeechRecognition" in window) {
  // console.log("Speech Recognition Available")
  // } else {
  // console.log("Speech Recognition Not Available")
  // }


  useEffect(() => {
    const handleListen = () => {
      if (isListening) {
        mic.start()
        mic.onend = () => {
          console.log('continue..')
          mic.start()
        }
      } else {
        mic.stop()
        mic.onend = () => {
          console.log('Mic off')
        }
      }
      mic.onstart = () => {
        console.log('Mic on')
      }

      mic.onresult = event => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')
        console.log(transcript)
        setNote(transcript)
        mic.onerror = event => {
          console.log(event.error)
        }
      }
    }
    handleListen()
  }, [isListening])

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note])
    setNote('')
  }

  return (
    <>
      <h1>Speech Recognition</h1>
      <div className="container">
        <div className="box">
          <h2>Current</h2>
          {isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}
          <button onClick={handleSaveNote} disabled={!note}>
            Save it
          </button>
          <button onClick={() => setIsListening(prevState => !prevState)}>
            Start/Stop
          </button>
          <p>{note}</p>
        </div>
        <div className="box">
          <h2>Previous</h2>
          {savedNotes.map(n => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </div>
    </>
  )
}

export default Speech
