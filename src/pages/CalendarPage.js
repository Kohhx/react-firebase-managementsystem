import React from "react";
import Calendar from "../components/Calendar";

const CalendarPage = () => {
  return (
    <div className="w-[80%] mt-10 mb-10 mx-auto">
      <Calendar
        options={{
          showToday: true,
        }}
      />
    </div>
  );
};

export default CalendarPage;
