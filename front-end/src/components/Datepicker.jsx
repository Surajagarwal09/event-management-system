import React, { useEffect, useRef } from "react";
import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";
import localeEn from "air-datepicker/locale/en";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import "../css/CustomDatePicker.css";

const CustomDatePicker = ({ date, setDate }) => {
  const inputRef = useRef(null);
  const datepickerRef = useRef(null);

  useEffect(() => {
    datepickerRef.current = new AirDatepicker(inputRef.current, {
  locale: localeEn,
  dateFormat: "yyyy-MM-dd",
  autoClose: true,
  isMobile: true,
  selectedDates: date ? [date] : [],
  buttons: [
    {
      content: "Today",
      className: "custom-today-btn",
      onClick: (dp) => {
        const today = new Date();
        dp.selectDate(today);
        setDate(today);
        dp.hide();
      },
    },
    "clear",
  ],
  onSelect({ date }) {
    setDate(date);
  },
});


    return () => datepickerRef.current?.destroy?.();
  }, [setDate]);

   const handleClick = () => {
    if (datepickerRef.current) {
      datepickerRef.current.show(); 
    }
  };

  return (
    <div className="datepicker-wrapper">
      <input
        type="text"
        ref={inputRef}
        placeholder="dd-mm-yyyy"
        readOnly
        className="custom-datepicker-input"
      />
      <FontAwesomeIcon
        icon={faCalendarDay}
        onClick={handleClick}
        className="fontc-icon"
      />
    </div>
  );
};

export default CustomDatePicker;
