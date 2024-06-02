import { useContext } from "react";
import { AccountContext } from "../Account";
import PropTypes from "prop-types";
import "./AccountMenu.css";

const AccountMenu = ({ user }) => {
    const { logout } = useContext(AccountContext);

    return (
        <div className="account-menu">
            <p>{user.preferred_username}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

AccountMenu.propTypes = {
    user: PropTypes.object.isRequired,
};

export default AccountMenu;
