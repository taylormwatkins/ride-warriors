import { useState, useEffect } from 'react';
import { getVisitByDate, getActivitiesByVisit } from '../api/getters.js';



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
                alert("Changing date...")
                window.location.reload(0);
            }
            console.log("Response from getVisitByDate:", response);
        }
        catch (error) {
            console.error("Failed to change date:", error);
        }
    };




    return (
        <>
            <div className="wrapper">
                <div className="my-forms">

                    <form onSubmit={handleChangeDate}>
                        <div className="title">Select visit</div>
                        <input
                            className="weather-input"
                            type="date"
                            value={selectedVisit}
                            onChange={(e) => setSelectedVisit(e.target.value)}
                        />
                        <button type="submit">Set date</button> <br />
                        <div className="title">
                            <div className="date-display">
                                <div className="line-1">Showing activities for:</div>
                                <div className="line-2">
                                    {dateDisplay}
                                </div>
                            </div>
                        </div>

                        <div className="activities-list">
                            <ul>
                                {activities
                                    .sort((a, b) => a.timeOfDay.localeCompare(b.timeOfDay))
                                    .map((a) => (

                                        <li key={a.id}>
                                            Time: {a.timeOfDay} <br />
                                            Name: {a.attraction.name} <br />
                                            Wait time: {a.waitTime} <br />
                                            {a.meal ? (
                                                <>
                                                    {a.meal.foodItems.map(item => item.name).join(", ")} <br />
                                                    Rating: {a.meal.rating}/10 <br />
                                                </>
                                            ) : (
                                                <>
                                                    {a.frontRow !== null && a.frontRow !== undefined && (
                                                        <>Front Row: {a.frontRow ? "Yes" : "No"}  </>
                                                    )} <br />
                                                </>
                                            )}
                                            {a.comments ? (
                                                <> Comments: {a.comments} <br /> </>
                                            ) : (
                                                <></>
                                            )} 
                                            <br />
                                        </li> 
                                    ))} 
                            </ul>

                        </div>

                    </form>
                </div> {/* end my-forms */}
            </div> {/* end wrapper */}
        </>
    );
};

export default QueryPage;