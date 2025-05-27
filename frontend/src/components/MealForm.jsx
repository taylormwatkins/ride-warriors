import { getFoodByAttraction } from "../api/getters";
import { useState, useEffect } from "react";
import "./forms.css";


function MealForm({ attractionId, onMealChange }) {
    const [foodItems, setFoodItems] = useState([]);

    const [meal, setMeal] = useState({
        rating: '',
        foodIds: []
    });

    useEffect(() => {
        const loadFoodItems = async () => {
            try {
                const fetchedFood = await getFoodByAttraction(attractionId);
                setFoodItems(fetchedFood);
            }
            catch (error) {
                console.error("Failed to fetch food items:", error);
            }
        };

        loadFoodItems();
    }, []);


    useEffect(() => {
        onMealChange(meal); // notify parent on meal changes
    }, [meal, onMealChange]);

    const handleRatingChange = (e) => {
        setMeal(prevMeal => ({ ...prevMeal, rating: e.target.value }));
    };

    const handleFoodSelect = (id) => {
        setMeal(prevMeal => {
            const alreadySelected = prevMeal.foodIds.includes(id);
            const updatedFoodIds = alreadySelected
                ? prevMeal.foodIds.filter(fid => fid !== id) // remove
                : [...prevMeal.foodIds, id]; // add

            return { ...prevMeal, foodIds: updatedFoodIds };
        });
    };


    return (
        <div className="meal-form">
            <label>Select food</label>
            <div className="food-options">
                {foodItems.map(food => (
                    <button
                        key={food.id}
                        type="button"
                        className={meal.foodIds.includes(food.id) ? "selected-btn" : "form-btn"}
                        onClick={() => handleFoodSelect(food.id)}
                    >
                        {food.name}
                    </button>
                ))}
            </div>
            <label>Rating (out of 10)</label>
            <input
                className="input"
                type="number"
                value={meal.rating}
                onChange={handleRatingChange}
            />
        </div>
    );
}

export default MealForm

