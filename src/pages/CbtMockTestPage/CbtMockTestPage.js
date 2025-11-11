import React, { useEffect, useState, useRef } from 'react';
import styles from './CbtMockTestPage.module.css';
import { FaFilter, FaCircle, FaExclamationCircle, FaCaretRight, FaUser } from 'react-icons/fa';
import ApexCharts from 'apexcharts';
import { backendFetch, getSessionId } from '../../utils/backendFetch';

const languageMapping = { "1": "en", "2": "hi", "3": "mr", "4": "bn", "5": "ta", "6": "te", "7": "gu", "8": "pa" };
const translations = {
  en: { line1: "", line2: "", line3: "", line4: "" },
  hi: { line1: '<i class="fa fa-caret-right"></i> कुल <span id="totalQTable3"></span> प्रश्नो में से आपने <span id="ansQ1"></span> प्रश्नो का जवाब दिया है।', line2: '<i class="fa fa-caret-right"></i> कुल <span id="totalQTable5"></span> प्रश्नो में से आपने <span id="noansQ1"></span> प्रश्नो का जवाब नहीं दिया है।', line3: '<i class="fa fa-caret-right"></i> यहाँ क्लिक कर&nbsp;<button id="backtest" onclick="backtotest()">टेस्ट पर वापिस लौटे</button>', line4: '<i class="fa fa-caret-right"></i> यहाँ क्लिक कर&nbsp;<button id="submittest" onclick="submitbtn()">टेस्ट को समाप्त कर सबमिट करे</button>' },
  mr: { line1: '<i class="fa fa-caret-right"></i> एकूण <span id="totalQTable3"></span> प्रश्नांपैकी तुम्ही <span id="ansQ1"></span> प्रश्नांना उत्तर दिले आहे।', line2: '<i class="fa fa-caret-right"></i> एकूण <span id="totalQTable5"></span> प्रश्नांपैकी तुम्ही <span id="noansQ1"></span> प्रश्नांची उत्तरे दिली नाहीत।', line3: '<i class="fa fa-caret-right"></i> येथे क्लिक करा&nbsp;<button id="backtest" onclick="backtotest()">चाचणीत परत जा</button>', line4: '<i class="fa fa-caret-right"></i> येथे क्लिक करा&nbsp;<button id="submittest" onclick="submitbtn()">चाचणी पूर्ण करून सबमिट करा</button>' },
  bn: { line1: '<i class="fa fa-caret-right"></i> মোট <span id="totalQTable3"></span> প্রশ্নের মধ্যে আপনি <span id="ansQ1"></span> প্রশ্নের উত্তর দিয়েছেন।', line2: '<i class="fa fa-caret-right"></i> মোট <span id="totalQTable5"></span> প্রশ্নের মধ্যে আপনি <span id="noansQ1"></span> প্রশ্নের উত্তর দেননি।', line3: '<i class="fa fa-caret-right"></i> এখানে ক্লিক করুন&nbsp;<button id="backtest" onclick="backtotest()">পরীক্ষায় ফিরে যান</button>', line4: '<i class="fa fa-caret-right"></i> এখানে ক্লিক করুন&nbsp;<button id="submittest" onclick="submitbtn()">পরীক্ষা শেষ করে জমা দিন</button>' },
  ta: { line1: '<i class="fa fa-caret-right"></i> மொத்தம் <span id="totalQTable3"></span> கேள்விகளில், நீங்கள் <span id="ansQ1"></span> கேள்விகளுக்கு பதிலளித்துள்ளீர்கள்.', line2: '<i class="fa fa-caret-right"></i> மொத்தம் <span id="totalQTable5"></span> கேள்விகளில், நீங்கள் <span id="noansQ1"></span> கேள்விகளுக்கு பதிலளிக்கவில்லை.', line3: '<i class="fa fa-caret-right"></i> இங்கே கிளிக் செய்யவும்&nbsp;<button id="backtest" onclick="backtotest()">சோதனைக்கு திரும்புங்கள்</button>', line4: '<i class="fa fa-caret-right"></i> இங்கே கிளிக் செய்யவும்&nbsp;<button id="submittest" onclick="submitbtn()">சோதனையை முடித்து சமர்ப்பிக்கவும்</button>' },
  te: { line1: '<i class="fa fa-caret-right"></i> మొత్తం <span id="totalQTable3"></span> ప్రశ్నలలో, మీరు <span id="ansQ1"></span> ప్రశ్నలకు సమాధానం ఇచ్చారు।', line2: '<i class="fa fa-caret-right"></i> మొత్తం <span id="totalQTable5"></span> ప్రశ్నలలో, మీరు <span id="noansQ1"></span> ప్రశ్నలకు సమాధానం ఇవ్వలేదు।', line3: '<i class="fa fa-caret-right"></i> ఇక్కడ క్లిక్ చేయండి&nbsp;<button id="backtest" onclick="backtotest()">పరీక్షకు తిరిగి వెళ్లండి</button>', line4: '<i class="fa fa-caret-right"></i> ఇక్కడ క్లిక్ చేయండి&nbsp;<button id="submittest" onclick="submitbtn()">పరీక్ష ముగించి సమర్పించండి</button>' },
  gu: { line1: '<i class="fa fa-caret-right"></i> કુલ <span id="totalQTable3"></span> પ્રશ્નોમાંથી તમે <span id="ansQ1"></span> પ્રશ્નોના જવાબ આપ્યા છે.', line2: '<i class="fa fa-caret-right"></i> કુલ <span id="totalQTable5"></span> પ્રશ્નોમાંથી તમે <span id="noansQ1"></span> પ્રશ્નોના જવાબ આપ્યા નથી.', line3: '<i class="fa fa-caret-right"></i> અહીં ક્લિક કરો&nbsp;<button id="backtest" onclick="backtotest()">પરીક્ષામાં પાછા જાઓ</button>', line4: '<i class="fa fa-caret-right"></i> અહીં ક્લિક કરો&nbsp;<button id="submittest" onclick="submitbtn()">પરીક્ષા સમાપ્ત કરી સબમિટ કરો</button>' },
  pa: { line1: '<i class="fa fa-caret-right"></i> ਕੁੱਲ <span id="totalQTable3"></span> ਸਵਾਲਾਂ ਵਿੱਚੋਂ ਤੁਸੀਂ <span id="ansQ1"></span> ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦਿੱਤੇ ਹਨ।', line2: '<i class="fa fa-caret-right"></i> ਕੁੱਲ <span id="totalQTable5"></span> ਸਵਾਲਾਂ ਵਿੱਚੋਂ ਤੁਸੀਂ <span id="noansQ1"></span> ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਨਹੀਂ ਦਿੱਤੇ।', line3: '<i class="fa fa-caret-right"></i> ਇੱਥੇ ਕਲਿੱਕ ਕਰੋ&nbsp;<button id="backtest" onclick="backtotest()">ਟੈਸਟ ਤੇ ਵਾਪਸ ਜਾਓ</button>', line4: '<i class="fa fa-caret-right"></i> ਇੱਥੇ ਕਲਿੱਕ ਕਰੋ&nbsp;<button id="submittest" onclick="submitbtn()">ਟੈਸਟ ਖਤਮ ਕਰਕੇ ਜਮ੍ਹਾਂ ਕਰੋ</button>' }
};

let TotalQuestionsCBT, palette = [], tick = [], radiocheck = [], cnt = [], purpletogreen = [], redtogreen = [], radcnt = [], hasReachedLastQuestion = false, keyCurrentQuestionIndex = 0, flattenedQuestions = [], answeredCount = 0, unansweredCount = 0, rightAnswers = 0, wrongAnswers = 0, bookmarkedAnsweredCount = 0, currentLanguage = "2", timer, startTime, elapsedTime, remainingTime = 7200, currentTab = 0, currentSubCategoryId = null, mainScoreChart = null, miniChartRight = null, miniChartWrong = null, miniChartNoAnswer = null;
var pos = 0, na, overall, test1, temp = 1, test, test_status, question, choice, choices, chA, chB, chC, chD, correct = 0, test11 = 0, colour = 0, nosub = 0, wrong = 0, book = 0, nbook = 0, answered = 0, questions = [], bookmarkStatus = [];

