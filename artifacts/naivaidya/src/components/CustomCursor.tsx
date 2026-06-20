import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHover, setIsHover] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number>(0);

  const rawX = useRef(-200);
  const rawY = useRef(-200);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // Ring follows with soft spring
  const ringX = useSpring(mouseX, { damping: 26, stiffness: 260, mass: 0.6 });
  const ringY = useSpring(mouseY, { damping: 26, stiffness: 260, mass: 0.6 });

  // Dot snaps immediately
  const dotX = useMotionValue(-200);
  const dotY = useMotionValue(-200);

  useEffect(() => {
    const loop = () => {
      mouseX.set(rawX.current - 16);
      mouseY.set(rawY.current - 16);
      dotX.set(rawX.current - 3);
      dotY.set(rawY.current - 3);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mouseX, mouseY, dotX, dotY]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.current = e.clientX;
      rawY.current = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onEnterInteractive = () => setIsHover(true);
    const onLeaveInteractive = () => setIsHover(false);
    const onLeaveWindow = () => setIsVisible(false);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeaveWindow);

    const updateListeners = () => {
      const targets = document.querySelectorAll("a, button, [role=button], input, textarea, select, label, [data-cursor-hover]");
      targets.forEach((el) => {
        el.addEventListener("mouseenter", onEnterInteractive);
        el.addEventListener("mouseleave", onLeaveInteractive);
      });
    };

    updateListeners();
    const observer = new MutationObserver(updateListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeaveWindow);
      observer.disconnect();
    };
  }, [isVisible]);

  return (
    <>
      {/* Outer ring — healthcare cross inside */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x: ringX, y: ringY, opacity: isVisible ? 1 : 0 }}
        animate={{ scale: isHover ? 1.55 : 1 }}
        transition={{ scale: { type: "spring", stiffness: 300, damping: 22 } }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.9)",
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.35), 0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          {/* Medical cross — white with dark shadow for universal readability */}
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.7))" }}>
            <rect x="4" y="0" width="3" height="11" rx="1.5" fill="white" />
            <rect x="0" y="4" width="11" height="3" rx="1.5" fill="white" />
          </svg>
        </div>
      </motion.div>

      {/* Inner dot — white with dark outline */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x: dotX, y: dotY, opacity: isVisible ? 1 : 0 }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 0 0 1.5px rgba(0,0,0,0.5)",
          }}
        />
      </motion.div>

      <style>{`
        *, *::before, *::after { cursor: none !important; }
      `}</style>
    </>
  );
}
