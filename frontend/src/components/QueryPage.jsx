import './QueryPage.css';
import { useState, useEffect } from 'react';
import { getVisitByDate, getActivitiesByVisit } from '../api/getters.js';
import DateDisplay from './DateDisplay.jsx';



function QueryPage() {

    const storedUserId = localStorage.getItem('userId');

    // const [selectedVisitId, setSelectedVisitId] = useState("");
    const [activities, setActivities] = useState([]);
    const [coasters, setCoasters] = useState([]);
    const [rides, setRides] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [others, setOthers] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState({});  

    const [loadingMessage, setLoadingMessage] = useState("Loading...");





    useEffect(() => {
        const loadActivities = async () => {
            // console.log("Selected visit ID:", selectedVisitId);
            let visitId = localStorage.getItem("visitId");
            console.log("Visit ID from localStorage:", visitId);
            try {
                setLoadingMessage("Loading...");
                const fetchedActivities = await getActivitiesByVisit(visitId);
                setActivities(fetchedActivities);
                sortActivities(fetchedActivities);
                console.log("Response from getActivitiesByVisit:", fetchedActivities);

                if (fetchedActivities.length === 0) {
                    setLoadingMessage("No activities found for this date");
                    return;
                }
            }
            catch (error) {
                console.error("Failed to get activities:", error);
            }
            setLoadingMessage("");

        };

        loadActivities();
    }, []);


    const sortActivities = (activities) => {
        setCoasters(activities.filter(a => a.attraction?.type === "coaster"));
        setRides(activities.filter(a => a.attraction?.type === "ride"));    
        setRestaurants(activities.filter(a => a.attraction?.type === "restaurant"));
        setOthers(activities.filter(a => a.attraction?.type === "other"));

    }

    

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
                    <div className="activity-summary">
                    {loadingMessage}
                        <h3>Total activities: {activities.length}</h3>
                        <h3><button className="query-btn">Coasters</button> {coasters.length} | 
                        <button className="query-btn">Rides</button> {rides.length}<br/>
                        <button className="query-btn">Restaurants</button> {restaurants.length} | 
                        <button className="query-btn">Other</button> {others.length}</h3>
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
                                        ) : a.attraction?.type === "coaster" ? (
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