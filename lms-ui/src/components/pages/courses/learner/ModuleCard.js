import React, { useState, useEffect } from "react";
import Collapse from "react-collapse";

import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "../../../styles/CourseTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";

const ModuleCard = ({
  module,
  isExpanded,
  toggleModule,
  handleLessonSelect,
  selectedLesson,
  handleVideoCompleted,
  assignments,
  handleAssignmentClick,
  setShowAssignment,
  videoCompletion,
  setVideoCompletion,
  unitCompletion,
  setUnitCompletion,
}) => {
  const navigate = useNavigate();
  // const [selectedLesson, setSelectedLesson] = useState(null);
  const [showPDF, setShowPdf] = useState(false);
  const [doc, setDoc] = useState([]);
  const [isCourseContentVisible, setIsCourseContentVisible] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [lessonResources, setLessonResources] = useState({});
  const [lectureCompleted, setLectureCompleted] = useState(false);
  // const []

  useEffect(() => {
    if (!isExpanded) {
      // handleLessonSelect(null);
      handleVideoCompleted(false);
      // } else if (module.lessons.length > 0) {
      //    first lesson as selected when the module is expanded
      //   setSelectedLesson(module.lessons[0]);
    }
  }, [isExpanded, module]);
  const [moduleUnit, setModuleUnit] = useState([]);
  const [unitPDF, setUnitPDF] = useState([]);
  const [unitAssignment, setUnitAssignment] = useState([]);
  const [unitResources, setUnitResources] = useState([]);

  useEffect(() => {
    const getCourseData = () => {
      fetch(`http://127.0.0.1:8000/api/modules/${module.id}/units/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${sessionStorage.getItem("user_token")}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          response.json().then(function (result) {
            console.log("Units", result);
            setModuleUnit(result);
          });
        }
      });
    };

    getCourseData();
  }, [0]);

  const handleFileComplete = (file) => {
    let completed = ""
    if(lectureCompleted !== true) {
      completed = file.file_completed
    }
    else {
      completed = lectureCompleted
    }
    const updatedObj = {
      title: file.title,
      instructor: file.instructor,
      unit: file.unit,
      updated_by: sessionStorage.getItem("user_id"),
      file_completed: completed,
    };

    fetch(`http://127.0.0.1:8000/api/files/${file.id}/`, {
      method: "PUT",
      body: JSON.stringify(updatedObj),
      headers: {
        Authorization: `Token ${sessionStorage.getItem("user_token")}`,
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((response) => {
      if (response.status === 200) {
        response.json().then(function (result) {
          console.log("updated data: ", result);
        });
      } else {
        console.log(response);
      }
    });
  };

  const handleUnitPDF = (unit) => {
    fetch(`http://127.0.0.1:8000/api/units/${unit.id}/files/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${sessionStorage.getItem("user_token")}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        response.json().then(function (result) {
          console.log("Units", result);
          setUnitPDF(result);
        });
      } else {
        console.log(response);
      }
    });

    fetch(`http://127.0.0.1:8000/api/units/${unit.id}/assignments/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${sessionStorage.getItem("user_token")}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        response.json().then(function (result) {
          console.log("Units", result);
          setUnitAssignment(result);
        });
      } else {
        console.log(response);
      }
    });

    fetch(`http://127.0.0.1:8000/api/units/${unit.id}/resources/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${sessionStorage.getItem("user_token")}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        response.json().then(function (result) {
          console.log("Resources: ", result);
          setUnitResources(result);
        });
      } else {
        console.log(response);
      }
    });
  };

  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleLesson = (lesson) => {
    fetch(`http://127.0.0.1:8000/api/units/${lesson.id}/videos/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${sessionStorage.getItem("user_token")}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        response.json().then(function (result) {
          console.log("Api result: ", result[0].video_completed);
          // setUnitCompletion(result[0].video_completed)
          setVideoCompletion(result[0].video_completed);
          handleLessonSelect(result[0]);
        });
      }
    });
  };
  const toggleCourseContent = () => {
    setIsCourseContentVisible(!isCourseContentVisible);
  };

  const toggleFullScreen = () => {
    const videoPlayer = document.getElementById("videoPlayer");

    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      videoPlayer.requestFullscreen().catch((err) => {
        console.error("Failed to enter full screen:", err);
      });
    }

    setIsFullScreen(!isFullScreen);
  };

  const handleViewPdf = (file) => {
    console.log("pdf url", file);
    // const obj = moduleUnit.filter((unit) => {
    //   return unit.id === id;
    // });
    // console.log('handleViewPdf ka obj',obj)
    setDoc(() => file);
    setShowPdf(!showPDF);
    setLectureCompleted(true);
    window.open(file, "_blank");
  };

  // const toggleResources = (lessonId, lessonResources) => {
  //   setLessonResources((prevResources) => ({
  //     ...prevResources,
  //     [lessonId]: !prevResources[lessonId],
  //   }));
  // };

  const videoUrl = "https://youtu.be/apGV9Kg7ics?si=yP2oeVUi684WxZyg";

  return (
    <div className="module-card">
      <div className="module-header" onClick={toggleModule}>
        <div className="module-title-container">
          <h3>{module.title}</h3>
        </div>
        <i
          className={`fas fa-caret-up ${
            isExpanded ? "fa-rotate-180" : ""
          } arrow`}
        ></i>
      </div>
      <Collapse isOpened={isExpanded}>
        <div className="module-list">
          <ul className="module-content">
            {moduleUnit.length === 0
              ? "No Unit Found for this Module"
              : moduleUnit &&
                moduleUnit.map((unit, index) => {
                  const lessonAssignments = unit.assignments || [];
                  return (
                    <div className="module-content-container" key={unit.id}>
                      <div className="check-box-div">
                        <form onSubmit={(e) => e.preventDefault()}>
                          <input
                            className="checkbox"
                            type="checkbox"
                            id={`lesson-${unit.id}`}
                            name="lesson"
                            // value={`lesson-${unit.id}`}
                            value={unitCompletion}
                            checked={unit.unit_completed}
                          />
                        </form>
                      </div>
                      <div className="content-inside-container">
                        <li
                          data-bs-toggle="collapse"
                          data-bs-target={`#${unit.id}`}
                          className={`lesson-item ${
                            selectedLesson === unit ? "active" : ""
                          } upper-row`}
                        >
                          {/* <li className="lecture-sno">{index + 1}</li> */}
                          <li
                            className="lecture-name"
                            onClick={() => {
                              handleUnitPDF(unit)
                              toggleLesson(unit);
                            }}
                          >
                            <div>{unit.title}</div>
                            <div>
                              <i
                                className={`fas fa-thin fa-chevron-down ${
                                  isExpanded ? "fa-rotate-180" : ""
                                }arrow`}
                              ></i>
                            </div>
                          </li>
                        </li>
                        <div
                          className={`video-player-icon collapse ${
                            selectedLesson === unit ? "active" : ""
                          }`}
                          id={unit.id}
                        >
                          <li
                            key={unit.id}
                            onClick={() => {
                              toggleLesson(unit);
                            }}
                            data-bs-toggle="collapse"
                            data-bs-target={`#${unit.id}`}
                            className={`lesson-item upper-row`}
                          >
                            <div className="lesson-content-container">
                              <div className="lesson-title">
                                <input
                                  className="checkbox"
                                  type="checkbox"
                                  id={`lesson-${unit.id}`}
                                  name="lesson"
                                  // value={`lesson-${unit.id}`}
                                  value={videoCompletion}
                                  checked={videoCompletion}
                                />
                                <FontAwesomeIcon
                                  icon={faCirclePlay}
                                  className="my-icon"
                                  style={{ marginTop: "3px" }}
                                />

                                <li>{unit.id}</li>
                              </div>
                              <div className="lecture-pdf">
                                {unitPDF.length === 0
                                  ? "No Document"
                                  : unitPDF &&
                                    unitPDF.map((pdf) => {
                                      return (
                                        <div
                                          className="pdf-doc-container"
                                          onClick={() => {
                                            handleViewPdf(pdf.file);
                                          }}
                                        >
                                          <div
                                            className="check-box-div"
                                            onClick={handleFileComplete(pdf)}
                                          >
                                            <input
                                              className="checkbox"
                                              type="checkbox"
                                              id={pdf.id}
                                              name="lesson-checkbox"
                                              value={pdf.id}
                                              checked={pdf.file_completed}
                                            />
                                          </div>
                                          <i class="fas fa-solid fa-file-pdf"></i>
                                          <li>{pdf.title}</li>
                                        </div>
                                      );
                                    })}
                              </div>
                              <div
                                className="assignment-container"
                                onClick={() => setShowAssignment((pre) => !pre)}
                              >
                                {unitAssignment.length === 0
                                  ? null
                                  : unitAssignment &&
                                    unitAssignment.map((assignment) => {
                                      return (
                                        <div
                                          className="NoDoc-pdf-container"
                                          onClick={() =>
                                            // navigate("/course/my-assignments")
                                            handleAssignmentClick(assignment)
                                          }
                                        >
                                          <div>
                                            
                                              <input
                                                className="checkbox"
                                                type="checkbox"
                                                name="lesson-checkbox"
                                                checked={assignment.assignment_completed}
                                              />
                                              </div>
                                            <i class="far fa-file-alt"></i>
                                          <div className="assignment-pdf">
                                            {assignment.title}
                                          </div>
                                        </div>
                                      );
                                    })}
                              </div>
                              {/* -----------xxxxxxxxx-------------- */}
                              <div className="additional-resources-container">
                                {unitResources.length === 0
                                  ? null
                                  : unitResources.map((resource) => {
                                      return (
                                        <div>
                                          <div className="resource-title-container">
                                            <div>
                                              <i class="fas fa-folder"></i>
                                            </div>
                                            <div>{resource.title}</div>
                                          </div>
                                        </div>
                                      );
                                    })}
                              </div>
                            </div>
                          </li>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </ul>
        </div>
      </Collapse>

      {/* ------------------- */}
      {/* <div className="video_player_container_extended_view">
        {selectedLesson && selectedLesson.url (
          <div className="video-player-container">
            {console.log(selectedLesson.url)}
            <ReactPlayer
              url={selectedLesson.url}
              controls={true}
              width="100%"
              height="100%"
              volume={3.5}
              onProgress={handleVideoProgress}
            />
          </div>
        )}
      </div> */}

      {/* ------------ */}
      <div className="document-container">
        {/* {console.log(module.lessons[0].doc)} */}
        {/* {module.lessons.filter((lesson) => { */}
        {/* return ( */}
        {/* showPDF && ( */}
        {/* {console.log('document: ',doc.doc)} */}
        {/* ------------------------------------------- */}
        {/* {doc.length !== 0 && (
          <DocViewer
            key={doc.id} // Assign a unique key
            documents={doc[0].doc} // Use lesson.doc
            pluginRenderers={DocViewerRenderers}
            style={{ height: 500 }}
          />
        )} */}
        {/* -------------------------------------------- */}
        {/* ) */}
        {/* ); */}
        {/* })} */}
      </div>
    </div>
  );
};

export default ModuleCard;
