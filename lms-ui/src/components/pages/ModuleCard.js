import React, { useState } from "react";
import YouTube from "react-youtube";
import Collapse from "react-collapse";
import styles from "../styles/CourseTable.module.css";
import ReactPlayer from "react-player";
import "../styles/CourseTable.css";

const ModuleCard = ({ module }) => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [isModuleExpanded, setIsModuleExpanded] = useState(false);

  const selectLesson = (lesson) => {
    setSelectedLesson(lesson);
  };

  const selectModule = ({ module }) => {
    setSelectedModule(module);
  };

  const toggleModuleExpand = () => {
    setIsModuleExpanded(!isModuleExpanded);
  };


  const videoUrl = "https://youtu.be/apGV9Kg7ics?si=yP2oeVUi684WxZyg";

  // console.log(selectedLesson)
  // console.log(selectedLesson && selectedLesson.url)
  return (
    <>
      <div className="module-card">
        <div className="module-header" onClick={toggleModuleExpand}>
          <h3>{module.title}</h3>
          <i class="fas fa-caret-up fa-rotate-180 arrow"></i>
        </div>
        <Collapse isOpened={isModuleExpanded}>
          <div className="module-list">
            <ul className="module-content">
              {module.lessons.map((lesson) => (
                <>
                  <div className="module-content-container">
                    <div className="check-box-div">
                      <form action="">
                        <input
                          className="checkbox"
                          type="checkbox"
                          id="lesson"
                          name="lesson"
                          value="lesson"
                        />
                      </form>
                    </div>
                    <div className="content-inside-container">
                      <li
                        key={lesson.id}
                        onClick={() => selectLesson(lesson)}
                        className={`lesson-item ${
                          selectedLesson === lesson ? "active" : ""
                        } upper-row`}
                      >
                        <li>{lesson.sno}</li>
                        <li> {lesson.title}</li>
                      </li>
                      <li>
                        <div className="video-player-icon">
                          <i class="fas fa-solid fa-tv"></i>
                          {lesson.duration}
                        </div>
                      </li>
                    </div>
                  </div>
                </>
              ))}
            </ul>
          </div>
        </Collapse>
        <div className="video_player_container">
          {selectedLesson && selectedLesson.url && (
            <div className="video-player-container">
              {console.log(selectedLesson.url)}
              <ReactPlayer
                url={selectedLesson.url}
                controls={true}
                width="100%"
                height="100%"
                volume = {3.5}
              />
            </div>
          )}
        </div>
      </div>

      {/* chatgpt */}
      {/* <div className="module-card">
        <div className="module-list">
          <h3 onClick={toggleModuleExpand}>
            {selectedModule ? selectedModule.title : "Select a Module"}
          </h3>
          <Collapse isOpened={isModuleExpanded}>
            {modules.map((module) => (
              <div key={module.id} className="module-item">
                <h3 onClick={() => selectModule(module)}>{module.title}</h3>
                <ul>
                  {module.lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      onClick={() => selectLesson(lesson)}
                      className={`lesson-item ${
                        selectedLesson === lesson ? "active" : ""
                      }`}
                    >
                      {lesson.title}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Collapse>
        </div>
      </div> */}
    </>
  );
};

export default ModuleCard;