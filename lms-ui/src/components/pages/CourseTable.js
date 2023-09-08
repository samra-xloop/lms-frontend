import React, { useState } from "react";
import "../styles/CourseTable.css";

import ModuleCard from "./ModuleCard";

const coursesData = [
  {
    id: 1,
    title: "Course 1",
    modules: [
      {
        id: 1,
        title: "Module 1",
        lessons: [
          {
            id: 1,
            sno: "1.1",
            title: "Lesson Title",
            url: "https://youtu.be/apGV9Kg7ics?si=0H7Du27QWZP7DQ6u",
            duration: "7 min",
            ppt:"https://xloop-my.sharepoint.com/:p:/g/personal/samara_mohsin_xloopdigital_com/EfoU-4J3K2xMjzZ1I3wkwdEB9POjRCIOc0luDu8N2Rq3bw?e=sAHpKS"
          },
          {
            id: 2,
            sno: "1.2",
            title: "Lesson Title",
            url: "https://youtu.be/waGfV-IoOt8?si=1Th7Y9ZQ_GzC_h-B",
            duration: "1 hr",
          },
        ],
      },
      {
        id: 2,
        title: "Module 2",
        lessons: [
          {
            id: 3,
            sno: "1.3",
            title: "Lesson Title",
            url: "https://youtu.be/gwWKnnCMQ5c?si=_av7yUDr5ZKqGbgt",
            duration: "7 min",
          },
          {
            id: 4,
            sno: "1.4",
            title: "Lesson Title",
            url: "https://youtu.be/rZ41y93P2Qo?si=FEzJeeSY_baszCQ4",
            duration: "2 hr",
          },
        ],
      },
    ],
  },
  // Add more courses and modules as needed
];

function CourseTable() {
  const [activeTab, setActiveTab] = useState("Course Content");
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <>
      {/* nav */}
      <div className="course-nav"></div>
      {/* main-div*/}
      <div className="main-outer-container">
        {/* sidebar div */}
        <div className="course-main">
          <div className="video-section">
          <h1>video container</h1>
          {/* tabs below video */}
          </div>
          <div className="tabs-container">
          <ul className="tabs">
            <li
              className={activeTab === "Course Content" ? "active" : ""}
              onClick={() => handleTabChange("Course Content")}
            >
              Course-Content
            </li>
            <li
              className={activeTab === "Overview" ? "active" : ""}
              onClick={() => handleTabChange("Overview")}
            >
              Overview
            </li>
          </ul>

          <div className="tab-content">
            {activeTab === "Course Content" && (
              <div>
                {/* Add content for Course Content tab */}
                <p>Course Content tab.</p>
              </div>
            )}

            {activeTab === "Overview" && (
              <div>
                {/* Add content for Overview tab */}
                <p>Overview tab.</p>
              </div>
            )}
          </div>
        </div>
        </div>
        <div className="App">
          <header className="App_header">
            <h1>Course Content</h1>
            <i class="fa fa-times close-icon" aria-hidden="true"></i>
          </header>
          <div className="course_list">
            {coursesData.map((course) => (
              <div key={course.id} className="course_card">
                <h2>{course.title}</h2>
                {course.modules.map((module) => (
                  <ModuleCard key={module.id} module={module} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseTable;