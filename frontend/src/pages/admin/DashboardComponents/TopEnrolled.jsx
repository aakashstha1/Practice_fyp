import axios from "axios";
import React, { useEffect, useState } from "react";

function TopEnrolled() {
  const API_URL = "http://localhost:8000/api";
  const [topEnrolledCourses, setTopEnrolledCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await axios.get(`${API_URL}/admin/most-enrolled-courses`, {
        withCredentials: true,
      });
      // console.log(res?.data?.topCourses);
      setTopEnrolledCourses(res?.data?.topCourses);
    };
    fetchCourses();
  }, []);

  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return "bg-yellow-400 text-white"; // Gold
      case 1:
        return "bg-gray-300 text-black"; // Silver
      case 2:
        return "bg-yellow-700 text-white"; // Bronze
      default:
        return "bg-green-100 text-green-600"; // Default
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Top Courses by Enrollment
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Rank
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Course Name
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Instructor
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Students Enrolled
              </th>
            </tr>
          </thead>
          <tbody>
            {topEnrolledCourses.map((course, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${getRankColor(
                      index
                    )}`}
                  >
                    {index + 1}
                  </div>
                </td>
                <td className="py-3 px-4 font-medium text-gray-800">
                  {course?.title}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {course?.creator?.name}
                </td>
                <td className="py-3 px-4 font-medium text-purple-600">
                  {course?.enrolledStudents.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default TopEnrolled;
