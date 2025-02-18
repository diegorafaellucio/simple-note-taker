import subprocess

video_path = "../data/Notetaking video.mp4"
audio_path = "../data/Notetaking_audio.wav"
text_path = "../data/Notetaking_transcript.txt"

# Extract audio from the video
subprocess.run(["ffmpeg", "-i", video_path, "-q:a", "0", "-map", "a", audio_path, "-y"])

# Now, I will transcribe the extracted audio
import speech_recognition as sr

# Initialize the recognizer
recognizer = sr.Recognizer()

# Load the extracted audio
with sr.AudioFile(audio_path) as source:
    audio_data = recognizer.record(source)

# Transcribe the audio to text
try:
    transcript = recognizer.recognize_google(audio_data)
except sr.UnknownValueError:
    transcript = "Audio could not be transcribed."
except sr.RequestError:
    transcript = "Error with the speech recognition service."

# Save the transcript for reference
with open(text_path, "w") as f:
    f.write(transcript)

# Display the transcript
transcript