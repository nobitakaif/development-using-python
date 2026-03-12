import { useVoiceRecorder } from './mediaRecoder'

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function VoiceRecorder() {
  const {
    state, audioURL, audioBlob, duration,
    startRecording, stopRecording, pauseRecording, resumeRecording, reset,
  } = useVoiceRecorder()

  const handleUpload = async () => {
    if (!audioBlob) return
    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.webm')

    await fetch('/api/upload-audio', { method: 'POST', body: formData })
    alert('Uploaded!')
  }

  return (
    <div>
      <p>🕐 {formatTime(duration)}</p>
      <p>Status: {state}</p>

      {state === 'idle' && (
        <button onClick={startRecording}>🎙️ Start Recording</button>
      )}

      {state === 'recording' && (
        <>
          <button onClick={pauseRecording}>⏸️ Pause</button>
          <button onClick={stopRecording}>⏹️ Stop</button>
        </>
      )}

      {state === 'paused' && (
        <>
          <button onClick={resumeRecording}>▶️ Resume</button>
          <button onClick={stopRecording}>⏹️ Stop</button>
        </>
      )}

      {state === 'stopped' && audioURL && (
        <>
          <audio src={audioURL} controls />
          <button onClick={handleUpload}>☁️ Upload</button>
          <button onClick={reset}>🔄 Record Again</button>
        </>
      )}
    </div>
  )
}