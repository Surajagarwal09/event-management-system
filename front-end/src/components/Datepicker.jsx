import React, { useEffect, useRef, useState } from "react";
import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";
import localeEn from "air-datepicker/locale/en";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import "../css/CustomDatePicker.css";

const CustomDatePicker = ({ date, setDate }) => {
  const inputRef = useRef(null);
  const datepickerRef = useRef(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    datepickerRef.current = new AirDatepicker(inputRef.current, {
      locale: localeEn,
      dateFormat: "dd-MM-yyyy",
      autoClose: true,
      isMobile: false,
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
      onShow() {
        setIsPickerOpen(true);
      },
      onHide() {
        setIsPickerOpen(false);
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
        required
      />
      <FontAwesomeIcon
        icon={faCalendarDay}
        onClick={handleClick}
        className="fontc-icon"
      />
      {isPickerOpen && (
        <div
          className="datepicker-overlay"
          onClick={() => {
            datepickerRef.current.hide();
          }}
        ></div>
      )}
    </div>
  );
};

export default CustomDatePicker;
