import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 280, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const dotSpring = { damping: 50, stiffness: 600, mass: 0.2 };
  const dotSpringX = useSpring(dotX, dotSpring);
  const dotSpringY = useSpring(dotY, dotSpring);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 18);
      mouseY.set(e.clientY - 18);
      dotX.set(e.clientX - 4);
      dotY.set(e.clientY - 4);
    };

    const handleEnter = () => {
      cursorRef.current?.classList.add("cursor-hover");
    };
    const handleLeave = () => {
      cursorRef.current?.classList.remove("cursor-hover");
    };

    window.addEventListener("mousemove", moveCursor);

    const interactables = document.querySelectorAll("a, button, [role=button], input, textarea, select, label");
    interactables.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      interactables.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, [mouseX, mouseY, dotX, dotY]);

  return (
    <>
      {/* Outer ring cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-normal"
        style={{ x: cursorX, y: cursorY }}
      >
        {/* Ring with medical cross */}
        <div
          className="w-9 h-9 rounded-full border-2 border-[#7C3AED] flex items-center justify-center transition-all duration-200"
          style={{
            background: "rgba(124,58,237,0.08)",
            backdropFilter: "blur(2px)",
          }}
          id="cursor-ring"
        >
          {/* Medical cross — matches NAIVAIDYA logo symbol */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="5.5" y="1" width="3" height="12" rx="1.5" fill="#7C3AED" />
            <rect x="1" y="5.5" width="12" height="3" rx="1.5" fill="#7C3AED" />
          </svg>
        </div>
      </motion.div>

      {/* Inner dot — snaps faster */}
      <motion.div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x: dotSpringX, y: dotSpringY }}
      >
        <div className="w-2 h-2 rounded-full bg-[#7C3AED]" />
      </motion.div>

      <style>{`
        * { cursor: none !important; }
        #cursor-ring {
          transition: width 0.2s, height 0.2s, background 0.2s, border-color 0.2s;
        }
        .cursor-hover #cursor-ring,
        div[id="cursor-ring"]:has(~ .cursor-hover) {
          width: 3rem;
          height: 3rem;
          background: rgba(124,58,237,0.15);
          border-color: #8B5CF6;
        }
      `}</style>
    </>
  );
}
