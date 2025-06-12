import { getFoodByAttraction } from "../api/getters";
import { useState, useEffect } from "react";
import "./forms.css";


function MealForm({ attractionId, onMealChange, existingMeal = null }) {
    const [foodDisplay, setFoodDisplay] = useState([]);

    const [meal, setMeal] = useState({
        rating: '',
        foodIds: []
    });

    useEffect(() => {
        const loadFoodDisplay = async () => {
            try {
                const fetchedFood = await getFoodByAttraction(attractionId);
                setFoodDisplay(fetchedFood);
                console.log("Fetched food items:", fetchedFood);
            }
            catch (error) {
                console.error("Failed to fetch food items:", error);
            }
        };

        loadFoodDisplay();
    }, []);



    useEffect(() => {
        if (existingMeal) {
            const { rating, foodItems } = existingMeal;
            console.log("Existing meal data:", existingMeal);
            // extract food ids 
            const foodIds = Array.isArray(foodItems)
                ? foodItems.map(f => f.id)
                : [];
    
            setMeal({ rating, foodIds });
        }
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
                {/* show entrees first then sides */}
                {foodDisplay
                    .filter(food => food.isEntree) 
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(food => (
                        <button
                            key={food.id}
                            type="button"
                            className={(meal.foodIds.includes(food.id)) ? "selected-btn" : "form-btn"}                            
                            onClick={() => handleFoodSelect(food.id)}
                        >
                            {food.name}
                        </button>
                    ))} 
                    {foodDisplay
                    .filter(food => !food.isEntree) 
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(food => (
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

