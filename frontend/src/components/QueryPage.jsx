import './QueryPage.css';
import { useState, useEffect } from 'react';
import { getVisitByDate, getActivitiesByVisit } from '../api/getters.js';
import DateDisplay from './DateDisplay.jsx';



function QueryPage() {

    const storedUserId = localStorage.getItem('userId');

    const [dateDisplay, setDateDisplay] = useState("");
    const [selectedVisit, setSelectedVisit] = useState("");
    // const [selectedVisitId, setSelectedVisitId] = useState("");
    const [activities, setActivities] = useState([]);



    useEffect(() => {
        const showDate = async () => {

            let visitDate = localStorage.getItem("visitDate")

            if (visitDate === null) {
                setDateDisplay("No date selected");
            }
            else {
                setSelectedVisit(visitDate);
                setDateDisplay(formatDateForDisplay(visitDate));
            }
        };

        showDate();
    }, []);


    useEffect(() => {
        const loadActivities = async () => {
            // console.log("Selected visit ID:", selectedVisitId);
            let visitId = localStorage.getItem("visitId");
            console.log("Visit ID from localStorage:", visitId);
            try {
                const fetchedActivities = await getActivitiesByVisit(visitId);
                setActivities(fetchedActivities);
                console.log("Response from getActivitiesByVisit:", fetchedActivities);

                if (fetchedActivities.length === 0) {
                    alert("No activities found for this date. Please add activities first.");
                }
            }
            catch (error) {
                console.error("Failed to get activities:", error);
            }

        };

        loadActivities();
    }, []);



    const formatDateForDisplay = (dateString) => {
        const date = new Date(dateString);

        // increment the day because JS will parse it as UTC
        // and UTC at midnight is a day ahead of EST
        date.setUTCDate(date.getUTCDate() + 1);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };


    const handleChangeDate = async (e) => {
        e.preventDefault();
        try {
            const response = await getVisitByDate(storedUserId, selectedVisit);
            if (response === 0) {
                alert("Visit not found. Please pick a different date or add a new visit.")
            }
            else {
                localStorage.setItem("visitDate", selectedVisit)
                localStorage.setItem("visitId", response)
                // setSelectedVisitId(response);
                window.location.reload(0);
            }
            console.log("Response from getVisitByDate:", response);
        }
        catch (error) {
            console.error("Failed to change date:", error);
        }
    };

    const formatTimeForDisplay = (timeString) => {

        // get hours and minutes
        let [h, m] = timeString.split(":").map(Number);
        const p = h >= 12 ? "PM" : "AM";

        // convert hour to 12-hour format
        h = h % 12 || 12;

        // create a new string with the formatted time
        let formattedTime = `${h}:${String(m).padStart(2, "0")} ${p}`;
        return formattedTime;
    };


    return (
        <>
            <div className="wrapper">
                <div className="my-forms">
                    <div className="title">
                        <div className="line-1">Showing activities for:</div>
                        <DateDisplay />
                    </div>

                    <div className="activities-list">
                        <ul>
                            {activities
                                .sort((a, b) => a.timeOfDay.localeCompare(b.timeOfDay))
                                .map((a) => (

                                    <li key={a.id}>
                                        <span className="activity-label">Time:</span> <span className="activity-value">{formatTimeForDisplay(a.timeOfDay)}</span> <br />
                                        <span className="activity-label">Name:</span> <span className="activity-value">{a.attraction.name}</span> <br />
                                        <span className="activity-label">Wait time:</span> <span className="activity-value">{a.waitTime}</span> <br />
                                        {a.meal ? (
                                            <><span className="activity-label">Food items:</span><span> </span>
                                                <span className="activity-value">
                                                    {a.meal.foodItems.map(item => item.name).join(", ")}
                                                </span> <br />
                                                <span className="activity-label">Rating:</span> <span className="activity-value">{a.meal.rating}/10</span> <br />
                                            </>
                                        ) : a.attraction?.type === "ride" ? (
                                            <>
                                                {a.frontRow !== null && a.frontRow !== undefined && (
                                                    <>
                                                        <span className="activity-label">Front row:</span> <span className="activity-value">{a.frontRow ? "Yes" : "No"}</span> <br />
                                                    </>
                                                )}
                                            </>
                                        ) : null}
                                        {a.comments && (
                                            <>
                                                <span className="activity-label">Comments:</span> <span className="activity-value">{a.comments}</span> <br />
                                            </>
                                        )}
                                        <br />
                                    </li>
                                ))}
                        </ul>

                    </div> {/* end activities-list */}

                </div> {/* end my-forms */}
            </div> {/* end wrapper */}
        </>
    );
};

export default QueryPage;