import React, {Component} from 'react'
import {Navbar, Nav, NavItem} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

export default class Header extends Component {
  render() {
    return (

      <Navbar  fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            kwPolish
          </Navbar.Brand>
          <Navbar.Toggle/>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav activeKey={1}>
            <LinkContainer to="/start">
              <NavItem eventKey={1} href="#">
                开始
              </NavItem>  
            </LinkContainer>
            <LinkContainer to="/keyword">
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