
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Home,
  User,
  Activity,
  HelpCircle,
  LogOut,
  Info,
  MessageCircle,
  Settings,
  Edit3,
  Camera,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Menu,
  X,
  BookOpen,
  Trash2,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const menuButtonRef = useRef(null);
  const [formData, setFormData] = useState({
    id: user?._id || "",
    name: user?.name || "",
    address: user?.address || "",
    phone: user?.phone || "",
    email: user?.email || "",
    description: user?.description || "",
    contactInfo: user?.contactInfo || "",
    amenity: user?.amenity || "",
    establishment: user?.establishment || "",
    additionalInfo: user?.additionalInfo || "",
    teachers: user?.teachers || [],
  });
  const [jobFormData, setJobFormData] = useState({
    jobTitle: "",
    companyName: "",
    location: "",
    jobType: "",
    salary: "",
    jobDescription: "",
    jobRequirements: "",
    applicationDeadline: "",
    howToApply: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const handleJobFormChange = (e) => {
    setJobFormData({ ...jobFormData, [e.target.name]: e.target.value });
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURI}/user/createjob`,
        jobFormData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setMessage(response.data.message);
      setJobFormData({
        jobTitle: "",
        companyName: "",
        location: "",
        jobType: "",
        salary: "",
        jobDescription: "",
        jobRequirements: "",
        applicationDeadline: "",
        howToApply: "",
      });
      // Refresh jobs list after creating
      fetchJobs();
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all jobs
  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASEURI}/user/getalljobs`);
      setJobs(response.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setMessage("Failed to load jobs");
    } finally {
      setLoadingJobs(false);
    }
  };

  // Delete a job
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job opening?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASEURI}/user/deletejob/${jobId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setMessage(response.data.message || "Job deleted successfully");
        // Refresh jobs list
        fetchJobs();
      } else {
        setMessage(response.data.message || "Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      setMessage(error.response?.data?.message || "Failed to delete job");
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const addTeacher = () => {
    setFormData({
      ...formData,
      teachers: [...formData.teachers, { name: "", qualification: "" }],
    });
  };

  const removeTeacher = (index) => {
    const updatedTeachers = formData.teachers.filter((_, i) => i !== index);
    setFormData({ ...formData, teachers: updatedTeachers });
  };

  const handleTeacherChange = (index, field, value) => {
    const updatedTeachers = formData.teachers.map((teacher, i) =>
      i === index ? { ...teacher, [field]: value } : teacher
    );
    setFormData({ ...formData, teachers: updatedTeachers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!user || !user.email) {
      setMessage("Email is missing.");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", user.email);

      // Send all fields including empty strings to allow clearing fields
      Object.keys(formData).forEach((key) => {
        if (key !== "teachers" && key !== "id" && key !== "email") {
          // Send the value even if it's an empty string
          const value = formData[key];
          if (value !== undefined && value !== null) {
            formDataToSend.append(key, value);
          }
        }
      });

      if (profilePicture) {
        formDataToSend.append("image", profilePicture);
      }

      // Ensure teachers is a valid JSON string before appending
      if (Array.isArray(formData.teachers)) {
        formDataToSend.append("teachers", JSON.stringify(formData.teachers));
      }

      // Debug logging
      console.log("--- Sending Profile Update ---");
      console.log("Profile picture file:", profilePicture);
      console.log("FormData entries:");
      for (let pair of formDataToSend.entries()) {
        if (pair[0] === 'image') {
          console.log(`  ${pair[0]}:`, pair[1].name, `(${pair[1].size} bytes)`);
        } else {
          console.log(`  ${pair[0]}:`, pair[1]);
        }
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_BASEURI}/user/updateProfile`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success && response.data.user) {
        // Update user state with the updated user data from server
        const updatedUser = {
          ...user,
          ...response.data.user,
          _id: response.data.user._id || user._id,
        };

        setUser(updatedUser);

        // Update sessionStorage with the updated user data
        sessionStorage.setItem("user", JSON.stringify(updatedUser));

        // Update formData to reflect the saved changes
        setFormData({
          id: updatedUser._id || "",
          name: updatedUser.name || "",
          address: updatedUser.address || "",
          phone: updatedUser.phone || "",
          email: updatedUser.email || "",
          description: updatedUser.description || "",
          contactInfo: updatedUser.contactInfo || "",
          amenity: updatedUser.amenity || "",
          establishment: updatedUser.establishment || "",
          additionalInfo: updatedUser.additionalInfo || "",
          teachers: updatedUser.teachers || [],
        });

        // Clear profile picture state after successful upload
        setProfilePicture(null);

        setMessage(response.data.message || "Profile updated successfully!");

        // Redirect to dashboard after a short delay to show success message
        setTimeout(() => {
          // If using tabs, switch to dashboard tab
          setActiveTab("dashboard");
          // Or if you want to navigate to the route (if specific route exists)
          // navigate('/user-dashboard'); 

          // Scroll to top
          window.scrollTo(0, 0);
        }, 1500);
      } else {
        setMessage(response.data.message || "Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Sync formData with user state when user loads or changes
  useEffect(() => {
    if (user) {
      setFormData({
        id: user._id || user.id || "",
        name: user.name || "",
        address: user.address || "",
        phone: user.phone || "",
        email: user.email || "",
        description: user.description || "",
        contactInfo: user.contactInfo || "",
        amenity: user.amenity || "",
        establishment: user.establishment || "",
        additionalInfo: user.additionalInfo || "",
        teachers: Array.isArray(user.teachers) ? user.teachers : [],
      });
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch jobs when "myJobs" tab is active
  useEffect(() => {
    if (activeTab === "myJobs") {
      fetchJobs();
    }
  }, [activeTab]);

  const renderContent = () => {
    if (!user) return null;
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#17A2B8] to-[#1E2939] rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 capitalize">{user.userType} Dashboard</h1>
                  <p className="text-gray-600 mt-1">Welcome back, {user.name}!</p>
                </div>
              </div>
            </div>

            {/* Status Card */}
            {user.status && (
              <div className={`p-6 rounded-2xl shadow-lg border-2 ${(user.status === 'active' || user.status === 'unblock')
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                }`}>
                <div className="flex items-center gap-4">
                  {(user.status === 'active' || user.status === 'unblock') ? (
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  ) : (
                    <XCircle className="w-10 h-10 text-yellow-600" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Status: <span className="capitalize">{user.status === 'unblock' ? 'Active' : user.status}</span>
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {(user.status === 'active' || user.status === 'unblock')
                        ? 'Your account is active and fully functional.'
                        : 'Your account is currently blocked. Please contact support.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div
                onClick={() => setActiveTab("updateProfile")}
                className="group bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Update Profile</h3>
                    <p className="text-blue-100 text-sm">Keep your profile information up-to-date</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab("postJob")}
                className="group bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                      <Edit3 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Post a Job</h3>
                    <p className="text-purple-100 text-sm">Create and manage job postings</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab("myJobs")}
                className="group bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-2xl shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">My Jobs</h3>
                    <p className="text-indigo-100 text-sm">View and delete your job openings</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab("support")}
                className="group bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Contact Support</h3>
                    <p className="text-green-100 text-sm">Get help from our support team</p>
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                      <Info className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Account Info</h3>
                    <p className="text-orange-100 text-sm">View your account details and settings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "updateProfile":
        return (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#17A2B8] to-[#1E2939] p-6 rounded-2xl shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Edit3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white capitalize">
                    Edit Profile
                  </h2>
                  <p className="text-white/90 mt-1">
                    Update your {user.userType} profile information
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Picture Preview */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-100">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Current Profile Picture
              </label>
              {user.image ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative">
                    <img
                      src={user.image.startsWith('http') ? user.image : `${import.meta.env.VITE_BASEURI}${user.image}`}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#17A2B8] shadow-lg"
                      onError={(e) => {
                        e.target.src = "/default-image.png";
                      }}
                    />
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800 mb-1">Profile image saved</p>
                    <p className="text-sm text-gray-600">Upload a new image below to replace</p>
                    <p className="text-xs text-gray-500 mt-1">Recommended: Square image, max 5MB</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">No profile picture uploaded</p>
                    <p className="text-xs text-gray-500 mt-1">Upload an image below to add your profile picture</p>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <Edit3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white"
                    />
                  </div>
                </div>

                {/* Address Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white"
                    />
                  </div>
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Email Input */}
              {/* <div className="flex items-center space-x-3">
              <Mail className="w-6 h-6 text-purple-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Change Email Address"
                className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-purple-500"
              /> 
            </div>*/}

              {/* Profile Picture Upload */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border-2 border-orange-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Camera className="w-5 h-5 inline mr-2 text-orange-500" />
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border-2 border-dashed border-orange-300 rounded-xl bg-white hover:border-orange-400 transition-colors cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 file:cursor-pointer"
                />
                {profilePicture && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {profilePicture.name} selected
                  </p>
                )}
              </div>

              {/* Description Textarea */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Edit3 className="w-4 h-4 inline mr-2 text-[#17A2B8]" />
                  Description
                  {formData.description && (
                    <span className="ml-2 text-xs text-green-600 font-normal flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Saved
                    </span>
                  )}
                </label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  placeholder="Enter a brief description about your institution/organization"
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white resize-none"
                ></textarea>
                {formData.description && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="text-green-600">●</span>
                    Current: {formData.description.substring(0, 60)}{formData.description.length > 60 ? '...' : ''}
                  </p>
                )}
              </div>

              {/* Contact Info Textarea */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2 text-[#17A2B8]" />
                  Contact Information
                  {formData.contactInfo && (
                    <span className="ml-2 text-xs text-green-600 font-normal flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Saved
                    </span>
                  )}
                </label>
                <textarea
                  name="contactInfo"
                  value={formData.contactInfo || ""}
                  onChange={handleChange}
                  placeholder="Enter contact details (email, phone, address, etc.)"
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white resize-none"
                ></textarea>
                {formData.contactInfo && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="text-green-600">●</span>
                    Current: {formData.contactInfo.substring(0, 60)}{formData.contactInfo.length > 60 ? '...' : ''}
                  </p>
                )}
              </div>

              {/* Amenity Textarea */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <CheckCircle className="w-4 h-4 inline mr-2 text-[#17A2B8]" />
                  Amenities
                  {formData.amenity && (
                    <span className="ml-2 text-xs text-green-600 font-normal flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Saved
                    </span>
                  )}
                </label>
                <textarea
                  name="amenity"
                  value={formData.amenity || ""}
                  onChange={handleChange}
                  placeholder="List amenities (one per line):&#10;• WiFi&#10;• Parking&#10;• Library"
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white resize-none"
                ></textarea>
                {formData.amenity && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="text-green-600">●</span>
                    Current: {formData.amenity.split('\n')[0] || formData.amenity.substring(0, 60)}{formData.amenity.length > 60 ? '...' : ''}
                  </p>
                )}
              </div>

              {/* Establishment */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Home className="w-4 h-4 inline mr-2 text-[#17A2B8]" />
                  Establishment Details
                  {formData.establishment && (
                    <span className="ml-2 text-xs text-green-600 font-normal flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Saved
                    </span>
                  )}
                </label>
                <textarea
                  name="establishment"
                  value={formData.establishment || ""}
                  onChange={handleChange}
                  placeholder="Enter establishment year, history, or other details"
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white resize-none"
                ></textarea>
                {formData.establishment && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="text-green-600">●</span>
                    Current: {formData.establishment.substring(0, 60)}{formData.establishment.length > 60 ? '...' : ''}
                  </p>
                )}
              </div>

              {/* Additional Info */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Info className="w-4 h-4 inline mr-2 text-[#17A2B8]" />
                  Additional Information
                  {formData.additionalInfo && (
                    <span className="ml-2 text-xs text-green-600 font-normal flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Saved
                    </span>
                  )}
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo || ""}
                  onChange={handleChange}
                  placeholder="Add any additional information about your institution/organization"
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white resize-none"
                ></textarea>
                {formData.additionalInfo && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="text-green-600">●</span>
                    Current: {formData.additionalInfo.substring(0, 60)}{formData.additionalInfo.length > 60 ? '...' : ''}
                  </p>
                )}
              </div>

              {/* Our Specialist Section */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl border-2 border-teal-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <User className="w-6 h-6 text-teal-600" />
                    Our Specialists / Teachers
                    {formData.teachers && formData.teachers.length > 0 && (
                      <span className="ml-2 text-sm font-normal text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        ({formData.teachers.length} {formData.teachers.length === 1 ? 'specialist' : 'specialists'} saved)
                      </span>
                    )}
                  </h3>
                  <button
                    type="button"
                    onClick={addTeacher}
                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-semibold flex items-center gap-2"
                  >
                    <span>+</span> Add Specialist
                  </button>
                </div>

                {!formData.teachers || formData.teachers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-white/50 rounded-lg">
                    <User className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No specialists added yet. Click "Add Specialist" to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.teachers.map((teacher, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                            <span className="text-teal-600 font-bold text-sm">{index + 1}</span>
                          </div>
                          {(teacher.name || teacher.qualification) && (
                            <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Saved
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Specialist Name
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                value={teacher.name || ""}
                                onChange={(e) => handleTeacherChange(index, "name", e.target.value)}
                                placeholder="Enter specialist name"
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Qualification / Specialization
                            </label>
                            <div className="relative">
                              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                value={teacher.qualification || ""}
                                onChange={(e) => handleTeacherChange(index, "qualification", e.target.value)}
                                placeholder="Enter qualification"
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeTeacher(index)}
                          className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-all font-semibold flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove Specialist
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    // Reset form to original user data
                    setFormData({
                      id: user._id || user.id || "",
                      name: user.name || "",
                      address: user.address || "",
                      phone: user.phone || "",
                      email: user.email || "",
                      description: user.description || "",
                      contactInfo: user.contactInfo || "",
                      amenity: user.amenity || "",
                      establishment: user.establishment || "",
                      additionalInfo: user.additionalInfo || "",
                      teachers: Array.isArray(user.teachers) ? user.teachers : [],
                    });
                    setProfilePicture(null);
                    setMessage("");
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl shadow-md hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-[#17A2B8] to-[#1E2939] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Activity className="w-5 h-5 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Status Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-xl shadow-lg ${message.includes("success") || message.includes("Success")
                  ? "bg-green-50 border-2 border-green-200 text-green-800"
                  : "bg-blue-50 border-2 border-blue-200 text-blue-800"
                  }`}
              >
                <div className="flex items-center gap-2">
                  {message.includes("success") || message.includes("Success") ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Info className="w-5 h-5 text-blue-600" />
                  )}
                  <p className="font-semibold">{message}</p>
                </div>
              </motion.div>
            )}
          </div>


        );
      case "postJob":
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-gray-800">Post a Job</h2>
              <p className="text-gray-600 mt-1">
                Fill out the form below to post a new job opportunity.
              </p>
            </div>

            <form onSubmit={handleJobSubmit} className="space-y-6 bg-gray-50 p-6 rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Edit3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="jobTitle"
                      value={jobFormData.jobTitle}
                      onChange={handleJobFormChange}
                      placeholder="Enter job title"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="companyName"
                      value={jobFormData.companyName}
                      onChange={handleJobFormChange}
                      placeholder="Enter company name"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={jobFormData.location}
                      onChange={handleJobFormChange}
                      placeholder="Enter job location"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="jobType"
                      value={jobFormData.jobType}
                      onChange={handleJobFormChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white appearance-none"
                      required
                    >
                      <option value="">Select Job Type</option>
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Salary (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                    <input
                      type="number"
                      name="salary"
                      value={jobFormData.salary}
                      onChange={handleJobFormChange}
                      placeholder="Enter salary amount"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white"
                      onWheel={(e) => e.target.blur()}
                      style={{ appearance: "textfield" }}
                    />
                  </div>
                </div>

                {/* Job Description */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="jobDescription"
                    value={jobFormData.jobDescription}
                    onChange={handleJobFormChange}
                    placeholder="Describe the job role and responsibilities"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white resize-none"
                    rows="4"
                    required
                  ></textarea>
                </div>

                {/* Job Requirements */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Requirements <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="jobRequirements"
                    value={jobFormData.jobRequirements}
                    onChange={handleJobFormChange}
                    placeholder="List the required qualifications and skills"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white resize-none"
                    rows="4"
                    required
                  ></textarea>
                </div>

                {/* Application Deadline */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Application Deadline <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={jobFormData.applicationDeadline}
                      onChange={handleJobFormChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white"
                      required
                    />
                  </div>
                </div>

                {/* How to Apply */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    How to Apply <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="howToApply"
                    value={jobFormData.howToApply}
                    onChange={handleJobFormChange}
                    placeholder="Provide instructions for applicants"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white resize-none"
                    rows="4"
                    required
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#17A2B8] to-[#1E2939] text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#17A2B8] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Posting..." : "Post Job"}
                </button>
              </div>
            </form>

            {/* Status Message */}
            {message && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                <p className="text-green-700 font-medium">{message}</p>
              </div>
            )}
          </div>
        );

      case "myJobs":
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-gray-800">My Job Openings</h2>
              <p className="text-gray-600 mt-1">
                View and manage all posted job openings.
              </p>
            </div>

            {loadingJobs ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No job openings posted yet.</p>
                <p className="text-gray-500 mt-2">Post your first job opening to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{job.jobTitle}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <p><strong>Company:</strong> {job.companyName}</p>
                          <p><strong>Location:</strong> {job.location}</p>
                          <p><strong>Job Type:</strong> {job.jobType}</p>
                          {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        disabled={loading}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete job"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <p><strong>Description:</strong> {job.jobDescription}</p>
                      <p><strong>Requirements:</strong> {job.jobRequirements}</p>
                      <p><strong>Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}</p>
                      <p><strong>How to Apply:</strong> {job.howToApply}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Status Message */}
            {message && (
              <div className={`mt-6 p-4 rounded-xl text-center ${message.includes("success") || message.includes("Success")
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
                }`}>
                <p className="font-medium">{message}</p>
              </div>
            )}
          </div>
        );

      // case "status":
      //   return (
      //     <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
      //       <h2 className="text-xl font-semibold mb-4">{user.userType} Status</h2>

      //       {user.status === "block" ? (
      //         <div>
      //           {/* Blocked Status Content */}
      //           <div className="flex items-center space-x-3 text-red-500">
      //             <XCircle className="w-8 h-8" />
      //             <p className="text-lg font-semibold">Your account is currently blocked.</p>
      //           </div>
      //           <p className="mt-2 text-red-600">If you believe this is a mistake, please contact our support team or request an unblock by sending a message to the admin.</p>

      //           {/* Instructional Content */}
      //           <div className="mt-6 bg-yellow-100 p-4 rounded-md">
      //             <h3 className="text-lg font-semibold text-yellow-600">How to Request Unblock:</h3>
      //             <ul className="list-inside list-disc text-gray-600">
      //               <li>Describe the issue you're facing clearly and provide any relevant details.</li>
      //               <li>Ensure to mention your username or account email for quick identification.</li>
      //               <li>If this is a system-generated block, the admin will review and resolve it accordingly.</li>
      //             </ul>
      //           </div>

      //           {/* Unblock Request Form */}
      //           <textarea
      //             className="w-full p-2 border border-gray-300 rounded-md mt-4"
      //             placeholder="Write your message to the admin..."
      //           ></textarea>
      //           <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600">
      //             Send Request
      //           </button>

      //           {/* Support Contact Info */}
      //           <div className="mt-6 bg-gray-100 p-4 rounded-md">
      //             <h3 className="text-lg font-semibold">Need Immediate Assistance?</h3>
      //             <p className="text-gray-600">
      //               You can also get in touch with our support team by calling or emailing us:
      //             </p>
      //             <ul className="text-blue-500">
      //               <li><strong>Phone:</strong> +1 800 123 4567</li>
      //               <li><strong>Email:</strong> support@example.com</li>
      //             </ul>
      //           </div>
      //         </div>
      //       ) : (
      //         <div>
      //           {/* Active Status Content */}
      //           <div className="flex items-center space-x-3 text-green-500">
      //             <CheckCircle className="w-8 h-8" />
      //             <p className="text-lg font-semibold">Your account is active and fully functional.</p>
      //           </div>

      //           {/* Encouragement Content */}
      //           <div className="mt-6 bg-green-100 p-4 rounded-md">
      //             <h3 className="text-lg font-semibold text-green-600">Stay Active and Explore More:</h3>
      //             <p className="text-gray-600">
      //               Enjoy your time on the platform! Make sure to regularly update your profile to enhance your experience. Here are some things you can do:
      //             </p>
      //             <ul className="list-inside list-disc text-gray-600">
      //               <li>Complete your profile with the latest information.</li>
      //               <li>Check out new features that are available to you.</li>
      //               <li>Review your privacy settings to make sure your data is secure.</li>
      //             </ul>
      //           </div>

      //           {/* Additional Links */}
      //           <div className="mt-6 bg-gray-100 p-4 rounded-md">
      //             <h3 className="text-lg font-semibold">Need Help or Have Questions?</h3>
      //             <p className="text-gray-600">
      //               If you need assistance or have any questions about your account or how to make the most of our platform, feel free to contact our support team.
      //             </p>
      //             <ul className="text-blue-500">
      //               <li><strong>Help Center:</strong> <a href="#" className="hover:underline">Visit our Help Center</a></li>
      //               <li><strong>Contact Us:</strong> <a href="#" className="hover:underline">Submit a Support Request</a></li>
      //             </ul>
      //           </div>
      //         </div>
      //       )}
      //     </div>
      //   );
      case "support":
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-gray-800 capitalize">{user.userType} Support</h2>
              <p className="text-gray-600 mt-1">Need help? Our support team is here to assist you.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div
                className="group bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300"
                onClick={() => window.location.href = 'tel:+919811247700'}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">Call Us</p>
                    <p className="text-blue-100 text-sm">+91 9811247700</p>
                  </div>
                </div>
              </div>

              <div
                className="group bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300"
                onClick={() => window.location.href = 'mailto:support.edu2medu@gmail.com'}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">Email Us</p>
                    <p className="text-green-100 text-sm">support.edu2medu@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Submit a Support Request</h3>
              <textarea
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17A2B8] focus:border-[#17A2B8] transition-all bg-white resize-none"
                rows="6"
                placeholder="Describe your issue or question..."
              ></textarea>
              <button className="mt-4 w-full bg-gradient-to-r from-[#17A2B8] to-[#1E2939] text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300">
                Submit Request
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6 text-gray-800">{user.userType} Dashboard</div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Modern Sidebar */}
      <div
        ref={sidebarRef}
        className={`w-full md:w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-6 flex flex-col justify-between transition-all duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:relative z-50 h-screen border-r border-gray-700 shadow-2xl`}
      >
        <div>
          {/* User Profile Section */}
          <div className="mb-8 pb-6 border-b border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#17A2B8] to-[#1E2939] rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {user?.name || "User"}
                </h2>
                <p className="text-xs text-gray-400 capitalize">{user?.userType || "User"}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ul className="space-y-2">
            <li
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${activeTab === "dashboard"
                ? "bg-gradient-to-r from-[#17A2B8] to-[#1E2939] text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                }`}
              onClick={() => { setActiveTab("dashboard"); setIsSidebarOpen(false); }}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </li>
            <li
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${activeTab === "updateProfile"
                ? "bg-gradient-to-r from-[#17A2B8] to-[#1E2939] text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                }`}
              onClick={() => { setActiveTab("updateProfile"); setIsSidebarOpen(false); }}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Update Profile</span>
            </li>
            <li
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${activeTab === "postJob"
                ? "bg-gradient-to-r from-[#17A2B8] to-[#1E2939] text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                }`}
              onClick={() => { setActiveTab("postJob"); setIsSidebarOpen(false); }}
            >
              <Edit3 className="w-5 h-5" />
              <span className="font-medium">Post a Job</span>
            </li>
            <li
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${activeTab === "myJobs"
                ? "bg-gradient-to-r from-[#17A2B8] to-[#1E2939] text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                }`}
              onClick={() => { setActiveTab("myJobs"); setIsSidebarOpen(false); }}
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">My Jobs</span>
            </li>
            <li
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${activeTab === "support"
                ? "bg-gradient-to-r from-[#17A2B8] to-[#1E2939] text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                }`}
              onClick={() => { setActiveTab("support"); setIsSidebarOpen(false); }}
            >
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium">Support</span>
            </li>
          </ul>
        </div>

        {/* Logout Button */}
        <button
          className="flex items-center justify-center gap-3 w-full p-3 mt-4 bg-gradient-to-r from-[#E76F51] to-[#d45a3f] hover:from-[#d45a3f] hover:to-[#c04a2f] text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          onClick={() => {
            sessionStorage.removeItem("user");
            navigate("/login");
          }}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:p-8 p-4 overflow-auto min-h-screen">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {renderContent()}
        </div>
      </div>

      {/* Hamburger Menu Button for Mobile */}
      <button
        ref={menuButtonRef}
        className="md:hidden fixed top-24 left-4 z-50 p-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
