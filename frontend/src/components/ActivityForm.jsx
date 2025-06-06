import { addActivity, addMeal } from "../api/newEntry";
import { getAttractionsByType } from "../api/getters";
import { useEffect, useState } from "react";
import TimePicker from './TimePicker';
import DateDisplay from './DateDisplay';
import MealForm from "./MealForm";
import './forms.css';

function ActivityForm() {
    const storedVisitId = localStorage.getItem('visitId');

    const [attractions, setAttractions] = useState([]);
    const [newActivity, setNewActivity] = useState({
        timeOfDay: "",
        attraction: "",
        waitTime: "",
        frontRow: false,
        comments: "",
    });
    const [selectedType, setSelectedType] = useState("coaster");
    const [attractionId, setAttractionId] = useState("");
    const [mealData, setMealData] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState("Loading...");





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


        // while we're here set the default type
        handleTypeChange("coaster");

    }, []);



    const handleTypeChange = async (type) => {
        try {
            setLoadingMessage("Loading...");
            setSelectedType(type)
            const fetchedAttractions = await getAttractionsByType(type);
            setAttractions(fetchedAttractions);
        }
        catch (error) {
            console.error("Failed to set attraction type:", error);
        }
        setLoadingMessage("---Select attraction---");

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



    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("newactivity", newActivity);
        console.log("storedVisitId", storedVisitId);
        try {
            const activityId = await addActivity(newActivity, storedVisitId);

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


    return (
        <>
            <div className="wrapper">
                <div className="my-forms">
                    <div className="title">
                        <div className="line-1">Entering activity for:</div>
                        <DateDisplay />
                    </div>

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
                                id="coaster"
                                value="coaster"
                                checked={selectedType === "coaster"}
                                onChange={(e) => handleTypeChange(e.target.value)}
                            />
                            <label htmlFor="coaster" className="form-btn"> Coaster </label>

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
                            <label htmlFor="restaurant" className="form-btn"> Food </label>

                            <input
                                type="radio"
                                name="activityType"
                                id="other"
                                value="other"
                                checked={selectedType === "other"}
                                onChange={(e) => handleTypeChange(e.target.value)}
                            />
                            <label htmlFor="other" className="form-btn"> Other </label>
                        </div>

                        {selectedType && (
                            <>
                                <label>Name of activity</label>
                                <select
                                    className="input"
                                    value={newActivity.attraction ? newActivity.attraction.id : ""}
                                    onChange={handleAttractionChange}
                                >
                                    <option value="">{loadingMessage}</option>
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

                        {selectedType === "coaster" && (
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


