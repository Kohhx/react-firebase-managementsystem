import React, { useState, useEffect } from "react";
import "./Calendar.css";
import moment from "moment";
import { GrCaretNext } from "react-icons/gr";
import { GrCaretPrevious } from "react-icons/gr";
import { useFirestoreImage } from "../hooks/useFirestoreImage";
import { useAuthContext } from "../hooks/useAuthContext";

const Calendar = ({ options }) => {
  const { user } = useAuthContext();
  const [images, setImages] = useState([]);
  const { addImageDocument, getAllImages, isPending, deleteImage } =
    useFirestoreImage(user.uid, "images");
  const [imagesLength, setImagesLength] = useState(-1);

  useEffect(() => {
    getAllImages().then((data) => {
      setImages(data);
      setImagesLength(data.length);
    });
  }, []);

  // Get date of images
  // console.log(moment(images[0].imgDate.toDate()).format("YYYY-MM-DD"));

  // Create a hash table of images
  const imagesHash = {};
  images.forEach((image) => {
    const date = moment(image.imgDate.toDate()).format("YYYY-MM-DD");
    if (!imagesHash[date]) {
      imagesHash[date] = [];
    }
    imagesHash[date] = [...imagesHash[date], image];
  });

  const [calendar, setCalendar] = useState({
    cal: moment(),
    allDaysDisplay: [],
    currentMonth: moment().format("MMMM"),
    selectedDate: moment().format("YYYY-MM-DD"),
  });

  // Get all days of the week Sun, mon, tue, wed, thu, fri, sat
  const weekdayshort = moment.weekdaysShort();
  const monthshort = moment.monthsShort();


  const next = () => {
    setCalendar({
      ...calendar,
      cal: calendar.cal.add(1, "month"),
      currentMonth: moment().format("MMMM"),
    });
  };

  const previous = () => {
    setCalendar({
      ...calendar,
      cal: calendar.cal.subtract(1, "month"),
      currentMonth: moment().format("MMMM"),
    });
  };

  const getMonth = () => {
    return calendar.cal.startOf("month").format("MMM");
  };

  const getFirstDayOfMonth = () => {
    return calendar.cal.startOf("month").format("d");
  };

  const setBlanks = () => {
    let blank = [];
    for (let i = 0; i < getFirstDayOfMonth(); i++) {
      blank.push(<td className="calendar-day empty">{""}</td>);
    }
    return blank;
  };

  const buildDayClass = (day) => {
    const dayClass = ["cursor-pointer"];
    if (
      moment().format("YYYY") === calendar.cal.format("YYYY") &&
      moment().format("MM") === calendar.cal.format("MM") &&
      day === parseInt(moment().format("DD")) &&
      options.showToday
    ) {
      dayClass.push("today");
    }

    const selectedDateArr = calendar.selectedDate.split("-");
    if (
      calendar.cal.format("YYYY") === selectedDateArr[0] &&
      calendar.cal.format("MM") === selectedDateArr[1] &&
      day === parseInt(selectedDateArr[2])
    ) {
      dayClass.push("day-selected");
    }
    return dayClass.join(" ");
  };

  const setDays = () => {
    let daysInMonth = [];
    for (let d = 1; d <= calendar.cal.daysInMonth(); d++) {
      const thisMonth = parseInt(calendar.cal.format("M"));
      const thisYear = parseInt(calendar.cal.format("YYYY"));
      console.log("thisMonth", thisMonth-1)
      const thisDate = moment().set({'month': thisMonth-1, 'date': d, 'year': thisYear}).format("YYYY-MM-DD");
      daysInMonth.push(
        <td
          key={d}
          onClick={() => {
            setCalendar({
              ...calendar,
              currentMonth: moment().format("MMMM"),
              selectedDate: thisDate,
            });
          }}
        >
          <span className={buildDayClass(d)}>{d}</span>
          <div className="cell-images">
            {imagesHash[thisDate] &&
              imagesHash[thisDate].length > 0 &&
              imagesHash[thisDate].map((image) => {
                return <img src={image.imgUrl} alt="" />;
              })}
          </div>
        </td>
      );
    }
    return daysInMonth;
  };

  const setFullDays = () => {
    return [...setBlanks(), ...setDays()];
  };

  // Create the header of the calendar
  const weekdayshortDisplay = weekdayshort.map((day) => <th>{day}</th>);

  // Create days display
  const setDaysDisplay = (options) => {
    let dayStore = [];
    let daysDisplay = [];
    setFullDays().forEach((day, index) => {
      if ((index + 1) % 7 === 0) {
        dayStore.push(day);
        daysDisplay.push(<tr>{dayStore.map((day) => day)}</tr>);
        dayStore = [];
      } else {
        dayStore.push(day);
      }
    });
    daysDisplay.push(<tr>{dayStore.map((day) => day)}</tr>);
    return daysDisplay;
  };

  return (
    <div className="min-w-[800px] calendar-container">
      {calendar.selectedDate}
      <div className="flex items-center mx-auto border text-center p-3 bg-slate-400 text-white calendar-header">
        <GrCaretPrevious className="cursor-pointer" onClick={previous} />
        <span className="mx-auto">
          {calendar.cal.format("MMMM")}, {calendar.cal.format("YYYY")}
        </span>
        <GrCaretNext className="cursor-pointer" onClick={next} />
      </div>

      <table className="w-full">
        <thead>{weekdayshortDisplay}</thead>
        <tbody>{setDaysDisplay()}</tbody>
      </table>
    </div>
  );
};

export default Calendar;
