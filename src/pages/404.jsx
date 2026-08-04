import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdArrowBack, MdRefresh } from "react-icons/md";
import SEO from "@/common/SEO";
import styles from "@/styles/NotFound.module.css";

export default function NotFound() {
  const router = useRouter();
  const stageRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event) => {
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setTilt({
      x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 12,
      y: ((event.clientY - bounds.top) / bounds.height - 0.5) * -12,
    });
  };

  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you requested could not be found."
        noindex
      />
      <section
        ref={stageRef}
        className={styles.stage}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      >
        <div className={styles.glowOne} aria-hidden="true" />
        <div className={styles.glowTwo} aria-hidden="true" />
        <div className={styles.grid} aria-hidden="true" />

        <div className={styles.content}>
          <div
            className={styles.errorArt}
            style={{ transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` }}
            aria-hidden="true"
          >
            <span>4</span>
            <span className={styles.record}>
              <i />
            </span>
            <span>4</span>
          </div>

          <p className={styles.eyebrow}>Signal lost</p>
          <h1>This page has left the airwaves.</h1>
          <p className={styles.copy}>
            The link may be outdated, or the page may have moved. Let&apos;s get you back to the conversation.
          </p>

          <div className={styles.actions}>
            <Link href="/" className={styles.primaryAction}>
              <MdArrowBack aria-hidden="true" />
              Back to home
            </Link>
            <button type="button" className={styles.retryAction} onClick={() => router.reload()}>
              <MdRefresh aria-hidden="true" />
              Try again
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
