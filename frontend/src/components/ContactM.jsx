import { useState } from "react";

const ContactM = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/contact.jpg')", // Make sure your image is in the public folder
      }}
    >
      <div className="container mx-auto flex flex-col items-center justify-center space-y-8">
        <div
          className="flex flex-col items-center text-center space-y-4"
          style={{
            backgroundImage: "url('/contact.jpg')", // Keeps the background image for this div
          }}
        >
          <div className="bg-opacity-70 bg-[#1E2939] px-8 py-10 rounded-lg max-w-lg w-full shadow-xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Feel Free to Contact <span className="text-[#329ea3]">Us</span>
            </h1>

            <div className="space-y-4 w-full mt-8">
              <div className="flex flex-col space-y-3">
                <label htmlFor="name" className="text-lg text-white">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-4 py-3 text-white w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D88429] placeholder-gray-500"
                  placeholder="Enter Your Name"
                />
              </div>
              <div className="flex flex-col space-y-3">
                <label htmlFor="phone" className="text-lg text-white">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-4 py-3 text-white w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D88429] placeholder-gray-500"
                  placeholder="+91 0000 0000 00"
                />
              </div>
            </div>

            <button className="mt-6 w-full py-3 bg-[#D88429] text-white rounded-lg hover:bg-[#67533e] transition duration-300">
              Request Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactM;
