import { useState, useEffect } from "react";



function TimePicker({ onTimeChange, existingTime = null}) {
    const [hour, setHour] = useState("");
    const [minute, setMinute] = useState("");
    const [period, setPeriod] = useState("");


    useEffect(() => {
        if (existingTime) {
            showActivityTime();
        } else {
            showCurrentTime();
        }
    }, []);


    const showCurrentTime = async () => {

        const localTime = new Date();
        let h = localTime.getHours();
        const m = localTime.getMinutes();
        const p = h >= 12 ? "PM" : "AM";

        // convert hour to 12-hour format
        h = h % 12 || 12;

        // round minute to nearest multiple of 5
        let roundedMinute = roundToNearestFifth(m);

        // increment hour if rounding up to 60
        if (roundedMinute === 60) {
            h = (h % 12) + 1;
            roundedMinute = 0;
        }
        // update state
        setHour(h);
        setMinute(roundedMinute);
        setPeriod(p);

        console.log("Current Date:", localTime);
        console.log("Current Time:", `${h}:${roundedMinute} ${p}`);
    };


    const showActivityTime = async () => {
        console.log("existing time", existingTime);
    
        const [hourStr, minuteStr] = existingTime.split(":");
        let h = parseInt(hourStr, 10);
        let m = parseInt(minuteStr, 10);
        const p = h >= 12 ? "PM" : "AM";
        
        // convert hour to 12-hour format
        h = h % 12 || 12;

        // update state
        setHour(h);
        setMinute(m);
        setPeriod(p);

    
        console.log("Activity Time:", `${h}:${m} ${p}`);
    };

    // a method that rounds the current minutes to the nearest multiple of 5
    const roundToNearestFifth = (minutes) => {
        return Math.round(minutes / 5) * 5;
    };

    const handleTimeChange = (newHour, newMinute, newPeriod) => {
        let h = parseInt(newHour);
        if (newPeriod === "PM" && h !== 12) h += 12;
        if (newPeriod === "AM" && h === 12) h = 0;

        const localTime = new Date();
        localTime.setHours(h);
        localTime.setMinutes(parseInt(newMinute));
        localTime.setSeconds(0);
        console.log("handleDate:", localTime);


        // manually format the time
        const formattedHour = String(localTime.getHours()).padStart(2, "0");
        const formattedMinute = String(localTime.getMinutes()).padStart(2, "0");
        const formattedTime = `${formattedHour}:${formattedMinute}:00`;

        // send formatted time to backend
        onTimeChange(formattedTime);

    };

    const handleChange = (setter, value, part) => {
        // update the specific part of the time
        setter(value);

        // handle the time change with the updated value
        if (part === 'hour') {
            handleTimeChange(value, minute, period);
        } else if (part === 'minute') {
            handleTimeChange(hour, value, period);
        } else if (part === 'period') {
            handleTimeChange(hour, minute, value);
        }
    };


    return (
        <div className="input-group">
            {/* hour dropdown */}
            <select
                className="input"
                id="hour"
                value={hour}
                onChange={(e) => handleChange(setHour, e.target.value, 'hour')}>
                {[...Array(12)].map((_, i) => {
                    const hr = (i + 1).toString();
                    return <option key={hr} value={hr}>{hr}</option>;
                })}
            </select>

            {/* minute dropdown */}
            <select
                className="input"
                id="minute"
                value={minute}
                onChange={(e) => handleChange(setMinute, e.target.value, 'minute')}
            >
                {Array.from({ length: 12 }, (_, i) => {
                    const m = String(i * 5).padStart(2, '0');
                    return (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    );
                })}
            </select>

            {/* am/pm dropdown */}
            <select
                className="input"
                id="period"
                value={period}
                onChange={(e) => handleChange(setPeriod, e.target.value, 'period')}>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
            </select>
        </div>
    );
}

export default TimePicker;


