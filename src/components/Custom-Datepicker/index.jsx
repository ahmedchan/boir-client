/* eslint-disable react/prop-types */
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "./index.css"
import InputMask from "react-input-mask"
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md"


const CustomDatePicker = (props) => {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
  ]
  return (
    <>
      <DatePicker
        customInput={<InputMask type="text" mask="99/99/9999" />}
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled
        }) => (
          <div className="input-group input-group-sm input-group-calender">
            <div className="input-group-prepend">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  decreaseMonth()
                }}
                disabled={prevMonthButtonDisabled}
                className="btn btn-link btn-sm"
                type="button"
              >
                <MdArrowBackIos />
              </button>
            </div>

            <input
              type="number"
              onChange={({ target: { value } }) => changeYear(value)}
              value={date.getFullYear()}
              className="form-control"
              placeholder=""
              aria-label=""
              aria-describedby="basic-addon1"
            />
            <select
              className="form-control"
              value={months[date.getMonth()]}
              onChange={({ target: { value } }) =>
                changeMonth(months.indexOf(value))
              }
            >
              {months.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="input-group-append">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  increaseMonth()
                }}
                className="btn btn-link btn-sm"
                disabled={nextMonthButtonDisabled}
              >
                <MdArrowForwardIos />
              </button>
            </div>
          </div>
        )}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 48 48"
          >
            <mask id="ipSApplication0">
              <g
                fill="none"
                stroke="#fff"
                strokeLinejoin="round"
                strokeWidth="4"
              >
                <path strokeLinecap="round" d="M40.04 22v20h-32V22"></path>
                <path
                  fill="#fff"
                  d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
                ></path>
              </g>
            </mask>
            <path
              fill="currentColor"
              d="M0 0h48v48H0z"
              mask="url(#ipSApplication0)"
            ></path>
          </svg>
        }
        wrapperClassName={props.wrapperClassName}
        className={`form-control ${props.isInvalid ? "is-invalid" : ""}`}
        dateFormat="dd/MM/yyyy"
        minDate={false}
        selected={props.selected}
        onChange={props.onChange}
      />
    </>
  )
}

export default CustomDatePicker
