import React from 'react';
import styles from './CourseDashboard.module.css'; // Import the CSS Module
import { 
  FaFileAlt,
  FaBullhorn,
  FaQuestionCircle,
  FaVideo,
  FaPencilAlt,
  FaFileSignature,
  FaChartLine,
  FaBook,
  FaHistory,
  FaHeadset
} from 'react-icons/fa'; // Import icons

const CourseDashboard = ({
  courseName,
  instructor,
  enrollmentStatus,
  profileImageUrl,
  onSyllabusClick,
  onAnnouncementClick,
  learningVideosHref = "#",
  questionBankHref = "#",
  practiceQuizHref = "#",
  cbtMockTestHref = "#",
  progressHref = "#",
  onStudyMaterialClick,
  onPreviousYearPaperClick,
  onSupportClick
}) => {
  return (
    <div className={styles.dashboardWrapper}>
      <main className={styles.dashboardContainer}>
        {/* Course Information Section */}
        <section className={styles.dashboardInfo}>
          <h1 className={styles.infoTitle}>{courseName}</h1>
          <div className={styles.infoMeta}>
            <div className={styles.instructorInfo}>
              <img 
                src={profileImageUrl || 'https://via.placeholder.com/40'} 
                alt={`${instructor}'s profile`} 
                className={styles.profileImg} 
              />
              <span>{instructor}</span>
            </div>
            <span className={styles.enrollmentStatus}>{enrollmentStatus}</span>
          </div>
        </section>

        {/* Dashboard Buttons Grid */}
        <section className={styles.dashboardGrid}>
          {/* Non-interactive buttons triggering onClick handlers */}
          <button 
            type="button" 
            className={styles.dashboardBtn} 
            style={{ '--i': 1 }} 
            onClick={onSyllabusClick}
          >
            <FaFileAlt className={styles.btnIcon} />
            <span className={styles.btnText}>Syllabus & Exam Pattern</span>
          </button>

          <button 
            type="button" 
            className={styles.dashboardBtn} 
            style={{ '--i': 2 }}
            onClick={onAnnouncementClick}
          >
            <FaBullhorn className={styles.btnIcon} />
            <span className={styles.btnText}>New Announcement</span>
          </button>

          {/* Links pointing to hrefs */}
          <a
            href={learningVideosHref}
            className={styles.dashboardBtn}
            style={{ '--i': 3 }}
          >
            <FaVideo className={styles.btnIcon} />
            <span className={styles.btnText}>Learning Videos</span>
          </a>

<<<<<<< Updated upstream
          <a
=======
          <a 
>>>>>>> Stashed changes
            href={questionBankHref}
            className={styles.dashboardBtn}
            style={{ '--i': 4 }}
          >
            <FaQuestionCircle className={styles.btnIcon} />
            <span className={styles.btnText}>Question Bank</span>
          </a>
 
          <a
            href={practiceQuizHref}
            className={styles.dashboardBtn}
            style={{ '--i': 5 }}
          >
            <FaPencilAlt className={styles.btnIcon} />
            <span className={styles.btnText}>Practice Quiz</span>
          </a>
 
          <a
            href={cbtMockTestHref}
            className={styles.dashboardBtn}
            style={{ '--i': 6 }}
          >
            <FaFileSignature className={styles.btnIcon} />
            <span className={styles.btnText}>CBT Mock Test</span>
          </a>
 
          <a
            href={progressHref}
            className={styles.dashboardBtn}
            style={{ '--i': 7 }}
          >
            <FaChartLine className={styles.btnIcon} />
            <span className={styles.btnText}>Progress</span>
          </a>
 
          <button
            type="button"
            className={styles.dashboardBtn}
            style={{ '--i': 8 }}
            onClick={onStudyMaterialClick}
          >
            <FaBook className={styles.btnIcon} />
            <span className={styles.btnText}>Study Material</span>
          </button>
 
          <button
            type="button"
            className={styles.dashboardBtn}
            style={{ '--i': 9 }}
            onClick={onPreviousYearPaperClick}
          >
            <FaHistory className={styles.btnIcon} />
            <span className={styles.btnText}>Previous Year Paper</span>
          </button>
 
          <button
            type="button"
            className={styles.dashboardBtn}
            style={{ '--i': 10 }}
            onClick={onSupportClick}
          >
            <FaHeadset className={styles.btnIcon} />
            <span className={styles.btnText}>Support</span>
          </button>
        </section>
      </main>
    </div>
  );
};

export default CourseDashboard;