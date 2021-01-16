import React, { useState, useContext } from 'react';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, Media } from 'reactstrap';
import { Link } from 'react-router-dom';
import { UserContext } from '../user-context';
import logo from '../assets/logo.png';

const TopNav = () => {
    const { isLoggedIn, setIsloggedIn } = useContext(UserContext);

    const [collapsed, setCollapsed] = useState(true);
    const toggleNavbar = () => setCollapsed(!collapsed);

    const logoutHandler = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('user_id')
        setIsloggedIn(false)
    }

    return isLoggedIn ? 
        <div>
            <Navbar color="faded" light>
                <NavbarToggler onClick={toggleNavbar} />
                <Media>
                    <img
                        src={logo}
                        className="img-fluid"
                        alt="Book my event"
                    />
                </Media>
                <Link to="/login" onClick={logoutHandler}>Logout</Link>
                <Collapse isOpen={!collapsed} navbar>
                    <Nav navbar>
                        <NavItem>
                            <Link to="/">Home</Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/events">Create Event</Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/myregistrations">Registration Requests</Link>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    : ""
}

export default TopNav;