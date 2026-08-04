'use client';
import styles from './Modal.module.css';

export default function Modal({ isOpen, onClose, title, children }) {
  // Support both patterns:
  // 1. <Modal isOpen={showModal}> (controlled by isOpen prop)
  // 2. {condition && <Modal>} (always visible when rendered, isOpen not passed)
  if (isOpen !== undefined && !isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>
  );
}
