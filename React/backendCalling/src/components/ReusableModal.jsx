import React from "react";

const ReusableModal = ({ data, title }) => {
  const renderData = (obj) => {
    return Object.entries(obj).map(([key, value]) => {
      if (value !== null && typeof value === "object") {
        return (
          <div key={key} className="ms-3">
            <h6 className="mt-3 text-capitalize">
              {key}
            </h6>

            {renderData(value)}
          </div>
        );
      }

      return (
        <p key={key}>
          <strong className="text-capitalize">{key}:</strong> {value}
        </p>
      );
    });
  };

  return (
    <div
      className="modal fade"
      id="userModal"
      tabIndex="-1"
      aria-labelledby="userModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title" id="userModalLabel">
              {title}
            </h5>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {data ? renderData(data) : <p>No Data Available</p>}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReusableModal;