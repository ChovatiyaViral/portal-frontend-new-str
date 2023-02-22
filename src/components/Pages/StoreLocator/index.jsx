import React from "react";
import AddNewStore from "./addNewStore";
import { useDispatch } from "react-redux";
import { setCurrentView } from "../../../store/Auth/auth.actions";

const StoreLocator = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setCurrentView("Add New Store"));
  }, []);

  return (
    <>
      {/* <Heading text="Add New Store" variant="h4"/> */}
      <div className="bg-white p-4">
        <AddNewStore/>
      </div>
    </>
  );
}

export default StoreLocator;
