
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

  Calendar,
} from "lucide-react";

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
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.response?.data?.message || "Failed to post job");
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
  
      Object.keys(formData).forEach((key) => {
        if (key !== "teachers" && formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
  
      if (profilePicture) {
        formDataToSend.append("image", profilePicture);
      }
  
      // Ensure teachers is a valid JSON string before appending
      if (Array.isArray(formData.teachers)) {
        formDataToSend.append("teachers", JSON.stringify(formData.teachers));
      }
  
      const response = await axios.patch(
        `${import.meta.env.VITE_BASEURI}/user/updateProfile`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
           withCredentials: true,
        }
      );
  
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
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
            <div className={`p-6 rounded-2xl shadow-lg border-2 ${
              user.status === 'active' 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
            }`}>
              <div className="flex items-center gap-4">
                {user.status === 'active' ? (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-yellow-600" />
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Status: <span className="capitalize">{user.status}</span>
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {user.status === 'active' 
                      ? 'Your account is active and fully functional.' 
                      : 'Your account is currently blocked. Please contact support.'}
                  </p>
                </div>
              </div>
            </div>

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
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-gray-800 capitalize">
                Update {user.userType} Profile
              </h2>
              <p className="text-gray-600 mt-1">
                Keep your profile up-to-date for the best experience.
              </p>
            </div>
        
            <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-6 rounded-xl">
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
            <div className="flex items-center space-x-3">
              <Camera className="w-6 h-6 text-orange-500" />
              <input
                type="file"
                onChange={handleFileChange}
                className="p-3 border border-gray-300 rounded-md w-full"
              />
            </div>
        
            {/* Description Textarea */}
            <div className="flex items-center space-x-3">
              <Edit3 className="w-6 h-6 text-red-500" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Update Description"
                className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-red-500"
              ></textarea>
            </div>
         {/* Contact Info Textarea */}
         <div className="flex items-center space-x-3">
              <Edit3 className="w-6 h-6 text-red-500" />
              <textarea
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                placeholder="Conatct information"
                className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-red-500"
              ></textarea>
            </div>
            {/* Amenity Textarea */}
         <div className="flex items-center space-x-3">
              <Edit3 className="w-6 h-6 text-yellow-400" />
              <textarea
                name="amenity"
                value={formData.amenity}
                onChange={handleChange}
                placeholder="Add amenity"
                className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-red-500"
              ></textarea>
            </div>
             {/* Establishment */}
         <div className="flex items-center space-x-3">
              <Edit3 className="w-6 h-6 text-green-500" />
              <textarea
                name="establishment"
                value={formData.establishment}
                onChange={handleChange}
                placeholder="Add Establishment"
                className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-red-500"
              ></textarea>
            </div>
            {/* Additional Info */}
            <div className="flex items-center space-x-3 sm:col-span-2">
              <Edit3 className="w-6 h-6 text-indigo-500" />
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Add Bio or Additional Details"
                className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>
        
            {/* Our Specialist Section */}
            

              <div className="sm:col-span-2 mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Specialist</h3>

                {formData.teachers.map((teacher, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <User className="w-6 h-6 text-teal-500" />
                      <input
                        type="text"
                        name="specialist"
                        value={teacher.name}
                        onChange={(e) => handleTeacherChange(index, "name", e.target.value)}
                        placeholder="Enter Name"
                        className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-6 h-6 text-orange-500" />
                      <input
                        type="text"
                        name="qualification"
                        value={teacher.qualification}
                        onChange={(e) => handleTeacherChange(index, "qualification", e.target.value)}
                        placeholder="Enter Specialization or Qualification"
                        className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeTeacher(index)}
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600"
                    >
                      Remove 
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addTeacher}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
                >
                  Add 
                </button>
              </div>
        
            {/* Submit Button */}
            <div className="mt-6 text-center sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        
          {/* Status Message */}
          {message && (
            <div className="mt-4 text-center text-gray-700 bg-gray-100 p-3 rounded-md">
              {message}
            </div>
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
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-[#17A2B8] to-[#1E2939] text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
              onClick={() => { setActiveTab("dashboard"); setIsSidebarOpen(false); }}
            >
              <Home className="w-5 h-5" /> 
              <span className="font-medium">Dashboard</span>
            </li>
            <li
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                activeTab === "updateProfile"
                  ? "bg-gradient-to-r from-[#17A2B8] to-[#1E2939] text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
              onClick={() => { setActiveTab("updateProfile"); setIsSidebarOpen(false); }}
            >
              <User className="w-5 h-5" /> 
              <span className="font-medium">Update Profile</span>
            </li>
            <li
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                activeTab === "postJob"
                  ? "bg-gradient-to-r from-[#17A2B8] to-[#1E2939] text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
              onClick={() => { setActiveTab("postJob"); setIsSidebarOpen(false); }}
            >
              <Edit3 className="w-5 h-5" /> 
              <span className="font-medium">Post a Job</span>
            </li>
            <li
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                activeTab === "support"
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
