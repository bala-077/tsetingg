// import React, { useEffect, useState } from 'react'
// import { useHistory } from 'react-router-dom' // For navigation
// import { checkToken } from '../../Api/Users/Users'
// import { fetchDashBoardData } from '../../Api/Dashboard/Dashboard'

// const ProjectStatus = () => {
//     const history = useHistory()  // Initialize history for navigation
//     const [userType, setUserType] = useState('')
//     const [counts, setCounts] = useState({})
//     const [recentAddedBooks, setRecentAddedBooks] = useState([])
//     const [recentAddedStudents, setRecentAddedStudents] = useState([])
//     const [recentBorrows, setRecentBorrows] = useState([])
//     const [recentReservations, setRecentReservations] = useState([])
//     const [PMrecentAddedBooks, setPMrecentAddedBooks] = useState([])
//     const [PMrecentAddedStudents, setPMrecentAddedStudents] = useState([])

//     useEffect(() => {
//         let isCancelled = false; // To handle cleanup of async operations

//         const fetchApi = async () => {
//             const res = await checkToken("")
//             if (res === undefined || res.status === 401) {
//                 history.push('/') // Redirect to home if no valid token or unauthorized
//             } else {
//                 const data = await fetchDashBoardData()

//                 if (!isCancelled) {
//                     // Set data based on the userType
//                     if (res.data.userType === 'PD') {
//                         setUserType(res.data.userType)
//                         setCounts(data.counts)
//                         setRecentAddedBooks(data.recentBooks)
//                         setRecentAddedStudents(data.recentStudents)
//                         setRecentBorrows(data.recentBorrows)
//                         setRecentReservations(data.recentReservations)
//                     } else {
//                         setUserType(res.data.userType)
//                         setCounts(data.counts)
//                         setPMrecentAddedBooks(data.PMrecentAddedBooks)
//                         setPMrecentAddedStudents(data.PMrecentAddedStudents)
//                     }
//                 }
//             }
//         }

//         fetchApi()

//         return () => {
//             // Cleanup on component unmount
//             isCancelled = true
//         }
//     }, [history])

//     return (
//         <div>
//             <h1>Project Status</h1>
//             {userType === 'admin' ? (
//                 <div>
//                     <h2>Admin View</h2>
//                     <div>Counts: {JSON.stringify(counts)}</div>
//                     {/* Render other admin-specific data */}
//                 </div>
//             ) : (
//                 <div>
//                     <h2>Project Manager View</h2>
//                     <div>PM Counts: {JSON.stringify(counts)}</div>
//                     {/* Render other project manager-specific data */}
//                 </div>
//             )}
//         </div>
//     )
// }

// export default ProjectStatus

import React, { useEffect, useState } from "react";
import axios from "axios";

const ProjectStatus = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [TL, setTL] = useState([]);

  const getTL = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/allocate/create"
      );
      setTL(response.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/allocate/get-status"
      );
      setData(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
    getTL();
  }, []);

  const getProjectLead = (projectname) => {
    const projectLead = TL.find((item) => item.projectname === projectname);
    return projectLead ? projectLead.plname : "No Lead Assigned";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Start":
        return "text-yellow-500";
      case "Process":
        return "text-blue-500";
      case "Testing":
        return "text-purple-500";
      case "Deployment":
        return "text-red-500";
      case "Finish":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusLineColor = (status) => {
    switch (status) {
      case "Start":
        return "bg-yellow-500";
      case "Process":
        return "bg-blue-500";
      case "Testing":
        return "bg-purple-500";
      case "Deployment":
        return "bg-red-500";
      case "Finish":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case "Start":
        return "20%";
      case "Process":
        return "40%";
      case "Testing":
        return "60%";
      case "Deployment":
        return "80%";
      case "Finish":
        return "100%";
      default:
        return "0%";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Project Status Dashboard</h1>
        <p className="text-gray-600">Track and monitor your project progress</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-lg p-8">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Projects Allocated</h2>
          <p className="text-gray-600 text-center max-w-md">
            Currently, there are no projects allocated. Projects will appear here once they are assigned.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, i) => (
            <div
              key={i}
              className="relative bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {item.projectname}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(item.stage)} bg-opacity-10 ${getStatusLineColor(item.stage)}`}>
                    {item.stage}
                  </span>
                </div>

                <div className="relative mt-4 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`${getStatusLineColor(item.stage)} absolute left-0 top-0 h-full rounded-full transition-all duration-1000`}
                    style={{ width: getProgressPercentage(item.stage) }}
                  ></div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600">Project Lead</p>
                      <p className="font-medium text-gray-800">{getProjectLead(item.projectname)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600">Team Members</p>
                      <p className="font-medium text-gray-800">{item.plname.join(", ")}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium text-gray-800">{item.duration} month</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-500">
                    <div>
                      <p className="font-medium">Register Date</p>
                      <p>{item.registerdate}</p>
                    </div>
                    <div>
                      <p className="font-medium">Created On</p>
                      <p>{new Date(item.dateCreated).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-24 h-24 bg-opacity-10 bg-gray-300 rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-opacity-10 bg-gray-300 rounded-tr-full"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectStatus;