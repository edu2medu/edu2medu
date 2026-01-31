import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Home,
  Plus,
  Ban,
  Newspaper,
  User,
  LogOut,
  Menu,
  X,
  PhoneCall,
  BookOpen,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaMoneyBill } from "react-icons/fa";

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    ctitle: "",
    categoryType: "",
    userType: "",
  });

  const [newsFormData, setNewsFormData] = useState({
    title: "",
    content: "",
    newsImage: "",
    moreContent: "",
  });
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASEURI}/admin/getContacts`
        );
        setContacts(response.data);
      } catch (err) {
        setError("Failed to fetch contacts.");
      }
    };

    fetchContacts();
  }, []);
  const handleNewsChange = (e) => {
    setNewsFormData({ ...newsFormData, [e.target.name]: e.target.value });
  };
  const handleNewsFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      setImage(file); // ✅ Store file correctly
      setFileName(file.name);

      // ✅ Ensure state consistency
      setNewsFormData((prevData) => ({
        ...prevData,
        newsImage: file, // This will not be sent as JSON, only used for reference
      }));
    }
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();

    const trimedTitle = newsFormData.title?.trim();
    const trimedContent = newsFormData.content?.trim();
    const trimedMoreContent = newsFormData.moreContent?.trim();

    if (!trimedContent || !trimedTitle || !trimedMoreContent || !image) {
      alert("All fields including image are required");
      return;
    }

    console.log("Submitting with:", {
      trimedTitle,
      trimedContent,
      trimedMoreContent,
      image,
    });

    // ✅ Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(image.type)) {
      alert("Please select a valid image file (JPEG, PNG, WebP, or GIF)");
      return;
    }

    // ✅ Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (image.size > maxSize) {
      alert("File size should be less than 5MB");
      return;
    }

    // ✅ Use FormData to send the file
    const formDataToSends = new FormData();
    formDataToSends.append("title", trimedTitle);
    formDataToSends.append("content", trimedContent);
    formDataToSends.append("moreContent", trimedMoreContent);
    formDataToSends.append("image", image); // ✅ Correctly attach file

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURI}/admin/addNews`,
        formDataToSends,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert(response.data.message);
        // ✅ Reset form
        setNewsFormData({
          title: "",
          content: "",
          moreContent: "",
        });
        setFileName("");
        setImage(null);

        // ✅ Reset file input manually
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        throw new Error(response.data.message || "Failed to add News");
      }
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      alert(
        "Error adding news. " +
        (error.response?.data?.message || "Please try again.")
      );
    }
  };

  //Addcategory
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = formData.name?.trim();
    const trimmedTitle = formData.ctitle?.trim();
    const trimmedType = formData.categoryType?.trim();
    const trimmedUserType = formData.userType?.trim();
    if (
      !trimmedName ||
      !trimmedTitle ||
      !trimmedType ||
      !trimmedUserType ||
      !image
    ) {
      alert("All fields including image are required");
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(image.type)) {
      alert("Please select a valid image file (JPEG, PNG, or GIF)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (image.size > maxSize) {
      alert("File size should be less than 5MB");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", trimmedName);
    formDataToSend.append("ctitle", trimmedTitle);
    formDataToSend.append("categoryType", trimmedType);
    formDataToSend.append("image", image);
    formDataToSend.append("userType", trimmedUserType);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURI}/admin/addCategory`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // Add timeout and retry logic
          timeout: 30000, // 30 seconds timeout
          maxRetries: 3,
          retryDelay: 1000,
        }
      );

      if (response.data.success) {
        alert(response.data.message);
        // Reset form
        setFormData({
          name: "",
          ctitle: "",
          categoryType: "",
          userType: "",
        });
        setFileName("");
        setImage(null);

        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        throw new Error(response.data.message || "Failed to add category");
      }
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);

      let errorMessage = "Error adding category. ";
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Please try again.";
      }

      alert(errorMessage);
    }
  };

  // Update time and greeting
  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date();
      const indianTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      const formattedTime = indianTime.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentTime(formattedTime);

      const hours = indianTime.getHours();
      if (hours >= 5 && hours < 12) setGreeting("Good Morning");
      else if (hours >= 12 && hours < 17) setGreeting("Good Afternoon");
      else if (hours >= 17 && hours < 21) setGreeting("Good Evening");
      else setGreeting("Good Night");
    };

    const interval = setInterval(updateTimeAndGreeting, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchEduUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURI}/admin/getEducationUsers`
      );
      const userData = Array.isArray(response.data?.users) ? response.data.users : [];
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching Education users:", error);
    }
  };

  const fetchMedUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURI}/admin/getHealthcareUsers`
      );
      const userData = Array.isArray(response.data?.users) ? response.data.users : [];
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching Healthcare users:", error);
    }
  };

  const onBlockUser = async (userId, currentStatus) => {
    try {
      const isBlocked = currentStatus === "blocked";
      const endpoint =
        selectedSection === "Education"
          ? isBlocked
            ? `${import.meta.env.VITE_BASEURI}/admin/unblockEducationUser`
            : `${import.meta.env.VITE_BASEURI}/admin/blockEducationUser`
          : isBlocked
            ? `${import.meta.env.VITE_BASEURI}/admin/unblockHealthcareUser`
            : `${import.meta.env.VITE_BASEURI}/admin/blockHealthcareUser`;

      await axios.post(endpoint, { userId });
      selectedSection === "Education" ? fetchEduUsers() : fetchMedUsers();
    } catch (error) {
      console.error("Error toggling user block status:", error);
      alert("Failed to update user status.");
    }
  };

  const handleSchoolSelection = (schoolId) => {
    setSelectedSchools((prev) => {
      if (prev.includes(schoolId)) {
        return prev.filter((id) => id !== schoolId);
      } else {
        return [...prev, schoolId];
      }
    });
  };
  const calculateRemainingDays = (paymentDate) => {
    if (!paymentDate) return "N/A";

    const oneDay = 24 * 60 * 60 * 1000;
    const currentDate = new Date();
    const paymentDateObj = new Date(paymentDate);

    const diffDays = Math.round(
      Math.abs((currentDate - paymentDateObj) / oneDay)
    );
    const remainingDays = 365 - diffDays;

    return remainingDays >= 0 ? remainingDays : 0;
  };


  const formatIndianDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };


  useEffect(() => {
    if (selectedSection === "Education") {
      fetchEduUsers();
    } else if (selectedSection === "Healthcare") {
      fetchMedUsers();
    }
  }, [selectedSection]);

  const sidebarOptions = {
    Education: [
      { name: "Dashboard", icon: <Home /> },
      { name: "Add Categories", icon: <Plus /> },
      { name: "Block School & College", icon: <Ban /> },
      { name: "Add News", icon: <Newspaper /> },
      { name: "User Details", icon: <User /> },
      { name: "Payment History", icon: <FaMoneyBill /> },
      { name: "User Inquiries", icon: <PhoneCall /> },
    ],
    Healthcare: [
      { name: "Dashboard", icon: <Home /> },
      { name: "Add Categories", icon: <Plus /> },
      { name: "Block Medical & Clinics", icon: <Ban /> },
      { name: "Add News", icon: <Newspaper /> },
      { name: "User Details", icon: <User /> },
      { name: "Payment History", icon: <FaMoneyBill /> },
      { name: "User Inquiries", icon: <PhoneCall /> },
    ],
  };

  const renderEducationTable = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-[#17A2B8] to-[#1E2939] text-white px-6 py-3 rounded-xl shadow-lg">
            <span className="font-semibold">Total Schools: {Array.isArray(users) ? users.length : 0}</span>
          </div>
        </div>
        {selectedSchools.length > 0 && (
          <button className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold">
            Block Selected ({selectedSchools.length})
          </button>
        )}
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="w-full bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
              <th className="py-4 px-6 text-left font-semibold">Select</th>
              <th className="py-4 px-6 text-left font-semibold">Name</th>
              <th className="py-4 px-6 text-left font-semibold">Type</th>
              <th className="py-4 px-6 text-left font-semibold">Category</th>
              <th className="py-4 px-6 text-left font-semibold">Subscription</th>
              <th className="py-4 px-6 text-left font-semibold">Remaining Days</th>
              <th className="py-4 px-6 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.isArray(users) && users.map((school, index) => (
              <tr key={school._id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className="py-4 px-6">
                  <input
                    type="checkbox"
                    checked={selectedSchools.includes(school._id)}
                    onChange={() => handleSchoolSelection(school._id)}
                    className="h-5 w-5 text-[#17A2B8] rounded border-gray-300 focus:ring-[#17A2B8]"
                  />
                </td>
                <td className="py-4 px-6 font-medium text-gray-900">{school.name}</td>
                <td className="py-4 px-6 text-gray-600">{school.userType}</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {school.category}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${school.paymentDetails.paymentStatus === "paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                    }`}>
                    {school.paymentDetails?.paymentStatus === "paid" ? "✓ Paid" : "✗ Unpaid"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`font-semibold ${calculateRemainingDays(school.paymentDetails.paymentDate) <= 30
                    ? "text-red-600"
                    : "text-green-600"
                    }`}>
                    {calculateRemainingDays(school.paymentDetails?.paymentDate)} days
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <button
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${school.status === "blocked"
                      ? "bg-green-500 hover:bg-green-600 text-white shadow-md"
                      : "bg-red-500 hover:bg-red-600 text-white shadow-md"
                      }`}
                    onClick={() => onBlockUser(school._id, school.status)}
                  >
                    {school.status === "blocked" ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUserTable = () => (
    <div className="space-y-4">
      <div className="flex justify-end mb-6">
        <div className="bg-gradient-to-r from-[#17A2B8] to-[#1E2939] text-white px-6 py-3 rounded-xl shadow-lg">
          <span className="font-semibold">Total Active Users: {Array.isArray(users) ? users.length : 0}</span>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="w-full bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
              <th className="py-4 px-6 text-left font-semibold">Select</th>
              <th className="py-4 px-6 text-left font-semibold">Name</th>
              <th className="py-4 px-6 text-left font-semibold">Type</th>
              <th className="py-4 px-6 text-left font-semibold">Category</th>
              <th className="py-4 px-6 text-left font-semibold">Subscription</th>
              <th className="py-4 px-6 text-left font-semibold">Remaining Days</th>
              <th className="py-4 px-6 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.isArray(users) && users.map((user, index) => (
              <tr key={user._id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className="py-4 px-6">
                  <input
                    type="checkbox"
                    checked={selectedSchools.includes(user._id)}
                    onChange={() => handleSchoolSelection(user._id)}
                    className="h-5 w-5 text-[#17A2B8] rounded border-gray-300 focus:ring-[#17A2B8]"
                  />
                </td>
                <td className="py-4 px-6 font-medium text-gray-900">{user.name}</td>
                <td className="py-4 px-6 text-gray-600">{user.userType}</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.category}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${user.paymentDetails.paymentStatus === "paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                    }`}>
                    {user.paymentDetails?.paymentStatus === "paid" ? "✓ Paid" : "✗ Unpaid"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`font-semibold ${calculateRemainingDays(user.paymentDetails.paymentDate) <= 30
                    ? "text-red-600"
                    : "text-green-600"
                    }`}>
                    {calculateRemainingDays(user.paymentDetails?.paymentDate)} days
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <button
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${user.status === "blocked"
                      ? "bg-green-500 hover:bg-green-600 text-white shadow-md"
                      : "bg-red-500 hover:bg-red-600 text-white shadow-md"
                      }`}
                    onClick={() => onBlockUser(user._id, user.status)}
                  >
                    {user.status === "blocked" ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeItem) {
      case "Dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Users</p>
                    <p className="text-3xl font-bold mt-2">{Array.isArray(users) ? users.length : 0}</p>
                  </div>
                  <User className="w-12 h-12 text-blue-200" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Active Users</p>
                    <p className="text-3xl font-bold mt-2">
                      {Array.isArray(users) ? users.filter(u => u.status === 'active').length : 0}
                    </p>
                  </div>
                  <Activity className="w-12 h-12 text-green-200" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Paid Users</p>
                    <p className="text-3xl font-bold mt-2">
                      {Array.isArray(users) ? users.filter(u => u.paymentDetails?.paymentStatus === 'paid').length : 0}
                    </p>
                  </div>
                  <FaMoneyBill className="w-12 h-12 text-purple-200" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Welcome to {selectedSection} Dashboard</h3>
              <p className="text-gray-600">Manage {selectedSection.toLowerCase()} users, categories, news, and inquiries from this centralized dashboard.</p>
            </div>
          </div>
        );
      case "Add Categories":
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Add Categories for {selectedSection}
              </h2>
              <p className="text-gray-600 mt-1">Create a new category to organize content</p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-gray-50 p-6 rounded-xl"
              encType="multipart/form-data"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white"
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ctitle"
                    value={formData.ctitle}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white"
                    placeholder="Enter category title"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryType"
                    value={formData.categoryType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white"
                    required
                  >
                    <option value="">Select Category Type</option>
                    {selectedSection === "Education" ? (
                      <>
                        <option value="Day School">Day School</option>
                        <option value="Boarding School">Boarding School</option>
                        <option value="Play School">Play School</option>
                        <option value="Private Tutor">Private Tutor</option>
                        <option value="Coaching Centre">Coaching Centre</option>
                      </>
                    ) : (
                      <>
                        <option value="Hospital">Hospital</option>
                        <option value="Private Clinic">Private Clinic</option>
                        <option value="Medical Stores">Medical Stores</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    User Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white"
                    required
                  >
                    <option value="">Select User Type</option>
                    {selectedSection === "Education" ? (
                      <>
                        <option value="education">Education</option>
                      </>
                    ) : (
                      <>
                        <option value="healthcare">HealthCare</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Image <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#17A2B8] transition-colors bg-white">
                  <div className="space-y-2 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center items-center gap-1">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-semibold text-[#17A2B8] hover:text-[#0f7a8a] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#17A2B8] transition-colors"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="image"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept="image/*"
                          required
                        />
                      </label>
                      <p className="text-gray-500">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF, WEBP up to 5MB
                    </p>
                    {fileName && (
                      <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium text-green-700">
                          {fileName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#17A2B8] to-[#1E2939] text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#17A2B8] focus:ring-offset-2"
              >
                Add Category
              </button>
            </form>
          </div>
        );
      case "Block School & College":
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                Block Education Institutions
              </h3>
              <p className="text-gray-600 mt-1">Manage and block/unblock educational institutions</p>
            </div>
            {users.length > 0 ? (
              renderEducationTable()
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-600 text-lg">No educational institutions found.</p>
              </div>
            )}
          </div>
        );
      case "Block Medical & Clinics":
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                Block Healthcare Institutions
              </h3>
              <p className="text-gray-600 mt-1">Manage and block/unblock healthcare institutions</p>
            </div>
            {users.length > 0 ? (
              renderUserTable()
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-600 text-lg">No healthcare institutions found.</p>
              </div>
            )}
          </div>
        );
      case "Add News":
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-gray-800">Add News</h2>
              <p className="text-gray-600 mt-1">Create and publish news articles</p>
            </div>
            <form
              onSubmit={handleNewsSubmit}
              className="space-y-6 bg-gray-50 p-6 rounded-xl"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  News Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  placeholder="Enter news title"
                  value={newsFormData.title}
                  onChange={handleNewsChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sub Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  placeholder="Enter sub content or summary"
                  value={newsFormData.content}
                  onChange={handleNewsChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Main Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="moreContent"
                  placeholder="Enter main content"
                  value={newsFormData.moreContent}
                  onChange={handleNewsChange}
                  required
                  rows="8"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  News Image <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#17A2B8] transition-colors bg-white">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="image"
                          type="file"
                          className="sr-only"
                          onChange={handleNewsFileChange}
                          accept="image/*"
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF ,WEBP up to 5MB
                    </p>
                    {fileName && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected file: {fileName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#17A2B8] to-[#1E2939] text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#17A2B8] focus:ring-offset-2"
              >
                Publish News
              </button>
            </form>
          </div>
        );
      case "User Details":
        return (
          <div className="p-4 sm:p-6 md:p-8 bg-gray-100 rounded-xl shadow-xl border border-gray-300 w-full overflow-hidden">
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-gray-900 text-center">
              {selectedSection} User List
            </h3>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0">
              <span className="bg-gradient-to-r from-[#17A2B8] to-[#5db4c1] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold shadow-lg text-center">
                Total Active Users: {users.length}
              </span>
            </div>

            {users.length > 0 ? (
              <>
                {/* Table for Desktop and Tablet */}
                <div className="hidden sm:block overflow-x-auto rounded-lg shadow-md">
                  <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden text-sm sm:text-md">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#17A2B8] to-[#17A2B8] text-white uppercase text-xs sm:text-sm font-bold tracking-wide text-center">
                        <th className="py-3 px-4 sm:py-4 sm:px-6">Name</th>
                        <th className="py-3 px-4 sm:py-4 sm:px-6">Email</th>
                        <th className="py-3 px-4 sm:py-4 sm:px-6">Phone</th>
                        <th className="py-3 px-4 sm:py-4 sm:px-6">Subscription</th>
                        <th className="py-3 px-4 sm:py-4 sm:px-6">Remaining Days</th>
                        <th className="py-3 px-4 sm:py-4 sm:px-6">Type</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-800 font-medium divide-y divide-gray-300">
                      {Array.isArray(users) && users.map((user, index) => (
                        <tr
                          key={user._id}
                          className={`transition duration-300 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 hover:scale-[1.02]`}
                        >
                          <td className="py-3 px-4 sm:py-4 sm:px-6 text-center">{user.name}</td>
                          <td className="py-3 px-4 sm:py-4 sm:px-6 text-center break-all">{user.email}</td>
                          <td className="py-3 px-4 sm:py-4 sm:px-6 text-center">
                            <a href={`tel:${user.phone}`} className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M2 3a1 1 0 011-1h3a1 1 0 011 .883l.7 4.2a1 1 0 01-.316.906l-1.6 1.4a13.06 13.06 0 006.316 6.316l1.4-1.6a1 1 0 01.906-.316l4.2.7A1 1 0 0118 15v3a1 1 0 01-1 1h-2c-8.837 0-16-7.163-16-16V4a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                              <span className="text-xs sm:text-sm">{user.phone}</span>
                            </a>
                          </td>
                          <td className={`py-3 px-4 sm:py-4 sm:px-6 text-center font-semibold rounded-md ${user.paymentDetails.paymentStatus === "paid"
                            ? "text-green-700 bg-green-200"
                            : "text-red-700 bg-red-200"
                            }`}
                          >
                            {user.paymentDetails.paymentStatus}
                          </td>
                          <td className={`py-3 px-4 sm:py-4 sm:px-6 text-center font-semibold rounded-md ${calculateRemainingDays(user.paymentDetails.paymentDate) <= 30
                            ? "text-red-700 bg-red-200"
                            : "text-green-700 bg-green-200"
                            }`}
                          >
                            {calculateRemainingDays(user.paymentDetails.paymentDate)}
                          </td>
                          <td className="py-3 px-4 sm:py-4 sm:px-6 text-center">{user.userType}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Card Layout for Mobile */}
                <div className="sm:hidden space-y-4">
                  {Array.isArray(users) && users.map((user, index) => (
                    <div key={user._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                      <div className="space-y-2">
                        <p className="text-gray-900 font-semibold">Name: <span className="font-normal">{user.name}</span></p>
                        <p className="text-gray-900 font-semibold">Email: <span className="font-normal break-all">{user.email}</span></p>
                        <p className="text-gray-900 font-semibold">
                          Phone:{" "}
                          <a href={`tel:${user.phone}`} className="font-normal text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M2 3a1 1 0 011-1h3a1 1 0 011 .883l.7 4.2a1 1 0 01-.316.906l-1.6 1.4a13.06 13.06 0 006.316 6.316l1.4-1.6a1 1 0 01.906-.316l4.2.7A1 1 0 0118 15v3a1 1 0 01-1 1h-2c-8.837 0-16-7.163-16-16V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            <span>{user.phone}</span>
                          </a>
                        </p>
                        <p className="text-gray-900 font-semibold">
                          Subscription:{" "}
                          <span className={`font-semibold rounded-md px-2 py-1 ${user.paymentDetails.paymentStatus === "paid"
                            ? "text-green-700 bg-green-200"
                            : "text-red-700 bg-red-200"
                            }`}
                          >
                            {user.paymentDetails.paymentStatus}
                          </span>
                        </p>
                        <p className="text-gray-900 font-semibold">
                          Remaining Days:{" "}
                          <span className={`font-semibold rounded-md px-2 py-1 ${calculateRemainingDays(user.paymentDetails.paymentDate) <= 30
                            ? "text-red-700 bg-red-200"
                            : "text-green-700 bg-green-200"
                            }`}
                          >
                            {calculateRemainingDays(user.paymentDetails.paymentDate)}
                          </span>
                        </p>
                        <p className="text-gray-900 font-semibold">Type: <span className="font-normal">{user.userType}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-700 text-center mt-4 sm:mt-6 text-base sm:text-lg">No users found for {selectedSection}.</p>
            )}
          </div>
        );
      case "Payment History":
        return (
          <div className="p-4 sm:p-6 md:p-8 bg-gray-100 rounded-xl shadow-xl border border-gray-300 w-full overflow-hidden">
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-gray-900 text-center">
              {selectedSection} User List
            </h3>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0">
              <span className="bg-gradient-to-r from-[#17A2B8] to-[#5db4c1] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold shadow-lg text-center">
                Total Paid Users: {users.filter(user => user.paymentDetails.paymentStatus === "paid").length}
              </span>
            </div>

            {users.filter(user => user.paymentDetails.paymentStatus === "paid").length > 0 ? (
              <>
                {/* Table for Desktop and Tablet */}
                <div className="hidden sm:block overflow-x-auto rounded-lg shadow-md">
                  <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden text-sm sm:text-md">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#17A2B8] to-[#17A2B8] text-white uppercase text-xs sm:text-sm font-bold tracking-wide text-center">
                        <th className="py-3 px-4 sm:py-4 sm:px-6">Name</th>
                        <th className="py-3 px-4 sm:py-4 sm:px-6">Email</th>
                        <th className="py-3 px-4 sm:py-4 sm:px-6">UTR Number</th>
                        <th className="py-3 px-4 sm:py-4 sm:px-6">Payment Date & Time (IST)</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-800 font-medium divide-y divide-gray-300">
                      {users.filter(user => user.paymentDetails.paymentStatus === "paid").map((user, index) => (
                        <tr key={user._id} className={`transition duration-300 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 hover:scale-[1.02]`}>
                          <td className="py-3 px-4 sm:py-4 sm:px-6 text-center">{user.name}</td>
                          <td className="py-3 px-4 sm:py-4 sm:px-6 text-center">{user.email}</td>
                          <td className="py-3 px-4 sm:py-4 sm:px-6 text-center font-semibold">{user.paymentDetails.utrNumber || "N/A"}</td>
                          <td className="py-3 px-4 sm:py-4 sm:px-6 text-center font-semibold">{formatIndianDateTime(user.paymentDetails.paymentDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Card Layout for Mobile */}
                <div className="sm:hidden space-y-4">
                  {users.filter(user => user.paymentDetails.paymentStatus === "paid").map(user => (
                    <div key={user._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                      <p className="text-gray-900 font-semibold">Name: <span className="font-normal">{user.name}</span></p>
                      <p className="text-gray-900 font-semibold">Email: <span className="font-normal">{user.email}</span></p>
                      <p className="text-gray-900 font-semibold">UTR Number: <span className="font-normal">{user.paymentDetails.utrNumber || "N/A"}</span></p>
                      <p className="text-gray-900 font-semibold">Payment Date & Time: <span className="font-normal">{formatIndianDateTime(user.paymentDetails.paymentDate)}</span></p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-700 text-center mt-4 sm:mt-6 text-base sm:text-lg">
                No paid users found for {selectedSection}.
              </p>
            )}
          </div>
        );

      case "User Inquiries":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="border-b border-gray-200 pb-4 flex-1">
                <h3 className="text-2xl font-bold text-gray-800">User Inquiries</h3>
                <p className="text-gray-600 mt-1">View and manage user contact inquiries</p>
              </div>
              <div className="bg-gradient-to-r from-[#E76F51] to-[#d45a3f] text-white px-6 py-3 rounded-xl shadow-lg">
                <span className="font-semibold">Total: {contacts.length}</span>
              </div>
            </div>

            {contacts.length > 0 ? (
              <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
                <table className="w-full bg-white">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#E76F51] to-[#d45a3f] text-white">
                      <th className="py-4 px-6 text-left font-semibold">Name</th>
                      <th className="py-4 px-6 text-left font-semibold">Phone</th>
                      <th className="py-4 px-6 text-left font-semibold">Date</th>
                      <th className="py-4 px-6 text-center font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {contacts.map((contact, index) => (
                      <tr
                        key={contact._id}
                        className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                      >
                        <td className="py-4 px-6 font-medium text-gray-900">
                          {contact.name}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          <a href={`tel:${contact.phone}`} className="hover:text-[#17A2B8] transition-colors">
                            {contact.phone}
                          </a>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <a
                            href={`tel:${contact.phone}`}
                            className="inline-flex items-center justify-center w-10 h-10 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            <PhoneCall size={20} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <PhoneCall className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No user inquiries found.</p>
              </div>
            )}
          </div>
        );
      default:
        return <p>Select an option from the sidebar.</p>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-blue-50">
      {selectedSection ? (
        <div className="flex flex-col md:flex-row min-h-screen w-full">
          <aside
            className={`w-full md:w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-6 shadow-2xl fixed md:sticky top-0 h-screen transition-transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
              } md:translate-x-0 z-50 border-r border-gray-700`}
          >
            {/* Sidebar Header */}
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-700">
              <div>
                <h1 className="text-xl font-bold text-white">{selectedSection}</h1>
                <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="md:hidden text-white hover:bg-gray-700 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1">
              <ul className="space-y-2">
                {sidebarOptions[selectedSection].map((item, index) => (
                  <li key={index}>
                    <button
                      className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 text-left group ${activeItem === item.name
                        ? "bg-gradient-to-r from-[#17A2B8] to-[#1E2939] text-white shadow-lg"
                        : "hover:bg-gray-700/50 text-gray-300 hover:text-white"
                        }`}
                      onClick={() => {
                        setActiveItem(item.name);
                        setIsMenuOpen(false);
                      }}
                    >
                      <span className={`${activeItem === item.name ? "text-white" : "text-gray-400 group-hover:text-white"} transition-colors`}>
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium">{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Logout Button */}
            <button
              className="w-full py-3 bg-gradient-to-r from-[#E76F51] to-[#d45a3f] hover:from-[#d45a3f] hover:to-[#c04a2f] text-white font-semibold rounded-xl flex items-center justify-center gap-3 mt-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                sessionStorage.removeItem("admin");
                navigate("/login");
              }}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </aside>
          <div
            className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50 md:p-8 lg:p-10 overflow-y-auto min-h-screen"
            style={{ scrollbarWidth: "thin", msOverflowStyle: "none" }}
          >
            {/* Header Bar */}
            <div className="flex justify-between items-center mb-8 bg-white rounded-2xl shadow-md p-4 sticky top-0 z-10">
              <button
                className="md:hidden text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu size={28} />
              </button>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex-1 text-center md:text-left">
                {activeItem}
              </h2>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">{renderMainContent()}</div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden px-4">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 max-w-4xl w-full">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#E76F51] to-[#17A2B8] rounded-full mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#E76F51] to-[#17A2B8] text-transparent bg-clip-text mb-3">
                  Welcome, Admin
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 font-medium">
                  {greeting}!
                </p>
                <p className="text-gray-500 mt-2 text-sm md:text-base">
                  {currentTime}
                </p>
              </div>

              {/* Section Selection Cards */}
              <div className="grid md:grid-cols-2 gap-6 mt-10">
                <button
                  onClick={() => setSelectedSection("Education")}
                  className="group relative overflow-hidden bg-gradient-to-br from-[#E76F51] to-[#d45a3f] rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Education</h2>
                    <p className="text-white/90 text-sm">Manage schools, colleges, and educational institutions</p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedSection("Healthcare")}
                  className="group relative overflow-hidden bg-gradient-to-br from-[#17A2B8] to-[#0f7a8a] rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                      <Activity className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Healthcare</h2>
                    <p className="text-white/90 text-sm">Manage hospitals, clinics, and medical facilities</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes blob {
              0% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
              100% { transform: translate(0px, 0px) scale(1); }
            }
            .animate-blob {
              animation: blob 7s infinite;
            }
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            .animation-delay-4000 {
              animation-delay: 4s;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
