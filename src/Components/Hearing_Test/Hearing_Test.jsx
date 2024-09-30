'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { FaPlay, FaVolumeUp, FaVolumeDown } from 'react-icons/fa';
import { FaPlus, FaMinus  } from "react-icons/fa6";


// import '../Components.css';
import assets from '../../../public/assets/assets';
import { IoIosCheckmark } from 'react-icons/io';


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

  // Function to submit hearing test data
  const submitHearingTest = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://aural-hearing-backend-production.up.railway.app/api/hearing-test/submit',
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
          <div className='h-full py-10  '>
            <h2 className="font-outfit font-bold text-5xl text-auralyellow text-center pt-10 pb-6 w-full">Instant Hearing Test</h2>
            <div className="flex flex-row item-center justify-center w-[900px] border-2 border-gray-100 shadow-xl rounded-lg">
              <div className="flex flex-col items-start justify-start w-1/2">
                <p className="font-poppins text-lg text-start pt-10 px-2 ">Take a 2-minute instant hearing test to check your hearing.</p>
                <p className="font-poppins text-[15px] text-start px-2 py-2 ">This Test Is Designed To:</p>
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
              <div className="w-1/2">
                <img src={assets.Test_1} className='w-full  rounded-r-lg h-[500px] rounded-br-lg' alt="" srcset="" />
              </div>
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
                <input className="w-[405px] max-w-[405px] mx-5 px-2 py-2 border-b-[1.5px] bg-transparent border-gray-500 rounded-t-md  mb-4 text-sm text-black focus:outline-none focus:no-underline rounded-br-sm rounded-bl-sm" type="number" name="age" placeholder="Age" onChange={handleChange} />
                <input className="w-[405px] max-w-[405px] mx-5 px-2 py-2 border-b-[1.5px] bg-transparent border-gray-500 rounded-t-md  mb-4 text-sm text-black focus:outline-none focus:no-underline rounded-br-sm rounded-bl-sm" type="text" name="contact" placeholder="Phone Number or Email" onChange={handleChange} />
                <button className="mx-auto px-12 py-2 bg-auralblue text-white font-poppins text-xl font-bold text-center rounded-none mt-10" onClick={() => setStep(3)}>Next</button>
              </div>
              <div className="w-1/2">
                <img src={assets.Test_1} className='w-full  rounded-r-lg h-[500px] rounded-br-lg' alt="" srcset="" />
              </div>
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
              <div className="w-1/2">
                <img src={assets.Test_1} className='w-full  rounded-r-lg h-[500px] rounded-br-lg' alt="" srcset="" />
              </div>
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
              <div className="w-1/2">
                <img src={assets.Test_1} className='w-full  rounded-r-lg h-[500px] rounded-br-lg' alt="" srcset="" />
              </div>
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
              <div className="w-1/2">
                <img src={assets.Test_1} className='w-full  rounded-r-lg h-[500px] rounded-br-lg' alt="" srcset="" />
              </div>
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
              <div className="w-1/2">
                <img src={assets.Test_1} className='w-full  rounded-r-lg h-[500px] rounded-br-lg' alt="" srcset="" />
              </div>
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
                <img src={assets.Test_1} className='w-full  rounded-r-lg h-[500px] rounded-br-lg' alt="" srcset="" />
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
              <div className="w-1/2">
                <img src={assets.Test_1} className='w-full  rounded-r-lg h-[500px] rounded-br-lg' alt="" srcset="" />
              </div>
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
                <button className=" mx-auto px-12 py-2 bg-auralblue text-white font-poppins text-xl font-bold text-center rounded-none mt-14" onClick={() => setStep(10)} disabled={nextButtonDisabled}>Next</button>
              </div>
              <div className="w-1/2 flex flex-col gap-5 h-[500px] bg-gray-100 items-center justify-center ">
                <button className="text-[16px] mx-auto font-normal bg-transparent border-[1px] border-auralyellow rounded-none h-28 w-52 mb-3  font-poppins hover:text-white" onClick={measureBackgroundNoise}>Measure Background Noise</button>

                {backgroundNoiseMessage && <p className="text-center font-poppins text-lg font-medium px-10">{backgroundNoiseMessage}</p>}
              </div>
            </div>
          </div>
        );
      case 10:
        return (
          <div className='h-full py-10'>
            <h2 className="font-outfit font-bold text-5xl text-auralyellow text-center pt-10 pb-6 w-full">Instant Hearing Test</h2>
            <div className="flex flex-row item-center justify-center w-[900px] border-2 border-gray-100 shadow-xl rounded-lg">
              <div className="flex flex-col items-start justify-start w-1/2">
                <h2 className="font-poppins text-3xl pt-10 pb-9 px-2 font-normal  text-auralyellow">Hearing Test</h2>
                <p className='font-poppins text-[14px] text-start flex gap-1 ml-2 pb-2 px-2 items-center'>Use the "+" and "-" buttons to adjust the decibel levels for the sound.</p>
                <p className='font-poppins text-[14px] text-start flex gap-1 ml-2 px-2 items-center'>Click "Next" once you've adjusted the sound until you can hear the softest tone.</p>

                <div>
                  <p className='font-poppins text-[10px] mt-60 px-5'>Note: This hearing test is computerized and may not provide fully accurate results. For a precise evaluation and proper consultation, please consult a certified audiologist.</p>
                </div>
              </div>
              <div className="w-1/2 flex flex-col gap-5 h-[500px] bg-gray-200 rounded-br-md rounded-tr-md items-center justify-center ">

                <div className='flex gap-3 items-center justify-center'>
                  <button className="bg-transparent hover:bg-transparent" onClick={() => adjustVolume(-0.5)}><FaMinus className='text-4xl text-auralyellow' /></button>
                  <div className='flex flex-col items-center justify-center'>

                    <button className="bg-transparent hover:scale-105 hover:bg-transparent " onClick={() => playSound(frequencies[frequencyIndex].frequency, frequencies[frequencyIndex].ear)}>
                     <img src={assets.play_button} className='w-32 ' alt="" srcset="" />
                    </button>
                    <p className="font-poppins mt-[-12px]">{frequencies[frequencyIndex].label} on {frequencies[frequencyIndex].ear} Ear</p>
                  </div>
                  <button className="bg-transparent hover:bg-transparent " onClick={() => adjustVolume(0.5)}>< FaPlus className='text-4xl text-auralyellow' /></button>
                </div>
                {/* <div className="volume-controls"></div> */}
                <button className="mx-auto px-12 py-2 bg-auralblue text-white font-poppins text-xl font-bold text-center rounded-none mt-2" onClick={handleNextSound}>Next Sound</button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    
    <div className="flex items-center justify-center">
      {renderStep()}
      {submissionMessage && <p className="message">{submissionMessage}</p>}
      {isLoading && <p className="message">Loading...</p>}
    </div>
  );
};

export default Hearing_Test;
