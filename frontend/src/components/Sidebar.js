import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const SidebarContainer = styled.div`
    width: 200px;
    height: 100vh;
    background-color: #2c3e50;
    position: fixed;
    left: 0;
    top: 0;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.h1`
    color: #ecf0f1;
    font-size: 1.5em;
    margin-bottom: 40px;
    text-align: left;
`;

const NavList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const NavItem = styled.li`
    margin-bottom: 10px;
`;

const NavLink = styled(Link)`
    display: block;
    padding: 12px 15px;
    color: #ecf0f1;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;

  &:hover {
    background-color: #34495e;
  }

  &.active {
    background-color: #3498db;
  }
`;

function Sidebar() {
    return (
        <SidebarContainer>
            <Logo>GaumenGalopp</Logo>
            <NavList>
                <NavItem>
                    <NavLink to="/">Home</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink to="/beispiel">Beispiel</NavLink>
                </NavItem>
            </NavList>
        </SidebarContainer>
    );
}

export default Sidebar;