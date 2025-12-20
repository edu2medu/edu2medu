import { motion } from 'framer-motion';

function HMarque() {
  const text = "The Smart Way to Discover Great Healthcare!";

  return (
    <div 
      data-scroll 
      data-scroll-section 
      data-scroll-speed=".1" 
      className='w-full max-w-full py-2 bg-[#2fae9d]'
    >
      <div className='border-t-2 border-b-2 border-slate-50 flex overflow-hidden whitespace-nowrap px-4 sm:px-6'>
        <motion.div
          initial={{ x: 100 }} 
          animate={{ x: "-100%" }}
          whileHover={{ x: "" }}  // Pause the animation when hovered
          transition={{ repeat: Infinity, ease: "linear", duration: 90 }}
          className='flex'
          style={{ whiteSpace: 'nowrap' }}
        >
          {[...Array(20)].map((_, i) => (
            <h1
              key={i}
              className=' k text-xs sm:text-sm md:text-lg lg:text-xl leading-none font-semibold uppercase py-5 px-4 sm:px-6 text-[#fdfeff]'
            >
              {text}
            </h1>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default HMarque;
