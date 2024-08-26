/* eslint-disable react-hooks/exhaustive-deps */

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReactComponent as PowerOffIcon } from "../assets/PowerOffIcon.svg";
import { ReactComponent as Pages } from "../assets/add.svg";
import { ReactComponent as Delete } from "../assets/delete.svg";
import { ReactComponent as PauseIcon } from "../assets/multimedia-pause-icon-circle-button.svg";
import { ReactComponent as PlayIcon } from "../assets/play.svg";
import { auth, db } from "../firebase-config";

function CreatePost({ isAuth }) {
  const [tasks, setTasks] = useState(() => {
    // Retrieve tasks from LocalStorage
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks
      ? JSON.parse(savedTasks)
      : [{ id: 1, title: "", elapsedTime: 0, running: false }];
  });

  const navigate = useNavigate();
  const intervalRefs = useRef([]);
  const postsCollectionRef = collection(db, "posts");

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  // Save tasks to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Restore timer intervals
  useEffect(() => {
    tasks.forEach((task, index) => {
      if (task.running) {
        const startTime = Date.now() - task.elapsedTime * 1000;

        intervalRefs.current[index] = setInterval(() => {
          const now = Date.now();
          const elapsed = Math.floor((now - startTime) / 1000);
          const updatedTasks = [...tasks];
          updatedTasks[index].elapsedTime = elapsed;
          setTasks(updatedTasks);
        }, 1000);
      }
    });

    return () => {
      intervalRefs.current.forEach(clearInterval);
    };
  }, [tasks]);

  const handleTitleChange = (index, newTitle) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].title = newTitle;
    setTasks(updatedTasks);
  };

  const startTimer = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].running = true;
    setTasks(updatedTasks);

    const startTime = Date.now() - updatedTasks[index].elapsedTime * 1000;

    intervalRefs.current[index] = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      updatedTasks[index].elapsedTime = elapsed;
      setTasks([...updatedTasks]);
    }, 1000);
  };

  const pauseTimer = (index) => {
    clearInterval(intervalRefs.current[index]);
    const updatedTasks = [...tasks];
    updatedTasks[index].running = false;
    setTasks(updatedTasks);
  };

  const stopTimer = (index) => {
    clearInterval(intervalRefs.current[index]);

    const updatedTasks = [...tasks];
    updatedTasks[index].running = false;

    const currentElapsedTime = updatedTasks[index].elapsedTime;
    updatedTasks[index].totalTimes = [
      ...(updatedTasks[index].totalTimes || []),
      currentElapsedTime,
    ];

    const createPost = async () => {
      try {
        await addDoc(postsCollectionRef, {
          title: updatedTasks[index].title,
          author: {
            name: auth.currentUser.displayName,
            id: auth.currentUser.uid,
          },
          createdAt: serverTimestamp(),
          totalTimes: updatedTasks[index].totalTimes,
        });

        toast.success("Task added successfully!");

        // Remove task from state and local storage
        updatedTasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
        // Navigate to the dashboard
        navigate("/");
      } catch (error) {
        console.error("Error creating post:", error);
        toast.error("Error creating post:", error);
      }
    };

    createPost();
  };

  const deleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const addTask = () => {
    setTasks((prevTasks) => [
      ...prevTasks,
      { id: prevTasks.length + 1, title: "", elapsedTime: 0, running: false },
    ]);
  };

  return (
   
    <div className="createPostPage min-h-screen px-4 flex items-center justify-center bg-gray-100 w-full">
      <div className="w-full max-w-2xl mx-auto py-6 bg-white rounded-lg shadow-md border">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-500 mb-4">
            Time Tracker
          </h1>
          <p className="text-gray-600 text-base">
            A Web Application for Tracking Time
          </p>
        </div>

        {tasks.map((task, index) => (
          <div key={task.id} className="mb-6">
            <ul className="flex flex-col md:flex-row justify-between items-center md:items-start px-4 mb-4">
              <li className="w-full md:w-2/3 mb-4 md:mb-0 md:pr-2 ">
                <input
                  type="text"
                  placeholder="Enter Project Name"
                  className="border border-gray-300 shadow px-2 py-2  w-full rounded-md"
                  value={task.title}
                  onChange={(event) =>
                    handleTitleChange(index, event.target.value)
                  }
                />
              </li>
              <li className="w-full md:w-1/3 flex items-center justify-center md:justify-end space-x-2">
                <div className="flex items-center space-x-4">
                  <div className="timing-clock text-xl md:text-[16px]">
                    <h1 title="Time Count">{formatTime(task.elapsedTime)}</h1>
                  </div>
                  <div className="flex space-x-2">
                    {!task.running ? (
                      <button
                        onClick={() => startTimer(index)}
                        aria-label="Start Timer"
                      >
                        <PlayIcon width="24" height="20" />
                      </button>
                    ) : (
                      <button
                        onClick={() => pauseTimer(index)}
                        aria-label="Pause Timer"
                      >
                        <PauseIcon width="20" height="20" />
                      </button>
                    )}
                    <button
                      onClick={() => stopTimer(index)}
                      aria-label="Stop Timer"
                    >
                      <PowerOffIcon width="20" height="20" />
                    </button>
                    <button
                      onClick={() => deleteTask(index)}
                      aria-label="Delete Task"
                    >
                      <Delete width="20" height="20" />
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        ))}

        <div className="flex justify-center mb-6">
          <button
            onClick={addTask}
            className="flex items-center bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-300"
          >
            <span className="mr-2">Add Task</span>
            <Pages width="30" height="30" />
          </button>
        </div>
        <ToastContainer />
      </div>
    </div>

  

  );
}

export default CreatePost;
