import { Heart, Eye } from "lucide-react";

function PreSchool() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row py-10 px-5">
      {/* Left side filter box */}
      <div className="lg:w-1/4 w-full bg-white p-6 rounded-lg shadow-lg sticky top-24 h-auto lg:h-screen z-10">
        <h2 className="text-2xl font-semibold text-blue-600 mb-3">Filter</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Fees (Annual)</label>
            <select className="w-full border rounded-full py-2 px-4">
              <option>Below ₹5,00,000</option>
              <option>₹5,00,000 - ₹10,00,000</option>
              <option>Above ₹10,00,000</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Board</label>
            <select className="w-full border rounded-full py-2 px-4">
              <option>ICSE</option>
              <option>CBSE</option>
              <option>IB</option>
              <option>IGCSE</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Gender Classification</label>
            <select className="w-full border rounded-full py-2 px-4">
              <option>Co-Ed</option>
              <option>Boys</option>
              <option>Girls</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Region</label>
            <select className="w-full border rounded-full py-2 px-4">
              <option>Maharashtra</option>
              <option>Tamil Nadu</option>
              <option>Karnataka</option>
              <option>Uttarakhand</option>
            </select>
          </div>
        </div>
      </div>

      {/* Right side school list */}
      <div className="lg:w-3/4 w-full pl-6 overflow-y-auto h-auto lg:h-screen">
        <h1 className="text-4xl font-bold text-black mb-4">Pre School List near India</h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Explore a variety of boarding schools across India.
        </p>

        <div className="space-y-6">
          <SchoolCard
            name="UWC Mahindra College"
            location="Pune, Maharashtra"
            fee="24,80,625"
            rating={3.7}
            votes={19}
            image="b1.jpg"
            tags={["Boarding School", "IB DP", "Co-Ed School", "Class 11 - 12"]}
          />
          <SchoolCard
            name="Sai International"
            location="Bhubaneswar, Odisha"
            fee="24,80,625"
            rating={3.7}
            votes={19}
            image="b2.jpg"
            tags={["Boarding School", "IB DP", "Co-Ed School", "Class 11 - 12"]}
          />
          <SchoolCard
            name="UWC Mahindra College"
            location="Pune, Maharashtra"
            fee="24,80,625"
            rating={3.7}
            votes={19}
            image="b3.jpg"
            tags={["Boarding School", "IB DP", "Co-Ed School", "Class 11 - 12"]}
          />

          <SchoolCard
            name="Good Shepherd International School"
            location="Ooty, Tamil Nadu"
            fee="23,00,000"
            rating={4.4}
            votes={27}
            image="b4.jpg"
            tags={["Boarding School", "ICSE & ISC, IGCSE, IB PYP, MYP & DYP", "Co-Ed School", "Class 4 - 12"]}
            isAdmissionOpen={true}
          />
        </div>
      </div>
    </div>
  );
}

const SchoolCard = ({ name, location, fee, rating, votes, image, tags, isAdmissionOpen }) => {
  return (
    <div className="border rounded-lg shadow-md p-4 flex flex-col lg:flex-row">
      <div className="relative w-full lg:w-1/3 mb-4 lg:mb-0 mr-0 lg:mr-4">
        <img src={image || "/placeholder.svg"} alt={name} className="w-full h-48 object-cover rounded" />
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded">
          <Eye className="inline-block mr-1 h-4 w-4" />
          {votes > 50000 ? "50986" : (votes * 1000).toLocaleString()}
        </div>
      </div>
      <div className="w-full lg:w-2/3">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-red-500">{location}</p>
          </div>
          <Heart className="h-6 w-6 text-gray-400" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold text-red-500">₹{fee}</span>
          <span className="text-gray-600"> / annum</span>
          <span className="ml-4 text-yellow-500">
            {"★".repeat(Math.floor(rating))}
            {"☆".repeat(5 - Math.floor(rating))}
          </span>
          <span className="text-gray-600 ml-1">{rating}</span>
          <span className="text-gray-600 ml-1">{votes} votes</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="bg-gray-200 rounded-full px-3 py-1 text-sm">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button className="bg-red-500 text-white rounded-full px-4 py-2">View School</button>
          {isAdmissionOpen && (
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full px-3 py-1 text-sm mr-2">Admission Open</span>
              <button className="bg-green-500 text-white rounded-full px-4 py-2">Call</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PreSchool;
