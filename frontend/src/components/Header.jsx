import "./Header.css"
import { useEffect } from "react";
import { userLogout } from "../api/userLog";


function Header() {

    const userName = localStorage.getItem('userName') || "";



    useEffect(() => {
        const checkSession = async () => {
            try {
                // const response = await checkUserSession();

                // console.log("Response from checkSession:", response);
                if (userName === "" || userName === null) {
                    // prevent an infinite loop, don't redirect if we're already there
                    if (window.location.pathname !== "/login") {
                        window.location.href = "/login";
                    }
                    return;
                }
                else {
                    console.log("name", localStorage.getItem("userName"));
                    console.log("id", Number(localStorage.getItem("userId")));
                    console.log("date", localStorage.getItem("visitDate"));
                    console.log("visitId", localStorage.getItem("visitId"));
                }


            } catch (error) {
                console.error("Failed to authenticate user session:", error);
            }
        };

        checkSession();
    }, []);


    const logout = async () => {
        try {
            await userLogout();
            localStorage.removeItem('userName');
            localStorage.removeItem('userId');
            localStorage.removeItem('visitDate');
            localStorage.removeItem('visitId');
            window.location.href = '/login';
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    }


    const goToHome = async () => {
        window.location.href = '/';
    }


    return (
        <header className="header">
            <a href="/"><img id="logo" src="8.png" alt="Logo" /></a>

            <div className="user-display" >
                <p>{userName}</p>
                {userName && (
                    <button
                        className="smaller-btn"
                        onClick={logout}>Logout
                    </button>
                )}
            </div>
                <button className="home-btn" onClick={goToHome}>Home </button>
        </header>
    );

}

export default Header

