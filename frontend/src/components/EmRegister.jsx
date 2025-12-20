import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const EmRegister = () => {
  const [userType, setUserType] = useState('education'); // Default type
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // Track registration success
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [utrNumber, setUtrNumber] = useState(''); // UTR number

  const educationCategories = [
    'Day School', 'Play School', 'Boarding School', 'Coaching Centre', 'Private Tutor'
  ];
  const healthcareCategories = [
    'Hospital', 'Private Clinic', 'Medical Stores'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (userType !== 'education' && userType !== 'healthcare') {
      setMessage('Invalid user type selected.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURI}/user/register`,
        { name, email, password, phone, category, userType },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 201) {
        setMessage('Registration Successful!');
        setRegistrationSuccess(true); // Set registration success to true
      } else {
        setMessage(response.data.message || 'Registration Failed');
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      setMessage('Email already exists, try another email');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
  
    // Validate all fields
    if (!email || !utrNumber) {
      setMessage('All fields are required.');
      setLoading(false);
      return; // Stop further execution
    }
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURI}/user/addpayment`,
        { email, utrNumber },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      if (response.status === 200) {
        setMessage('Payment details stored successfully!');
        setPaymentSuccess(true); // Set payment success to true
      } else {
        setMessage(response.data.message || 'Failed to store payment details');
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      setMessage('Failed to store payment details');
    } finally {
      setLoading(false);
    }
  };

  // Check if all required fields are filled
  const isPaymentFormValid = email && utrNumber;

  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/logine.jpg)' }}>
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-opacity-50 p-8 rounded-lg shadow-xl z-10 w-full max-w-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, duration: 0.8 }}
      >
        {!registrationSuccess ? (
          <>
            <h2 className={`text-xl font-serif mb-4 text-center ${userType === 'education' ? 'text-[#fa7b5c]' : 'text-[#17A2B8]'}`}>
              Register
            </h2>

            {message && (
              <p className={`text-center text-xs font-medium mb-3 ${message.includes('Success') ? 'text-green-500' : 'text-red-500'}`}>
                {message}
              </p>
            )}

            {/* User Type Selection */}
            <div className="mb-4 flex justify-center ">
              <button
                className={`px-4 py-1  text-xs font-medium ${userType === 'education' ? 'bg-[#E76F51] text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setUserType('education')}
              >
                Education
              </button>
              <button
                className={`px-4 py-1  text-xs font-medium ${userType === 'healthcare' ? 'bg-[#17A2B8] text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setUserType('healthcare')}
              >
                Healthcare
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div>
                <label className="block py-2 text-xs font-bold text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  placeholder="Enter Name"
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-[#E76F51]"
                  required
                />
              </div>
              <div>
                <label className="block py-2 text-xs font-bold text-gray-700">Mobile Number</label>
                <input
                  type="text"
                  value={phone}
                  placeholder="Enter your mobile number"
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-[#E76F51]"
                  required
                />
              </div>
              <div>
                <label className="block py-2 text-xs font-bold text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-[#E76F51]"
                  required
                />
              </div>
              <div>
                <label className="block py-2 text-xs font-bold text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-[#E76F51]"
                  required
                />
              </div>

              {/* Category Dropdown */}
              {userType && (
                <div>
                  <label className="block py-2 text-xs font-bold text-gray-700">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-[#E76F51] text-gray-700"
                    required
                  >
                    <option value="" disabled hidden>Select Category</option>
                    {userType === 'education'
                      ? educationCategories.map((item, idx) => <option key={idx} value={item}>{item}</option>)
                      : healthcareCategories.map((item, idx) => <option key={idx} value={item}>{item}</option>)
                    }
                  </select>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full py-1 mt-10 text-white text-xs font-medium rounded ${loading ? 'bg-gray-400' : userType === 'education' ? 'bg-[#E76F51] hover:bg-[#9f6b5e]' : 'bg-[#17A2B8] hover:bg-[#6babb5]'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? 'Registering...' : 'Register'}
              </motion.button>
            </form>

            <p className="mt-2 text-xs font-medium text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#E76F51] font-medium hover:underline">
                Login
              </Link>
            </p>
          </>
        ) : (
          <>
          {paymentSuccess ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
              <p className="text-gray-700 mb-4">
                Your payment has been successfully submitted. After approval from our team, you will be able to login.
              </p>
              <Link
                to="/login"
                className="inline-block bg-[#17A2B8] text-white py-2 px-4 rounded-lg hover:bg-[#73ccda] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-center mb-6">Payment Details</h1>
          
              {/* QR Code Image */}
              <div className="flex flex-col items-center justify-center mb-6">
                <img 
                  src="/Qrcode.jpg" 
                  alt="QR Code" 
                  className="w-48 h-48 rounded-lg shadow-md"
                />
                <h5 className="mt-3 text-lg font-semibold text-gray-700 text-center">
                9472539868
                </h5>
                <h5 className="mt-1 text-lg font-semibold text-gray-700 text-center">
                  UPI ID: krdpankaj44-1@okaxis
                </h5>
              </div> 
          
              {/* Payment Amount Display */}
              <div className="bg-gray-200 text-gray-800 text-center font-bold py-3 px-4 mb-4 rounded-lg">
                Payment Amount: ₹500 <br />
                <h1 className='bg-gray-100 rounded-full mt-4 w-auto text-gray-500'>For 365 Days</h1>
              </div>
          
              {/* Input Field for Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter Your Registered Email</label>
                <input 
                  type="email" 
                  value={email}
                  placeholder="john.doe@example.com" 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
          
              {/* Input Field for UTR Number */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">UTR Number</label>
                <input 
                  type="text" 
                  value={utrNumber}
                  placeholder="Enter UTR Number" 
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
          
              {/* Submit Button */}
              <button 
                onClick={handlePaymentSubmit}
                disabled={!isPaymentFormValid || loading} // Disable if fields are not filled or loading
                className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  !isPaymentFormValid ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Submitting...' : 'Submit Payment'}
              </button>
            </>
          )}
          </>
        )}
        
      </motion.div>
    </div>
  );
};

export default EmRegister;  