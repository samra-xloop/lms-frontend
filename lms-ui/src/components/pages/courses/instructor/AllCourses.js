import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { CourseProbs } from "../../../../App";
import Avatar from "react-avatar";

const AllCourse = ({ show, minDate }) => {
  const userId = sessionStorage.getItem("user_id");
  const userRole = sessionStorage.getItem("role");
  const navigate = useNavigate();
  const {
    courseId,
    setCourseId,
    instructor,
    setInstructor,
    courseCoauthors,
    setCourseCoauthors,
    courseCreator,
    setCourseCreator,
  } = useContext(CourseProbs);
  //   Create Course Section
  const [showContent, setShowContent] = useState("");
  const [courseContent, setCourseContent] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [descriptionHover, setDescriptionHover] = useState("")

  const [singleCourse, setSingleCourse] = useState([]);
  const [courseCategory, setCourseCategory] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [authorData, setAuthorData] = useState([]);

  useEffect(() => {
    const getCourseData = (authorsData) => {
      fetch("http://127.0.0.1:8000/api/courses/", {
        method: "GET",
        headers: {
          Authorization: `Token ${sessionStorage.getItem("user_token")}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          response.json().then(function (result) {
            console.log("Api course result", result);
            // setCourseContent(result);
            if (userRole === "admin") {
              setCourseContent(result);
            } else {
              const obj = result.filter((course) => {
                const author = authorsData.find(
                  (author) => author.id === course.instructor
                );
                return (
                  author &&
                  (author.created_by === +userId ||
                    author.editor.includes(+userId))
                );
              });
              setCourseContent(obj);
            }
          });
        } else {
          console.log(response);
          setCourseContent([]);
        }
      });
    };

    const getCategoryData = () => {
      fetch("http://127.0.0.1:8000/api/categories", {
        method: "GET",
        headers: {
          Authorization: `Token ${sessionStorage.getItem("user_token")}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          response.json().then(function (result) {
            setCategoryData(result);
          });
        } else {
          console.log(response);
          setCategoryData([]);
        }
      });
    };

    const getTeamData = () => {
      fetch("http://127.0.0.1:8000/teams_list_data/", {
        method: "GET",
        headers: {
          Authorization: `Token ${sessionStorage.getItem("user_token")}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          response.json().then(function (result) {
            console.log("API team data", result);
            setTeamData(result);
          });
        } else {
          console.log(response);
          setTeamData([]);
        }
      });
    };

    const getUsers = () => {
      fetch("http://127.0.0.1:8000/list_all_users/", {
        method: "GET",
        headers: {
          Authorization: `Token ${sessionStorage.getItem("user_token")}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          response.json().then(function (result) {
            console.log("API user Data ", result);
            setUserData(result);
          });
        } else {
          console.log(response);
        }
      });
    };

    const getAuthorsData = () => {
      fetch(`http://localhost:8000/api/authors/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${sessionStorage.getItem("user_token")}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          response.json().then(function (result) {
            console.log("Api result Author Data", result);
            setAuthorData(result);
            getCourseData(result);
          });
        } else {
          console.log(response);
          getCourseData();
        }
      });
    };

    getCategoryData();
    getTeamData();
    getUsers();

    getAuthorsData();
  }, [0]);

  const handleVisibility = (course) => {
    // setVisibility(e.target.value);
    const active = course.is_active;
    const obj = {
      title: course.title,
      instructor: course.instructor,
      updated_by: sessionStorage.getItem("user_id"),
      category: course.category,
      is_active: !active,
    };
    fetch(`http://127.0.0.1:8000/api/courses/${course.id}/`, {
      method: "PUT",
      body: JSON.stringify(obj),
      headers: {
        Authorization: `Token ${sessionStorage.getItem("user_token")}`,
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((response) => {
      if (response.status === 200) {
        response.json().then(function (result) {
          console.log(result);
          Swal.fire({
            title: `${result.title} has been ${
              result.is_active ? "activated" : "deactivated"
            }`,
            icon: "success",
          }).then((res) => {
            window.location.reload();
          });
          // window.location.reload();
        });
      } else {
        console.log(response);
      }
    });
  };

  const getUSerFullName = (id) => {
    if (authorData.length !== 0) {
      const author = authorData.filter((author) => {
        return author.id === id;
      });

      if (author.length !== 0 && userData.length !== 0) {
        const user = userData.filter(
          (users) => users.id === author[0].created_by
        );

        if (user.length !== 0) {
          return `${user[0].first_name} ${user[0].last_name}`;
        } else {
          return "N/A";
        }
      } else {
        return "N/A";
      }
    }
  };

  function randomColor() {
    let hex = Math.floor(Math.random() * 0xffffff);
    let color = "#" + hex.toString(16);

    return color;
  }

  const handleCourseTitle = (e) => {
    setCourseTitle(e.target.value);
  };

  const handlecourseCategory = (e) => {
    setCourseCategory(e.target.value);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (courseTitle && courseCategory) {
      fetch("http://127.0.0.1:8000/api/authors/", {
        method: "POST",
        body: JSON.stringify({ created_by: userId, editor: [userId] }),
        headers: {
          Authorization: `Token ${sessionStorage.getItem("user_token")}`,
          "Content-type": "application/json; charset=UTF-8",
        },
      }).then((response) => {
        if (response.status === 201) {
          response.json().then(function (result) {
            console.log("Author Post Api result", result);
            coursePostRequest(result.id);
          });
        } else {
          console.log(response);
        }
      });

      const coursePostRequest = (authorId) => {
        const obj = {
          title: courseTitle,
          description: `This is description for the ${courseTitle} course.`,
          category: [courseCategory],
          updated_by: userId,
          instructor: authorId,
        };

        fetch("http://127.0.0.1:8000/api/courses/", {
          method: "POST",
          body: JSON.stringify(obj),
          headers: {
            Authorization: `Token ${sessionStorage.getItem("user_token")}`,
            "Content-type": "application/json; charset=UTF-8",
          },
        }).then((response) => {
          if (response.status === 201) {
            response.json().then(function (result) {
              setCourseContent((pre) => [...pre, result]);
              setCourseCategory("");
              setCourseTitle("");
              // window.location.reload();
            });
          } else {
            console.log(response);
          }
        });
      };
    }
  };

  const getNumberOfUsers = (id) => {
    let totalUsers = 0;
    for (const team of teamData) {
      if (team.courses.includes(id)) {
        totalUsers += team.users.length;
      }
    }
    return totalUsers;
  };

  const handleDeleteCourse = (course, deleted) => {
    const courseAuthor = authorData.filter(
      (author) => author.id === course.instructor
    );
    if (
      +sessionStorage.getItem("user_id") === courseAuthor[0].created_by ||
      sessionStorage.getItem("role") === "admin"
    ) {
      let action = "";
      if (deleted) {
        action = "Delete";
      } else {
        action = "Restore";
      }
      Swal.fire({
        title: "Attention",
        text: `Do you want to ${action} this course?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: `${action}`,
      }).then((result) => {
        if (result.isConfirmed) {
          const obj = {
            title: course.title,
            is_updated: true,
            is_delete: deleted,
            category: course.category,
            updated_by: userId,
            instructor: course.instructor,
          };

          fetch(`http://127.0.0.1:8000/api/courses/${course.id}/`, {
            method: "PUT",
            body: JSON.stringify(obj),
            headers: {
              Authorization: `Token ${sessionStorage.getItem("user_token")}`,
              "Content-type": "application/json; charset=UTF-8",
            },
          }).then((response) => {
            if (response.status === 200) {
              response.json().then(function (result) {
                console.log("Api result Course: ", result);
                Swal.fire(
                  `${action}d!`,
                  `${course.title} has been ${action}d.`,
                  "success"
                ).then((res) => {
                  window.location.reload();
                });
                setCourseContent((pre) => [...pre, result]);
                setCourseCategory("");
                setCourseTitle("");
              });
            } else {
              console.log(response);
            }
          });
        }
      });
    } else {
      Swal.fire({
        icon: "warning",
        text: "You can't delete this course!",
      });
    }
  };

  const handleCourseContentData = (course) => {
    setSingleCourse(course);
    const obj = authorData.filter((author) => author.id === course.instructor);
    if (obj.length !== 0) {
      setCourseCoauthors(obj[0].editor);
      setCourseCreator(obj[0].created_by);
    }

    setCourseId(course.id);
    setCourseTitle(course.title);
    setCourseCategory(course.category);
    setInstructor(course.instructor);

    navigate(`/course/content/${course.id}`, {
      state: {
        courseContent,
        categoryData,
        userData,
        course,
        courseCoauthors,
      },
    });

    // setCourseStart(course.start_date)
    // setCourseEnd(course.end_date)
    // fetch(`http://127.0.0.1:8000/api/courses/${course.id}/modules`, {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Token ${sessionStorage.getItem("user_token")}`,
    //   },
    // }).then((response) => {
    //   if (response.status === 200) {
    //     response.json().then(function (result) {
    //       console.log("Api result: ", result);
    //       const obj = result.filter(module => {
    //         return module.is_delete === false
    //       })
    //       setModuleData(obj);

    //     });
    //   } else {
    //     console.log(response);
    //     setModuleData([]);
    //   }
    // });
  };

  const onHover = (e) => {
    setDescriptionHover(e.description)
    console.log("hovered");
  };

  const onHoverOver = (e) => {
    setDescriptionHover("")
    console.log("out");
  };

  return (
    <div className="">
      <div className="all-course-content pt-2">
        <div className="create-course-form">
          <div className="create-course-btn">
            <button
              type="button"
              className="btn btn-primary ms-3"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasRight"
              aria-controls="offcanvasRight"
              onClick={() => {
                setCourseTitle("");
                setCourseCategory("");
              }}
            >
              <i className="fas fa-solid fa-plus"></i> Add Course
            </button>

            {/* This is for Category panel */}

            <div className="create-course">
              <div
                className={`offcanvas offcanvas-end ${show}`}
                tabIndex="-1"
                id="offcanvasRight"
                aria-labelledby="offcanvasRightLabel"
              >
                <div className="offcanvas-header">
                  <h5 className="offcanvas-title" id="offcanvasRightLabel">
                    Add Course
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="offcanvas-body">
                  <div className="add-category-content">
                    <form onSubmit={(e) => e.preventDefault()}>
                      <label className="mb-0">
                        Title<span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={courseTitle}
                        onChange={handleCourseTitle}
                        required
                      />
                      <label className="mb-0 mt-1">
                        Category<span style={{ color: "red" }}>*</span>
                      </label>
                      <select
                        onChange={(e) => handlecourseCategory(e)}
                        value={courseCategory}
                        required
                      >
                        <option value="">--Select Category--</option>
                        {categoryData.length === 0 ||
                        categoryData.detail == "No objects found"
                          ? categoryData.detail
                          : categoryData &&
                            categoryData.map((category) => {
                              return (
                                <option value={category.id} key={category.id}>
                                  {category.title}
                                </option>
                              );
                            })}
                      </select>
                      <div className="category-save-btn">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={(e) => handleSave(e)}
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <CourseContent
                singleCourse={singleCourse}
                setSingleCourse={setSingleCourse}
                moduleData={moduleData}
                categoryData={categoryData}
                setModuleData={setModuleData}
                courseContent={courseContent}
                setCourseId={setCourseId}
                userData={userData}
                showContent={showContent}
                setShowContent={setShowContent}
              /> */}
        <div className="course-table-container">
          <table className="table table-striped ">
            <thead className="table-info">
              <tr>
                <th className="course-table-heading" style={{ width: "2%" }}>
                  #
                </th>
                <th className="course-table-heading">Course Title</th>
                <th className="course-table-heading course-table-heading-des">Description</th>
                <th className="course-table-heading">Author</th>
                <th className="course-table-heading">Users Enrolled</th>
                <th className="course-table-heading">Created</th>
                <th colSpan="2" className="course-table-heading">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {courseContent.length !== 0 &&
                courseContent.map((course, index) => {
                  let deletedCourse = "";
                  if (course.is_delete === true) {
                    deletedCourse = "course-delete";
                  }
                  return (
                    <tr
                      key={course.id}
                      role="button"
                      // data-bs-toggle="offcanvas"
                      // data-bs-target="#offcanvasCourse"
                      // aria-controls="offcanvasRight"
                      onClick={() => {
                        setShowContent("show");
                        handleCourseContentData(course);
                      }}
                    >
                      <td style={{ width: "3%", fontWeight: "bold" }}>
                        {index + 1}
                      </td>
                      <td
                        className={`deletedCourse} ${
                          deletedCourse && "deleteCourse-line"
                        } course-table-title-td`}
                      >
                        {console.log(
                          "type of course title",
                          course.title.length
                        )}
                        {course.title && course.title.length < 30
                          ? course.title
                          : course.title.slice(0, 30) + "..."}
                      </td>
                      <td
                        className={`${deletedCourse} course-table-heading-des`}
                        onMouseEnter={(e) => onHover(course)}
                        onMouseLeave={(e) => onHoverOver(course)}
                      >
                        {descriptionHover === course.description && descriptionHover}
                        {descriptionHover === course.description ? "": course.description && course.description.length < 35
                          ? course.description
                          : course.description.slice(0, 35) + "..."}
                      </td>
                      <td className={`${deletedCourse} course-table-author-td`}>
                        <Avatar
                          name={getUSerFullName(course.instructor)}
                          style={{
                            backgroundColor: randomColor(),
                          }}
                          className="me-1"
                          round={true}
                          size="30px"
                        ></Avatar>
                        {getUSerFullName(course.instructor)}
                      </td>
                      <td
                        className={`${deletedCourse} course-table-userEnrolled-td`}
                      >
                        {getNumberOfUsers(course.id)}
                      </td>
                      <td
                        className={`${deletedCourse} course-table-createdDate-td`}
                      >
                        {course.created_at}
                      </td>
                      <td className="" style={{ width: "2%" }}>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            checked={course.is_active}
                            value={course.is_active}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleVisibility(course);
                            }}
                            id="flexSwitchCheckDefault"
                          />
                        </div>
                      </td>
                      <td className="ps-0">
                        {course.is_delete ? (
                          <i
                            className="bi bi-recycle text-info"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCourse(course, false);
                            }}
                          ></i>
                        ) : (
                          <i
                            className="bi bi-trash text-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCourse(course, true);
                            }}
                          ></i>
                        )}

                        {/* <div className="form-check form-switch">
                          <input
                            className="form-check-input "
                            type="checkbox"
                            role="switch"
                            checked={visibility}
                            value={visibility}
                            onChange={handleVisibility}
                            id="flexSwitchCheckDefault"
                          />
                        </div> */}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllCourse;
