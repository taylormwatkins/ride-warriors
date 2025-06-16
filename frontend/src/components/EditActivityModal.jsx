import React, { useState, useEffect } from "react";
import "./editActivityModal.css";
import MealForm from "./MealForm.jsx";
import { updateActivity, updateMeal } from "../api/update";
import { deleteActivity } from "../api/delete";
import TimePicker from './TimePicker';


function EditActivityModal({ activity, attractionId, onClose, onUpdate, onDelete }) {

    const [editedActivity, setEditedActivity] = useState(activity);
    const [editedMeal, setEditedMeal] = useState(null);
    const [attractionName, setAttractionName] = useState("");


    useEffect(() => {
        setEditedActivity(activity);
        setAttractionName(activity.attraction?.name || "");
    }, [activity]);

    const handleChange = (field, value) => {
        setEditedActivity(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDelete = async () => {
        const activityId = editedActivity.id;
        try {
            const response = await deleteActivity(activityId);
            if (response > 0) {
                alert("Activity deleted successfully!");

            } else {
                alert("Failed to delete activity.");
            }
            onDelete(activityId);
            onClose();
        } catch (error) {
            console.error("Failed to delete activity:", error);
            alert("Error deleting activity.");
        }
    };



    // i might have to change something so that the new meal is returned 
    const handleSave = async () => {
        const activityId = (editedActivity.id);
        console.log("activityId:", activityId, typeof activityId);
        console.log("editedActivity:", editedActivity);
        try {
            const updated = await updateActivity(editedActivity, activityId);

            if (editedActivity.meal) {
                const response = await updateMeal(editedMeal, activityId);
                if (response !== 0) {
                    alert("meal updated successfully!");
                } else {
                    alert("failed to update meal");
                }
            }

            else {
                alert("activity updated successfully!");
            }
            onUpdate(updated);
            onClose();

        } catch (error) {
            console.error("Failed to update activity:", error);
        }
    };

    return (
        <div className="modal-backdrop">

            <div className="modal">
                <h2>Edit Activity - {attractionName}</h2>
                <button className="delete-btn" onClick={handleDelete}>Delete</button><br />
                <label>Time </label>
                <TimePicker
                    onTimeChange={(timeStr) => setEditedActivity(prevActivity => ({
                        ...prevActivity, timeOfDay: timeStr
                    }))}
                    existingTime={editedActivity.timeOfDay}
                    defaultValue={editedActivity.timeOfDay}
                /><br/>

                <label>Wait Time (minutes) </label>
                <input
                    className="input"
                    type="number"
                    value={editedActivity.waitTime}
                    onChange={(e) => setEditedActivity(prevActivity => ({
                        ...prevActivity, waitTime: Number(e.target.value)
                    }))} /> <br />

                <label>Comments </label>
                <input
                    className="input"
                    type="text"
                    value={editedActivity.comments || ""}
                    onChange={e => handleChange("comments", e.target.value)}
                /> <br />
                {editedActivity.meal ? (
                    <MealForm
                        key={attractionId}
                        attractionId={attractionId}
                        existingMeal={editedActivity.meal}
                        onMealChange={(editedMeal) => setEditedMeal(editedMeal)}
                    />
                ) : editedActivity.attraction?.type === "coaster" ? (
                    <>
                        <label className="checkbox-container">Front row?
                            <input
                                type="checkbox"
                                checked={editedActivity.frontRow}
                                onChange={e => handleChange("frontRow", e.target.checked)}
                            />
                            <span className="checkmark"></span>
                        </label>
                    </>
                ) : null}
                <div className="modal-buttons">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default EditActivityModal;