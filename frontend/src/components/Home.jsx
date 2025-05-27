import "./forms.css";


function Home() {

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


    return (
        <div>

            <h2 className="title">Welcome ride warrior!</h2>
            <div className="button-choices">
                <button onClick={goToSetVisit}>Set visit</button>
                <button onClick={goToAddActivity}>Add activity</button>
                <button onClick={goToQueries}>Make query</button>
                <button onClick={goToUpdate}>Update a previous visit</button>
            </div>{/* end button choices */}

        </div>
    );

}

export default Home