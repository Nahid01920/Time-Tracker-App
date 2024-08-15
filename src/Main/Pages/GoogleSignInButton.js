// import React, { useState } from 'react';

// const DynamicForm = () => {
//   const [emails, setEmails] = useState(['']); // State to store email addresses

//   const handleAddField = () => {
//     setEmails([...emails, '']); // Add a new empty email field
//   };

//   const handleRemoveField = (index) => {
//     const newEmails = [...emails];
//     newEmails.splice(index, 1); // Remove the email field at the given index
//     setEmails(newEmails);
//   };

//   const handleChange = (index, event) => {
//     const newEmails = [...emails];
//     newEmails[index] = event.target.value; // Update the email at the given index
//     setEmails(newEmails);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     // Handle form submission logic here using 'emails' state
//     console.log('Submitted emails:', emails);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {emails.map((email, index) => (
//         <div key={index}>
//           <input
//             type="email"
//             placeholder="Enter email"
//             value={email}
//             onChange={(event) => handleChange(index, event)}
//           />
//           <button type="button" onClick={() => handleRemoveField(index)}>
//             Remove
//           </button>
//         </div>
//       ))}
//       <button type="button" onClick={handleAddField}>
//         Add Email
//       </button>
//       <button type="submit">Submit</button>
//     </form>
//   );
// };

// export default DynamicForm;






import {
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReactComponent as PowerOffIcon } from '../../Example/assets/PowerOffIcon.svg';
import { ReactComponent as Pages } from "../../Example/assets/add.svg";
// import { ReactComponent as Pages } from '../../Example/assets/add.svg";
import { ReactComponent as PauseIcon } from '../../Example/assets/multimedia-pause-icon-circle-button.svg';
import { ReactComponent as PlayIcon } from '../../Example/assets/play.svg';
import { auth, db } from '../firebase-config';

function CreatePost({ isAuth }) {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const [running, setRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalTimes, setTotalTimes] = useState([]);
  const intervalRef = useRef();
  const postsCollectionRef = collection(db, 'posts');

  useEffect(() => {
    // Retrieve project name from localStorage
    const storedTitle = localStorage.getItem('projectTitle');
    if (storedTitle) {
      setTitle(storedTitle);
    }

    const storedElapsedTime = localStorage.getItem('elapsedTime');
    if (storedElapsedTime) {
      setElapsedTime(parseInt(storedElapsedTime, 10));
    }

    const isTimerRunning = sessionStorage.getItem('isTimerRunning');
    if (isTimerRunning === 'true') {
      setRunning(true);
    }
  }, []);

  const saveElapsedTimeToLocalStorage = (time) => {
    localStorage.setItem('elapsedTime', time.toString());
  };

  // Update project title in localStorage when it changes
  const updateProjectTitle = (newTitle) => {
    setTitle(newTitle);
    localStorage.setItem('projectTitle', newTitle);
  };

  const stopTimer = async () => {
    try {
      if (!title.trim()) {
        console.error('Error: Title cannot be empty');
        toast.error('Error: Title cannot be empty');
        return;
      }

      if (running || !running) {
        clearInterval(intervalRef.current);
        setTotalTimes((prevTotalTimes) => [...prevTotalTimes, elapsedTime]);
        setElapsedTime(0);
        saveElapsedTimeToLocalStorage(0);
        setRunning(false);
      }
    } catch (error) {
      console.error('Error stopping timer:', error);
      toast.error('Error stopping timer:', error);
    }
  };

  useEffect(() => {
    const createPost = async () => {
      try {
        await addDoc(postsCollectionRef, {
          title,
          author: {
            name: auth.currentUser.displayName,
            id: auth.currentUser.uid,
          },
          createdAt: serverTimestamp(),
          totalTimes: totalTimes,
        });

        localStorage.removeItem('elapsedTime');
        sessionStorage.removeItem('isTimerRunning');
        localStorage.removeItem('projectTitle'); // Clear project title after submission
        toast.success('Added your Task successfully!');
        navigate('/');
      } catch (error) {
        console.error('Error creating post:', error);
        toast.error('Error creating post:', error);
      }
    };

    if (totalTimes.length > 0) {
      createPost();
    }
  }, [totalTimes, postsCollectionRef, title, navigate]);

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
    }
  }, [isAuth, navigate]);

  useEffect(() => {
    if (running) {
      const startTime = Date.now() - elapsedTime * 1000;

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setElapsedTime(elapsed);
        saveElapsedTimeToLocalStorage(elapsed);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [running, elapsedTime]);

  const startTimer = () => {
    if (!running) {
      setRunning(true);
      sessionStorage.setItem('isTimerRunning', 'true');
    }
  };

  const pauseTimer = () => {
    if (running) {
      setRunning(false);
      sessionStorage.setItem('isTimerRunning', 'false');
    }
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return (
      hours.toString().padStart(2, '0') +
      ':' +
      minutes.toString().padStart(2, '0') +
      ':' +
      seconds.toString().padStart(2, '0')
    );
  };

  const basicInfo =
    'user name :  ' +
    (auth.currentUser?.displayName || 'N/A') +
    '  Email :  ' +
    (auth.currentUser?.email || 'N/A') +
    '  Project Title :  ' +
    title;
  
const addTask = () => {
    console.log("kicu nai re");
  }

  return (
    <div className="createPostPage min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full md:w-1/2 mx-auto px-4 py-5 bg-white rounded-lg shadow border">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-500 mb-6">Time Tracker</h1>
          <p className="text-gray-600">A Web Application for Tracking Time</p>
        </div>
        <div className="mb-4">
          <ul className="flex flex-col md:flex-row justify-between pl-4 mb-4">
          <li className="mb-4 md:mb-0 w-full md:w-2/3">
            <input
              type="text"
              placeholder="Enter Project Name"
              className="border border-gray-300 shadow px-2 py-2 mt-1 w-full rounded"
              value={title}
              onChange={(event) => {
                updateProjectTitle(event.target.value);
              }}
            />
          </li>
          <li className="w-full md:w-1/3 lg:mr-6">
            <div className="clock-count flex mt-1 justify-center md:justify-end text-right">
              <div className="timing-clock mt-1.5 ml-2 text-[20px]">
                <h1 title="Time Count">{formatTime(elapsedTime)}</h1>
              </div>
              <div className="clock-icon ml-2 md:ml-8 mt-2">
                <div>
                  {!running ? (
                    <button onClick={startTimer}>
                      <PlayIcon width="24" height="24" title="Start Timer" />
                    </button>
                  ) : (
                    <button onClick={pauseTimer}>
                      <PauseIcon width="24" height="24" title="Pause Timer" />
                    </button>
                  )}
                  <button onClick={stopTimer} className="ml-2">
                    <PowerOffIcon width="26" height="26" title={basicInfo} />
                  </button>
                </div>
              </div>
            </div>
          </li>
          </ul>
        </div>
        <div className="mb-4">
          <button
            onClick={addTask}
            className="add-page flex 
            items-center justify-center 
            bg-blue-500 text-white 
            py-2 px-4 ml-4 rounded-md 
            hover:bg-blue-600 
            transition duration-300"
            >
            <span>Add Task</span>
             <Pages width="30" height="30" title="Add Pages" />
          </button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default CreatePost;
