import { useState, useContext } from "react";
import PropTypes from "prop-types";

import { AccountContext } from "../../Account";

import "./Popup.css";

const Login = ({ setLoginOpen }) => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const { authenticate } = useContext(AccountContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        authenticate(userName, password)
            .then(() => setLoginOpen(false))
            .catch((err) => console.error(err));
    };

    return (
        <div className="popup">
            <div className="popup__content">
                <h2>Login</h2>

                <button className="close" onClick={() => setLoginOpen(false)}>
                    &times;
                </button>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                    <button type="submit">Login</button>
                </form>
                <button className="close" onClick={() => setLoginOpen(false)}>
                    &times;
                </button>
            </div>
        </div>
    );
};

Login.propTypes = {
    setLoginOpen: PropTypes.func.isRequired,
};

export default Login;
