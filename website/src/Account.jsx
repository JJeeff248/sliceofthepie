import { createContext } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import PropTypes from "prop-types";

import Pool from "./UserPool";

const AccountContext = createContext();

const Account = ({ children }) => {
    const getSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = Pool.getCurrentUser();

            user
                ? user.getSession((err, session) =>
                      err ? reject(err) : resolve(session)
                  )
                : reject();
        });
    };

    const authenticate = async (Username, Password) => {
        return await new Promise((resolve, reject) => {
            const user = new CognitoUser({
                Username,
                Pool,
            });

            const authDetails = new AuthenticationDetails({
                Username,
                Password,
            });

            user.authenticateUser(authDetails, {
                onSuccess: (data) => {
                    resolve(data);
                },
                onFailure: (err) => {
                    reject(err);
                },
                newPasswordRequired: (data) => {
                    resolve(data);
                },
            });
        });
    };

    const logout = () => {
        const user = Pool.getCurrentUser();
        if (user) user.signOut();
    };

    return (
        <AccountContext.Provider value={{ authenticate, getSession, logout }}>
            {children}
        </AccountContext.Provider>
    );
};

Account.propTypes = {
    children: PropTypes.node.isRequired,
};

export { Account, AccountContext };
