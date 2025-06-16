import './UpdateForm.css';
import { useState, useEffect } from 'react';
import { getVisitById, getActivitiesByVisit } from '../api/getters.js';
import { updateVisit } from '../api/update';
import DateDisplay from './DateDisplay.jsx';
import EditActivityModal from './EditActivityModal.jsx';



function UpdateForm() {

    const storedUserId = localStorage.getItem('userId');
    const visitId = localStorage.getItem("visitId");

    const [activities, setActivities] = useState([]);
    const [coasters, setCoasters] = useState([]);
    const [rides, setRides] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [others, setOthers] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [allActivities, setAllActivities] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activityBeingEdited, setActivityBeingEdited] = useState(null);
    const [weather, setWeather] = useState("");
    const [weatherEdit, setWeatherEdit] = useState(false);
    const [dataUpdated, setDataUpdated] = useState(false);


    const [loadingMessage, setLoadingMessage] = useState("Loading...");



    useEffect(() => {
        const loadActivities = async () => {
            // console.log("Selected visit ID:", selectedVisitId);
            console.log("Visit ID from localStorage:", visitId); 
            if (visitId === null) {
                setLoadingMessage("Date not set! Set a date to view activities");
                return;
            }
            try {
                setLoadingMessage("Loading...");
                const fetchedActivities = await getActivitiesByVisit(visitId);
                const visitWeather = await getVisitById(visitId);
                setWeather(visitWeather);
                setActivities(fetchedActivities);
                setWeatherEdit(false);
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
    }, [dataUpdated]);


    const calculateAvgWaitTimes = (activities) => {
        if (!activities || activities.length === 0) return "";

        // grab the wait times
        const waitTimes = activities
            // filter valid wait times
            .filter(activity => typeof activity.waitTime === 'number')
            .map(activity => activity.waitTime);

        if (waitTimes.length === 0) return "";

        // calculate average
        const total = waitTimes.reduce((sum, time) => sum + time, 0);
        const avg = Math.round(total / waitTimes.length); // round to nearest minute
        return avg === 0 ? "" : `Average wait: ${avg}m`;
    }


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
        setDataUpdated(prev => !prev); // trigger re-fetch

    };


    const handleDeleteActivity = (activityId) => {
        setActivities(prev => prev.filter(a => a.id !== activityId));
    };

    const toggleWeatherEdit = () => {
        setWeatherEdit(!weatherEdit);
    };

    const handleSaveVisit = async () => {
        console.log("visitId:", visitId, typeof visitId);
        console.log("edited weather:", weather);
        try {
            const updated = await updateVisit(weather, visitId);

            if (updated) {
                alert("visit updated successfully!");

            } else {
                alert("error updating visit");
            }


        } catch (error) {
            console.error("Failed to update visit:", error);
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
                        <h3>{loadingMessage}</h3>
                    </div>

                    <hr />
                    <div className="weather-summary">
                        <h2>Weather</h2>


                        {weatherEdit ? (
                            <div className="weather-edit">

                                <button className="cancel-btn"
                                    onClick={() => {
                                        toggleWeatherEdit();
                                    }}>cancel</button>

                                <button className="edit-btn"
                                    onClick={() => {
                                        toggleWeatherEdit();
                                        handleSaveVisit();
                                    }}>save</button><br />

                                <span className="weather-label">Temperature:</span>
                                <input
                                    className="input"
                                    type="number"
                                    value={weather.temperature}
                                    onChange={(e) => setWeather({ ...weather, temperature: e.target.value })}
                                />°F<br />

                                <span className="weather-label">Humidity:</span>
                                <input
                                    className="input"
                                    type="number"
                                    value={weather.humidity}
                                    onChange={(e) => setWeather({ ...weather, humidity: e.target.value })}
                                />%<br />

                                <span className="weather-label">Wind speed:</span>
                                <input
                                    className="input"
                                    type="number"
                                    value={weather.windSpeed}
                                    onChange={(e) => setWeather({ ...weather, windSpeed: e.target.value })}
                                />mph<br />

                                <span className="weather-label">UV Index:</span>
                                <input
                                    className="input"
                                    type="number"
                                    value={weather.uvIndex}
                                    onChange={(e) => setWeather({ ...weather, uvIndex: e.target.value })}
                                /><br />

                                <label className="checkbox-container">Rain?
                                    <input
                                        type="checkbox"
                                        checked={weather.rain}
                                        onChange={(e) => setWeather({ ...weather, rain: e.target.checked })}
                                    />
                                    <span className="checkmark"></span>
                                </label><br />
                            </div>
                        ) : (

                            <>
                                <button className="edit-btn" onClick={() => { toggleWeatherEdit() }}>edit</button><br />
                                <span className="weather-label">Temperature:</span> <span className="weather-value">{weather.temperature}°F</span> <br />
                                {weather.humidity && (
                                    <>
                                        <span className="weather-label">Humidity:</span> <span className="weather-value">{weather.humidity}%</span> <br />
                                    </>
                                )}
                                {weather.windSpeed && (
                                    <>
                                        <span className="weather-label">Wind speed:</span> <span className="weather-value">{weather.windSpeed}</span> <br />
                                    </>
                                )}
                                {weather.uvIndex && (
                                    <>
                                        <span className="weather-label">UV Index:</span> <span className="weather-value">{weather.uvIndex}</span> <br />
                                    </>
                                )}
                                <span className="activity-label">Rain:</span> <span className="activity-value">{weather.rain ? "Yes" : "No"}</span> <br />
                            </>
                        )}
                    </div>
                    <hr />
                    <div className="activity-summary">
                        <h3>
                            Coasters | {coasters.length} |{calculateAvgWaitTimes(coasters)}<br />
                            Rides | {rides.length} | {calculateAvgWaitTimes(rides)}<br />
                            Restaurants | {restaurants.length} | {calculateAvgWaitTimes(restaurants)}<br />
                            Other | {others.length} | {calculateAvgWaitTimes(others)}<br />
                        </h3>
                        <h3>Total activities: {allActivities.length} <br />{calculateAvgWaitTimes(allActivities)}</h3>


                        <h3>Filter by type:</h3>
                        <div className="filter-buttons">
                            <button
                                className={selectedTypes.includes("coaster") ? "selected-query-btn" : "query-btn"}
                                onClick={() => handleTypeChange("coaster")}
                            >
                                Coasters
                            </button>
                            <button
                                className={selectedTypes.includes("ride") ? "selected-query-btn" : "query-btn"}
                                onClick={() => handleTypeChange("ride")}
                            >
                                Thrill Rides
                            </button>
                            <button
                                className={selectedTypes.includes("restaurant") ? "selected-query-btn" : "query-btn"}
                                onClick={() => handleTypeChange("restaurant")}
                            >
                                Restaurants
                            </button>
                            <button
                                className={selectedTypes.includes("other") ? "selected-query-btn" : "query-btn"}
                                onClick={() => handleTypeChange("other")}
                            >
                                Other
                            </button>
                        </div>
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


