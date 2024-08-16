/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */

import { addDays } from "date-fns";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReactComponent as DownloadIcon } from "../assets/download-button-1.svg";
import { ReactComponent as User } from "../assets/user.svg";
import { ReactComponent as Worker } from "../assets/working.svg";
import { auth, db } from "../firebase-config";

export function Dashboard({ isAuth }) {
  const [postList, setPostList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10); // Fixed number of rows per page
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRange, setDateRange] = useState("");

  const postsCollectionRef = collection(db, "posts");

  // Confirmation modal state
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  const openConfirmationModal = (id) => {
    setPostIdToDelete(id);
    setShowConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setPostIdToDelete(null);
    setShowConfirmationModal(false);
  };

  const deletePost = async (id) => {
    // Show the confirmation modal
    openConfirmationModal(id);
  };

  const confirmDelete = async () => {
    try {
      // Delete the post
      await deleteDoc(doc(db, "posts", postIdToDelete));
      setPostList((prevPosts) =>
        prevPosts.filter((post) => post.id !== postIdToDelete)
      );

      // Show success toast
      toast.success("Post deleted successfully");

      // Close the confirmation modal
      closeConfirmationModal();
    } catch (error) {
      console.error("Error deleting post:", error);
      // Handle error: show an error toast
      toast.error("Error deleting post");

      // Close the confirmation modal
      closeConfirmationModal();
    }
  };

  const formatTime = (totalSeconds) => {
    if (totalSeconds === null || totalSeconds === undefined)
      return "No time tracked";

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const calculateTotalWorkingTime = () => {
    let totalWorkingTime = 0;
    postList.forEach((post) => {
      if (post.totalTimes) {
        totalWorkingTime += post.totalTimes.reduce(
          (acc, curr) => acc + curr,
          0
        );
      }
    });
    return totalWorkingTime;
  };

  const exportToCSV = () => {
    const csvFields = [
      "Serial No.",
      "Project Details",
      "Duration",
      "Update Time",
      "Author",
    ];
    const csvData = postList.map((post, index) => [
      index + 1, // Serial number starts from 1
      post.title,
      post.totalTimes
        ? formatTime(post.totalTimes.reduce((acc, curr) => acc + curr, 0))
        : "No time tracked",
      post.createdAt
        ? post.createdAt.toLocaleString("en-US", { timeZone: "UTC" }) // Use UTC or specify a time zone
        : "",
      post.author.name,
    ]);

    // Adding Total Working Time as a row in the CSV data
    const totalWorkingTimeRow = [
      "Total Working Time",
      "",
      formatTime(calculateTotalWorkingTime()),
      "",
      "",
    ];
    csvData.push(totalWorkingTimeRow);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvFields.join(",") +
      "\n" +
      csvData.map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "dashboard_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const fetchPosts = async () => {
    if (isAuth && currentUser) {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(
          query(postsCollectionRef, where("author.id", "==", currentUser.uid))
        );

        const posts = [];
        querySnapshot.forEach((doc) => {
          const postData = doc.data();
          const post = {
            id: doc.id,
            ...postData,
            createdAt: postData.createdAt ? postData.createdAt.toDate() : null,
          };
          posts.push(post);
        });

        setPostList(posts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [isAuth, currentUser]);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    const now = new Date();
    switch (range) {
      case "7":
        setStartDate(addDays(now, -7));
        setEndDate(now);
        break;
      case "10":
        setStartDate(addDays(now, -10));
        setEndDate(now);
        break;
      case "15":
        setStartDate(addDays(now, -15));
        setEndDate(now);
        break;
      case "30":
        setStartDate(addDays(now, -30));
        setEndDate(now);
        break;
      case "allDays":
      default:
        setStartDate(null);
        setEndDate(null);
        break;
    }
  };

  const filteredData = useMemo(() => {
    return postList.filter((item) => {
      const dateMatch =
        (!startDate || new Date(item.createdAt) >= startDate) &&
        (!endDate || new Date(item.createdAt) <= endDate);
      const searchMatch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.createdAt
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.totalTimes.toString().includes(searchTerm);
      return dateMatch && searchMatch;
    });
  }, [searchTerm, startDate, endDate, postList]);

  // Calculate the index of the first and last row to display
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  // Handle Next and Previous buttons
  const handleNext = () => {
    if (currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Reset to the first page when the filteredData changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="p-4 bg-[#073b4c] relative rounded-lg shadow-md">
        <ul className="flex flex-col md:flex-row justify-between items-center">
          <li className="text-[#0ead69] font-bold text-xl md:text-2xl">
            Dash<span className="text-white">board</span>
          </li>
          <li className="text-white font-bold">
            Total Working Time: {formatTime(calculateTotalWorkingTime())} Hours
          </li>
          <li className="text-white font-bold flex items-center">
            <User className="w-6 h-6" />
            <p className="ml-2 text-[#219ebc]">
              {currentUser ? currentUser.displayName : "Loading..."}
            </p>
          </li>
          <li className="text-white font-bold flex items-center mt-4 md:mt-0">
            <Worker className="w-6 h-6" />
            <span className="ml-2">Running...</span>
          </li>
          <li className="mt-4 md:mt-0 cursor-pointer" onClick={exportToCSV}>
            <DownloadIcon className="w-6 h-6 text-green-900" />
          </li>
        </ul>
      </div>

      <div className="flex flex-wrap justify-between mt-4">
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
          <div className="flex flex-col space-y-4">
            <select
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Select-Days">Select Days</option>
              <option value="allDays">All Days</option>
              <option value="7">Last 7 Days</option>
              <option value="10">Last 10 Days</option>
              <option value="15">Last 15 Days</option>
              <option value="30">Last 30 Days</option>
            </select>
          </div>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
          <div className="flex flex-col">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date"
              className="w-full mr-2 p-2 border border-gray-300 rounded-md sm:mb-2"
            />{" "}
          </div>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
          <div className="flex flex-col ">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              placeholderText="End Date"
              className="w-full p-2 border border-gray-300 rounded-md"
            />{" "}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr className="text-xs md:text-sm lg:text-base">
              <th className="w-20 p-3 font-semibold text-left">Serial No.</th>
              <th className="w-20 p-3 font-semibold text-left">
                Project Details
              </th>
              <th className="w-20 p-3 font-semibold text-left">Durations</th>
              <th className="w-20 p-3 font-semibold text-left">Update Time</th>
              <th className="w-12 p-3 font-semibold text-left">Author</th>
              <th className="w-8 p-3 font-semibold text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentData.map((post, index) => (
              <tr key={post.id} className="border-t border-gray-300">
                <td className="px-4 py-2 font-bold">
                  {indexOfFirstRow + index + 1}
                </td>
                <td className="px-4 py-2">{post.title}</td>
                <td className="px-4 py-2">
                  {post.totalTimes
                    ? formatTime(
                        post.totalTimes.reduce((acc, curr) => acc + curr, 0)
                      )
                    : "No time tracked"}
                </td>
                <td className="px-4 py-2">
                  {post.createdAt ? post.createdAt.toLocaleString() : ""}
                </td>
                <td className="px-4 py-2 font-bold text-[#073b4c]">
                  @{post.author.name}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-white bg-red-700 hover:bg-red-800 px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-4 py-2 ${
              currentPage === 1
                ? "bg-gray-300"
                : "bg-blue-500 hover:bg-blue-700 text-white"
            } rounded`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={
              currentPage === Math.ceil(filteredData.length / rowsPerPage)
            }
            className={`px-4 py-2 ${
              currentPage === Math.ceil(filteredData.length / rowsPerPage)
                ? "bg-gray-300"
                : "bg-blue-500 hover:bg-blue-700 text-white"
            } rounded`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
