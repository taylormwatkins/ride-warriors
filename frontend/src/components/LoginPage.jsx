import React, { useEffect, useState } from 'react';
import { login, createNewUser } from '../api/userLog';
import "./login.css";



function LoginPage() {


    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState(0);
    const [userMessage, setUserMessage] = useState("");
    const [newUser, setNewUser] = useState(false);


    useEffect(() => {
        localStorage.setItem('userName', userName);
    }, [userName]);

    useEffect(() => {
        localStorage.setItem('userId', userId);
    }, [userId]);



    const handleSubmit = async (event) => {
        // prevent page from refreshing when form is submitted
        event.preventDefault();

        // account for trailing white space
        const trimmedName = userName.trim();

        try {
            const response = await login(trimmedName);
            const userId = response.data;
            console.log("Response from login:", response, userId);
            if (userId === 0) {
                setUserMessage("User " + userName + " not found");
                setNewUser(true);
            }
            else if (userId < 0) {
                setUserMessage("Please enter a valid name");
            }
            else {
                // store the userName
                setUserName(trimmedName);
                // store the userId
                // let userId = Number(response);
                localStorage.setItem('userId', userId);


                // wait for the state update before redirecting
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            }
        }
        catch (error) {
            console.error("Failed to login:", error);
        }
    };


    const handleNewUser = async (event) => {
        event.preventDefault();

        // account for trailing white space
        const trimmedName = userName.trim();

        try {
            const response = await createNewUser(trimmedName);

            // store the userName
            setUserName(trimmedName);
            // store the userId
            let userId = response.data;
            localStorage.setItem('userId', userId);
            // TODO: figure out which of these is right
            setUserId(userId);

            alert("User " + userName + " created!")

            // wait for the state update before redirecting
            setTimeout(() => {
                window.location.href = '/';
            }, 100);
        }
        catch (error) {
            console.error("Failed to create new user:", error);
        }
    };

    return (
        <>

            <form onSubmit={handleSubmit}>
                <div className="login-group">

                    <label className="login-text">Who are you?</label>
                    <input
                        className="input"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your name"
                        required
                    />

                    <button type="submit" className="submit-btn">Let's Go</button>
                </div>
            </form><br />
            <div className="login-group">

                {userMessage && (
                    <div className="login-text">
                        {userMessage}
                    </div>
                )}
                {newUser && (
                    <button className="submit-btn" onClick={handleNewUser}>
                        Create new user?</button>
                )}

            </div>
        </>

    );
};

export default LoginPage;