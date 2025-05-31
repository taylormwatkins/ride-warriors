import { addVisit } from "../api/newEntry";
import { getVisitByDate } from "../api/getters";
import { useState } from "react";
import "./visit.css";
import "./forms.css";
import DateDisplay from "./DateDisplay";

// 'visit already exists'

function VisitForm() {

    const storedUserId = localStorage.getItem('userId');
    const [isVisible, setIsVisible] = useState(false);
    const [newVisit, setNewVisit] = useState({
        date: "",
        temperature: "",
        windSpeed: "",
        humidity: "",
        uvIndex: "",
        rain: false,
        comments: "",
    });

    const [selectedVisit, setSelectedVisit] = useState('');

    // call backend to add the new visit
    const handleSelectVisit = async (event) => {
        event.preventDefault();
        try {
            const response = await getVisitByDate(storedUserId, selectedVisit);
            if (response === 0) {
                alert("Visit not found. Please pick a different date or add a new visit.")
            }
            else {
                localStorage.setItem("visitDate", selectedVisit)
                localStorage.setItem("visitId", response);
                setTimeout(() => {
                    alert("Date set!")
                    window.location.href = '/addactivity';
                }, 1000);
            }
        }
        catch (error) {
            console.error("Failed to select date:", error);
        }
    };

    // call backend to add the new visit
    const handleAddVisit = async (event) => {
        event.preventDefault();

        // TODO: add error handling here in case a visit already exists for the selected date
        try {
            console.log("Adding visit with date:", newVisit.date);
            const response = await addVisit(newVisit, storedUserId);
            localStorage.setItem('visitDate', newVisit.date);
            localStorage.setItem("visitId", response);


            setTimeout(() => {
                alert("visit added successfully")
                window.location.href = '/addactivity';
            }, 1000);

        } catch (error) {
            console.error("Failed to add vist:", error);
        }
    };




    const setTodayDate = () => {
        const today = new Date().toISOString().split("T")[0];
        setNewVisit({ ...newVisit, date: today });
    };


    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };


    return (
        <>
            <div className="wrapper">
                <div className="my-forms">
                    <div className="title">
                        <div className="line-1">Current visit:</div>
                        <DateDisplay />
                    </div>
                    <form onSubmit={handleAddVisit}>
                        <div className="input-visit">
                            <div className="title">Or add a new one</div>
                            <span>
                                <label>Date: </label>
                                <input
                                    className="weather-input"
                                    type="date"
                                    value={newVisit.date}
                                    onChange={(e) => setNewVisit({ ...newVisit, date: e.target.value })}
                                />
                                <button className="smaller-btn" type="button" onClick={setTodayDate}>Today</button>
                            </span>
                            <label className="checkbox-container">
                                <input
                                    type="checkbox"
                                    checked={isVisible}
                                    onChange={(e) => toggleVisibility(e.target.checked)}
                                />
                                <span className="checkmark"></span>
                                Add Weather
                            </label>

                            <div className={isVisible ? "weather-visible" : "weather-hidden"}>
                                <div>
                                    <label>Temperature (in °F) </label>
                                    <input
                                        className="weather-input"
                                        type="number"
                                        value={newVisit.temperature}
                                        onChange={(e) => setNewVisit({ ...newVisit, temperature: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label>Wind Speed (in mph) </label>
                                    <input
                                        className="weather-input"
                                        type="number"
                                        value={newVisit.windSpeed}
                                        onChange={(e) => setNewVisit({ ...newVisit, windSpeed: e.target.value })}

                                    />
                                </div>
                                <div>
                                    <label>Humidity (%) </label>
                                    <input
                                        className="weather-input"
                                        type="number"
                                        value={newVisit.humidity}
                                        onChange={(e) => setNewVisit({ ...newVisit, humidity: e.target.value })}

                                    />
                                </div>
                                <div>
                                    <label>UV Index </label>
                                    <input
                                        className="weather-input"
                                        type="number"
                                        value={newVisit.uvIndex}
                                        onChange={(e) => setNewVisit({ ...newVisit, uvIndex: e.target.value })}

                                    />
                                </div>
                                <label className="checkbox-container">Rain?
                                    <input
                                        id="frontRow"
                                        type="checkbox"
                                        value={newVisit.rain}
                                        onChange={(e) => setNewVisit({ ...newVisit, rain: e.target.checked })}
                                    />
                                    <span className="checkmark"></span>
                                </label>

                                <label>Additional comments</label>
                                <input
                                    className="weather-input"
                                    type="text"
                                    value={newVisit.comments}
                                    onChange={(e) => setNewVisit({ ...newVisit, comments: e.target.value })}
                                />
                            </div>


                            <button type="submit">Add New Visit</button>
                        </div> {/* end input-visit */}

                    </form>

                </div> {/* end my-forms */}
            </div> {/* end wrapper */}
        </>
    )
}
export default VisitForm




