import { motion } from "framer-motion";

export default function GoBuildDownloadApp() {
  return (
    <section className="w-full bg-white py-16 md:py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 md:gap-20 relative">

        {/* LEFT — Phone + Floating Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Glow */}
          <div className="absolute -inset-8 bg-blue-400/20 blur-[90px] rounded-full -z-10"></div>

          {/* Floating Phone */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-[320px] h-[650px]"
          >
            <img
              src="/AppView.png"
              alt="GoBuild App Screenshot"
              className="w-full h-full object-contain drop-shadow-2xl"
            />

            {/* Invisible Button Overlay */}
            <a
              href="https://play.google.com/store/apps/details?id=com.go_build_app_version"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute"
              style={{
                top: "50.8%",
                left: "20.3%",
                width: "59.4%",
                height: "8.5%",
              }}
            ></a>
          </motion.div>

        {/* Floating Card 1 — SMALLER */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="absolute top-28 -right-20 bg-white shadow-lg p-3 rounded-xl w-48 border border-gray-100"
          >
            <p className="font-semibold text-gray-900 text-xs">Upcoming Service</p>
            <p className="text-[10px] text-gray-600 mt-1">Electrician arriving in 20 mins</p>

            <div className="w-full bg-blue-100 h-1.5 mt-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-2/3"></div>
            </div>
          </motion.div>


          {/* Floating Card 2 */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute bottom-14 -left-24 bg-white shadow-xl p-4 rounded-2xl w-52 border border-gray-100"
          >
            <p className="font-semibold text-gray-900 text-sm">Completed Task</p>
            <p className="text-xs text-gray-600 mt-1">Plumber Service Completed</p>
          </motion.div>
        </motion.div>

        {/* RIGHT — Text & CTA */}
        <div className="flex-1 flex flex-col justify-center">

          <h1 className="text-4xl font-extrabold text-gray-900 leading-snug text-center">
  Download the <span className="text-blue-600">GoBuild App</span>
</h1>


          <p className="text-lg text-gray-600 mt-4 pl-2">
               Find trusted professionals, book services instantly, track progress,
            and manage everything from your phone.
          </p>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 bg-blue-50 p-4 rounded-xl border-l-4 border-blue-600 shadow-inner"
          >
           <p className="italic text-sm text-gray-700 text-center">
              "Found a verified electrician in minutes! Progress tracking is a game-changer."
            </p>

            <p className="mt-1 text-sm font-semibold text-blue-800 text-center">
              - A Happy User
            </p>

          </motion.div>

 <div className="mt-12 p-6 rounded-2xl backdrop-blur-xl bg-white/40 
     border border-white/20 shadow-xl flex items-center justify-center gap-10">

  <motion.img
    whileHover={{ scale: 1.05 }}
    src="/AppScanner.jpg"
    alt="Scan to download GoBuild App from Google Play Store"
    className="w-28 h-28 shadow-lg rounded-xl border border-gray-200"
  />

  <motion.a
    href="https://play.google.com/store/apps/details?id=com.go_build_app_version"
    whileHover={{ scale: 1.07 }}
    className="transition-transform"
  >
    <img
      src="/AppBadge(blue).png"
      alt="Get it on Play Store"
      className="w-40 rounded-xl shadow-lg"
    />
  </motion.a>
</div>    
        </div>
        </div>
    </section>
  );
}
