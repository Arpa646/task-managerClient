import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/outline';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Event Organizer',
      content: 'EventHub made organizing my conference so much easier. The interface is intuitive and the features are exactly what I needed.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Mike Chen',
      role: 'Community Manager',
      content: 'I\'ve discovered amazing local events through EventHub. It\'s become my go-to platform for finding things to do.',
      rating: 5,
      avatar: '👨‍💻'
    },
    {
      name: 'Emily Davis',
      role: 'Freelancer',
      content: 'The networking events I found here helped me grow my business. EventHub connects the right people at the right time.',
      rating: 5,
      avatar: '👩‍🎨'
    }
  ];

  // Animation variants
  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };



  return (
    <section className="relative 
      bg-gradient-to-br from-black via-gray-900 to-purple-900
      text-white py-24 px-4 overflow-hidden border-b border-gray-800">
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute top-10 left-10 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl"
        animate={{
          y: [-20, 20, -20],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-10 right-10 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl"
        animate={{
          x: [-10, 10, -10],
          y: [-15, 15, -15],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-xl"
        animate={{
          y: [-25, 25, -25],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-block bg-white/20 text-white px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-white/30">
              💬 User Testimonials
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            What Our Users Say
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Don't just take our word for it - hear from our amazing community of event enthusiasts
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 border border-white/20 hover:border-white/40"
              variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              {/* Glowing border effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-sm opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="relative z-10">
                <motion.div 
                  className="flex mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                >
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        delay: index * 0.2 + 0.7 + i * 0.1,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </motion.div>
                
                <motion.p 
                  className="text-purple-100 mb-6 italic leading-relaxed text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3 }}
                >
                  "{testimonial.content}"
                </motion.p>
                
                <div className="flex items-center">
                  <motion.div 
                    className="text-3xl mr-4"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {testimonial.avatar}
                  </motion.div>
                  <div>
                    <motion.div 
                      className="font-semibold text-white text-lg"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.5 }}
                    >
                      {testimonial.name}
                    </motion.div>
                    <motion.div 
                      className="text-purple-200 text-sm"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.6 }}
                    >
                      {testimonial.role}
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Curved Bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg 
          className="relative block w-full h-20" 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          style={{ transform: "scaleY(-1)" }}
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="fill-black"
          />
        </svg>
      </div>
    </section>
  );
};

export default TestimonialsSection; 