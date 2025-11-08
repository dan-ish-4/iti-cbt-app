import React, { useEffect, useState, useRef } from 'react';
import styles from './ProgressDashboardPage.module.css';
import { FaFilter } from 'react-icons/fa';
import ApexCharts from 'apexcharts';

const API_BASE_URL = "https://admin.online2study.in/api";
const USER_ID = 4; // This should ideally come from authentication context

let dailyProgressChart = null;
let practiceQuizChart = null;
let mockTestScoreChart = null;
let miniChartRight = null;
let miniChartWrong = null;
let miniChartNoAnswer = null;
let currentDailyData = null;
let currentQuizData = null;
const subjectNameMap = new Map();

const ProgressDashboardPage = () => {
  const [globalFilterOptions, setGlobalFilterOptions] = useState([]);
  const [selectedGlobalFilter, setSelectedGlobalFilter] = useState('');
  const [dailySubjectFilterOptions, setDailySubjectFilterOptions] = useState([]);
  const [practiceSubjectFilterOptions, setPracticeSubjectFilterOptions] = useState([]);
  const [todayAttempts, setTodayAttempts] = useState(0);
  const [todayPercentage, setTodayPercentage] = useState(0);
  const [mockTestNoData, setMockTestNoData] = useState(true);
  const [mockTestStats, setMockTestStats] = useState({
    attempt: 0,
    right: '0%',
    wrong: '0%',
    noAnswer: '0%',
    averageTime: '0:00'
  });

  const dailyChartRef = useRef(null);
  const practiceChartRef = useRef(null);
  const scoreChartRef = useRef(null);
  const miniChartRightRef = useRef(null);
  const miniChartWrongRef = useRef(null);
  const miniChartNoAnswerRef = useRef(null);

  useEffect(() => {
    initializeDashboard();
  }, []);

  useEffect(() => {
    if (selectedGlobalFilter) {
      fetchAllChartData(selectedGlobalFilter);
    }
  }, [selectedGlobalFilter]);

  const showSpinner = () => {
    const spinnerEl = document.getElementById('universalSpinner');
    if (spinnerEl) spinnerEl.style.display = 'flex';
  };

  const hideSpinner = () => {
    const spinnerEl = document.getElementById('universalSpinner');
    if (spinnerEl) spinnerEl.style.display = 'none';
  };

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch from ${url}:`, error);
      return null;
    }
  };

  const populateGlobalDropdown = (subCategories) => {
    setGlobalFilterOptions(subCategories);
    if (subCategories.length > 0) {
      setSelectedGlobalFilter(subCategories[0].id.toString());
    } else {
      setSelectedGlobalFilter('');
    }
  };

  const handleGlobalFilterChange = (event) => {
    setSelectedGlobalFilter(event.target.value);
  };

  const fetchAllChartData = async (subCategoryId) => {
    showSpinner();
    const dailyPromise = fetchData(`${API_BASE_URL}/show/question-bank-count/${USER_ID}/${subCategoryId}`);
    const quizPromise = fetchData(`${API_BASE_URL}/show/quiz/${USER_ID}/${subCategoryId}`);
    const mockPromise = fetchData(`${API_BASE_URL}/show/mock-test/${USER_ID}/${subCategoryId}`);

    const [dailyData, quizData, mockData] = await Promise.all([dailyPromise, quizPromise, mockPromise]);

    currentDailyData = dailyData;
    currentQuizData = quizData;

    renderDailyProgressChart();
    renderPracticeQuizChart();
    renderMockTestScoreChart(mockData);
    hideSpinner();
  };

  const renderDailyProgressChart = () => {
    const container = dailyChartRef.current;
    if (!container) return;

    if (!currentDailyData || !currentDailyData.series || currentDailyData.series.length === 0) {
      container.innerHTML = `<div class="${styles.noDataMessage}">No question bank data available.</div>`;
      setDailySubjectFilterOptions([]);
      if (dailyProgressChart) {
        dailyProgressChart.destroy();
        dailyProgressChart = null;
      }
      return;
    }

    const newDailySubjectOptions = currentDailyData.series.map(seriesItem => ({
      id: seriesItem.subject_id,
      name: subjectNameMap.get(seriesItem.subject_id) || `Subject ${seriesItem.subject_id}`
    }));
    setDailySubjectFilterOptions(newDailySubjectOptions);

    const initialSeries = currentDailyData.series[0];
    const maxVal = Math.max(...initialSeries.data, 1);

    const options = {
      series: [{ name: "Answers", data: initialSeries.data }],
      chart: {
        type: "area",
        height: 295,
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 3 },
      xaxis: {
        categories: currentDailyData.labels.map(label => new Date(label).toLocaleString("en-US", { weekday: 'short' }))
      },
      yaxis: {
        min: 0,
        max: maxVal,
        tickAmount: 4,
        labels: {
          formatter: function (val) { return Math.ceil(val); }
        }
      },
      grid: { borderColor: "var(--border-color)" },
      tooltip: { x: { format: "dd/MM/yy" } }
    };

    container.innerHTML = '';
    if (dailyProgressChart) {
      dailyProgressChart.destroy();
    }
    dailyProgressChart = new ApexCharts(container, options);
    dailyProgressChart.render();
  };

  const updateDailyChartView = (event) => {
    const selectedSubjectId = event.target.value;
    const selectedSeries = currentDailyData.series.find(s => s.subject_id == selectedSubjectId);
    if (selectedSeries && dailyProgressChart) {
      const maxVal = Math.max(...selectedSeries.data, 1);
      dailyProgressChart.updateOptions({
        yaxis: {
          min: 0,
          max: maxVal,
          tickAmount: 4,
          labels: {
            formatter: function (val) { return Math.ceil(val); }
          }
        }
      });
      dailyProgressChart.updateSeries([{ data: selectedSeries.data }]);
    }
  };

  const renderPracticeQuizChart = () => {
    const container = practiceChartRef.current;
    if (!container) return;

    if (!currentQuizData || !currentQuizData.data || currentQuizData.data.length === 0) {
      container.innerHTML = `<div class="${styles.noDataMessage}">No quiz practice data available.</div>`;
      setTodayAttempts(0);
      setTodayPercentage(0);
      setPracticeSubjectFilterOptions([]);
      if (practiceQuizChart) {
        practiceQuizChart.destroy();
        practiceQuizChart = null;
      }
      return;
    }

    const newPracticeSubjectOptions = currentQuizData.data.map(subjectItem => ({
      id: subjectItem.subject_id,
      name: subjectItem.subject_name.includes("|") ? subjectItem.subject_name.split("|")[1].trim() : subjectItem.subject_name
    }));
    setPracticeSubjectFilterOptions(newPracticeSubjectOptions);

    updatePracticeChartView({ target: { value: newPracticeSubjectOptions[0].id } });
  };

  const updatePracticeChartView = (event) => {
    const selectedSubjectId = event.target.value;
    const subjectData = currentQuizData.data.find(d => d.subject_id == selectedSubjectId);
    if (!subjectData) return;

    const categories = subjectData.summary.map(s => s.day.substring(0, 3));
    const percentages = subjectData.summary.map(s => s.percentage);

    const today = new Date();
    const todayData = subjectData.summary.find(s => new Date(s.date).toDateString() === today.toDateString()) || { attempts: 0, percentage: 0 };
    setTodayAttempts(todayData.attempts);
    setTodayPercentage(todayData.percentage.toFixed(0));

    const options = {
      series: [{ name: "Percentage", data: percentages }],
      chart: {
        type: "bar",
        height: 220,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "60%",
          borderRadius: 4
        }
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: categories,
        labels: { style: { colors: "#333" } }
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 5,
        title: { text: "Performance", style: { color: "#333" } },
        labels: { style: { colors: "#333" } }
      },
      fill: { opacity: 1 },
      tooltip: {
        y: {
          formatter: function (val) { return `${val.toFixed(2)} %`; }
        }
      },
      grid: { borderColor: "rgba(0,0,0,0.1)" },
      colors: ["var(--orange-accent)"]
    };

    const container = practiceChartRef.current;
    container.innerHTML = '';
    if (practiceQuizChart) {
      practiceQuizChart.destroy();
    }
    practiceQuizChart = new ApexCharts(container, options);
    practiceQuizChart.render();
  };

  const renderMockTestScoreChart = (apiData) => {
    const chartBody = document.querySelector(`.${styles.scoreCardBody}`);
    const noDataMsg = document.getElementById('no-data-message-mock');
    const avgTimeLabel = document.getElementById('average-time-label');
    const avgTimeValue = document.getElementById('average-time-value-attempt');

    if (!apiData || !apiData.data) {
      if (chartBody) chartBody.classList.add(styles.hidden);
      if (noDataMsg) noDataMsg.classList.remove(styles.hidden);
      if (avgTimeLabel) avgTimeLabel.style.display = 'none';
      setMockTestNoData(true);
      return;
    }

    if (chartBody) chartBody.classList.remove(styles.hidden);
    if (noDataMsg) noDataMsg.classList.add(styles.hidden);
    setMockTestNoData(false);

    const { right_answer, wrong_answer, unanswered, total_questions, time_taken, attempt_number } = apiData.data;

    const right_percent = (right_answer / total_questions * 100 || 0).toFixed(0);
    const wrong_percent = (wrong_answer / total_questions * 100 || 0).toFixed(0);
    const no_answer_percent = (unanswered / total_questions * 100 || 0).toFixed(0);

    setMockTestStats({
      attempt: attempt_number,
      right: `${right_percent}%`,
      wrong: `${wrong_percent}%`,
      noAnswer: `${no_answer_percent}%`,
      averageTime: formatTime(time_taken)
    });

    if (avgTimeLabel && avgTimeValue) {
      avgTimeLabel.style.display = 'block';
      avgTimeValue.textContent = formatTime(time_taken);
    }

    const mainChartOptions = {
      series: [right_answer, wrong_answer, unanswered],
      chart: {
        type: "donut",
        height: 200
      },
      labels: ["Right", "Wrong", "No Answer"],
      colors: ["#1de9b6", "#ff4560", "#546e7a"],
      plotOptions: {
        pie: {
          donut: {
            size: "75%",
            labels: {
              show: true,
              total: {
                show: true,
                label: "Total",
                fontSize: "16px",
                fontWeight: 600
              }
            }
          }
        }
      },
      legend: { show: false },
      dataLabels: { enabled: false }
    };

    const mainContainer = scoreChartRef.current;
    if (mainContainer) {
      mainContainer.innerHTML = '';
      if (mockTestScoreChart) {
        mockTestScoreChart.destroy();
      }
      mockTestScoreChart = new ApexCharts(mainContainer, mainChartOptions);
      mockTestScoreChart.render();
    }
    renderOrUpdateMiniCharts(apiData.data);
  };

  const renderOrUpdateMiniCharts = (data) => {
    const chartConfigs = {
      right: {
        chart: miniChartRight,
        selector: miniChartRightRef.current,
        colors: ["#1de9b6", "#E0E0E0"],
        series: [data.right_answer, data.total_questions - data.right_answer],
        percent: (data.right_answer / data.total_questions * 100 || 0).toFixed(0)
      },
      wrong: {
        chart: miniChartWrong,
        selector: miniChartWrongRef.current,
        colors: ["#ff4560", "#E0E0E0"],
        series: [data.wrong_answer, data.total_questions - data.wrong_answer],
        percent: (data.wrong_answer / data.total_questions * 100 || 0).toFixed(0)
      },
      no_answer: {
        chart: miniChartNoAnswer,
        selector: miniChartNoAnswerRef.current,
        colors: ["#546e7a", "#E0E0E0"],
        series: [data.unanswered, data.total_questions - data.unanswered],
        percent: (data.unanswered / data.total_questions * 100 || 0).toFixed(0)
      }
    };

    for (const key in chartConfigs) {
      const config = chartConfigs[key];
      const container = config.selector;
      if (container) {
        container.innerHTML = '';
        const options = {
          series: config.series,
          chart: {
            type: "donut",
            height: 120
          },
          plotOptions: {
            pie: {
              donut: {
                size: "65%",
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: "",
                    fontSize: "18px",
                    fontWeight: 700,
                    formatter: function () { return `${config.percent}%`; }
                  }
                }
              }
            }
          },
          colors: config.colors,
          legend: { show: false },
          dataLabels: { enabled: false },
          tooltip: { enabled: false }
        };

        if (config.chart) {
          config.chart.destroy();
        }
        chartConfigs[key].chart = new ApexCharts(container, options);
        chartConfigs[key].chart.render();
      }
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    let timeString = "";
    if (hours > 0) {
      timeString += `${String(hours).padStart(2, "0")}h: `;
    }
    if (minutes > 0 || hours > 0) {
      timeString += `${String(minutes).padStart(2, "0")}m: `;
    }
    timeString += `${String(secs).padStart(2, "0")}s`;
    return timeString;
  };

  const initializeDashboard = async () => {
    showSpinner();
    try {
      const courseData = await fetchData(`${API_BASE_URL}/user/courses/${USER_ID}?status=1`);
      if (!courseData || !courseData.data || courseData.data.length === 0) {
        console.error("User's active course data could not be loaded.");
        hideSpinner();
        populateGlobalDropdown([]);
        return;
      }

      const permittedSubCategoryIds = new Set();
      const languageIds = new Set();
      courseData.data.forEach(course => {
        if (course.course_detail && course.course_detail.sub_category_id) {
          course.course_detail.sub_category_id.forEach(id => {
            permittedSubCategoryIds.add(parseInt(id));
          });
        }
        if (course.course_detail && course.course_detail.language_id) {
          languageIds.add(course.course_detail.language_id);
        }
      });

      const categoryPromises = Array.from(languageIds).map(langId =>
        fetchData(`${API_BASE_URL}/get-categories/${langId}`)
      );
      const categoryResults = await Promise.all(categoryPromises);

      const userSubCategories = [];
      subjectNameMap.clear();
      categoryResults.forEach(result => {
        if (result && result.success && result.data) {
          result.data.forEach(category => {
            if (category.subcategory) {
              category.subcategory.forEach(subCat => {
                if (permittedSubCategoryIds.has(subCat.id)) {
                  userSubCategories.push({ id: subCat.id, name: subCat.name });
                }
                if (subCat.subject) {
                  subCat.subject.forEach(subject => {
                    if (!subjectNameMap.has(subject.id)) {
                      subjectNameMap.set(subject.id, subject.name);
                    }
                  });
                }
              });
            }
          });
        }
      });

      populateGlobalDropdown(userSubCategories);
      if (userSubCategories.length > 0) {
        fetchAllChartData(userSubCategories[0].id);
      } else {
        hideSpinner();
      }
    } catch (error) {
      console.error("Initialization failed:", error);
      hideSpinner();
    }
  };

  return (
    <div className={styles.progressReportContainer}>
      <div className={styles.pageHeader}>Progress Dashboard</div>
      <div className={styles.globalFilterContainer}>
        <div className={styles.selectWrapper}>
          <select id="unified-filter-dropdown" onChange={handleGlobalFilterChange} value={selectedGlobalFilter}>
            {globalFilterOptions.map(option => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.dashboardContainer}>
        <div className={`${styles.card} ${styles.dailyReadingCard}`}>
          <div className={styles.cardHeader}>
            <span>Daily Question Bank Reading</span>
            <div className={styles.selectWrapper}>
              <select id="subject-filter-dropdown-daily" onChange={updateDailyChartView}>
                {dailySubjectFilterOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div id="chart-container-daily" ref={dailyChartRef}></div>
        </div>
        <div className={`${styles.card} ${styles.practiceQuizCard}`}>
          <div className={styles.cardHeader}>
            <span>Daily Quiz Practice</span>
            <div className={styles.selectWrapper}>
              <select id="subject-filter-dropdown-practice" onChange={updatePracticeChartView}>
                {practiceSubjectFilterOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.dailyProgressBody}>
            <div id="chart-container-practice" ref={practiceChartRef}></div>
            <div id="today-stats-container">
              <div className={styles.statItem}><h4 className={styles.statTitle}>Today's Attempts</h4><p id="today-attempts" className={styles.statValue}>{todayAttempts}</p></div>
              <div className={styles.statItem}><h4 className={styles.statTitle}>Today's %</h4><p id="today-percentage" className={styles.statValue}>{todayPercentage}%</p></div>
            </div>
          </div>
        </div>
        <div className={`${styles.card} ${styles.scoreCard}`}>
          <div className={styles.cardHeader}>Mock Test Score</div>
          <div className={styles.scoreCardBody}>
            <div className={styles.mainChartSection}>
              <div id="chart-container-score" ref={scoreChartRef}></div>
              <div id="average-time-label" style={{ display: mockTestNoData ? 'none' : 'block' }}>Average Time Taken: <span id="average-time-value-attempt">{mockTestStats.averageTime}</span></div>
            </div>
            <div className={styles.miniChartsSection}>
              <div className={styles.miniChartWrapper}><h4>Right</h4><div id="mini-chart-right" ref={miniChartRightRef}></div></div>
              <div className={styles.miniChartWrapper}><h4>Wrong</h4><div id="mini-chart-wrong" ref={miniChartWrongRef}></div></div>
              <div className={styles.miniChartWrapper}><h4>No Answer</h4><div id="mini-chart-no-answer" ref={miniChartNoAnswerRef}></div></div>
            </div>
            <div className={styles.statsSection} id="stats-section">
              <div className={styles.statItemNew}><span className={styles.statLabel}>Total Attempt:</span><span className={`${styles.statValueBox} ${styles.attempt}`} id="stat-value-attempt">{mockTestStats.attempt}</span></div>
              <div className={styles.statItemNew}><span className={styles.statLabel}>Right Answer:</span><span className={`${styles.statValueBox} ${styles.right}`} id="stat-value-right">{mockTestStats.right}</span></div>
              <div className={styles.statItemNew}><span className={styles.statLabel}>Wrong Answer:</span><span className={`${styles.statValueBox} ${styles.wrong}`} id="stat-value-wrong">{mockTestStats.wrong}</span></div>
              <div className={styles.statItemNew}><span className={styles.statLabel}>Not Answer:</span><span className={`${styles.statValueBox} ${styles.noAnswer}`} id="stat-value-no-answer">{mockTestStats.noAnswer}</span></div>
            </div>
          </div>
          <div id="no-data-message-mock" className={`${styles.noDataMessage} ${mockTestNoData ? '' : styles.hidden}`}>User has not attempted this mock test yet.</div>
        </div>
      </div>
      <div className={styles.spinner} id="universalSpinner" style={{ display: 'none' }}><div className={styles.spinnerIcon}></div></div>
    </div>
  );
};

export default ProgressDashboardPage;