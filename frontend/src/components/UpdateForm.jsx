import './UpdateForm.css';
import { useState, useEffect, act } from 'react';
import { getVisitByDate, getVisitById, getActivitiesByVisit } from '../api/getters.js';
import DateDisplay from './DateDisplay.jsx';
import EditActivityModal from './EditActivityModal.jsx';
import { all } from 'axios';



function UpdateForm() {

    const storedUserId = localStorage.getItem('userId');

    // const [selectedVisitId, setSelectedVisitId] = useState("");
    const [activities, setActivities] = useState([]);
    const [coasters, setCoasters] = useState([]);
    const [rides, setRides] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [others, setOthers] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [allActivities, setAllActivities] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activityBeingEdited, setActivityBeingEdited] = useState(null);
    const [weather, setWeather] = useState(null);



    const [loadingMessage, setLoadingMessage] = useState("Loading...");





    useEffect(() => {
        const loadActivities = async () => {
            // console.log("Selected visit ID:", selectedVisitId);
            let visitId = localStorage.getItem("visitId");
            console.log("Visit ID from localStorage:", visitId);
            try {
                setLoadingMessage("Loading...");
                const fetchedActivities = await getActivitiesByVisit(visitId);
                const visitWeather = await getVisitById(visitId);
                setWeather(visitWeather);
                setActivities(fetchedActivities);
                setAllActivities(fetchedActivities);
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
        // filter activities by type
        // this is really just for the counts at the top
        setCoasters(activities.filter(a => a.attraction?.type === "coaster"));
        setRides(activities.filter(a => a.attraction?.type === "ride"));
        setRestaurants(activities.filter(a => a.attraction?.type === "restaurant"));
        setOthers(activities.filter(a => a.attraction?.type === "other"));
    }


    const handleTypeChange = async (type) => {

        setLoadingMessage("Loading...");

        // check if the type is already selected
        const isSelected = selectedTypes.includes(type);

        // add or remove type from the array
        const updatedTypes = isSelected
            ? selectedTypes.filter(t => t !== type) // remove it
            : [...selectedTypes, type];             // add it

        setSelectedTypes(updatedTypes);

        const filtered = allActivities.filter(a =>
            updatedTypes.includes(a.attraction?.type)
        );

        setActivities(filtered);
        if (filtered.length === 0) {
            setActivities(allActivities);
            // reset to all activities if no types are selected
        }
        setLoadingMessage("");

    };

    const handleUpdateActivity = (updatedActivity) => {
        setActivities(prev =>
            prev.map(a => (a.id === updatedActivity.id ? updatedActivity : a))
        );
    };


    const handleDeleteActivity = (activityId) => {
        setActivities(prev => prev.filter(a => a.id !== activityId));
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
                    <div className="weather-summary">
                {weather && (
                    <>
                    <h2>Weather</h2>
                    <span className="weather-label">Temperature:</span> <span className="weather-value">{weather.temperature}°F</span> <br/>
                    <span className="weather-label">Humidity:</span> <span className="weather-value">{weather.humidity}%</span> <br/>
                    <span className="weather-label">Wind speed:</span> <span className="weather-value">{weather.windSpeed}</span> <br/>
                    <span className="weather-label">UV Index:</span> <span className="weather-value">{weather.uvIndex}</span> <br/>
                    <span className="activity-label">Rain:</span> <span className="activity-value">{weather.rain ? "Yes" : "No"}</span> <br />


                    </>
                )}
                    </div>
                    <div className="activity-summary">
                        {loadingMessage}
                        <h3>Activities: {activities.length}</h3>
                        <h3><button
                            className={(selectedTypes.includes("coaster")) ? "selected-query-btn" : "query-btn"}


                            onClick={() => handleTypeChange("coaster")}
                        >Coasters</button> {coasters.length} |
                            <button
                                className={(selectedTypes.includes("ride")) ? "selected-query-btn" : "query-btn"}

                                onClick={() => handleTypeChange("ride")}
                            >Rides</button> {rides.length}<br />
                            <button
                                className={(selectedTypes.includes("restaurant")) ? "selected-query-btn" : "query-btn"}

                                onClick={() => handleTypeChange("restaurant")}
                            >Restaurants</button> {restaurants.length} |
                            <button
                                className={(selectedTypes.includes("other")) ? "selected-query-btn" : "query-btn"}

                                onClick={() => handleTypeChange("other")}
                            >Other</button> {others.length}</h3>
                    </div>


                    <div className="activities-list">
                        <ul>
                            {activities
                                .sort((a, b) => a.timeOfDay.localeCompare(b.timeOfDay))
                                .map((a) => (

                                    <li key={a.id}>
                                        <span className="activity-label">Time:</span> <span className="activity-value">{formatTimeForDisplay(a.timeOfDay)}</span>
                                        <button className="edit-btn"
                                            onClick={() => {
                                                setActivityBeingEdited(a);
                                                setIsModalOpen(true);
                                            }}
                                        >edit</button><br />
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
                                    </li>
                                ))}
                        </ul>


                    </div> {/* end activities-list */}

                </div> {/* end my-forms */}
            </div> {/* end wrapper */}

            {isModalOpen && activityBeingEdited && (
                <EditActivityModal
                    activity={activityBeingEdited}
                    attractionId={activityBeingEdited.attraction.id}
                    onClose={() => setIsModalOpen(false)}
                    onUpdate={handleUpdateActivity}
                    onDelete={handleDeleteActivity}
                />
            )}
        </>
    );
};

export default UpdateForm;


