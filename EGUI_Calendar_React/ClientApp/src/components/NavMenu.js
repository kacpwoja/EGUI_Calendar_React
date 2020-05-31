import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Button, ButtonToggle } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
    }

    changeTheme() {
        if (document.body.classList.contains("darktheme")) {
            document.body.classList.remove("darktheme");
        }
        else {
            document.body.classList.add("darktheme");
        }
    }

  render () {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white box-shadow mb-3 navigation" light>
          <Container>
            <NavbarBrand className="text-white" tag={Link} to="/">Calendar</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow navigation">
                <NavItem>
                  <NavLink tag={Link} className="text-white" to="/day">Today</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-white" to="/event">New Event</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-white" to="/info">Info</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={ButtonToggle} className="text-white" onClick={this.changeTheme}>Change Theme</NavLink>
                </NavItem>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
