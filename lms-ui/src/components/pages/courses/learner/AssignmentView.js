import React, { useState, useEffect } from "react";
import "../../../styles/AssignmentView.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import fil from "../../../content/Images/fil.png";

function calculateSubmissionStatus(
  dueDate,
  isDone,
  isResubmit,
  isSubmitClicked
) {
  const formattedSubmissionDate = new Date();
  const formattedDueDate = new Date(dueDate);

  if (isSubmitClicked) {
    return <span className="submitted-status">Submitted</span>;
  } else if (isDone) {
    return <span className="done-status">Done</span>;
  } else if (isResubmit) {
    return <span className="resubmitted-status">Resubmitted</span>;
  } else if (formattedSubmissionDate > formattedDueDate) {
    return <span className="late-submission-status">Late Submission</span>;
  } else {
    return <span className="not-submitted-status">Not Submitted</span>;
  }
}

function AssignmentView({ selectedAssignments }) {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [files, setFiles] = useState([]);
  const [link, setLink] = useState("");
  const [file, setFile] = useState([]);
  const [links, setLinks] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [submissionOption, setSubmissionOption] = useState(null);
  const [showSubmissionOptions, setShowSubmissionOptions] = useState(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [isResubmit, setIsResubmit] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [isFileInputVisible, setIsFileInputVisible] = useState(false);
  const [isConfirmButtonVisible, setIsConfirmButtonVisible] = useState(true);
  const [instructorFeedback, setInstructorFeedback] = useState(null);
  const [apiData, setApiData] = useState([]);
  const [number, setNumber] = useState(0);
  const [assignmentid, setAssignmentid] = useState("");
  const [feedbackData, setFeedbackData] = useState("feedback"); // State variable for feedback
  const [gradeData, setGradeData] = useState(0);
  const [statusData, setStatusData] = useState([]);
  const [previousFiles, setPreviousFiles] = useState([]);
  const [previousLink, setPreviousLink] = useState("");
  const [previousSubmission, setPreviousSubmission] = useState({
    files: [],
    links: [],
  });
  const [showAddNewSubmission, setShowAddNewSubmission] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [submittedLink, setSubmittedLink] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState([]);
  const [submissionId, setSubmissionId] = useState(null);
  const [isEditClicked, setIsEditClicked] = useState(false);

  // const assignments = [
  //   {
  //     id: 1,
  //     title: "Assignment 1",
  //     description: "Complete the first assignment.",
  //     dueDate: "2023-09-30 14:00",
  //     points: 90,
  //     resourceFiles: ["https://example.com/your-pdf-file.pdf", "file2.doc"],
  //     submissionLinks: [
  //       "https://example.com/your-file-url",
  //       "https://anotherlink.com",
  //     ],
  //     feedback: "", // Add feedback property
  //     grade: null, // Add grade property
  //   },
  //   // Add more assignments here.
  // ];

  useEffect(() => {
    const getAssignmentData = () => {
      fetch("http://127.0.0.1:8000/api/assignments", {
        method: "GET",
        headers: {
          Authorization: `Token ${sessionStorage.getItem("user_token")}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (Array.isArray(result) && result.length > 0) {
            console.log(result);
            setApiData(result);
            setNumber(result[0].marks);
          } else {
            console.error("Invalid API response:", result);
          }
        })
        .catch((error) => {
          console.error("Error fetching assignment data:", error);
        });
    };

    getAssignmentData();
  }, []);

  // useEffect(() => {
  //   const getGradingData = () => {
  //     console.log("Fetching grading data...");

  //     fetch("http://127.0.0.1:8000/api/assignment_gradings", {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Token ${sessionStorage.getItem("user_token")}`,
  //       },
  //     })
  //       .then((response) => {
  //         response.json().then(function (result) {
  //           console.log(result);
  //           setFeedbackData(result);
  //           setGradeData(result);
  //         });
  //       });
  //   };
  //   getGradingData();
  // }, []);

  // useEffect(() => {
  //   const getGradingData = async () => {
  //     try {
  //       const response = await fetch("http://127.0.0.1:8000/api/assignment_gradings", {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Token ${sessionStorage.getItem("user_token")}`,
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }

  //       const data = await response.json();
  //       // console.log("API Data:", data, data[0].marks);
  //       setGradeData(data[0].marks);
  //       setFeedbackData(data[0].comments);
  //       console.log("feddback data from variab", gradeData)

  //     } catch (error) {
  //       console.error("Error fetching grading data:", error);
  //     }
  //   };

  //   getGradingData();
  // }, []);

  // console.log("I m feedback data : ", feedbackData);
  // const marks = feedbackData ? feedbackData.marks : null;

  const simulateSubmission = () => {
    setTimeout(() => {
      // Simulate pass or fail randomly
      const isPassed = Math.random() < 0.5;

      const feedback = isPassed
        ? "Congratulations! You have passed the assignment."
        : "Sorry, you have not passed the assignment. Please review and resubmit.";

      const grade = isPassed ? selectedAssignment.points : 0;

      setInstructorFeedback(feedback);
      setSelectedAssignment((prevSelectedAssignment) => ({
        ...prevSelectedAssignment,
        feedback,
        grade,
      }));
      setIsSubmitClicked(true);
    }, 2000);
  };

  function handleAssignment(assignment) {
    setSelectedAssignment(assignment);
    setFiles([]);
    setLinks([]);
    setIsDone(false);
    setSubmissionOption(null);
    setIsResubmit(false);
    setShowLink(false)
    // setShowAddNewSubmission(false)
    setIsConfirmButtonVisible(true);
    setInstructorFeedback(null);
    setAssignmentid(assignment.id);

    const getGradingData = () => {
      fetch(
        `http://127.0.0.1:8000/api/assignments/${assignment.id}/assignment_submissions/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${sessionStorage.getItem("user_token")}`,
          },
        }
      ).then((response) => {
        if (response.status === 200) {
          response.json().then(function (result) {
            console.log("Api result submissions: ", result);
            console.log("result id", result[result.length - 1].id);
            getGradingAPI(result[result.length - 1].id);
            if (result.length > 0) {
              setShowAddNewSubmission(false);
              setIsSubmitClicked(true);
            } else {
              setShowAddNewSubmission(true);
              setIsSubmitClicked(false);
            }
            // setShowAddNewSubmission(true);
          });
        } else {
          console.log(response);
          setGradeData(0);
          setShowAddNewSubmission(true);
          setIsSubmitClicked(false);
        }
      });
    };

    const getGradingAPI = (id) => {
      fetch(
        `http://127.0.0.1:8000/api/assignment_submissions/${id}/assignment_gradings`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${sessionStorage.getItem("user_token")}`,
          },
        }
      ).then((response) => {
        if (response.status === 200) {
          response.json().then(function (result) {
            console.log("Api result Gradings: ", result);
            setGradeData(result[result.length - 1].marks);
            setFeedbackData(result[result.length - 1].comments);
            setStatusData(result[result.length - 1].status);

            if (result[result.length - 1].marks === null) {
              setIsSubmitClicked(true);
              setShowAddNewSubmission(false);
            } else {
              setIsSubmitClicked(false);
              setShowAddNewSubmission(false);
            }

            // Check if the status is "pending" and update isResubmit accordingly
            // if (result[result.length - 1].marks === null) {
            //   setIsResubmit(true);
            // } else {
            //   setIsResubmit(false);
            // }
          });
        } else {
          console.log(response);
          setGradeData(0);
          setIsSubmitClicked(true);
          setShowAddNewSubmission(false);
        }
      });
    };

    getGradingData();
  }

  // function handleToggleResubmit() {
  //   setIsResubmit(!isResubmit);

  //   if (!isResubmit) {
  //     setFiles([]);
  //     setLinks([]);
  //     setIsDone(false);
  //     setSubmissionOption(null);
  //     setShowSubmissionOptions(false);
  //     setIsSubmitClicked(false);
  //     setIsConfirmButtonVisible(true);
  //     setInstructorFeedback(null); // Reset feedback when toggling resubmit
  //   }
  // }

  function fetchSubmissionByAssignment(assignmentId) {
    console.log("assignment get:", assignmentId);
    fetch(
      `http://127.0.0.1:8000/api/assignments/${assignmentId}/assignment_submissions`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${sessionStorage.getItem("user_token")}`,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          console.error("Error fetching submission data:", response);
          setShowAddNewSubmission(true);
          setIsSubmitClicked(false);
        }
      })
      .then((submissionData) => {
        if (submissionData.length > 0) {
          // const submission= submissionData;
          const submission = submissionData[submissionData.length - 1];
          console.log("Submission Data:", submission);
          setIsSubmitClicked(true);

          setSubmissionId(submission.id);
          setLink(submission.submitted_link);
          // setFiles(submission.content)
          setShowAddNewSubmission(false);
        } else {
          console.log("No submissions found for this assignment");
          setShowAddNewSubmission(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching submission data:", error);
      });
  }

  function handleToggleResubmit(submission) {
    setShowLink(true);
    // Check if the status is not "pending"
    console.log("getting status :", statusData);
    console.log("getting  :", isResubmit);
    // if (statusData === "pending") {
    setIsResubmit(!isResubmit);

    if (!isResubmit) {
      fetchSubmissionByAssignment(submission);
      // setSubmittedLink(submission.submitted_link);
         setIsEditClicked(true);

      setFiles([]);
      setLinks([]);

      setIsDone(false);
      setSubmissionOption(null);
      setShowSubmissionOptions(false);
      setIsSubmitClicked(false);
      setIsConfirmButtonVisible(true);
      setInstructorFeedback(null);
    }
    // }
  }

  function handleLinkChange() {
    if (link.trim() !== "") {
      setLinks([...links, link]);
    }
  }

  function toggleFileInput() {
    setIsFileInputVisible(!isFileInputVisible);
  }

  function handleFileChange(event) {
    const selectedFiles = event.target.files[0];
    // setFiles((pre) =>[...pre, selectedFiles]);
    setFiles(selectedFiles)
    setIsFileInputVisible(false);
  }
console.log('file ', files);
  function handleRemoveFile(index) {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  }
  function handleRemoveLink(index) {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
  }

  function handleSubmit(event, request) {
    event.preventDefault();
    //   async function postData(obj) {
    //     try {
    //       const formData = new FormData();
    //       formData.append("submitted_by", sessionStorage.getItem("user_id"));
    //       formData.append("assignment", obj.assignment);
    //       formData.append("submission_date", "2024-10-03T10:00:00Z");
    //       formData.append("submitted_link", obj.submitted_link);
    //       formData.append("content", obj.content);

    //       postData(obj);

    //       // Add other form data properties as needed
    //       // formData.append("key", value);

    //       const response = await fetch("http://127.0.0.1:8000/api/assignment_submissions/", {
    //         method: "POST",
    //         body: formData,
    //         headers: {
    //           Authorization: `Token ${sessionStorage.getItem("user_token")}`,
    //         },
    //       });

    //       if (response.status === 201) {
    //         const result = await response.json();
    //         console.log(result.id);

    //         const submissionId = result.id;
    //         const newSubmissionId = result.id;
    //         fetchSubmissionByAssignment(newSubmissionId);

    //         const formattedSubmissionDate = new Date(obj.submission_date);
    //         const formattedDueDate = new Date(selectedAssignment.due_date);

    //         if (formattedSubmissionDate > formattedDueDate) {
    //           console.log("Assignment submitted late");
    //         }

    //         const gradingURL = `http://127.0.0.1:8000/api/assignment_submissions/${submissionId}/assignment_gradings`;

    //         const gradingResponse = await fetch(gradingURL, {
    //           method: "GET",
    //           headers: {
    //             Authorization: `Token ${sessionStorage.getItem("user_token")}`,
    //           },
    //         });

    //         if (gradingResponse.status === 200) {
    //           const gradingResult = await gradingResponse.json();
    //           console.log(gradingResult[0].marks);
    //           console.log(gradingResult[0].status);
    //           console.log(gradingResult[0].comments);
    //           setGradeData(gradingResult[0].marks);
    //         } else {
    //           console.log(gradingResponse);
    //         }

    //         setLink("");
    //         setFile([]);
    //       } else {
    //         console.log(response);
    //       }
    //     } catch (error) {
    //       console.error("Error:", error);
    //     }
    //   }

    //   // Call the postData function when needed:

    //   setShowConfirmationDialog(true);
    // }
    let url = "";
    const formData = new FormData();
    formData.append("submitted_by", sessionStorage.getItem("user_id"));
    formData.append("assignment", assignmentid);
    formData.append("submission_date", "2022-10-03T10:00:00Z");
    formData.append("submitted_link", link);
    formData.append("content", files);
    // const obj = {
    //   submitted_by: sessionStorage.getItem("user_id"),
    //   assignment: assignmentid,
    //   submission_date: "2022-10-03T10:00:00Z",
    //   submitted_link: link,
    //   // content: file,
    // };
    if (request === "POST") {
      url = `http://127.0.0.1:8000/api/assignment_submissions/`;
    } else {
      url = `http://127.0.0.1:8000/api/assignment_submissions/${submissionId}/`;
    }
    async function postData(formData) {
      try {
        const response = await fetch(`${url}`, {
          method: request,
          // body: JSON.stringify(obj),
          body: formData,
          headers: {
            Authorization: `Token ${sessionStorage.getItem("user_token")}`,
            // "Content-type": "application/json; charset=UTF-8",
          },
        });

        if (response.status === 201 || response.status === 200) {
          setShowLink(false)
          const result = await response.json();
          console.log(result.id);
          setShowAddNewSubmission(false);
          const submissionId = result.id;
          // const newSubmissionId = result.id;
          // fetchSubmissionByAssignment(newSubmissionId);

          const formattedSubmissionDate = new Date(formData.submission_date);
          const formattedDueDate = new Date(selectedAssignment.due_date);

          if (formattedSubmissionDate > formattedDueDate) {
            setSubmissionStatus("Late Submission");
          } else {
            setSubmissionStatus("");
          }

          // const updatedData = {
          //   submitted_link: link, // Update with the new link
          //   // Other fields that need to be updated
          // };
          // console.log("Submitting data:", formData);
          // fetch(
          //   `http://127.0.0.1:8000/api/assignment_submissions/${submissionId}/`,
          //   {
          //     method: "PUT",
          //     headers: {
          //       Authorization: `Token ${sessionStorage.getItem("user_token")}`,
          //       "Content-Type": "application/json",
          //     },
          //     body: JSON.stringify(updatedData),
          //   }
          // )
          //   .then((putResponse) => {
          //     if (putResponse.status === 200) {
          //       // Submission updated successfully, you can update your local state if needed
          //       console.log("Submission updated successfully");
          //     } else {
          //       console.error("Error updating submission:", putResponse);
          //     }
          //   })
          //   .catch((error) => {
          //     console.error("Error updating submission:", error);
          //   });
  
          // Rest of your code
          setLink("");
          // setFile([])


          const gradingURL = `http://127.0.0.1:8000/api/assignment_submissions/${submissionId}/assignment_gradings`;

          const gradingResponse = await fetch(gradingURL, {
            method: "GET",
            headers: {
              Authorization: `Token ${sessionStorage.getItem("user_token")}`,
              "Content-type": "application/json; charset=UTF-8",
            },
          });

          if (gradingResponse.status === 200) {
            const gradingResult = await gradingResponse.json();
            console.log(gradingResult[0].marks);
            console.log(gradingResult[0].status);
            console.log(gradingResult[0].comments);
            setGradeData(gradingResult[0].marks);
          } else {
            console.log(gradingResponse);
          }

          setLink("");
          // setFile([])
        } else {
          console.log(response);
        }
      } catch (error) {
        console.error("Error:", error);
      }

      
    }
    

    // Call the postData function when needed:
    postData(formData);

    setShowConfirmationDialog(true);
  }

  function handleConfirmSubmit() {
    setIsSubmitClicked(true);
    setShowConfirmationDialog(false);
    simulateSubmission(); // Simulate submission and get feedback
  }

  function handleCloseConfirmationDialog() {
    setShowConfirmationDialog(false);
  }

  return (
    <>
      <div className="app">
        <div className="assignment-view">
          <div className="assignment-list">
            {apiData.map((assignment) => (
              <div
                key={assignment.id}
                className={`assignment-item ${
                  selectedAssignment === assignment ? "selected" : ""
                }`}
                onClick={() => handleAssignment(assignment)}
              >
                {assignment.title}
              </div>
            ))}
          </div>
          {selectedAssignment ? (
            <div className="detail">
              <div className="title-date">
                <div className="detail-title">
                  <i className="fas fa-file-pen"></i>
                  <img src={fil} alt="" className="head" />{" "}
                  {selectedAssignment.title}
                </div>
                <div className="detail-points-and-date">
                  <div className="detail-points">
                    <strong>Marks:</strong>
                    {number}
                  </div>
                  <div className="detail-create">
                    <strong>Created At:</strong>
                    {selectedAssignment.created_at}
                  </div>
                  <div className="detail-date">
                    <strong>Due date:</strong>
                    {selectedAssignment.due_date.substr(0, 10)}
                  </div>
                </div>
              </div>
              <div className="detail-description">
                {selectedAssignment.description}
              </div>
              <div className="resource-files">
                {selectedAssignment.resourceFiles &&
                  selectedAssignment.resourceFiles.length > 0 && (
                    <>
                      <p>Attached Resource Files:</p>
                      <ul className="resources">
                        {selectedAssignment.resourceFiles.map((file, index) => (
                          <li key={index}>
                            <a className="res" href={file} download>
                              <i
                                className="fas fa-file"
                                style={{ marginRight: "5px" }}
                              ></i>
                              {file}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
              </div>
            </div>
          ) : (
            <p>Select an assignment to view details:</p>
          )}
          {selectedAssignment && (
            <div className="submit">
              <div className="submit-section">
                <div className="uploaded-files">
                  <div className="submission-status">
                    {calculateSubmissionStatus(
                      selectedAssignment.dueDate,
                      isDone,
                      isResubmit,
                      isSubmitClicked
                    )}
                    <span className={`${submissionStatus}-status`}>
                      {submissionStatus}
                    </span>
                  </div>
                  {files.length > 0 && (
                    <>
                      <ul className="uploa">
                        {files.map((file, index) => (
                          <li className="upload" key={index}>
                            <img src={fil} alt="" className="pht" />
                            <div className="fil-text">{file.name}</div>
                            <span
                              className="rem-fil"
                              onClick={() => handleRemoveFile(index)}
                            >
                              &#x2716;
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                <div className="submitted-links">
                  {links.length > 0 && (
                    <>
                      <ul>
                        {links.map((link, index) => (
                          <li key={index} className="lnk-upld">
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {link}
                            </a>
                            <span
                              className="rem-link"
                              onClick={() => handleRemoveLink(index)}
                            >
                              &#x2716;
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                <div className="feedback-section">
                  <div className="toggle-submission-button">
                    {isSubmitClicked && (
                      <div>
                        <button
                          type="button"
                          onClick={() => handleToggleResubmit(assignmentid)}
                          className="resubmit-btn"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                    {showLink && (
                      <>
                       {isEditClicked && (
                        <>
                        <input
                             type="text"
                             value={link}
                                onChange={(e) => setLink(e.target.value)}
                             placeholder="Enter link URL"
                             className="lnk-text"
                           />
                   
                  
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) =>handleFileChange(e)}
                                id="fileInput"
                                multiple
                                // className="upload-fil"
                                value={file}
                              />
                    
                          </>
                      )}

                     

                        <button
                          type="button"
                          onClick={(e) => handleSubmit(e, "PUT")}
                          className="save-btn"
                          disabled={!selectedAssignment}
                        >
                          Resubmit
                        </button>
                      </>
                    )}
                    {showAddNewSubmission &&  (
                      <div className="add-create-dropdown">
                        <button
                          type="button"
                          onClick={() =>
                            setShowSubmissionOptions(!showSubmissionOptions)
                          }
                          className="add-create"
                        >
                          <FontAwesomeIcon icon={faPlus} /> Add or create
                        </button>
                        {showSubmissionOptions && (
                          <div className="submission-options-dropdown">
                            <div>
                              <button
                                type="button"
                                onClick={() => setSubmissionOption("link")}
                                className="lnk-optn"
                              >
                                <i
                                  className=" lnk  fas fa-link"
                                  style={{
                                    position: "relative",
                                    top: "-2px",
                                    left: "-108px",
                                  }}
                                ></i>
                                <div className="texeria"> Link</div>
                              </button>
                            </div>
                            <div className="texeria-two">
                              <button
                                type="button"
                                onClick={() => setSubmissionOption("file")}
                                className="lnk-optn"
                              >
                                {/* <i className=" fil fas fa-paperclip"></i>{" "} */}
                                {/* <div className="texeria">File</div> */}

                                <label
                                  htmlFor="fileInput"
                                  className={` ${
                                    isFileInputVisible ? "hidden" : ""
                                  }`}
                                  onClick={toggleFileInput}
                                >
                                  <i className=" fil fas fa-paperclip"></i>{" "}
                                  <div className="texeria-tex">Upload File</div>
                                </label>
                              </button>
                            </div>
                          </div>
                        )}
                        {isConfirmButtonVisible && (
                          <button
                            type="button"
                            onClick={(e) => handleSubmit(e, "POST")}
                            className="save-btn"
                            disabled={!selectedAssignment}
                          >
                            Submit
                          </button>
                        )}
                      </div>
                    )}

                    {submissionOption === "link" && (
                      <div className="link-place">
                        <div
                          className="close-icon"
                          onClick={() => setSubmissionOption(null)}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </div>
                        <input
                          type="text"
                          value={link}
                          // value={submissionOption === "link" ? link : previousLink}
                          onChange={(e) => setLink(e.target.value)}
                          placeholder="Enter link URL"
                          className="lnk-text"
                        />
                        <button
                          type="button"
                          onClick={handleLinkChange}
                          className="link-btn"
                        >
                          Submit Link
                        </button>
                      </div>
                    )}
                    {submissionOption === "file" && (
                      <>
                        {!isSubmitClicked && (
                          <div className="load-img">
                            {/* <label
                                  htmlFor="fileInput"
                                  className={`custom-button ${
                                    isFileInputVisible ? "hidden" : ""
                                  }`}
                                  onClick={toggleFileInput}
                                >
                                  <i className="fas fa-upload"></i> Upload File
                                </label> */}
                            {isFileInputVisible && (
                              <>
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  onChange={(e) =>handleFileChange(e)}
                                  id="fileInput"
                                  multiple
                                  className="upload-fil"
                                  value={file}
                                />
                              </>
                            )}
                          </div>
                        )}
                        {!isFileInputVisible && <></>}
                      </>
                    )}

                    {showConfirmationDialog && (
                      <div className="confirmation-dialog">
                        <p>Are you sure you want to submit this assignment?</p>
                        <button
                          type="button"
                          onClick={handleConfirmSubmit}
                          className="confirm-btn"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={handleCloseConfirmationDialog}
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Display Feedback and Grade */}
                <>
                  {/* {isSubmitClicked && feedbackData !== null && ( */}
                  <div className="feedback-and-grade">
                    <div className="feedback-and-grad">
                      <div className="feedback-fb">
                        <strong>Comments:</strong>{" "}
                        {gradeData ? feedbackData : "No feedback yet"}
                      </div>
                      <div className="grade-gd">
                        <strong>Grade:</strong>{" "}
                        {gradeData
                          ? `${gradeData} / ${number}`
                          : "Not graded yet"}
                      </div>
                      <div className="status">
                        <strong>Status:</strong>{" "}
                        {gradeData ? statusData : "pending"}
                      </div>
                    </div>
                  </div>
                  {/* )} */}
                </>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AssignmentView;
