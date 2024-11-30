import { useContext } from "react";
import { AccountContext } from "../Account";
import PropTypes from "prop-types";
import "./AccountMenu.css";

const AccountMenu = ({ user, setAccountMenuOpen }) => {
    const { logout } = useContext(AccountContext);

    const handleLogout = () => {
        logout();
        setAccountMenuOpen(false);
    };

    return (
        <div className="account-menu">
            <p>{user.preferred_username}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

AccountMenu.propTypes = {
    user: PropTypes.object.isRequired,
    setAccountMenuOpen: PropTypes.func.isRequired,
};

export default AccountMenu;
