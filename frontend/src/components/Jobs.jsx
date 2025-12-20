import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASEURI}/user/getalljobs`);
        console.log("Response data:", response.data); // Log the response data
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
  
    fetchJobs();
  }, []);
  
  return (
    <div className="bg-gradient-to-r from-white to-[#8dd3dc] py-16">
      <div className="container mx-auto px-4 md:px-14 lg:px-20">
        
        {/* Careers Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-12">
          <div className="w-full md:px-14 lg:w-1/2">
            <h1 className="text-4xl px-14 font-bold text-gray-800 mb-4">Careers</h1>
            <p className="text-lg px-14 text-gray-600">Join Our Growing Team at Edu2Medu</p>
            <p className="mt-4 px-14 font-serif text-lg text-gray-600">
              Are you passionate about education and healthcare? At Edu2Medu, we are committed to providing quality education and healthcare services. If you’re ready to make a meaningful impact and join our dynamic team, we would love to hear from you!
            </p>
          </div>

          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1, type: "spring", stiffness: 80 }}
            className="lg:w-1/2 flex justify-center relative"
          >
            <motion.img
              src="ab.jpg"
              alt="Educational items illustration"
              className="object-cover rounded-full mt-20 shadow-2xl w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] lg:w-[350px] lg:h-[350px] border-4 border-transparent bg-clip-border hover:ring-8 hover:ring-[#17a2b8] transform transition-all duration-300 ease-in-out"
              whileHover={{ scale: 1.1 }}
            />
          </motion.div>
        </div>

        {/* Why Work With Edu2Medu Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 px-4 md:px-14 lg:px-20">
          {[
            { title: "Collaborative Environment", desc: "We foster a collaborative environment to deliver excellent education and healthcare services." },
            { title: "Growth Opportunities", desc: "Develop your skills and advance your career in education and healthcare through mentorship and training." },
            { title: "Exciting Projects", desc: "Work on impactful projects that make a difference in the education and healthcare sectors." },
            { title: "Flexible Work Culture", desc: "Enjoy a healthy work-life balance with our flexible work policies." }
          ].map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-serif text-gray-800 mb-4">{item.title}</h3>
              <p className="text-lg text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Open Positions Section */}
        <div className="px-4 md:px-14 mt-20 mb-20 lg:px-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Open Positions</h2>

          {/* Display Jobs Dynamically */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.length > 0 ? (
  jobs.map((job) => ( // Change `jobs` to `job` here
    <div key={job._id} className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition duration-300 ease-in-out">
      <h3 className="text-2xl font-serif text-gray-800 mb-4">{job.jobTitle}</h3>
      <p className="text-lg text-gray-600 mb-2"><strong>Company:</strong> {job.companyName}</p>
      <p className="text-lg text-gray-600 mb-2"><strong>Location:</strong> {job.location}</p>
      <p className="text-lg text-gray-600 mb-2"><strong>Job Type:</strong> {job.jobType}</p>
      <p className="text-lg text-gray-600 mb-2"><strong>Salary:</strong> {job.salary}</p>
      <p className="text-lg text-gray-600 mb-4">{job.jobDescription}</p>
      <p className="text-sm text-gray-500 mb-2"><strong>Requirements:</strong> {job.jobRequirements}</p>
      <p className="text-sm text-gray-500 mb-2"><strong>Deadline:</strong> {job.applicationDeadline}</p>
      <p className="text-sm text-gray-500 mb-4"><strong>How to Apply:</strong> {job.howToApply}</p>
      <button className="bg-[#17A2B8] text-white px-6 py-2 rounded-md hover:bg-[#6ba0a9] w-full">
        Apply now
      </button>
    </div>
  ))
) : (
  <p className="text-center text-gray-600 text-lg">No job openings available at the moment.</p>
)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
