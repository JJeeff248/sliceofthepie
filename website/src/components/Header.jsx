import logo from "/logo.svg";
import "./Header.css";
import { useContext, useEffect, useState } from "react";
import Signup from "./popups/Signup";
import Login from "./popups/Login";
import { AccountContext } from "../Account";
import UserPool from "../UserPool";

const Header = () => {
    const [signupOpen, setSignupOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);

    const [user, setUser] = useState(null);

    const { getSession, logout } = useContext(AccountContext);

    const currentUser = UserPool.getCurrentUser();

    useEffect(() => {
        getSession()
            .then((session) => setUser(session.idToken.payload))
            .catch(() => {
                setUser(null);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    window.onclick = function (event) {
        const popup = document.querySelector(".popup");
        if (event.target === popup) {
            setSignupOpen(false);
            setLoginOpen(false);
        }
    };

    return (
        <header>
            <img src={logo} className="logo" alt="logo" />
            <h1>Slice of Pie</h1>

            {user ? (
                <>
                    <h2>{user.preferred_username}</h2>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <>
                    <button onClick={() => setSignupOpen(true)}>Sign Up</button>
                    <button onClick={() => setLoginOpen(true)}>Login</button>
                </>
            )}

            {signupOpen && (
                <Signup
                    setSignupOpen={setSignupOpen}
                    user={user}
                    setUser={setUser}
                />
            )}
            {loginOpen && (
                <Login setLoginOpen={setLoginOpen} setUser={setUser} />
            )}
        </header>
    );
};

export default Header;
