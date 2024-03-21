"use client";

import styles from "../../styles";

export default function Project({ index, title, manageModal }) {
  return (
    <div
      onMouseEnter={(e) => {
        manageModal(true, index, e.clientX, e.clientY);
      }}
      onMouseLeave={(e) => {
        manageModal(false, index, e.clientX, e.clientY);
      }}
      className={styles.project}
    >
      <h2 className={styles.h2}>{title}</h2>
      <p className={styles.p}>Design & Development</p>
    </div>
  );
}
