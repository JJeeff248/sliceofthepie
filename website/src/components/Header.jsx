import logo from "/logo.svg";
import "./Header.css";
import { useContext, useEffect, useState } from "react";
import Signup from "./popups/Signup";
import Login from "./popups/Login";
import { AccountContext } from "../Account";
import UserPool from "../UserPool";
import AccountMenu from "./AccountMenu";
import { FaUserAlt } from "react-icons/fa";

const Header = () => {
    const [signupOpen, setSignupOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);

    const [accountMenuOpen, setAccountMenuOpen] = useState(false);

    const [user, setUser] = useState(null);

    const { getSession } = useContext(AccountContext);

    const currentUser = UserPool.getCurrentUser()?.getSignInUserSession();

    useEffect(() => {
        getSession()
            .then((session) => setUser(session.idToken.payload))
            .catch(() => {
                setUser(null);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const popup = document.querySelector(".popup");
            const popupContent = document.querySelector(".popup__content");
            if (popup && event.target === popup && !popupContent.contains(event.target)) {
                setSignupOpen(false);
                setLoginOpen(false);
            }
        };

        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleAccountMenuClick = (event) => {
            const accountMenu = document.querySelector(".account");
            if (accountMenu && event.target !== accountMenu && !accountMenu.contains(event.target)) {
                setAccountMenuOpen(false);
            }
        };

        window.addEventListener("click", handleAccountMenuClick);
        return () => window.removeEventListener("click", handleAccountMenuClick);
    }, []);

    return (
        <header>
            <div className="header">
                <img src={logo} className="logo" alt="logo" />
                <h1>Slice of Pie</h1>
                <div className="header-right">
                    {user ? (
                        <>
                            <a href="/create" className="create-recipe-button">
                                +
                            </a>
                            <div className="account">
                                <button 
                                    className={accountMenuOpen ? "account__menu_open" : ""}
                                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                                >
                                    <FaUserAlt />
                                </button>

                                {accountMenuOpen && <AccountMenu user={user} setAccountMenuOpen={setAccountMenuOpen} />}
                            </div>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setSignupOpen(true)}>Sign Up</button>
                            <button onClick={() => setLoginOpen(true)}>Login</button>
                        </>
                    )}
                </div>
            </div>

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
