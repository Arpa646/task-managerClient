import { motion } from 'framer-motion';

const NewsletterSection = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/40"></div>
      <motion.div 
        className="absolute top-1/4 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"
        animate={{
          x: [-20, 20, -20],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="relative max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2 
          className="text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Stay in the Loop
        </motion.h2>
        <motion.p 
          className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Get the latest updates on upcoming events, new features, and exclusive offers delivered to your inbox.
        </motion.p>
        <motion.div 
          className="max-w-md mx-auto flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-6 py-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-4 focus:ring-white/20 focus:border-gray-600 transition-all"
            whileFocus={{ scale: 1.02 }}
          />
          <motion.button 
            className="bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold border border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Subscribe
          </motion.button>
        </motion.div>
        <motion.p 
          className="text-sm text-gray-400 mt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          No spam, unsubscribe at any time
        </motion.p>
      </motion.div>
    </section>
  );
};

export default NewsletterSection; 