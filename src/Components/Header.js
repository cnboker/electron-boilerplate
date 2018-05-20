import React, {Component} from 'react'
import {Navbar, Nav, NavItem} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'


export default class Header extends Component {
  render() {
    return (

      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#brand">kwPolish</a>
          </Navbar.Brand>
          <Navbar.Toggle/>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to="/start">
              <NavItem eventKey={1} href="#">
                擦亮
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/config">
              <NavItem eventKey={2} href="#">
                关键字
              </NavItem>
            </LinkContainer>
          </Nav>

        </Navbar.Collapse>
      </Navbar>
    )
  }
}