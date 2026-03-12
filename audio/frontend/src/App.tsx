
import VoiceRecorder from "./components/media"
import SpeechRecognition,{useSpeechRecognition} from "react-speech-recognition"

function App() {
  
  const {transcript, listening, resetTranscript, browserSupportsSpeechRecognition} = useSpeechRecognition()
  
  if(!browserSupportsSpeechRecognition){
    return <span>your browswer dosen't support this</span>
  }
  return (
    <div>
      {/* <VoiceRecorder/>   */}
      <p>Microphone : {listening ? "on" :"off"}</p>
      <button onClick={()=>SpeechRecognition.startListening({continuous : true})} >start </button>
      <button onClick={()=>SpeechRecognition.stopListening} >stop </button>
      <button onClick={()=>resetTranscript} >reset </button>

      <p>{transcript}</p>
    </div>
  )
}

export default App
