import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getVisitByDate, getVisitsByUser } from "../api/getters";
import { useState, useEffect } from "react";
import './forms.css';
import './DateDisplay.css';

function DateDisplay() {
    const storedUserId = localStorage.getItem('userId');
    const [dateDisplay, setDateDisplay] = useState("");
    const [newVisitDate, setNewVisitDate] = useState(null);
    const [calendarDisplay, setCalendarDisplay] = useState(false);
    const [visitDates, setVisitDates] = useState([]);
    const [isDisabled, setIsDisabled] = useState(true);
    const visitDate = localStorage.getItem("visitDate")


    // change the date to the format javascript likes
    // const formatDate = (date) => date.toISOString().split("T")[0];


    useEffect(() => {
        const showDate = async () => {

            if (visitDate === null) {
                setDateDisplay("No date set");
            }
            else {
                setNewVisitDate(visitDate);
                console.log("Visit date from localStorage:", visitDate);
                setDateDisplay(formatDateForDisplay(visitDate));
            }
        };

        showDate();
    }, []);


    useEffect(() => {
        const fetchVisits = async () => {
            try {

                const fetchedVisits = await getVisitsByUser(storedUserId)
                console.log("Fetched visits:", fetchedVisits);
                // get the dates from the visit objects
                setVisitDates(fetchedVisits.map(visit => visit.date));


            } catch (error) {
                console.error("Failed to fetch visits:", error);
            }
        }

        fetchVisits();
    }, []);


    const formatDateForDisplay = (dateString) => {
        const date = new Date(dateString);

        console.log("Date object:", date);

        // increment the day because JS will parse it as UTC
        // and UTC at midnight is a day ahead of EST
        date.setUTCDate(date.getUTCDate() + 1);

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatDateString = (dateString) => {
        const date = new Date(dateString);
        // increment the day because JS will parse it as UTC
        // and UTC at midnight is a day ahead of EST
        date.setUTCDate(date.getUTCDate() + 1);
        return date;
    }


    const toggleCalendarDisplay = () => {
        setCalendarDisplay(!calendarDisplay);
    };

    const enableChangeButton = () => {
        setIsDisabled(false);
    };


    // account for the timezone difference when formatting the date
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const handleChangeDate = async () => {
        try {
            console.log("visitdate:", newVisitDate);

            const response = await getVisitByDate(storedUserId, newVisitDate);

            if (response === 0) {
                alert("Visit not found. Please pick a different date or add a new visit.")
            }
            else {
                localStorage.setItem("visitDate", newVisitDate)
                localStorage.setItem("visitId", response);
                setTimeout(() => {
                    window.location.reload(0);
                }, 1000);
            }
        }
        catch (error) {
            console.error("Failed to change date:", error);
        }

    };

    return (
        <>

            <div className="date-display">
                {dateDisplay}
                <button onClick={toggleCalendarDisplay} className="smaller-btn">Change</button>
            </div>

            {calendarDisplay && (
                <div className="date-display">
                    <DatePicker
                        className="calendar-input"
                        selected={newVisitDate ? formatDateString(newVisitDate) : null}
                        onChange={(date) => {
                            setNewVisitDate(formatDate(date));
                            enableChangeButton();
                        }}
                        filterDate={(date) => visitDates.includes(formatDate(date))}
                    />
                    <button
                        disabled={isDisabled}
                        onClick={handleChangeDate}
                        className="smaller-btn"
                    >
                        Set Date</button>
                </div>
            )}
        </>
    );
}

export default DateDisplay;


