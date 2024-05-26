import { useState, useContext } from "react";
import PropTypes from "prop-types";

import { CognitoUser } from "amazon-cognito-identity-js";

import { AccountContext } from "../../Account";

import UserPool from "../../UserPool";

import "./Popup.css";

const Signup = ({ setSignupOpen }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [verifyOpen, setVerifyOpen] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");

    const [user, setUser] = useState(null);

    const { authenticate } = useContext(AccountContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        UserPool.signUp(
            userName,
            password,
            [
                {
                    Name: "email",
                    Value: email,
                },
                {
                    Name: "preferred_username",
                    Value: userName,
                },
            ],
            null,
            (err) => {
                if (err) console.error(err);
                else {
                    setUser(new CognitoUser({ Username: userName, Pool: UserPool }));
                    setVerifyOpen(true);
                }
            }
        );
    };

    const handleVerifySubmit = (e) => {
        e.preventDefault();

        if (!verificationCode || !user) return;

        user.confirmRegistration(verificationCode, true, (err, result) => {
            if (err) console.error(err);
            else if (result === "SUCCESS") {
                authenticate(userName, password)
                    .then(() => setSignupOpen(false))
                    .catch((err) => console.error(err));
            }
        });
    };

    return (
        <div className="popup">
            <div className="popup__content">
                <h1>Signup</h1>

                <button className="close" onClick={() => setSignupOpen(false)}>
                    &times;
                </button>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="on"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        autoComplete="on"
                        required
                    />
                    {/* allow user to show/hide password */}
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="on"
                            required
                            minLength={8}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="password-toggle"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <div className="password-indicator">
                        <ul>
                            <li
                                className={password.length >= 8
                                        ? "password-indicator--valid"
                                        : "password-indicator--invalid"
                                }
                            >
                                At least 8 characters
                            </li>
                            <li
                                className={/[A-Z]/.test(password)
                                        ? "password-indicator--valid"
                                        : "password-indicator--invalid"
                                }
                            >
                                At least one uppercase letter
                            </li>
                            <li
                                className={/[a-z]/.test(password)
                                        ? "password-indicator--valid"
                                        : "password-indicator--invalid"
                                }
                            >
                                At least one lowercase letter
                            </li>
                            <li
                                className={/\d/.test(password)
                                        ? "password-indicator--valid"
                                        : "password-indicator--invalid"
                                }
                            >
                                At least one number
                            </li>
                            <li className={/[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
                                        ? "password-indicator--valid"
                                        : "password-indicator--invalid"
                                }
                            >
                                At least one special character
                            </li>
                        </ul>
                    </div>

                    <button
                        type="submit"
                        disabled={
                            !email ||
                            !userName ||
                            verifyOpen ||
                            !password ||
                            password.length < 8 ||
                            !/[A-Z]/.test(password) ||
                            !/[a-z]/.test(password) ||
                            !/\d/.test(password) ||
                            !/[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
                                password
                            )
                        }
                    >
                        Submit
                    </button>
                </form>

                {verifyOpen && (
                    <>
                        <hr />
                        <p>Please check your email and verify your account.</p>
                        <form onSubmit={handleVerifySubmit}>
                            <input
                                type="text"
                                placeholder="Verification code"
                                value={verificationCode}
                                onChange={(e) =>
                                    setVerificationCode(e.target.value)
                                }
                                autoComplete="off"
                            />
                            <button type="submit">Verify</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

Signup.propTypes = {
    setSignupOpen: PropTypes.func.isRequired
};

export default Signup;
