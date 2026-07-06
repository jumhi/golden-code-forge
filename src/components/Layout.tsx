import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import IslamicPattern from "./IslamicPattern";
import CustomCursor from "./CustomCursor";
import WhatsAppFloat from "./WhatsAppFloat";

const Layout = () => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen">
      <div className="pixel-grid" aria-hidden />
      <div className="pixel-dots" aria-hidden />
      <IslamicPattern />
      <CustomCursor />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="relative z-10"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Layout;
