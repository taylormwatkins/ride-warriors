import { addAttraction, addFoodItem } from "../api/newEntry";
import { getAllAttractions } from "../api/getters";
import { useState, useEffect } from "react";


function AttractionForm() {


    const [newAttraction, setNewAttraction] = useState({
        name: "",
        type: "ride",
    });
    const [attractions, setAttractions] = useState([]);
    const [newFoodItem, setNewFoodItem] = useState({
        name: "",
        isEntree: true,
    });
    const [selectedAttractionId, setSelectedAttractionId] = useState(0);

    useEffect(() => {
        const loadAttractions = async () => {
            try {
                const fetchedAttractions = await getAllAttractions();
                const filteredAttractions = fetchedAttractions.filter((a) => a.type === "restaurant");
                setAttractions(filteredAttractions);
            }
            catch (error) {
                console.error("Failed to fetch attractions:", error);
            }
        };

        loadAttractions();
    }, []);

    // call backend to add the new attraction
    const handleAddAttraction = async (event) => {
        event.preventDefault();
        try {
            await addAttraction(newAttraction);
            alert("Attraction added successfully");
            setNewAttraction({ name: "", type: "ride" }); // reset form
        } catch (error) {
            console.error("Failed to add attraction:", error);
        }
    };


    // add food item
    const handleAddFoodItem = async (event) => {
        event.preventDefault();
        try {
            console.log("new food item:", newFoodItem, selectedAttractionId);
            await addFoodItem(newFoodItem, selectedAttractionId);
            alert("Food item added successfully");
            setNewFoodItem({ name: "", isEntree: true }); // reset form
        }
        catch (error) {
            console.error("Failed to add food item:", error);
        }
    }

    return (
        <>
            <div className="my-forms">
                <form onSubmit={handleAddFoodItem}>
                    <input
                        type="text"
                        className="input"
                        value={newFoodItem.name}
                        onChange={(e) => setNewFoodItem({ ...newFoodItem, name: e.target.value })}
                        placeholder="Food Item Name"
                    />

                    <select className="input"
                        value={selectedAttractionId} onChange={(e) => setSelectedAttractionId(e.target.value)}>

                        <option value="">-- Select Restaurant --</option>
                        {attractions
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>
                            ))}
                    </select>
                    <label>Entree or side?
                        <select className="input"

                            value={newFoodItem.isEntree}
                            onChange={(e) => setNewFoodItem({ ...newFoodItem, isEntree: e.target.value })}
                        >
                            <option value="true">Entree</option>
                            <option value="false">Side</option>
                        </select>
                    </label>
                    <button type="submit">Add Food Item</button>
                </form>


                <br />
                <form onSubmit={handleAddAttraction}>
                    <input
                        type="text"
                        className="input"

                        value={newAttraction.name}
                        onChange={(e) => setNewAttraction({ ...newAttraction, name: e.target.value })}
                        placeholder="Attraction Name"
                    />
                    <select
                        className="input"

                        value={newAttraction.type}
                        onChange={(e) => setNewAttraction({ ...newAttraction, type: e.target.value })}
                    >
                        <option value="ride">Ride</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="other">Other</option>
                    </select>
                    <button type="submit">Add Attraction</button>
                </form>
            </div>
        </>

    )
}
export default AttractionForm




