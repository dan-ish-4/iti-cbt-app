import React from 'react';
import styles from './LearningVideosPage.module.css';
import { FaFilter } from 'react-icons/fa'; // Import icons

const LearningVideosPage = () => {
  return (
    <div className={styles.learningPageContainer}>
      <div className={styles.learningPageHeader}>
        Electrician 1st Year : Learning Videos
      </div>

      <div className={`${styles.card} ${styles.progressCard}`}>
        <div className={styles.progressCardHeader}>
          <span>Learning Video Progress</span>
          <button className={styles.filterButton}>
            <FaFilter /> All Subject
          </button>
        </div>
        <div className={styles.progressCardBody}>
          <div className={styles.progressChartWrapper}>
            <div className={styles.chartInnerCircle}>50%</div>
          </div>
          <div className={styles.videoStatsContainer}>
            <div className={styles.statItem}>
              <span>Total Videos</span>
              <span className={`${styles.statValue} ${styles.statTotal}`}>600</span>
            </div>
            <div className={styles.statItem}>
              <span>Watch Videos</span>
              <span className={`${styles.statValue} ${styles.statWatched}`}>300</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.card} ${styles.subjectsListCard}`}>
        <div className={styles.subjectsListHeader}>All Subjects Classes</div>
        <div className={styles.subjectCard}>
          <div className={styles.subjectIcon}></div>
          <div className={styles.subjectInfo}>
            <h3 className={styles.subjectTitle}>Electrician Theory</h3>
            <div className={styles.subjectDetails}>
              <span>Total Topics = 11</span>
              <span>Total Videos = 150</span>
            </div>
          </div>
        </div>
        <div className={styles.subjectCard}>
          <div className={styles.subjectIcon}></div>
          <div className={styles.subjectInfo}>
            <h3 className={styles.subjectTitle}>Workshop calculation Science</h3>
            <div className={styles.subjectDetails}>
              <span>Total Topics = 11</span>
              <span>Total Videos = 150</span>
            </div>
          </div>
        </div>
        <div className={styles.subjectCard}>
          <div className={styles.subjectIcon}></div>
          <div className={styles.subjectInfo}>
            <h3 className={styles.subjectTitle}>Engineering Drawing</h3>
            <div className={styles.subjectDetails}>
              <span>Total Topics = 11</span>
              <span>Total Videos = 150</span>
            </div>
          </div>
        </div>
        <div className={styles.subjectCard}>
          <div className={styles.subjectIcon}></div>
          <div className={styles.subjectInfo}>
            <h3 className={styles.subjectTitle}>Employability Skills</h3>
            <div className={styles.subjectDetails}>
              <span>Total Topics = 11</span>
              <span>Total Videos = 150</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningVideosPage;