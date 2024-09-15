'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { FaPlay, FaVolumeUp, FaVolumeDown } from 'react-icons/fa';

import '../Components.css'; // Import custom CSS for additional styling


const Hearing_Test = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    contact: '',
    headphone_type: '',
    answers: {},
  });
  const [volume, setVolume] = useState(50); // Initial volume level
  const [frequencyIndex, setFrequencyIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundNoiseMessage, setBackgroundNoiseMessage] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');

  const frequencies = [
    { frequency: 2000, ear: 'right', label: '2kHz' },
    { frequency: 4000, ear: 'right', label: '4kHz' },
    { frequency: 1000, ear: 'left', label: '1kHz' },
    { frequency: 6000, ear: 'left', label: '6kHz' },
  ];

  // Function to submit hearing test data
  const submitHearingTest = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/api/hearing-test/submit',
        data,
        { responseType: 'blob' }
      );

      // Handle successful response (download PDF)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'hearing_test_report.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSubmissionMessage('Thank you for completing the hearing test!');
    } catch (error) {
      setSubmissionMessage('Error submitting hearing test: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle answer selection
  const handleAnswer = (question, answer) => {
    setFormData((prev) => ({
      ...prev,
      answers: { ...prev.answers, [question]: answer },
    }));
    setStep(step + 1);
  };

  // Function to play sound
  const playSound = async (frequency, ear) => {
    const audio = new Audio(`http://127.0.0.1:5000/api/hearing-test/play-tone?frequency=${frequency}&ear=${ear}`);
    audio.volume = volume / 100;
    audio.play();
  };

  // Function to handle volume change
  const adjustVolume = (change) => {
    setVolume((prev) => Math.min(100, Math.max(0, prev + change)));
  };

  // Function to handle next sound
  const handleNextSound = () => {
    if (frequencyIndex < frequencies.length - 1) {
      setFrequencyIndex((prev) => prev + 1);
    } else {
      setSubmissionMessage('Thank you for completing the hearing test!');
      submitHearingTest(formData); // Submit and download the PDF report
    }
  };


  const measureBackgroundNoise = async () => {
    try {
      // Access the user's microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      microphone.connect(analyser);
      analyser.fftSize = 256;

      // Measure the sound level
      const getPeakVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        return Math.max(...dataArray); // Get the peak volume
      };

      const intervalId = setInterval(() => {
        const peakVolume = getPeakVolume();
        if (peakVolume < 50) { // Adjusted threshold
          setBackgroundNoiseMessage('Quiet environment detected.');
          setNextButtonDisabled(false);
        } else if (peakVolume < 100) { // Adjusted threshold
          setBackgroundNoiseMessage('Medium background noise detected. You may proceed.');
          setNextButtonDisabled(false);
        } else {
          setBackgroundNoiseMessage('High background noise detected. Please move to a quieter environment.');
          setNextButtonDisabled(true);
        }
      }, 1000);

      // Stop measuring after 10 seconds
      setTimeout(() => {
        clearInterval(intervalId);
        stream.getTracks().forEach(track => track.stop()); // Stop the microphone stream
      }, 10000);

    } catch (error) {
      setBackgroundNoiseMessage('Error accessing microphone: ' + error.message);
    }
  };

  // Render different steps based on current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="box">
            <h2 className="heading">Instant Hearing Test</h2>
            <p className="paragraph">Take a 2-minute instant hearing test to check your hearing.</p>
            <button className="btn" onClick={() => setStep(2)}>Start Test</button>
          </div>
        );
      case 2:
        return (
          <div className="box">
            <h2 className="heading">Enter Your Details</h2>
            <input className="input" type="text" name="full_name" placeholder="Full Name" onChange={handleChange} />
            <input className="input" type="number" name="age" placeholder="Age" onChange={handleChange} />
            <input className="input" type="text" name="contact" placeholder="Phone Number or Email" onChange={handleChange} />
            <button className="btn" onClick={() => setStep(3)}>Next</button>
          </div>
        );
      case 3:
        return (
          <div className="box">
            <h2 className="heading">How would you describe your hearing?</h2>
            {['Poor', 'Good', 'Not Sure'].map((option) => (
              <button className="btn" key={option} onClick={() => handleAnswer('hearing_description', option)}>
                {option}
              </button>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="box">
            <h2 className="heading">Do you find it hard to follow one-on-one conversations, or do people seem to mumble?</h2>
            {['Always', 'Often', 'Sometimes', 'Rarely', 'Never'].map((option) => (
              <button className="btn" key={option} onClick={() => handleAnswer('conversation_follow', option)}>
                {option}
              </button>
            ))}
          </div>
        );
      case 5:
        return (
          <div className="box">
            <h2 className="heading">Do you find it hard to have a conversation on the phone?</h2>
            {['Always', 'Often', 'Sometimes', 'Rarely', 'Never'].map((option) => (
              <button className="btn" key={option} onClick={() => handleAnswer('phone_conversation', option)}>
                {option}
              </button>
            ))}
          </div>
        );
      case 6:
        return (
          <div className="box">
            <h2 className="heading">Do you find it hard to hear high-pitched sounds like bird song?</h2>
            {['Always', 'Often', 'Sometimes', 'Rarely', 'Never'].map((option) => (
              <button className="btn" key={option} onClick={() => handleAnswer('high_pitched_sounds', option)}>
                {option}
              </button>
            ))}
          </div>
        );
      case 7:
        return (
          <div className="box">
            <h2 className="heading">Do you find it hard to follow conversation in noisy environments such as crowded places?</h2>
            {['Always', 'Often', 'Sometimes', 'Rarely', 'Never'].map((option) => (
              <button className="btn" key={option} onClick={() => handleAnswer('noisy_environments', option)}>
                {option}
              </button>
            ))}
          </div>
        );
      case 8:
        return (
          <div className="box">
            <h2 className="heading">Select your Headphones</h2>
            <p className="paragraph">Select your headphones or earphone style and put them on:</p>
            {['On-Ear, Cable', 'In-Ear, Cable', 'On-Ear, Wireless', 'In-Ear, Wireless'].map((option) => (
              <button className="btn" key={option} onClick={() => handleAnswer('headphone_type', option)}>
                {option}
              </button>
            ))}
          </div>
        );
      case 9:
        return (
          <div className="box">
            <h2 className="heading">Setup Instructions</h2>
            <p className="paragraph">1. Set your device volume to 100%.</p>
            <p className="paragraph">2. Turn off noise cancellation in your headphones.</p>
            <p className="paragraph">3. Make sure you are in a quiet environment.</p>
            <button className="btn" onClick={measureBackgroundNoise}>Measure Background Noise</button>
            <button className="btn" onClick={() => setStep(10)} disabled={nextButtonDisabled}>Next</button>
            {backgroundNoiseMessage && <p className="message">{backgroundNoiseMessage}</p>}
          </div>
        );
      case 10:
        return (
          <div className="box">
            <h2 className="heading">Hearing Test</h2>
            <p className="paragraph">Current Sound: {frequencies[frequencyIndex].label} on {frequencies[frequencyIndex].ear} Ear</p>
            <button className="btn" onClick={() => playSound(frequencies[frequencyIndex].frequency, frequencies[frequencyIndex].ear)}>Play Sound</button>
            <div className="volume-controls">
              <button className="volume-btn" onClick={() => adjustVolume(-10)}><FaVolumeDown /></button>
              <span className="volume-level">Volume: {volume}</span>
              <button className="volume-btn" onClick={() => adjustVolume(10)}><FaVolumeUp /></button>
            </div>
            <button className="btn" onClick={handleNextSound}>Next Sound</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      {renderStep()}
      {submissionMessage && <p className="message">{submissionMessage}</p>}
      {isLoading && <p className="message">Loading...</p>}
    </div>
  );
};

export default Hearing_Test;
