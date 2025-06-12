import { useEffect, useState } from "react";
import "./forms.css";


function Home() {

    const storedUserId = localStorage.getItem('userId');

    const [adminToggle, setAdminToggle] = useState(false);


    useEffect(() => {
        const checkAdminStatus = async () => {
            if (storedUserId === "11") {
                setAdminToggle(true);
            }
            else {
                setAdminToggle(false);
            }
        };

        checkAdminStatus();
    }
        , [storedUserId]);


    const goToQueries = async () => {
        window.location.href = '/queries';
    }

    const goToSetVisit = async () => {
        window.location.href = '/setvisit';
    }

    const goToAddActivity = async () => {
        window.location.href = '/addactivity';
    }

    const goToUpdate = async () => {
        window.location.href = '/update';
    }

    const goToAddAttraction = async () => {
        window.location.href = '/addattraction';
    }

    return (
        <div>

            <h2 className="title">Welcome ride warrior!</h2>
            <div className="button-choices">
                <button onClick={goToSetVisit}>Set visit</button>
                <button onClick={goToAddActivity}>Add activity</button>
                <button onClick={goToQueries}>Make query</button>
                <button onClick={goToUpdate}>Update a visit</button>
                {adminToggle &&
                    <button onClick={goToAddAttraction}>Add attraction or food</button>
                }
            </div>{/* end button choices */}

        </div>
    );

}

export default Home