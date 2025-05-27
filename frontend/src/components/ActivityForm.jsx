import { addActivity, addMeal } from "../api/newEntry";
import { getAttractionsByType, getVisitByDate } from "../api/getters";
import { useEffect, useState } from "react";
import TimePicker from './TimePicker';
import MealForm from "./MealForm";
import './forms.css';

function ActivityForm() {
    const storedUserId = localStorage.getItem('userId');

    const [dateDisplay, setDateDisplay] = useState("");
    const [attractions, setAttractions] = useState([]);
    const [newActivity, setNewActivity] = useState({
        timeOfDay: "",
        attraction: "",
        waitTime: "",
        frontRow: false,
        comments: "",
    });
    const [newVisitDate, setNewVisitDate] = useState(null);
    const [selectedType, setSelectedType] = useState("");
    const [attractionId, setAttractionId] = useState("");
    const [calendarDisplay, setCalendarDisplay] = useState(false);
    const [mealData, setMealData] = useState(null);



    useEffect(() => {

        const localTime = new Date();
        let h = localTime.getHours();
        const m = localTime.getMinutes();
        const pm = h >= 12 ? "PM" : "AM";

        // Round minute to nearest multiple of 5
        let roundedMinute = roundToNearestFifth(m);

        // increment hour if rounding up to 60        
        if (roundedMinute === 60) {
            h = (h % 12) + 1;
            roundedMinute = 0;
        }

        // update state 
        localTime.setHours(h);
        localTime.setMinutes(parseInt(roundedMinute));
        localTime.setSeconds(0);


        // manually format time
        const formattedHour = String(localTime.getHours()).padStart(2, "0");
        const formattedMinute = String(localTime.getMinutes()).padStart(2, "0");
        const formattedTime = `${formattedHour}:${formattedMinute}:00`;

        // set the initial timeOfDay
        setNewActivity((prevActivity) => ({
            ...prevActivity,
            timeOfDay: formattedTime,
        }));

    }, []);

    useEffect(() => {
        const showDate = async () => {

            let visitDate = localStorage.getItem("visitDate")

            if (visitDate === null) {
                alert('Visit date not set. Redirecting to visit form.');
                window.location.href = '/setvisit';
            }
            else {
                setNewVisitDate(visitDate);
                setDateDisplay(formatDateForDisplay(visitDate));
            }
        };

        showDate();
    }, []);



    const handleTypeChange = async (type) => {
        try {
            setSelectedType(type)
            const fetchedAttractions = await getAttractionsByType(type);
            setAttractions(fetchedAttractions);
        }
        catch (error) {
            console.error("Failed to set attraction type:", error);
        }
    };


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



    const handleAttractionChange = (e) => {

        const selectedId = parseInt(e.target.value);
        setAttractionId(selectedId);
        setNewActivity((prevActivity) => ({
            ...prevActivity,
            attraction: attractions.find((a) => a.id === selectedId),
        }));

    };

    // a method that rounds the current minutes to the nearest multiple of 5
    const roundToNearestFifth = (minutes) => {
        return Math.round(minutes / 5) * 5;
    };

    const toggleCalendarDisplay = () => {
        setCalendarDisplay(!calendarDisplay);
    };

    const handleChangeDate = async () => {
        try {
            const response = await getVisitByDate(storedUserId, newVisitDate);
            if (response === 0) {
                alert("Visit not found. Please pick a different date or add a new visit.")
            }
            else {
                localStorage.setItem("visitDate", newVisitDate)
                localStorage.setItem("visitId", response);
                setTimeout(() => {
                    alert("Date changed!")
                    window.location.reload(0);
                }, 1000);
            }
        }
        catch (error) {
            console.error("Failed to change date:", error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const activityId = await addActivity(newActivity, newVisitDate);

            setTimeout(() => {
                (async () => {
                    if (selectedType === "restaurant") {
                        const response = await addMeal(mealData, activityId);
                        if (response !== 0) {
                            alert("meal saved successfully!");
                        }
                    }
                    else {
                        alert("activity saved successfully!");
                    }
                    window.location.reload(0);

                })();
            }, 1000);



        } catch (error) {
            console.error("Failed to add activity:", error);
        }
    };


    useEffect(() => {
        console.log("Updated activity attraction:", newActivity.attraction);
    }, [newActivity.attraction]);

    return (
        <>
            <div className="wrapper">
                <div className="my-forms">
                    <div className="title">
                        <div className="date-display">
                            <div className="line-1">Entering activity for:</div>
                            <div className="line-2">
                                {dateDisplay}
                                <button onClick={toggleCalendarDisplay}>Change</button>
                            </div>
                        </div>
                    </div>

                    {calendarDisplay && (
                        <>
                            <input
                                className="weather-input"
                                type="date"
                                value={newVisitDate}
                                onChange={(e) => setNewVisitDate(e.target.value)}
                            />
                            <button onClick={handleChangeDate}>Change date</button>

                        </>
                    )}
                    <form className="form" onSubmit={handleSubmit}>
                        <label>Time of activity</label>
                        <TimePicker
                            onTimeChange={(timeStr) => setNewActivity(prevActivity => ({
                                ...prevActivity, timeOfDay: timeStr
                            }))}
                            defaultValue={newActivity.timeOfDay}
                        />



                        <label>type of activity </label>
                        <div className="input-group">
                            <input
                                type="radio"
                                name="activityType"
                                id="ride"
                                value="ride"
                                checked={selectedType === "ride"}
                                onChange={(e) => handleTypeChange(e.target.value)}
                            />
                            <label htmlFor="ride" className="form-btn"> Ride </label>


                            <input
                                type="radio"
                                name="activityType"
                                id="restaurant"
                                value="restaurant"
                                checked={selectedType === "restaurant"}
                                onChange={(e) => handleTypeChange(e.target.value)}
                            />
                            <label htmlFor="restaurant" className="form-btn"> Restaurant </label>


                            <input
                                type="radio"
                                name="activityType"
                                id="other"
                                value="other"
                                checked={selectedType === "other"}
                                onChange={(e) => handleTypeChange(e.target.value)}
                            />
                            <label htmlFor="other" className="form-btn"> Other </label>
                        </div> {/* end of radio-group */}

                        {selectedType && (
                            <>
                                <label>Name of activity</label>
                                <select
                                    className="input"
                                    value={newActivity.attraction ? newActivity.attraction.id : ""}
                                    onChange={handleAttractionChange}
                                >
                                    <option value="">-- Select Attraction --</option>
                                    {attractions
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.name}
                                            </option>
                                        ))}
                                </select>
                            </>
                        )}

                        <label>Wait time </label>
                        <input
                            className="input"
                            type="number"
                            value={newActivity.waitTime}
                            onChange={(e) => setNewActivity(prevActivity => ({
                                ...prevActivity, waitTime: e.target.value
                            }))}
                            placeholder="Wait time in minutes"
                        />

                        {selectedType === "ride" && (
                            <>
                                <label className="checkbox-container">Front row?
                                    <input
                                        type="checkbox"
                                        checked={newActivity.frontRow}
                                        onChange={(e) =>
                                            setNewActivity((prevActivity) => ({
                                                ...prevActivity,
                                                frontRow: e.target.checked,
                                            }))
                                        }
                                    />
                                    <span className="checkmark"></span>
                                </label>
                            </>
                        )}


                        {selectedType === "restaurant" && attractionId && (
                            <MealForm
                                key={attractionId}
                                attractionId={attractionId}
                                onMealChange={(mealData) => setMealData(mealData)}
                            />
                        )}


                        <label>Additional comments</label>
                        <input
                            className="input"
                            type="text"
                            value={newActivity.comments}
                            onChange={(e) => setNewActivity(prevActivity => ({
                                ...prevActivity, comments: e.target.value
                            }))}
                            placeholder="Optional"
                        />
                        <button className="form-btn" type="submit">Add Activity</button>
                    </form>



                    <br />

                </div>  {/*end my-forms */}
            </div>  {/*end wrapper */}
        </>

    )
}
export default ActivityForm


