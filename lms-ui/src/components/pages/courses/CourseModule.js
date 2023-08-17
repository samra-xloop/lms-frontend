import React, { useState } from "react";
import LeasonForm from "./LeasonForm";

const Module = ({ setModuleData, setShowModule, minDate }) => {
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleStart, setModuleStart] = useState("");
  const [moduleEnd, setModuleEnd] = useState("");

  const [unitData, setUnitData] = useState([]);

  const [showUnit, setShowUnit] = useState(false);

  const handleModuleTitle = (e) => {
    setModuleTitle(e.target.value);
  };
  const handleModuleStart = (e) => {
    setModuleStart(e.target.value);
  };
  const handleModuleEnd = (e) => {
    setModuleEnd(e.target.value);
  };

  const handleAddModule = (e) => {
    setModuleData((pre) => [
      ...pre,
      { moduleTitle, moduleStart, moduleEnd, unitData },
    ]);
    setModuleTitle("");
    setModuleStart("");
    setModuleEnd("");
    setShowModule((pre) => !pre);
  };
  return (
    <div>
      <div className="course-module">
        <form className="course-module-form">
          <div className="module-title">
            <label>Module Name</label>
            <input
              type="text"
              placeholder="Module Title"
              value={moduleTitle}
              onChange={handleModuleTitle}
            />
          </div>
          <div className="module-start">
            <label>Module Start Date</label>
            <input
              type="date"
              placeholder="Start Date"
              value={moduleStart}
              min={minDate}
              onChange={handleModuleStart}
            />
          </div>
          <div className="module-end">
            <label>Module End Date</label>
            <input
              type="date"
              placeholder="End Date"
              value={moduleEnd}
              max="2030-12-30" 
              min={minDate}
              onChange={handleModuleEnd}
            />
          </div>
        </form>
        <button
          type="button"
          className="btn btn-secondary w-50"
          onClick={() => setShowUnit(!showUnit)}
        >
          Add Unit
        </button>
        {showUnit && (
          <LeasonForm
            setUnitData={setUnitData}
            handleAddModule={handleAddModule}
          />
        )}
      </div>
    </div>
  );
};

export default Module;