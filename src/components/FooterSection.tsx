import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarIcon } from '@heroicons/react/24/outline';

const FooterSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <motion.div 
            className="sm:col-span-2 lg:col-span-2 mb-6 sm:mb-0"
            variants={itemVariants}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-4 sm:mb-6 justify-center sm:justify-start">
              <motion.div 
                className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 sm:p-3 rounded-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </motion.div>
              <span className="text-2xl sm:text-3xl font-bold">EventHub</span>
            </div>
            <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6 max-w-md text-center sm:text-left mx-auto sm:mx-0">
              Making events memorable, one connection at a time. Join our community and discover amazing events near you.
            </p>
            <div className="flex space-x-3 sm:space-x-4 justify-center sm:justify-start">
              {['📘', '🐦', '📷'].map((emoji, index) => (
                <motion.div 
                  key={index}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <span className="text-sm sm:text-lg">{emoji}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="text-center sm:text-left"
            variants={itemVariants}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              {[
                { to: "/events", text: "Browse Events" },
                { to: "/add-event", text: "Create Event" },
                { to: "/my-events", text: "My Events" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.to} 
                    className="hover:text-white transition-colors duration-200 inline-block py-1"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div 
            className="text-center sm:text-left"
            variants={itemVariants}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              {[
                "Help Center",
                "Contact Us", 
                "Privacy Policy",
                "Terms of Service"
              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="hover:text-white transition-colors duration-200 inline-block py-1"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          className="border-t border-gray-800 pt-6 sm:pt-8 text-center"
          variants={itemVariants}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed px-4 sm:px-0">
            © 2024 EventHub. All rights reserved. Making events memorable, one connection at a time.
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default FooterSection; 