import { useState, useRef, useCallback } from 'react'

export type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped'

export function useVoiceRecorder() {
  const [state, setState] = useState<RecordingState>('idle')
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [duration, setDuration] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder
    chunksRef.current = []

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      setAudioBlob(blob)
      setAudioURL(URL.createObjectURL(blob))
      stream.getTracks().forEach(track => track.stop()) // release mic
    }

    mediaRecorder.start()
    setState('recording')
    setDuration(0)
    timerRef.current = setInterval(() => setDuration(d => d + 1), 1000)
  }, [])

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop()
    clearInterval(timerRef.current!)
    setState('stopped')
  }, [])

  const pauseRecording = useCallback(() => {
    mediaRecorderRef.current?.pause()
    clearInterval(timerRef.current!)
    setState('paused')
  }, [])

  const resumeRecording = useCallback(() => {
    mediaRecorderRef.current?.resume()
    timerRef.current = setInterval(() => setDuration(d => d + 1), 1000)
    setState('recording')
  }, [])

  const reset = useCallback(() => {
    setAudioURL(null)
    setAudioBlob(null)
    setDuration(0)
    setState('idle')
  }, [])

  return {
    state, audioURL, audioBlob, duration,
    startRecording, stopRecording, pauseRecording, resumeRecording, reset,
  }
}