const CbtMockTestPage = () => {
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [scoreFilterOptions, setScoreFilterOptions] = useState([]);
  const [noDataMessage, setNoDataMessage] = useState(false);

  const mainChartRef = useRef(null);
  const miniChartRightRef = useRef(null);
  const miniChartWrongRef = useRef(null);
  const miniChartNoAnswerRef = useRef(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      renderMockTests(userId);
    }

    const okBtn = document.getElementById("ok-btn");
    if (okBtn) {
      okBtn.addEventListener("click", () => {
        submitbtnok();
        sendResultsToAPI();
      });
    }

    const keyBtns = document.querySelectorAll("#keybtn2");
    keyBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        window.history.length > 1 ? window.history.back() : window.location.href = "/";
      });
    });

    return () => {
      if (okBtn) okBtn.removeEventListener("click", () => {
        submitbtnok();
        sendResultsToAPI();
      });
      keyBtns.forEach(btn => {
        btn.removeEventListener("click", () => {
          window.history.length > 1 ? window.history.back() : window.location.href = "/";
        });
      });
    };

    initializePopup(); // Call initializePopup on component mount

    return () => {
      // Cleanup event listeners if necessary
      window.removeEventListener("resize", managePopup);
      window.removeEventListener("fullscreenchange", managePopup);
    };
  }, []);

  const managePopup = () => {
    const orientationPopup = document.getElementById("orientationPopup");
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    const isPortrait = window.innerHeight > window.innerWidth;

    if (isPortrait) {
      if (fullscreenElement && !fullscreenElement.contains(orientationPopup)) {
        fullscreenElement.appendChild(orientationPopup);
      }
      if (orientationPopup) orientationPopup.style.display = "flex";
    } else {
      if (orientationPopup) orientationPopup.style.display = "none";
    }
  };

  const initializePopup = () => {
    managePopup();
    window.addEventListener("resize", managePopup);
    window.addEventListener("fullscreenchange", managePopup);
  };

  const renderMockTests = (userId) => {
    const url = `https://admin.online2study.in/api/user/courses/${userId}?status=1`;
    backendFetch(url)
      .then(res => res.json())
      .then(data => {
        if (!data.status || !Array.isArray(data.data) || data.data.length === 0) return;
        const course = data.data[0];
        const courseId = course.course_id;
        currentLanguage = course.course_detail.language_id.toString();
        let subCategoryId = course.course_detail.sub_category_id;
        if (typeof subCategoryId === 'string') {
          subCategoryId = JSON.parse(subCategoryId || '[]');
        }
        const subCategoryIds = (subCategoryId || []).map(id => parseInt(id));

        const categoriesUrl = `https://admin.online2study.in/api/get-categories/${currentLanguage}`;
        backendFetch(categoriesUrl)
          .then(res => res.json())
          .then(catData => {
            if (!catData.success || !Array.isArray(catData.data)) return;
            const filteredSubjects = [];
            catData.data.forEach(cat => {
              cat.subcategory?.forEach(sub => {
                if (subCategoryIds.includes(sub.id)) {
                  filteredSubjects.push(sub);
                }
              });
            });
            renderSimpleTestCards(filteredSubjects, courseId, userId);
            renderScoreGraph(filteredSubjects);
          })
          .catch(error => console.error("❌ Failed to fetch categories:", error));
      })
      .catch(error => console.error("❌ Failed to fetch mock tests:", error));
  };

  const renderSimpleTestCards = (subjects, courseId, userId) => {
    // This part will be handled by React state and JSX directly
  };

  const fetchGraphData = () => {
    const userId = localStorage.getItem("userId");
    const selectedSubCategoryId = document.getElementById("score-filter-dropdown").value;
    if (!userId || !selectedSubCategoryId) return;

    showSpinner();
    const url = `https://admin.online2study.in/api/show/mock-test/${userId}/${selectedSubCategoryId}`;
    backendFetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Network response was not ok (${res.status})`);
        return res.json();
      })
      .then(data => {
        if (data && data.data) {
          renderCharts(data.data);
        } else {
          renderCharts(null);
        }
      })
      .catch(error => {
        console.error("Error fetching graph data:", error);
        renderCharts(null);
      })
      .finally(() => {
        hideSpinner();
      });
  };

  const renderCharts = (data) => {
    const scoreCardBody = document.querySelector(`.${styles.scoreCardBodyNew}`);
    const noDataMsg = document.getElementById("no-data-message");

    if (!scoreCardBody || !noDataMsg) return;

    if (!data) {
      scoreCardBody.style.display = "none";
      noDataMsg.style.display = "block";
      if (mainScoreChart) { mainScoreChart.destroy(); mainScoreChart = null; }
      if (miniChartRight) { miniChartRight.destroy(); miniChartRight = null; }
      if (miniChartWrong) { miniChartWrong.destroy(); miniChartWrong = null; }
      if (miniChartNoAnswer) { miniChartNoAnswer.destroy(); miniChartNoAnswer = null; }
      const chartContainers = document.querySelectorAll("#apex-chart-container, #mini-chart-right, #mini-chart-wrong, #mini-chart-no-answer");
      chartContainers.forEach(container => container.innerHTML = "");
      updateScoreStats(null);
      return;
    }

    scoreCardBody.style.display = "flex";
    noDataMsg.style.display = "none";

    const processedData = {
      right_answer: data.right_answer,
      wrong_answer: data.wrong_answer,
      total_questions: data.total_questions,
      attempt_number: data.attempt_number,
      time_taken: data.time_taken,
      attempted: data.right_answer + data.wrong_answer,
      unanswered: data.total_questions - data.right_answer - data.wrong_answer,
    };

    processedData.right_percent = (processedData.right_answer / processedData.total_questions * 100 || 0).toFixed(0);
    processedData.wrong_percent = (processedData.wrong_answer / processedData.total_questions * 100 || 0).toFixed(0);
    processedData.no_answer_percent = (processedData.unanswered / processedData.total_questions * 100 || 0).toFixed(0);
    processedData.attempt_percent = (processedData.attempted / processedData.total_questions * 100 || 0).toFixed(0);

    renderOrUpdateMainScoreChart(processedData);
    renderMiniCharts(processedData);
    updateScoreStats(processedData);
    updateAverageTime(processedData);
  };

  const renderOrUpdateMainScoreChart = (data) => {
    const chartContainer = mainChartRef.current;
    if (!chartContainer) return;

    if (mainScoreChart) mainScoreChart.destroy();

    if (!data) {
      chartContainer.innerHTML = "";
      return;
    }

    const options = {
      series: [data.right_answer, data.wrong_answer, data.unanswered],
      chart: {
        type: "donut",
        height: 230,
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
                label: "",
                formatter: () => "Total Average",
              },
            },
          },
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            chart: {
              height: 200,
            },
          },
        },
      ],
    };
    mainScoreChart = new ApexCharts(chartContainer, options);
    mainScoreChart.render();
  };

  const renderMiniCharts = (data) => {
    const chartConfigs = {
      right: {
        chartInstance: miniChartRight,
        selector: miniChartRightRef.current,
        colors: ["#1de9b6", "#E0E0E0"],
        percent: data?.right_percent,
        series: [data?.right_answer, data?.total_questions - data?.right_answer],
        labels: ["Right", "Others"],
      },
      wrong: {
        chartInstance: miniChartWrong,
        selector: miniChartWrongRef.current,
        colors: ["#ff4560", "#E0E0E0"],
        percent: data?.wrong_percent,
        series: [data?.wrong_answer, data?.total_questions - data?.wrong_answer],
        labels: ["Wrong", "Others"],
      },
      no_answer: {
        chartInstance: miniChartNoAnswer,
        selector: miniChartNoAnswerRef.current,
        colors: ["#546e7a", "#E0E0E0"],
        percent: data?.no_answer_percent,
        series: [data?.unanswered, data?.attempted],
        labels: ["No Answer", "Attempted"],
      },
    };

    for (const key in chartConfigs) {
      const config = chartConfigs[key];
      const container = config.selector;
      if (container) {
        if (config.chartInstance) config.chartInstance.destroy();
        if (!data) {
          container.innerHTML = "";
          continue;
        }

        const options = {
          series: config.series,
          chart: {
            type: "donut",
            height: 120,
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
                    formatter: () => `${config.percent}%`,
                  },
                },
              },
            },
          },
          colors: config.colors,
          labels: config.labels,
          legend: {
            show: false,
          },
          dataLabels: {
            enabled: false,
          },
          tooltip: {
            enabled: false,
          },
        };

        if (key === "right") {
          miniChartRight = new ApexCharts(container, options);
          miniChartRight.render();
        } else if (key === "wrong") {
          miniChartWrong = new ApexCharts(container, options);
          miniChartWrong.render();
        } else if (key === "no_answer") {
          miniChartNoAnswer = new ApexCharts(container, options);
          miniChartNoAnswer.render();
        }
      }
    }
  };

  const updateScoreStats = (data) => {
    const attemptEl = document.getElementById("stat-value-attempt");
    const rightEl = document.getElementById("stat-value-right");
    const wrongEl = document.getElementById("stat-value-wrong");
    const noAnswerEl = document.getElementById("stat-value-no-answer");

    if (!data) {
      if (attemptEl) attemptEl.textContent = "0";
      if (rightEl) rightEl.textContent = "0%";
      if (wrongEl) wrongEl.textContent = "0%";
      if (noAnswerEl) noAnswerEl.textContent = "0%";
      return;
    }

    if (attemptEl) attemptEl.textContent = data.attempt_number;
    if (rightEl) rightEl.textContent = `${data.right_percent}%`;
    if (wrongEl) wrongEl.textContent = `${data.wrong_percent}%`;
    if (noAnswerEl) noAnswerEl.textContent = `${data.no_answer_percent}%`;
  };

  const updateAverageTime = (data) => {
    const labelEl = document.getElementById("average-time-label");
    const valueEl = document.getElementById("average-time-value-attempt");

    if (!labelEl || !valueEl) return;

    if (!data) {
      labelEl.style.display = "none";
      return;
    }

    labelEl.style.display = "block";
    const totalSeconds = Math.round(data.time_taken);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let timeString = "";
    if (hours > 0) timeString += `${String(hours).padStart(2, "0")}h: `;
    if (minutes > 0 || hours > 0) timeString += `${String(minutes).padStart(2, "0")}m: `;
    timeString += `${String(seconds).padStart(2, "0")}s`;
    valueEl.textContent = timeString;
  };

  const renderScoreGraph = (subjects) => {
    const dropdown = document.getElementById("score-filter-dropdown");
    if (!dropdown) return;

    dropdown.innerHTML = "";
    subjects.forEach(subject => {
      const option = document.createElement("option");
      option.value = subject.id;
      option.textContent = subject.name;
      dropdown.appendChild(option);
    });

    if (subjects.length > 0) {
      fetchGraphData();
    }
  };

  const handleProceedClick = (subCategoryId, subCategoryName, courseId, userId) => {
    currentSubCategoryId = subCategoryId;
    fetchCBTQuestions(userId, courseId, subCategoryId, subCategoryName);
  };

  const fetchCBTQuestions = (userId, courseId, subCategoryId, subCategoryName) => {
    const url = `https://admin.online2study.in/api/${userId}/${courseId}/cbt?SubCategory=${subCategoryId}`;
    const sessionId = getSessionId();
    if (!sessionId) {
      alert("Session expired or missing. Please log in again.");
      return;
    }

    showSpinner();
    backendFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        questions = [];
        let languageKey, tradeName, subCategory;
        try {
          if (!data || Object.keys(data).length === 0) throw new Error("API response is empty.");
          languageKey = Object.keys(data)[0];
          if (!languageKey) throw new Error("Language key not found in response.");
          const parts = languageKey.split(" | ");
          tradeName = parts.length > 1 ? parts[1] : parts[0];

          const tradeData = data[languageKey];
          if (!tradeData || Object.keys(tradeData).length === 0) throw new Error("Trade object not found in response.");
          subCategory = Object.keys(tradeData)[0];

          const subCategoryData = tradeData[subCategory];
          if (!subCategoryData || Object.keys(subCategoryData).length === 0) throw new Error("SubCategory object not found in response.");
          const subjectKey = Object.keys(subCategoryData)[0];
          const subjects = subCategoryData[subjectKey];

          if (!subjects || Object.keys(subjects).length === 0) throw new Error("No subjects found for this test.");

          for (const subject in subjects) {
            const subjectQuestions = subjects[subject];
            if (Array.isArray(subjectQuestions)) {
              const formattedQuestions = subjectQuestions.map(q => [
                q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.answer, q.notes
              ]);
              questions.push({ Category: subject, questions: formattedQuestions });
            }
          }
        } catch (error) {
          console.error("Failed to parse questions from API response:", error);
          alert(`Error: Could not structure the test data. ${error.message}`);
          hideSpinner();
          return;
        }

        TotalQuestionsCBT = questions.reduce((acc, curr) => acc + curr.questions.length, 0);

        if (TotalQuestionsCBT > 0) {
          bookmarkStatus = new Array(TotalQuestionsCBT).fill(false);
          setIsExamStarted(true); // Show CBT interface
          const examStartEl = document.getElementById("exam-start");
          if (examStartEl) {
            examStartEl.style.display = "block";
            examStartEl.style.textAlign = "center";
          }
          const startButton = document.getElementById("start-button");
          if (startButton) startButton.style.display = "inline-block";

          UpdateName(tradeName, subCategoryName);
          updateLanguageDisplay(tradeName); // Assuming tradeName is the language display
          updateSubjectUI();
          initializeTest();
        } else {
          alert("No questions found for this test.");
        }
        hideSpinner();
      })
      .catch(error => {
        console.error("Error fetching CBT questions:", error);
        hideSpinner();
        alert("Failed to load test questions. Please try again.");
      });
  };

  const UpdateName = (trade, subCategory) => {
    const tradeNameEl = document.getElementById("Trade-Name");
    const subCategoryNameEl = document.getElementById("SubCategory-Name");
    if (tradeNameEl) tradeNameEl.innerHTML = trade;
    if (subCategoryNameEl) subCategoryNameEl.innerHTML = subCategory;
  };

  const updateLanguageDisplay = (lang) => {
    const langDisplayEl = document.getElementById("language-display");
    if (langDisplayEl) langDisplayEl.innerHTML = lang;
  };

  const updateSubjectUI = () => {
    const detailsElements = document.querySelectorAll("#min details");
    detailsElements.forEach(el => el.style.display = "none");

    questions.forEach((subject, index) => {
      const testDiv = document.querySelector(`#test${index + 1}`);
      if (testDiv && testDiv.parentElement) {
        const parentDetails = testDiv.parentElement;
        const summary = parentDetails.querySelector("summary");
        if (summary) summary.innerHTML = subject.Category;
        parentDetails.style.display = "block";
        if (index === 0) {
          parentDetails.open = true;
        } else {
          parentDetails.open = false;
        }
      }
    });
  };

  const initializeTest = () => {
    test11 = 0;
    initializeArrays(TotalQuestionsCBT);
    startTotalQuestions();
    renderQuestion();
  };

  const initializeArrays = (total) => {
    palette = [];
    tick = [];
    radiocheck = [];
    cnt = [];
    purpletogreen = [];
    redtogreen = [];
    radcnt = [];
    for (let i = 0; i < total; i++) {
      palette.push(`question${i + 1}`);
      tick.push("Not_Attend");
      radiocheck.push(0);
      cnt.push(0);
      purpletogreen.push(0);
      redtogreen.push(0);
      radcnt.push("F");
    }
  };

  const startTotalQuestions = () => {
    const totalQTable = document.getElementById("totalQTable");
    const totalMarksTable = document.getElementById("totalMarksTable");
    if (totalQTable) totalQTable.textContent = getTotalQuestions();
    if (totalMarksTable) totalMarksTable.textContent = 2 * getTotalQuestions();
  };

  const renderQuestion = () => {
    if (pos >= getTotalQuestions()) {
      document.getElementById("exam-show").style.display = "none";
      return false;
    }

    let subjectIndex = 0;
    let questionInSubjectIndex = pos;
    for (; questionInSubjectIndex >= questions[subjectIndex]?.questions?.length;) {
      questionInSubjectIndex -= questions[subjectIndex].questions.length;
      subjectIndex++;
      if (subjectIndex >= questions.length) return false;
    }

    if (subjectIndex >= questions.length) return false;

    const currentSubjectTestDivId = `test${subjectIndex + 1}`;
    const currentSubjectDetailsEl = document.querySelector(`#${currentSubjectTestDivId}`)?.parentElement;

    if (!currentSubjectDetailsEl) return false;

    const currentSubjectSummaryEl = currentSubjectDetailsEl.querySelector("summary");
    if (!currentSubjectSummaryEl) return false;

    const paperEl = document.getElementById("paper");
    if (paperEl && paperEl.innerHTML !== currentSubjectSummaryEl.innerHTML) {
      paperEl.innerHTML = currentSubjectSummaryEl.innerHTML;
    }

    const currentQuestionData = questions[subjectIndex]?.questions[questionInSubjectIndex];
    if (!currentQuestionData) return false;

    const questionContent = currentQuestionData[0];
    const options = currentQuestionData.slice(1, 5);

    document.getElementById("total").innerText = getTotalQuestions();
    document.getElementById("Q-No").innerHTML = pos + 1;

    const testDiv = document.getElementById("test");
    testDiv.innerHTML = `<p>${decodeHTMLEntities(questionContent)}</p>`;

    ["A", "B", "C", "D"].forEach((optionKey, index) => {
      const isChecked = tick[pos] === optionKey;
      testDiv.innerHTML += `
        <div class='${styles.content}'>
          <span class='notranslate'>(${optionKey})</span>
          <input type='radio' name='choices' value='${optionKey}' id='op${optionKey.toLowerCase()}' ${isChecked ? "checked" : ""} onclick='chck()'>
          <div class="${styles.optionContent}">${decodeHTMLEntities(options[index])}</div>
        </div>
      `;
    });

    // if (typeof MathJax !== "undefined" && MathJax.typesetPromise) {
    //   MathJax.typesetPromise().then(() => {
    //     MathJax.typeset(testDiv.querySelectorAll(`.${styles.content}`));
    //   });
    // }

    if (test11 === 0) {
      questions.forEach((subject, sIndex) => {
        const subjectTestDiv = document.getElementById(`test${sIndex + 1}`);
        if (!subjectTestDiv) return;
        subjectTestDiv.innerHTML = "";
        subject.questions.forEach((q, qIndex) => {
          const globalQuestionIndex = getQuestionIndex(sIndex, qIndex);
          subjectTestDiv.innerHTML += `<button class='${styles.palette}' id='${palette[globalQuestionIndex]}' onclick='loadQuestion(${globalQuestionIndex})'>${qIndex + 1}</button>`;
        });
      });
      test11++;
    }

    const markQCheckbox = document.querySelector(`.${styles.MarkQ} input[type="checkbox"]`);
    if (markQCheckbox) {
      markQCheckbox.checked = bookmarkStatus[pos] || false;
    }
    updateFinalCounts();

    if (questionInSubjectIndex === 0 && pos > 0) {
      openNextSubjectDetails(subjectIndex);
    }
    initializePopup();
  };

  const openNextSubjectDetails = (subjectIndex) => {
    if (subjectIndex >= questions.length) return;
    document.querySelectorAll("details").forEach(el => {
      el.removeAttribute("open");
    });
    const detailsEl = document.querySelector(`#test${subjectIndex + 1}`)?.parentElement;
    if (detailsEl) detailsEl.setAttribute("open", "true");
  };

  const getTotalQuestions = () => TotalQuestionsCBT || 0;

  const decodeHTMLEntities = (text) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  };

  const loadQuestion = (index) => {
    pos = index;
    renderQuestion();
  };

  const getQuestionIndex = (subjectIndex, questionIndexInSubject) => {
    let globalIndex = 0;
    for (let i = 0; i < subjectIndex; i++) {
      globalIndex += questions[i].questions.length;
    }
    return globalIndex + questionIndexInSubject;
  };

  const getQuestionIndexForResult = (globalIndex) => {
    let subjectIndex = 0;
    while (globalIndex >= questions[subjectIndex]?.questions.length) {
      globalIndex -= questions[subjectIndex].questions.length;
      subjectIndex++;
    }
    return subjectIndex;
  };

  const getQuestionIndexInCategory = (globalIndex) => {
    let subjectIndex = getQuestionIndexForResult(globalIndex);
    let questionIndexInSubject = globalIndex;
    for (let i = 0; i < subjectIndex; i++) {
      questionIndexInSubject -= questions[i].questions.length;
    }
    return questionIndexInSubject;
  };

  const chck = () => {
    radiocheck[pos] = 1;
  };

  const backBtn = () => {
    if (pos > 0) {
      pos--;
      renderQuestion();
    } else {
      alert("Already at the first question. Can't move back.");
    }
  };

  const maxmBtn = () => {
    document.getElementById("max").style.width = "100%";
    document.getElementById("min").style.display = "none";
    document.getElementById("maxm").style.display = "none";
    document.getElementById("minm").style.display = "block";
  };

  const minmBtn = () => {
    document.getElementById("max").style.width = "68%";
    document.getElementById("min").style.display = "block";
    document.getElementById("maxm").style.display = "block";
    document.getElementById("minm").style.display = "none";
  };

  const mark = () => {
    choices = document.getElementsByName("choices");
    let isAnswered = false;
    for (var i = 0; i < choices.length; i++) {
      if (choices[i].checked) {
        choice = choices[i].value;
        tick[pos] = choices[i].value;
        radcnt[pos] = tick[pos];
        isAnswered = true;
        break;
      }
    }
    bookmarkStatus[pos] = !bookmarkStatus[pos];
    const paletteBtn = document.getElementById(palette[pos]);
    if (paletteBtn) {
      if (bookmarkStatus[pos]) {
        if (isAnswered) {
          paletteBtn.style.backgroundColor = "#0676e0";
          paletteBtn.style.borderRadius = "50%";
        } else {
          paletteBtn.style.backgroundColor = "#e81111";
          paletteBtn.style.borderRadius = "8px 8px 2px 2px";
        }
      } else {
        if (isAnswered) {
          paletteBtn.style.backgroundColor = "green";
          paletteBtn.style.borderRadius = "2px 8px 8px 2px";
        } else {
          paletteBtn.style.backgroundColor = "#EBEBEB";
          paletteBtn.style.borderRadius = "3px";
        }
      }
    }
    let totalQ = getTotalQuestions();
    if (pos < totalQ - 1) {
      pos++;
      renderQuestion();
    } else if (pos === totalQ - 1) {
      alert("You are at the last question. Finishing the test is the next step.");
    }
  };

  const checkAnswer = () => {
    choices = document.getElementsByName("choices");
    let isBookmarked = bookmarkStatus[pos];
    let isAnswered = false;
    for (var i = 0; i < choices.length; i++) {
      if (choices[i].checked) {
        choice = choices[i].value;
        tick[pos] = choices[i].value;
        radcnt[pos] = tick[pos];
        cnt[pos]++;
        colour = 0;
        isAnswered = true;
        break;
      } else {
        colour = 1;
      }
    }

    if (isBookmarked) {
      bookmarkStatus[pos] = false;
      const markQCheckbox = document.querySelector(`.${styles.MarkQ} input[type="checkbox"]`);
      if (markQCheckbox) markQCheckbox.checked = false;
    }

    const paletteBtn = document.getElementById(palette[pos]);
    if (paletteBtn) {
      if (colour === 0) {
        paletteBtn.style.backgroundColor = "green";
        paletteBtn.style.borderRadius = "2px 8px 8px 2px";
      } else {
        paletteBtn.style.backgroundColor = "#EBEBEB";
        paletteBtn.style.borderRadius = "3px";
      }
    }

    let totalQ = getTotalQuestions();
    if (pos < totalQ - 1) {
      pos++;
      renderQuestion();
    } else if (pos === totalQ - 1) {
      alert("You are at the last question. Finishing the test is the next step.");
    }
    updateFinalCounts();
  };

  const updateFinalCounts = () => {
    let answeredCount = 0;
    let bookmarkedAnsweredCount = 0;
    let bookmarkedNotAnsweredCount = 0;

    for (let i = 0; i < getTotalQuestions(); i++) {
      if (tick[i] !== "Not_Attend") {
        if (bookmarkStatus[i]) {
          bookmarkedAnsweredCount++;
        } else {
          answeredCount++;
        }
      } else if (bookmarkStatus[i]) {
        bookmarkedNotAnsweredCount++;
      }
    }

    document.getElementById("ans").textContent = answeredCount;
    document.getElementById("bans").textContent = bookmarkedAnsweredCount;
    document.getElementById("uans").textContent = bookmarkedNotAnsweredCount;

    let totalAttempted = answeredCount + bookmarkedAnsweredCount + bookmarkedNotAnsweredCount;
    let notAnswered = getTotalQuestions() - totalAttempted;
    if (notAnswered < 0) notAnswered = 0;
    document.getElementById("noans").textContent = notAnswered;
  };

  const start = () => {
    countDown(7200, "quiz"); // Assuming 'quiz' is the ID for the timer display
    document.querySelector(`.${styles.mockTestContainer}`).style.display = "none";
    document.getElementById("exam-show").style.display = "block";

    let encodedCopyright = "d3d3Lm5jbnZ0b25saW5lLmNvbQ=="; // "www.ncnvtonline.com"
    let decodedCopyright = window.atob(encodedCopyright);
    document.getElementById("copyright").innerHTML = "© " + decodedCopyright;

    const examShowEl = document.getElementById("exam-show");
    enterFullscreenSafely(examShowEl);
    adjustSignHeights();
  };

  const Subquestion = () => {
    nosub = 1;
    if (nosub === 1) {
      let totalQ = getTotalQuestions();
      let answered = 0;
      pos = Math.min(totalQ - 1, 75); // This line seems problematic, should be pos = totalQ - 1 or similar
      renderQuestion(); // This will render the last question, not the review
      document.getElementById("reviewshow").style.display = "block";
      document.getElementById("exam-show").style.display = "none";

      for (let i = 0; i < totalQ; i++) {
        if (tick[i] === "A" || tick[i] === "B" || tick[i] === "C" || tick[i] === "D") {
          answered++;
        }
      }
      let notAnswered = totalQ - answered;

      const langCode = languageMapping[currentLanguage] || "en";
      const currentTranslations = translations[langCode];

      updateElementText("line1", currentTranslations.line1);
      updateElementText("line2", currentTranslations.line2);
      updateElementText("line3", currentTranslations.line3);
      updateElementText("line4", currentTranslations.line4);

      ["totalQTable1", "totalQTable2", "totalQTable3", "totalQTable4", "totalQTable5"].forEach(id => updateElementText(id, totalQ));
      ["ansQTable", "ansQ", "ansQ1"].forEach(id => updateElementText(id, answered));
      ["noansQTable", "noansQ", "noansQ1"].forEach(id => updateElementText(id, notAnswered));

      exitFullscreenSafely();
    }
  };

  const updateElementText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = text;
  };

  const adjustSignHeights = () => {
    const signElements = document.querySelectorAll(`.${styles.sign}, .${styles.sign1}`);
    const testEl = document.getElementById("test");
    let signHeight, testHeight;

    if (window.innerWidth > 1024) {
      signHeight = "800px";
      testHeight = "640px";
    } else if (window.innerWidth > 720 && window.innerWidth <= 1024) {
      signHeight = "460px";
      testHeight = "300px";
    } else {
      signHeight = "380px";
      testHeight = "220px";
    }

    signElements.forEach(el => { el.style.height = signHeight; });
    if (testEl) testEl.style.height = testHeight;
  };

  const instruction01 = () => {
    const popup = document.getElementById("popup-container");
    const overlay = document.getElementById("overlay");
    if (!popup || !overlay) return;

    if (window.getComputedStyle(popup).display === "none") {
      popup.style.display = "block";
      overlay.style.display = "block";
    } else {
      popup.style.display = "none";
      overlay.style.display = "none";
    }
  };

  const submitbtn = () => {
    const dialogBox = document.getElementById("dialog-box");
    if (dialogBox) dialogBox.style.display = "flex";
  };

  const sendResultsToAPI = () => {
    const userId = localStorage.getItem("userId");
    const sessionId = localStorage.getItem("sessionId");
    if (!userId || !sessionId) {
      console.error("User ID or Session ID not found. Cannot save results.");
      return;
    }

    const resultData = {
      google_user_id: parseInt(userId),
      sub_category_id: currentSubCategoryId,
      right_answer: rightAnswers,
      wrong_answer: wrongAnswers,
      total_questions: getTotalQuestions(),
      time_taken: elapsedTime,
    };

    backendFetch("https://admin.online2study.in/api/store/mock-test", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resultData),
    })
      .then(res => res.json())
      .then(data => {
        console.log("API Response:", data.message);
      })
      .catch(error => {
        console.error("Error sending results to API:", error);
      });
  };

  const showSpinner = () => {
    const spinnerEl = document.getElementById("universalSpinner");
    if (spinnerEl) spinnerEl.style.display = "flex";
  };

  const hideSpinner = () => {
    const spinnerEl = document.getElementById("universalSpinner");
    if (spinnerEl) spinnerEl.style.display = "none";
  };

  const submitbtnok = () => {
    document.getElementById("dialog-box").style.display = "none";
    stopTimer();

    let totalQ = getTotalQuestions();
    rightAnswers = 0;
    wrongAnswers = 0;

    for (let i = 0; i < totalQ; i++) {
      let subjectIndex = getQuestionIndexForResult(i);
      let questionInSubjectIndex = getQuestionIndexInCategory(i);
      let correctAnswer = questions[subjectIndex].questions[questionInSubjectIndex][5];
      let userAnswer = tick[i] || "Not_Attend";

      if (userAnswer !== "Not_Attend" && userAnswer === correctAnswer) {
        rightAnswers++;
      } else if (userAnswer !== "Not_Attend" && userAnswer !== correctAnswer) {
        wrongAnswers++;
      }
    }

    document.getElementById("reviewshow").style.display = "none";
    document.getElementById("resultshow").style.display = "block";
    key();
    setTimeout(ResultData, 500);
  };

  const ResultData = () => {
    if (flattenedQuestions.length === 0) {
      key();
      setTimeout(ResultData, 500);
      return;
    }

    const examDate = new Date().toLocaleDateString();
    const tradeName = document.getElementById("Trade-Name")?.textContent || "Not Provided";
    const tradeYear = document.getElementById("SubCategory-Name")?.textContent || "Not Provided";
    const attemptNumber = localStorage.getItem("attemptNumber") || "1";
    const totalMarks = 2 * getTotalQuestions();
    const obtainedMarks = 2 * rightAnswers;
    const percentageScore = (rightAnswers / getTotalQuestions() * 100 || 0).toFixed(1);

    document.getElementById("exam-date").textContent = examDate;
    document.getElementById("trade-name").textContent = tradeName;
    document.getElementById("trade-year").textContent = tradeYear;
    document.getElementById("attempt-no").textContent = attemptNumber;
    document.getElementById("time-taken").textContent = formatTime(elapsedTime);

    document.getElementById("total-questions").textContent = getTotalQuestions();
    document.getElementById("total-correct").textContent = rightAnswers;
    document.getElementById("total-incorrect").textContent = wrongAnswers;
    document.getElementById("total-marks").textContent = totalMarks;
    document.getElementById("obtained-marks").textContent = obtainedMarks;
    document.getElementById("percentage-score").textContent = `${percentageScore}%`;

    const subjectScores = {
      theory: { total: 0, correct: 0, incorrect: 0 },
      wsc: { total: 0, correct: 0, incorrect: 0 },
      ed: { total: 0, correct: 0, incorrect: 0 },
      es: { total: 0, correct: 0, incorrect: 0 },
    };

    flattenedQuestions.forEach((q, index) => {
      let subjectKey = null;
      const subjectName = q.subjectName.toLowerCase();
      if (subjectName.includes("theory")) {
        subjectKey = "theory";
      } else if (subjectName.includes("workshop") || subjectName.includes("wsc")) {
        subjectKey = "wsc";
      } else if (subjectName.includes("drawing") || subjectName.includes("ed")) {
        subjectKey = "ed";
      } else if (subjectName.includes("employability") || subjectName.includes("es")) {
        subjectKey = "es";
      } else {
        console.warn(`Unmapped subject: ${q.subjectName}`);
      }

      if (subjectKey && subjectScores[subjectKey]) {
        subjectScores[subjectKey].total++;
        if (tick[index] !== "Not_Attend" && tick[index] === q.question[5]) {
          subjectScores[subjectKey].correct++;
        } else if (tick[index] !== "Not_Attend" && tick[index] !== q.question[5]) {
          subjectScores[subjectKey].incorrect++;
        }
      }
    });

    Object.keys(subjectScores).forEach(key => {
      const totalEl = document.getElementById(`${key}-total`);
      if (totalEl) {
        totalEl.textContent = subjectScores[key].total;
        document.getElementById(`${key}-correct`).textContent = subjectScores[key].correct;
        document.getElementById(`${key}-incorrect`).textContent = subjectScores[key].incorrect;
        document.getElementById(`${key}-marks`).textContent = 2 * subjectScores[key].total;
        document.getElementById(`${key}-obtained-marks`).textContent = 2 * subjectScores[key].correct;
      }
    });
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    let timeString = "";
    if (h > 0) timeString += `${String(h).padStart(2, "0")}h: `;
    if (m > 0 || h > 0) timeString += `${String(m).padStart(2, "0")}m: `;
    timeString += `${String(s).padStart(2, "0")}s`;
    return timeString;
  };

  const key = () => {
    flattenedQuestions = [];
    questions.forEach((subject, sIndex) => {
      const subjectName = subject.Category;
      subject.questions.forEach(q => {
        flattenedQuestions.push({ subjectName: subjectName, subjectIndex: sIndex, question: q });
      });
    });
    renderAnswerKeyTabs();
    switchTab(0);
  };

  const renderAnswerKeyTabs = () => {
    const tabContainer = document.querySelector(`.${styles.tabContainer}`);
    if (!tabContainer) return;
    tabContainer.innerHTML = "";
    questions.forEach((subject, index) => {
      tabContainer.innerHTML += `<button class="${styles.tabButton}" onclick="switchTab(${index})">${subject.Category}</button>`;
    });
  };

  const backtotest = () => {
    document.getElementById("reviewshow").style.display = "none";
    document.getElementById("exam-show").style.display = "block";
    nosub = 0;
    const examShowEl = document.getElementById("exam-show");
    enterFullscreenSafely(examShowEl);
    renderQuestion();
  };

  const ClearBtn = () => {
    const choices = document.getElementsByName("choices");
    for (var i = 0; i < choices.length; i++) {
      if (choices[i].checked) {
        choices[i].checked = false;
      }
    }
    radiocheck[pos] = 0;
    tick[pos] = "Not_Attend";
    bookmarkStatus[pos] = false;
    const paletteBtn = document.getElementById(palette[pos]);
    if (paletteBtn) {
      paletteBtn.style.backgroundColor = "#EBEBEB";
      paletteBtn.style.borderRadius = "3px";
    }
    const markQCheckbox = document.querySelector(`.${styles.MarkQ} input[type="checkbox"]`);
    if (markQCheckbox) markQCheckbox.checked = false;
    renderQuestion();
  };

  const showAnswerKey = () => {
    const keyContainer = document.getElementById("KeyContainer");
    if (keyContainer) {
      keyContainer.style.display = "block";
      enterFullscreenSafely(keyContainer);
      const exitHandler = () => {
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
          keyContainer.style.display = "none";
          document.removeEventListener("fullscreenchange", exitHandler);
          document.removeEventListener("webkitfullscreenchange", exitHandler);
          document.removeEventListener("msfullscreenchange", exitHandler);
        }
      };
      document.addEventListener("fullscreenchange", exitHandler);
      document.addEventListener("webkitfullscreenchange", exitHandler);
      document.addEventListener("msfullscreenchange", exitHandler);
    }
  };

  const displayKeyQuestion = (index) => {
    const questionData = flattenedQuestions[index];
    const subjectName = questionData.subjectName;
    const subjectIndex = questionData.subjectIndex;
    const questionsInSubject = flattenedQuestions.filter(q => q.subjectIndex === subjectIndex);
    const questionNumberInSubject = questionsInSubject.findIndex(q => q.question === questionData.question) + 1;
    const questionText = questionData.question[0];
    const options = questionData.question.slice(1, 5);
    const correctAnswer = questionData.question[5];
    const notes = questionData.question[6] || "No notes provided";
    const userAnswer = tick[index] || "Not Attempted";

    document.getElementById("key-subject-name").textContent = subjectName;
    document.getElementById("key-question-content").innerHTML = `
      <div>
        <div class='${styles.questionKey}'><strong>Q${questionNumberInSubject}:</strong><p class='${styles.optionKey}'>${decodeHTMLEntities(questionText)}</p></div>
        <div class='${styles.questionKey}'><strong>(A)</strong><p class='${styles.optionKey}'>${decodeHTMLEntities(options[0])}</p></div>
        <div class='${styles.questionKey}'><strong>(B)</strong><p class='${styles.optionKey}'>${decodeHTMLEntities(options[1])}</p></div>
        <div class='${styles.questionKey}'><strong>(C)</strong><p class='${styles.optionKey}'>${decodeHTMLEntities(options[2])}</p></div>
        <div class='${styles.questionKey}'><strong>(D)</strong><p class='${styles.optionKey}'>${decodeHTMLEntities(options[3])}</p></div>
        <p><strong>Correct Answer:</strong> ${decodeHTMLEntities(correctAnswer)}</p>
        <p><strong>Your Answer:</strong> ${decodeHTMLEntities(userAnswer)}</p>
        <p><strong>Notes:</strong> ${decodeHTMLEntities(notes)}</p>
      </div>
    `;
    document.getElementById("key-pagination").textContent = `Question ${questionNumberInSubject} of ${questionsInSubject.length}`;
  };

  const navigateKey = (direction) => {
    if (direction === "next") {
      if (keyCurrentQuestionIndex < flattenedQuestions.length - 1) {
        keyCurrentQuestionIndex++;
      }
    } else {
      if (keyCurrentQuestionIndex > 0) {
        keyCurrentQuestionIndex--;
      }
    }
    const subjectIndex = flattenedQuestions[keyCurrentQuestionIndex].subjectIndex;
    if (subjectIndex !== currentTab) {
      switchTab(subjectIndex);
    }
    displayKeyQuestion(keyCurrentQuestionIndex);
    updateKeyNavigation();
  };

  const switchTab = (index) => {
    currentTab = index;
    const tabButtons = document.querySelectorAll(`.${styles.tabContainer} .${styles.tabButton}`);
    tabButtons.forEach((btn, i) => {
      btn.classList.toggle(styles.active, i === index);
    });
    const firstQuestionInTab = flattenedQuestions.findIndex(q => q.subjectIndex === index);
    if (firstQuestionInTab !== -1) {
      keyCurrentQuestionIndex = firstQuestionInTab;
      displayKeyQuestion(keyCurrentQuestionIndex);
    }
    updateKeyNavigation();
  };

  const updateKeyNavigation = () => {
    const totalQuestions = flattenedQuestions.length;
    document.getElementById("key-back-btn").style.visibility = keyCurrentQuestionIndex > 0 ? "visible" : "hidden";
    document.getElementById("key-next-btn").style.visibility = keyCurrentQuestionIndex < totalQuestions - 1 ? "visible" : "hidden";
  };

  const enterFullscreenSafely = (element) => {
    const requestFullscreen = element.requestFullscreen || element.webkitRequestFullscreen || element.msRequestFullscreen;
    if (requestFullscreen) {
      requestFullscreen.call(element).then(() => {
        element.style.height = "100%";
        element.style.overflowY = "auto";
      });
    } else {
      alert("Fullscreen mode is not supported by this browser.");
    }
  };

  const countDown = (totalSeconds, displayId) => {
    remainingTime = totalSeconds;
    startTime = Date.now();

    const updateTimer = () => {
      let currentTime = Date.now();
      let elapsed = Math.floor((currentTime - startTime) / 1000);
      let timeLeft = remainingTime - elapsed;

      if (timeLeft <= 0) {
        clearTimeout(timer);
        document.getElementById(displayId).innerHTML = "<font color='red'>Time Over</font>";
        submitbtnok();
        return;
      }

      let minutes = Math.floor(timeLeft / 60);
      let seconds = timeLeft % 60;
      document.getElementById(displayId).innerHTML = `<font color='white'>Time Left:</font> <span style="color:#00ff35; font-size:18px;">${minutes} : ${seconds < 10 ? "0" : ""}${seconds}</span>`;
      timer = setTimeout(updateTimer, 1000);
    };
    updateTimer();
  };

  const stopTimer = () => {
    clearTimeout(timer);
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  };

  const exitFullscreenSafely = () => {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  return (
    <div id="Data-container" className={styles.notranslate}>
      <div className={styles.mockTestContainer} style={{ display: isExamStarted ? 'none' : 'block' }}>
        <div className={styles.pageHeader}>
          Electrician 1st Year : Mock Test
        </div>
        <div className={`${styles.card} ${styles.scoreCard}`}>
          <div className={styles.cardHeader}>
            <span>Mock Test Score</span>
            <div className={styles.selectWrapper}>
              <select id="score-filter-dropdown" onChange={fetchGraphData} value={currentSubCategoryId}>
                {scoreFilterOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.scoreCardBodyNew} style={{ display: noDataMessage ? 'none' : 'flex' }}>
            <div className={styles.mainChartSection}>
              <div id="apex-chart-container" ref={mainChartRef}></div>
              <div id="average-time-label" style={{ display: 'none' }}>Average Time Taken: <span id="average-time-value-attempt">0:00</span></div>
            </div>
            <div className={styles.miniChartsSection}>
              <div className={styles.miniChartWrapper}>
                <h4>Right Answer</h4>
                <div id="mini-chart-right" ref={miniChartRightRef}></div>
              </div>
              <div className={styles.miniChartWrapper}>
                <h4>Wrong Answer</h4>
                <div id="mini-chart-wrong" ref={miniChartWrongRef}></div>
              </div>
              <div className={styles.miniChartWrapper}>
                <h4>No Answer</h4>
                <div id="mini-chart-no-answer" ref={miniChartNoAnswerRef}></div>
              </div>
            </div>
            <div className={styles.statsSection} id="stats-section">
              <div className={styles.statItemNew}><span className={styles.statLabel}>Test Attempts:</span><span className={`${styles.statValueBox} ${styles.attempt}`} id="stat-value-attempt">0</span></div>
              <div className={styles.statItemNew}><span className={styles.statLabel}>Right Answer:</span><span className={`${styles.statValueBox} ${styles.right}`} id="stat-value-right">0%</span></div>
              <div className={styles.statItemNew}><span className={styles.statLabel}>Wrong Answer:</span><span className={`${styles.statValueBox} ${styles.wrong}`} id="stat-value-wrong">0%</span></div>
              <div className={styles.statItemNew}><span className={styles.statLabel}>Not Answer:</span><span className={`${styles.statValueBox} ${styles.noAnswer}`} id="stat-value-no-answer">0%</span></div>
            </div>
          </div>
          <div id="no-data-message" style={{ display: noDataMessage ? 'block' : 'none', textAlign: 'center', color: '#6c757d', marginTop: '40px' }}>User has not attempted any exam yet.</div>
        </div>
        <div className={`${styles.card} ${styles.testCard} ${styles.live}`}>
          <div className={styles.liveTestHeader}>
            <span className={styles.liveBadge}><FaCircle /> LIVE</span>
            <span className={styles.expiryInfo}>Expiry 2 April 2025 at 12 midnight</span>
          </div>
          <h3 className={styles.testTitle}>Electrician 1st Year CBT Paper</h3>
          <div className={styles.testDetails}>
            <span>Total QN = 75</span>
            <span>Time = 2Hr</span>
            <span>Total Marks = 150</span>
            <span>Negative Marking = No</span>
          </div>
          <button className={styles.startTestBtn} onClick={start}>Start Test</button>
        </div>
        <div className={styles.simpleTestCardsContainer}>
          {/* Render simple test cards here */}
        </div>
      </div>

      <div id="cbt-interface-container" style={{ display: isExamStarted ? 'block' : 'none' }}>
        <div id="exam-start" className={styles.notranslate} style={{ display: isExamStarted ? 'block' : 'none', textAlign: 'center' }}>
          <div className={styles.cbtUser} style={{ clear: 'both', textAlign: 'center', marginBottom: '5px' }}>
            <img id="Registered-profile-image" alt="Registered User" border="0" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg_VV4AfW5dLJJb_Ovii7O12PbReplwXEmcJO77W2JsbNKLHhCqDp7S9yGJs5lUbhEFr5buT7zawmOlYCuOLmpSWxYRU0K0E_X_pU_fObY_f0vBB_voB20vNNbDEqI0aa6QLx3yDacQ1I2jTnRP3FwowxqsMz9rG4Rb6sZJU8Isy_n-Yv4XFeYfOpAUZLs/s1600/User.png" width="80px" height="80px" />
            <p>Registered User</p>
          </div>
          <table border="1">
            <tbody>
              <tr>
                <th>Trade</th>
                <th>Year / Semester</th>
                <th>Time</th>
              </tr>
              <tr>
                <td>
                  <span id="Trade-Name">Trade</span>
                </td>
                <td>
                  <span id="SubCategory-Name">Trade Year</span>
                </td>
                <td>
                  <span>120 Minutes</span>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <table border="1">
            <tbody>
              <tr>
                <th>Total Questions</th>
                <th>Total Marks</th>
                <th>Language</th>
              </tr>
              <tr>
                <td>
                  <p id="totalQTable"></p>
                </td>
                <td>
                  <p id="totalMarksTable"></p>
                </td>
                <td>
                  <span id="language-display"></span>
                </td>
              </tr>
            </tbody>
          </table>
          <button className={styles.button5} id="start-button" onClick={start} type="button">Start The Test</button>
          <div id="test_statuss"></div>
        </div>
        <div id="exam-show" style={{ display: isExamStarted ? 'block' : 'none' }}>
          <div className={`${styles.notranslate} ${styles.headbox}`} id="headbox">
            <div className={styles.head1}>
              <img alt="All India Trade Test 2024" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg20fF6P13yalZC1ib8y6xbZCJdOa1ksOzqj5yHQUWcIuRB1Ir2GC5f5O7S71XTre21gHna_kJQS-pSRtGM7bblWafNRywIR7eIcFZIBWphJQFgxpjmzWzHouvdNky0vQjZcJ5J2CKYqSZweF8W3I21e4fTtcevZD0I94_ZGCIGtJnv8IXzvwV2VMGadds/s1600/dgt.png" />
              <div className={styles.textContainer}>
                <h1>ALL INDIA TRADE TEST 2025</h1>
                <p>Craftsman Training Scheme Examination</p>
              </div>
            </div>
            <div className={styles.head2}><span className={styles.timecounter}>
              <div id="quiz"></div>
              <div id="status"></div>
            </span></div>
            <div className={styles.head3}>
              <div className={styles.userProfile}>
                <FaUser style={{ color: '#fdfeff', fontSize: '40px', marginRight: '20px' }} />
              </div>
            </div>
          </div>
          <div id="exam-div">
            <div className={`${styles.column} ${styles.sign} ${styles.notranslate}`} id="min">
              <div id="summaryhead">Summary Panel</div>
              <div className={styles.summaryCon}>
                <div className={styles.total}>Total Questions<span id="total"></span></div>
                <button className={styles.buttonA}></button> Answered<span id="ans"></span><br />
                <button className={styles.buttonB}></button> Bookmark with Ans.<span id="bans"></span><br />
                <button className={styles.buttonC}></button> Bookmark not Ans.<span id="uans"></span><br />
                <button className={styles.buttonD}></button> Not Answered<span id="noans"></span>
                <div className={styles.clear}></div>
              </div>
              <div className={styles.clear}></div>
              <details>
                <summary></summary>
                <div id="test1"></div>
              </details>
              <details>
                <summary></summary>
                <div id="test2"></div>
              </details>
              <details>
                <summary></summary>
                <div id="test3"></div>
              </details>
              <details>
                <summary></summary>
                <div id="test4"></div>
              </details>
            </div>
            <div className={`${styles.column1} ${styles.sign1} ${styles.notranslate}`} id="max">
              <button id="maxm" onClick={maxmBtn}>≪</button>
              <button id="minm" onClick={minmBtn}>≫</button>
              <span id="paper"></span>
              <button className={styles.instruction} onClick={instruction01}><FaExclamationCircle /> Instructions</button>
              <div style={{ clear: 'both' }}></div>
              <div id="popup-container" style={{ display: isPopupOpen ? 'block' : 'none' }}>
                <div className={styles.instrCont}>
                  <h3>Computer Based Test Instructions</h3>
                  <div className={styles.cbtCloseBtn} onClick={instruction01}>X</div>
                </div>
                <div className={styles.instrBox}>
                  <p><b>1)</b> Please read and understand the Test instructions so that you will be able to easily navigate through the Test</p>
                  <p><b>2)</b> Once you click on the 'Start The Exam ' button the actual test time will begin.</p>
                  <p><b>3)</b> On the Lower left-hand side you will see the count-down timer for the Test.</p>
                  <p><b>4)</b> Kindly verify your Profile Details after login.</p>
                  <p><b>5)</b> This computer-based exam is Timed as per Number of Questions.</p>
                  <p><b>6)</b> Exam once started cannot be stopped/skipped.</p>
                  <p><b>7)</b> On the Lower left-hand side you will see the count-down timer for the Test.</p>
                  <p><b>8)</b> The Question Paper consists of multiple Test Sections each having multiple objective type questions.</p>
                  <p><b>9)</b> Only one Question will be displayed on the computer screen at a time. To move to the next/ previous question, click on Next/ Previous button.</p>
                  <p><b>10)</b> On the Left side you will see the summary of number of questions that you have attempted, Not attempted, Bookmark, Not Bookmark .</p>
                  <p><b>11)</b> Each question will have 4 alternatives, out of which only one will be the correct answer.</p>
                  <p><b>12)</b> There is no negative marking.</p>
                  <p><b>13)</b> Once you have answered all the questions please click on the 'Done' button</p>
                  <p><b>14)</b> This is a demo test, our aim is to make the students understand how ITI computer based exam is conducted, this mock test helps the students to understand the exam pattern and avoid mistakes during the test.</p>
                  <br />
                </div>
                <p style={{ display: 'flex', justifyContent: 'center' }}>
                  <button className={styles.cbtCloseBtn} onClick={instruction01}>Close</button>
                </p>
              </div>
              <div id="overlay" onClick={instruction01} style={{ display: isOverlayVisible ? 'block' : 'none' }}></div>
              <div id="test_status">
                <div style={{ color: 'white', fontSize: '14px' }}>Question No. - <span id="Q-No"></span><span style={{ float: 'right' }}>Marks - 2.0</span></div>
              </div>
              <label className={styles.MarkQ}><input onClick={mark} type="checkbox" /> Bookmark this Question</label>
              <div style={{ clear: 'both' }}></div>
              <div id="test"></div>
              <div id="test-btn-box">
                <div className={styles.leftButtons}>
                  <button className={styles.PreQ} onClick={backBtn} type="button">Pre Question</button>
                  <button className={styles.NextQ} onClick={checkAnswer} type="button">Next Question</button>
                  <button className={styles.ClearR} id="Clear-r" onClick={ClearBtn}>Clear Response</button>
                </div>
                <div className={styles.rightButtons}>
                  <button className={styles.SubmitQ} id="Sub" onClick={Subquestion}>Done</button>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.notranslate} ${styles.copyright}`} id="copyright">www.ncvtonline.com</div>
        </div>
        <div id="reviewshow" style={{ display: 'none' }}>
          <p className={styles.notranslate} style={{ fontSize: '16px' }}><FaCaretRight /> Out of total <span id="totalQTable2"></span> questions, you have answered <span id="ansQ"></span> questions.</p>
          <p id="line1"></p>
          <p className={styles.notranslate} style={{ fontSize: '16px' }}><FaCaretRight /> Out of total <span id="totalQTable4"></span> questions, you have not answered <span id="noansQ"></span> questions.</p>
          <p id="line2"></p>
          <table border="1">
            <tbody>
              <tr>
                <th>Answered</th>
                <th>Not Answered</th>
                <th>Total</th>
              </tr>
              <tr>
                <td>
                  <p id="ansQTable"></p>
                </td>
                <td>
                  <p id="noansQTable"></p>
                </td>
                <td>
                  <p id="totalQTable1"></p>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <p className={styles.notranslate} style={{ fontSize: '16px' }}><FaCaretRight /> Click here to&nbsp;<button id="backtest" onClick={backtotest}>go back to Test</button></p>
          <p id="line3"></p>
          <p className={styles.notranslate} style={{ fontSize: '16px' }}><FaCaretRight /> Click here to&nbsp;<button id="submittest" onClick={submitbtn}>finish and submit the test</button></p>
          <p id="line4"></p>
          <p><a href="https://drive.google.com/file/d/1C9-mSJDGtmCKGwPIazC4DzCNn62X_94e/view?usp=share_link">Disclaimer</a></p><br />
          <div className={`${styles.notranslate} ${styles.copyright}`} id="copyright">www.ncvtonline.com</div>
        </div>
        <div id="resultshow" style={{ display: 'none' }}>
          <div className={styles.resultProfileContainer}>
            <div className={styles.resultHeader}>
              <span>Trainee Profile :</span>
              <img id="Result-profile-image" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgujRjGkIBqKVMdoC2rgHg0OhXXnOSCgccz1SIieEQvQJZf3Z1LLLwYk8ffU0ZtHKFF_jrT1V6BgCBsY9RZx6s5WRyNOKjM8D4fJMo4VuqfIJjFs_9KvN2CxZdVVQvWXFBOeIQ7LkJ6v4BadMeu73km0RkYr88e1cBmjd5ZrUg84sVYIWyui6VPaNBlqmKJ/s320/profile.png" alt="Profile Icon" />
            </div>
            <div className={styles.resultProfileTableContainer}>
              <table>
                <tbody>
                  <tr>
                    <td><strong>Trainee Name :</strong></td>
                    <td id="trainee-name"></td>
                    <td><strong>Exam Date :</strong></td>
                    <td id="exam-date"></td>
                  </tr>
                  <tr>
                    <td><strong>Trade Name :</strong></td>
                    <td id="trade-name"></td>
                    <td><strong>Year :</strong></td>
                    <td id="trade-year"></td>
                  </tr>
                  <tr>
                    <td><strong>Attempt No. :</strong></td>
                    <td id="attempt-no"></td>
                    <td><strong>Time Taken :</strong></td>
                    <td id="time-taken"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.resultHeader}>
              <span>Trainee Result :</span>
              <span className={styles.resultSummaryScore} id="percentage-score">75%</span>
            </div>
            <div className={styles.resultProfileTableContainer}>
              <table>
                <tbody>
                  <tr>
                    <th>Subject :</th>
                    <th>Total Questions</th>
                    <th className={styles.resultCorrectIcon}>✔ Correct</th>
                    <th className={styles.resultIncorrectIcon}>✖ Incorrect</th>
                    <th>Total Marks</th>
                    <th>Obtained Marks</th>
                  </tr>
                  <tr id="th-t-r">
                    <td>Theory :</td>
                    <td id="theory-total"></td>
                    <td id="theory-correct"></td>
                    <td id="theory-incorrect"></td>
                    <td id="theory-marks"></td>
                    <td id="theory-obtained-marks"></td>
                  </tr>
                  <tr id="wsc-t-r">
                    <td>WSC :</td>
                    <td id="wsc-total"></td>
                    <td id="wsc-correct"></td>
                    <td id="wsc-incorrect"></td>
                    <td id="wsc-marks"></td>
                    <td id="wsc-obtained-marks"></td>
                  </tr>
                  <tr id="ed-t-r">
                    <td>ED :</td>
                    <td id="ed-total"></td>
                    <td id="ed-correct"></td>
                    <td id="ed-incorrect"></td>
                    <td id="ed-marks"></td>
                    <td id="ed-obtained-marks"></td>
                  </tr>
                  <tr id="es-t-r">
                    <td>ES :</td>
                    <td id="es-total"></td>
                    <td id="es-correct"></td>
                    <td id="es-incorrect"></td>
                    <td id="es-marks"></td>
                    <td id="es-obtained-marks"></td>
                  </tr>
                  <tr>
                    <td><strong>Total :</strong></td>
                    <td><strong id="total-questions"></strong></td>
                    <td><strong id="total-correct"></strong></td>
                    <td><strong id="total-incorrect"></strong></td>
                    <td><strong id="total-marks"></strong></td>
                    <td><strong id="obtained-marks"></strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <button onClick={showAnswerKey} className={styles.showAnswerKey}>Show Answer Key</button>
          <button id="keybtn2" className={styles.notranslate}>Exit Test</button>
          <div id="KeyContainer" style={{ display: 'none', background: 'white' }}>
            <div className={styles.KeyContainer}>
              <h3 style={{ backgroundColor: '#1600ac', color: 'white', marginTop: '20px', textAlign: 'center', borderRadius: '5px' }}>
                Your Answer Key
              </h3>
              <div className={styles.tabContainer}>
                {/* Tabs will be rendered here */}
              </div>
              <div id="key-question-container" className={styles.notranslate} style={{ display: 'block' }}>
                <div id="key-subject-name" style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}></div>
                <div id="key-question-content"></div>
                <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                  <button id="key-back-btn" onClick={() => navigateKey('back')} style={{ visibility: 'hidden' }}>Back</button>
                  <span id="key-pagination">Question 1</span>
                  <button id="key-next-btn" onClick={() => navigateKey('next')}>Next</button>
                </div>
                <button id="keybtn2" className={styles.notranslate}>Exit Test</button>
              </div>
              <div className={`${styles.notranslate} ${styles.copyright}`} id="copyright">www.ncvtonline.com</div>
            </div>
          </div>
          <div className={`${styles.notranslate} ${styles.copyright}`} id="copyright">www.ncvtonline.com</div>
        </div>
        <div className={styles.popup} id="dialog-box" style={{ display: 'none' }}>
          <div className={`${styles.dialogContent} ${styles.notranslate}`}>
            <h2>Exam Submission</h2>
            <p>Exam Successfully Submitted!</p>
            <button id="ok-btn">OK</button>
          </div>
        </div>
      </div>
      <div className={styles.spinner} id="universalSpinner" style={{ display: 'none' }}>
        <div className={styles.spinnerIcon}></div>
      </div>
    </div>
  );
};

export default CbtMockTestPage;
