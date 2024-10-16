'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaPlay, FaVolumeUp, FaVolumeDown } from 'react-icons/fa';
import { FaPlus, FaMinus  } from "react-icons/fa6";


// import '../Components.css';
import assets from '../../../public/assets/assets';
import { IoIosCheckmark } from 'react-icons/io';
import HearingTestReport from './HearingTestReport';


const Hearing_Test = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    contact: '',
    headphone_type: '',
    answers: {},
  });

  const [frequencyIndex, setFrequencyIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [backgroundNoiseMessage, setBackgroundNoiseMessage] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [nextButtonDisabled, setNextButtonDisabled] = useState(true);


  const [decibelLevels, setDecibelLevels] = useState({});
  const [volume, setVolume] = useState(1);

  const frequencies = [
    { frequency: 2000, ear: 'right', label: '2kHz' },
    { frequency: 4000, ear: 'right', label: '4kHz' },
    { frequency: 1000, ear: 'left', label: '1kHz' },
    { frequency: 6000, ear: 'left', label: '6kHz' },
  ];

  const [speechTestData, setSpeechTestData] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentEar, setCurrentEar] = useState('right');
  const [selectedWords, setSelectedWords] = useState([]);
  const [audioUrl, setAudioUrl] = useState('');
  const audioRef = useRef(null);

  const [isMeasuring, setIsMeasuring] = useState(false);

  const [currentTone, setCurrentTone] = useState({ frequency: 4000, ear: 'right' });
  const [toneVolume, setToneVolume] = useState(10);
  const [toneAdjustmentType, setToneAdjustmentType] = useState('barely');
  const [speechTestResults, setSpeechTestResults] = useState([]);
  const [allWords, setAllWords] = useState([
    "King", "Baby", "Book",
    "Cat", "Dog", "Bird",
    "Car", "Bike", "Boat",
    "Apple", "Banana", "Orange"
  ]);

  const [showReport, setShowReport] = useState(false);

  // Function to submit hearing test data
  const submitHearingTest = async () => {
    setIsLoading(true);
    try {
      const dataToSend = {
        ...formData,
        decibelLevels,
        speechTestResults: speechTestResults.map(result => ({
          round: result.round,
          ear: result.ear,
          selectedWords: result.selectedWords,
          audioUrl: result.audioUrl
        }))
      };

      await axios.post('http://aural-hearing-backend-production.up.railway.app/api/hearing-test/submit', dataToSend);
      setShowReport(true);
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
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(`https://aural-hearing-backend-production.up.railway.app/api/hearing-test/play-tone?frequency=${frequency}&ear=${ear}`);
    audio.volume = volume / 100; // Convert volume to scale 0-1 for Audio API
    audio.play();

    setCurrentAudio(audio);
  };

  // Function to handle volume change
  const adjustVolume = (change) => {
    setVolume((prev) => {
      const newVolume = Math.min(100, Math.max(0, prev + change));  // Ensure volume stays between 0 and 100 dB HL
      // Update the volume of the currently playing sound in real-time
      if (currentAudio) {
        currentAudio.volume = newVolume / 100;  // Update the current audio volume dynamically
      }
      return newVolume;
    });
  };
  // Function to handle next sound
  const handleNextSound = () => {
    // Record the current frequency's decibel level
    const currentFrequency = frequencies[frequencyIndex];
    setDecibelLevels((prev) => ({
      ...prev,
      [`${currentFrequency.label} ${currentFrequency.ear} Ear`]: volume,
    }));

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    if (frequencyIndex < frequencies.length - 1) {
      // Move to the next sound in the list
      setFrequencyIndex((prev) => prev + 1);
      setVolume(10); // Reset the volume to 10 dB for each new sound
    } else {
      // If this is the last sound, submit the data to backend
      setSubmissionMessage('Thank you for completing the hearing test!');
      submitHearingTest({ ...formData, decibelLevels }); // Submit with the recorded decibel levels
    }
  };

  const measureBackgroundNoise = async () => {
    setIsMeasuring(true);
    setBackgroundNoiseMessage('Measuring background noise...');
    setNextButtonDisabled(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();

      const microphone = audioContext.createMediaStreamSource(stream);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      microphone.connect(analyser);
      analyser.fftSize = 256;

      const getPeakVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        return Math.max(...dataArray);
      };

      const measureInterval = setInterval(() => {
        const peakVolume = getPeakVolume();
        if (peakVolume < 50) {
          setBackgroundNoiseMessage('Quiet environment detected. You may proceed.');
          setNextButtonDisabled(false);
        } else if (peakVolume < 1000) {
          setBackgroundNoiseMessage('Medium background noise detected. You may proceed.');
          setNextButtonDisabled(false);
        } else {
          setBackgroundNoiseMessage('High background noise detected. Please reduce background noise and try again.');
          setNextButtonDisabled(true);
        }
      }, 100); // Update more frequently for real-time feedback

      // Stop measuring after 5 seconds
      setTimeout(() => {
        clearInterval(measureInterval);
        stream.getTracks().forEach(track => track.stop());
        setIsMeasuring(false);
      }, 5000);

    } catch (error) {
      setBackgroundNoiseMessage('Error accessing microphone: ' + error.message);
      setIsMeasuring(false);
    }
  };

  // Function to shuffle array
  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  // Function to handle next round
  const handleNextRound = () => {
    // Save the current round results
    setSpeechTestResults(prev => [...prev, { round: currentRound, ear: currentEar, selectedWords, audioUrl }]);

    if (currentRound < 2) {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      setSelectedWords([]);
      setAudioUrl(`http://aural-hearing-backend-production.up.railway.app/api/speech-test/${currentEar}/audio/${nextRound}`);
      setAllWords(shuffleArray([...allWords]));  // Shuffle words for the next round
    } else if (currentEar === 'right') {
      setCurrentEar('left');
      setCurrentRound(1);
      setSelectedWords([]);
      setAudioUrl(`http://aural-hearing-backend-production.up.railway.app/api/speech-test/left/audio/1`);
      setAllWords(shuffleArray([...allWords]));  // Shuffle words when switching ears
    } else {
      // Test complete, move to next step
      setStep(12);
    }
  };

  const playTone = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(`http://aural-hearing-backend-production.up.railway.app/api/hearing-test/play-tone?frequency=${currentTone.frequency}&ear=${currentTone.ear}`);
    audio.volume = toneVolume / 100;
    audio.play().catch(error => console.error("Audio playback failed:", error));

    setCurrentAudio(audio);
  }, [currentTone, toneVolume]);

  useEffect(() => {
    if (step === 10) {
      playTone();
    }
  }, [step, currentTone, playTone]);

  const adjustToneVolume = (newVolume) => {
    setToneVolume(newVolume);
    if (currentAudio) {
      currentAudio.volume = newVolume / 100;
    }
  };

  const handleNextTone = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }

    setDecibelLevels((prev) => ({
      ...prev,
      [`${currentTone.frequency}Hz ${currentTone.ear} Ear ${toneAdjustmentType}`]: toneVolume,
    }));

    if (currentTone.ear === 'right' && toneAdjustmentType === 'barely') {
      setToneAdjustmentType('loudest');
    } else if (currentTone.ear === 'right' && toneAdjustmentType === 'loudest') {
      setCurrentTone({ frequency: 4000, ear: 'left' });
      setToneAdjustmentType('barely');
    } else if (currentTone.ear === 'left' && toneAdjustmentType === 'barely') {
      setToneAdjustmentType('loudest');
    } else {
      setStep(11); // Move to speech test step
    }

    setToneVolume(10); // Reset volume for next tone
  };

  // Use useEffect to play audio when audioUrl changes
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      // Add a small delay before playing
      setTimeout(() => {
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.then(_ => {
            // Playback started successfully
          }).catch(error => {
            console.error("Audio playback failed:", error);
          });
        }
      }, 100);  // 100ms delay
    }
  }, [audioUrl]);

  // Add this function to handle word selection
  const handleWordSelection = (word) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else if (selectedWords.length < 3) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  // Render different steps based on current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className='h-full py-10  '>
            <h2 className="font-outfit font-bold text-5xl text-auralyellow text-center pt-10 pb-6 w-full">Instant Hearing Test</h2>
            <div className="flex flex-row item-center justify-center w-[900px] border-2 border-gray-100 shadow-xl rounded-lg">
              <div className="flex flex-col items-start justify-start w-1/2">
                <motion.p 
                    className="font-poppins text-lg text-start pt-10 px-2" 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ duration: 0.5 }}
                >
                    Take a 2-minute instant hearing test to check your hearing.
                </motion.p>
                <motion.p 
                    className="font-poppins text-[15px] text-start px-2 py-2" 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ duration: 0.5, delay: 0.1 }} // Added delay
                >
                    This Test Is Designed To:
                </motion.p>
                <div className='ml-2'>
                  <div className="flex flex-row items-center justify-start">
                    <IoIosCheckmark className='text-4xl' />
                    <p className="font-poppins text-[14px] text-start">Identify the frequency and direction of sounds.</p>
                  </div>
                  <div className="flex flex-row items-center justify-start">
                    <IoIosCheckmark className='text-4xl' />
                    <p className="font-poppins text-[14px] text-start">Understand your hearing health.</p>
                  </div>
                  <div className="flex flex-row items-center justify-start">
                    <IoIosCheckmark className='text-4xl' />
                    <p className="font-poppins text-[14px] text-start">Get personalized recommendations.</p>
                  </div>

                </div>

                <button className=" mx-auto px-12 py-2 bg-auralblue text-white font-poppins text-xl font-bold text-center rounded-none mt-24" onClick={() => setStep(2)}>Start Test</button>
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-1/2">
                <img src={assets.Test_1} className='w-full rounded-r-lg h-[500px] rounded-br-lg' alt="" />
              </motion.div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className='h-full py-10'>
            <h2 className="font-outfit font-bold text-5xl text-auralyellow text-center pt-10 pb-6 w-full">Instant Hearing Test</h2>
            <div className="flex flex-row item-center justify-center  w-[900px] border-2 border-gray-100 shadow-xl rounded-lg">
              <div className="flex flex-col items-start justify-start w-1/2">
                <h2 className="font-poppins text-3xl pt-10 pb-5 px-2 font-normal text-auralyellow">About Yourself</h2>
                <h2 className="font-poppins text-[16px] pb-1 px-2 font-medium">Enter Your Details:</h2>
                <input className="w-[405px] max-w-[405px] mx-5 px-2 py-2 border-b-[1.5px] bg-transparent border-gray-500 rounded-t-md  mb-4 text-sm text-black focus:outline-none focus:no-underline rounded-br-sm rounded-bl-sm" type="text" name="full_name" placeholder="Full Name" onChange={handleChange} />
                <div className="form-group text-start text-gray-400 text-xl">
                  <select
                    className="w-[405px] max-w-[405px] mx-5 px-2 py-2 border-b-[1.5px] bg-transparent border-gray-500 rounded-t-md  mb-4 text-sm text-black focus:outline-none focus:no-underline rounded-br-sm rounded-bl-sm"
                    name="sex"
                    id="sex"
                    value={formData.sex}
                    onChange={handleChange}
                  >
                    <option value="">Select your sex</option>
                    <option value="Male" className='text-black'>Male</option>
                    <option value="Female" className='text-black'>Female</option>
                    <option value="Others" className='text-black'>Prefer not to say</option>
                  </select>
                </div>
                <input className="w-[405px] max-w-[405px] mx-5 px-2 py-2 border-b-[1.5px] bg-transparent border-gray-500 rounded-t-md  mb-4 text-sm text-black focus:outline-none focus:no-underline rounded-br-sm rounded-bl-sm" type="text" name="age" placeholder="Age" onChange={handleChange} />
                <input className="w-[405px] max-w-[405px] mx-5 px-2 py-2 border-b-[1.5px] bg-transparent border-gray-500 rounded-t-md  mb-4 text-sm text-black focus:outline-none focus:no-underline rounded-br-sm rounded-bl-sm" type="text" name="contact" placeholder="+91 xxxxx xxxxx" onChange={handleChange} />
                <button className="mx-auto px-12 py-2 bg-auralblue text-white font-poppins text-xl font-bold text-center rounded-none mt-10" onClick={() => setStep(3)}>Next</button>
              </div>
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-1/2">
                <img src={assets.Test_1} className='w-full rounded-r-lg h-[500px] rounded-br-lg' alt="" />
              </motion.div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className='h-full py-10'>
            <h2 className="font-outfit font-bold text-5xl text-auralyellow text-center pt-10 pb-6 w-full">Instant Hearing Test</h2>
            <div className="flex flex-row item-center justify-center w-[900px] border-2 border-gray-100 shadow-xl rounded-lg">
              <div className="flex flex-col items-start justify-start w-1/2">
                <h2 className="font-poppins text-3xl pt-10 pb-5 px-2 font-normal  text-auralyellow">About Yourself</h2>
                <h2 className="font-poppins text-[16px] pb-5 px-2 font-medium">How would you describe your hearing?</h2>
                {['Poor', 'Good', 'Not Sure'].map((option) => (
                  <button className=" mx-2 text-[16px] font-normal bg-transparent border-[1px] border-auralyellow rounded-none w-52 mb-3  font-poppins hover:text-white" key={option} onClick={() => handleAnswer('hearing_description', option)}>
                    {option}
                  </button>
                ))}
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-1/2">
                <img src={assets.Test_1} className='w-full rounded-r-lg h-[500px] rounded-br-lg' alt="" />
              </motion.div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className='h-full py-10'>
            <h2 className="font-outfit font-bold text-5xl text-auralyellow text-center pt-10 pb-6 w-full">Instant Hearing Test</h2>
            <div className="flex flex-row item-center justify-center w-[900px] border-2 border-gray-100 shadow-xl rounded-lg">
              <div className="flex flex-col items-start justify-start w-1/2">
                <h2 className="font-poppins text-3xl pt-10 pb-5 px-2 font-normal  text-auralyellow">About Yourself</h2>
                <h2 className="font-poppins text-[16px] pb-5 px-2 font-medium">Do you find it hard to follow one-on-one conversations, or do people seem to mumble?</h2>
                {['Always', 'Often', 'Sometimes', 'Rarely', 'Never'].map((option) => (
                  <button className="mx-2 text-[16px] font-normal bg-transparent border-[1px] border-auralyellow rounded-none w-52 mb-3  font-poppins hover:text-white" key={option} onClick={() => handleAnswer('conversation_follow', option)}>
                    {option}
                  </button>
                ))}
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-1/2">
                <img src={assets.Test_2} className="w-full rounded-r-lg h-[500px] rounded-br-lg" alt="" />
              </motion.div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className='h-full py-10'>
            <h2 className="font-outfit font-bold text-5xl text-auralyellow text-center pt-10 pb-6 w-full">Instant Hearing Test</h2>
            <div className="flex flex-row item-center justify-center w-[900px] border-2 border-gray-100 shadow-xl rounded-lg">
              <div className="flex flex-col items-start justify-start w-1/2">
                <h2 className="font-poppins text-3xl pt-10 pb-5 px-2 font-normal  text-auralyellow">About Yourself</h2>
                <h2 className="font-poppins text-[16px] pb-5 px-2 font-medium">Do you find it hard to have a conversation on the phone?</h2>
                {['Always', 'Often', 'Sometimes', 'Rarely', 'Never'].map((option) => (
                  <button className="mx-2 text-[16px] font-normal bg-transparent border-[1px] border-auralyellow rounded-none w-52 mb-3  font-poppins hover:text-white" key={option} onClick={() => handleAnswer('phone_conversation', option)}>
                    {option}
                  </button>
                ))}
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-1/2">
                <img src={assets.Test_2} className="w-full rounded-r-lg h-[500px] rounded-br-lg" alt="" />
              </motion.div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className='h-full py-10'>
            <h2 className="font-outfit font-bold text-5xl text-auralyellow text-center pt-10 pb-6 w-full">Instant Hearing Test</h2>
            <div className="flex flex-row item-center justify-center w-[900px] border-2 border-gray-100 shadow-xl rounded-lg">
              <div className="flex flex-col items-start justify-start w-1/2">
                <h2 className="font-poppins text-3xl pt-10 pb-5 px-2 font-normal  text-auralyellow">About Yourself</h2>
                <h2 className="font-poppins text-[16px] pb-5 px-2 font-medium">Do you find it hard to hear high-pitched sounds like bird song?</h2>
                {['Always', 'Often', 'Sometimes', 'Rarely', 'Never'].map((option) => (
                  <button className="mx-2 text-[16px] font-normal bg-transparent border-[1px] border-auralyellow rounded-none w-52 mb-3  font-poppins hover:text-white" key={option} onClick={() => handleAnswer('high_pitched_sounds', option)}>
                    {option}
                  </button>
                ))}
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-1/2">
                <img src={assets.Test_2} className='w-full rounded-r-lg h-[500px] rounded-br-lg' alt="" />
              </motion.div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className='h-full py-10'>
            <h2 className="font-outfit font-bold text-5xl text-auralyellow text-center pt-10 pb-6 w-full">Instant Hearing Test</h2>
            <div className="flex flex-row item-center justify-center w-[900px] border-2 border-gray-100 shadow-xl rounded-lg">
              <div className="flex flex-col items-start justify-start w-1/2">
                <h2 className="font-poppins text-3xl pt-10 pb-5 px-2 font-normal  text-auralyellow">About Yourself</h2>
                <h2 className="font-poppins text-[16px] pb-5 px-2 font-medium">Do you find it hard to follow conversation in noisy environments such as crowded places?</h2>
                {['Always', 'Often', 'Sometimes', 'Rarely', 'Never'].map((option) => (
                  <button className="mx-2 text-[16px] font-normal bg-transparent border-[1px] border-auralyellow rounded-none w-52 mb-3  font-poppins hover:text-white" key={option} onClick={() => handleAnswer('noisy_environments', option)}>
                    {option}
                  </button>
                ))}
              </div>
              <div className="w-1/2">
                <img src={assets.Test_3} className='w-full  rounded-r-lg h-[500px] rounded-br-lg' alt="" srcset="" />
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className='h-full py-10'>
            <h2 className="font-outfit font-bold text-5xl text-auralyellow text-center pt-10 pb-6 w-full">Instant Hearing Test</h2>
            <div className="flex flex-row item-center justify-center w-[900px] border-2 border-gray-100 shadow-xl rounded-lg">
              <div className="flex flex-col items-start justify-start w-1/2">
                <h2 className="font-poppins text-3xl pt-10 pb-5 px-2 font-normal  text-auralyellow">Select your Headphones</h2>
                <p className="font-poppins text-[16px] pb-5 px-2 font-medium">Select your headphones or earphone style and put them on:</p>
                {['On-Ear, Cable', 'In-Ear, Cable', 'On-Ear, Wireless', 'In-Ear, Wireless'].map((option) => (
                  <button className="mx-2 text-[16px] font-normal bg-transparent border-[1px] border-auralyellow rounded-none w-52 mb-3  font-poppins hover:text-white" key={option} onClick={() => handleAnswer('headphone_type', option)}>
                    {option}
                  </button>
                ))}
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-1/2">
                <img src={assets.Test_2} className='w-full rounded-r-lg h-[500px] rounded-br-lg' alt="" />
              </motion.div>
            </div>
          </div>
        );
      case 9:
        return (
          <div className='h-full py-10'>
            <h2 className="font-outfit font-bold text-5xl text-auralyellow text-center pt-10 pb-6 w-full">Instant Hearing Test</h2>
            <div className="flex flex-row item-center justify-center w-[900px] border-2 border-gray-100 shadow-xl rounded-lg">
              <div className="flex flex-col items-start justify-start w-1/2">
                <h2 className="font-poppins text-3xl pt-10 pb-5 px-2 font-normal  text-auralyellow">Setup Instructions</h2>
                <p className="font-poppins text-[14px] text-start flex gap-1 ml-2 items-center"><IoIosCheckmark className='text-4xl' /> Set your device volume to 100%.</p>
                <p className="font-poppins text-[14px] text-start flex gap-1 ml-2 items-center"><IoIosCheckmark className='text-4xl' /> Turn off noise cancellation in your headphones.</p>
                <p className="font-poppins text-[14px] text-start flex gap-1 ml-2 items-center"><IoIosCheckmark className='text-4xl' /> Make sure you are in a quiet environment.</p>
                <button 
                  className=" mx-auto px-12 py-2 bg-auralblue text-white font-poppins text-xl font-bold text-center rounded-none mt-14" 
                  onClick={() => setStep(10)} 
                  disabled={nextButtonDisabled}
                >
                  Next
                </button>
              </div>
              <div className="w-1/2 flex flex-col gap-5 h-[500px] bg-gray-100 items-center justify-center ">
                <button 
                  className="text-[16px] mx-auto font-normal bg-transparent border-[1px] border-auralyellow rounded-none h-28 w-52 mb-3 font-poppins hover:text-white" 
                  onClick={measureBackgroundNoise}
                  disabled={isMeasuring}
                >
                  {isMeasuring ? 'Measuring...' : 'Measure Background Noise'}
                </button>

                {backgroundNoiseMessage && (
                  <p className="text-center font-poppins text-lg font-medium px-10">
                    {backgroundNoiseMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      case 10:
        return (
          <div className='h-full py-10'>
            <h2 className="font-outfit font-bold text-5xl text-auralyellow text-center pt-10 pb-6 w-full">Tone Test</h2>
            <div className="flex flex-row item-center justify-center w-[900px] border-2 border-gray-100 shadow-xl rounded-lg">
              <div className="flex flex-col items-start justify-start w-1/2">
                <h2 className="font-poppins text-3xl pt-10 pb-5 px-2 font-normal text-auralyellow">
                  {currentTone.frequency}Hz - {currentTone.ear.charAt(0).toUpperCase() + currentTone.ear.slice(1)} Ear
                </h2>
                <p className='font-poppins text-[14px] text-start flex gap-1 ml-2 pb-2 px-2 items-center'>
                  Adjust the volume until you can {toneAdjustmentType} hear the tone.
                </p>
                <div className="flex flex-col items-center justify-center mt-4 w-full">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={toneVolume}
                    onChange={(e) => {
                      const newVolume = Number(e.target.value);
                      setToneVolume(newVolume);
                      adjustToneVolume(newVolume);
                    }}
                    className="w-3/4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between w-3/4 mt-2">
                    <span className="text-sm text-gray-500">0</span>
                    <span className="text-sm text-gray-500">Volume: {toneVolume}</span>
                    <span className="text-sm text-gray-500">100</span>
                  </div>
                </div>
                <button
                  className="mx-auto px-12 py-2 bg-auralblue text-white font-poppins text-xl font-bold text-center rounded-none mt-8"
                  onClick={handleNextTone}
                >
                  Next
                </button>
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-1/2">
                <img src={assets.Test_3} className='w-full rounded-r-lg h-[500px] rounded-br-lg' alt="" />
              </motion.div>
            </div>
          </div>
        );
      case 11:
        return (
          <div className='h-full py-10'>
            <h2 className="font-outfit font-bold text-5xl text-auralyellow text-center pt-10 pb-6 w-full">Speech Test</h2>
            <div className="flex flex-row item-center justify-center w-[900px] border-2 border-gray-100 shadow-xl rounded-lg">
              <div className="flex flex-col items-start justify-start w-1/2">
                <h2 className="font-poppins text-3xl pt-10 pb-5 px-2 font-normal text-auralyellow">Round {currentRound} - {currentEar.charAt(0).toUpperCase() + currentEar.slice(1)} Ear</h2>
                <p className='font-poppins text-[14px] text-start flex gap-1 ml-2 pb-2 px-2 items-center'>Listen to the audio and select the 3 words you hear.</p>
                <audio ref={audioRef} loop>
                  <source src={audioUrl} type="audio/wav" />
                  <source src={audioUrl} type="audio/mpeg" />
                  <source src={audioUrl} type="audio/ogg" />
                  Your browser does not support the audio element.
                </audio>
                <div className="grid grid-cols-4 gap-2 gap-y-4 mt-4 text-center mx-auto">
                  {allWords.map((word) => (
                    <button
                      key={word}
                      className={`text-[16px] text-center font-normal ${
                        selectedWords.includes(word)
                          ? 'bg-auralblue text-white'
                          : 'bg-transparent text-black'
                        } border-[1px] border-auralyellow rounded-none w-24 h-12 font-poppins hover:text-white flex items-center justify-center`}
                      onClick={() => handleWordSelection(word)}
                    >
                      {word}
                    </button>
                  ))}
                </div>
                <button
                  className="mx-auto px-12 py-2 bg-auralblue text-white font-poppins text-xl font-bold text-center rounded-none mt-8"
                  onClick={handleNextRound}
                  disabled={selectedWords.length !== 3}
                >
                  Next
                </button>
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-1/2">
                <img src={assets.Test_3} className='w-full rounded-r-lg h-[500px] rounded-br-lg' alt="" />
              </motion.div>
            </div>
          </div>
        );
      case 12:
        return (
          <div className='h-full py-10'>
            <h2 className="font-outfit font-bold text-5xl text-auralyellow text-center pt-10 pb-6 w-full">Test Complete</h2>
            <div className="flex flex-col items-center justify-center w-[900px] border-2 border-gray-100 shadow-xl rounded-lg">
              <div className="flex flex-col items-start justify-start w-full p-8">
                {showReport ? (
                  <HearingTestReport />
                ) : (
                  <>
                    <p className="font-poppins text-xl text-center mb-4 mx-auto">Your test has been successfully completed. Please click 'Submit' to receive your results.</p>
                    <button
                      className="px-12 py-2 bg-auralblue text-white font-poppins text-xl font-bold text-center rounded-none mt-8 mx-auto"
                      onClick={submitHearingTest}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Calculating Your Test Results. Please Wait...' : 'Submit Test Results'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Use useEffect to fetch speech test data when the component mounts
  useEffect(() => {
    if (step === 11) {
      setAllWords(shuffleArray([...allWords]));
      setAudioUrl(`http://aural-hearing-backend-production.up.railway.app/api/speech-test/${currentEar}/audio/1`);
    }
  }, [step]);

  return (
    <div className="flex items-center justify-center">
      {renderStep()}
    </div>
  );
};

export default Hearing_Test;