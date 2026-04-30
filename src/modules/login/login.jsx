
import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Image } from "../../lib/Image";

import LoginForm from "./loginForm";
import "./login.css";

const backgroundImages = [
  "/background-1.jpg",
  "/background-2.jpg",
  "/background-3.jpg",
];

export default function LoginPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % backgroundImages.length
      );
    }, 10000); // Changed to 2000ms (2 seconds) for smoother transition

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-2">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block overflow-hidden">
        <AnimatePresence initial={true}>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <Image
              src={backgroundImages[currentImageIndex]}
              alt={`Login background image ${currentImageIndex + 1
                }`}
              fill
              className="h-full w-full object-cover dark:brightness-[0.2]  login-background-image"
              priority={currentImageIndex === 0} // Prioritize loading the first image
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
