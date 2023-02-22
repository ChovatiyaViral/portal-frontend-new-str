import React from "react";
import { useDispatch } from "react-redux";
import { setCurrentView } from "../../../../store/Auth/auth.actions";
import ErrorBoundary from "../../../UIComponents/ErrorBoundary";

/**
 * Renders Transport Jobs component
 */
const TransportJobs = (props) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setCurrentView("Transport Jobs"));
  }, []);

  return (
    <>
      <div className="bg-white p-4 table-responsive-padding border-radius-12">
        <ErrorBoundary>
          <>Coming Soon</>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default TransportJobs;
