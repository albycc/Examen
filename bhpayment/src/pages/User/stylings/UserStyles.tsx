import { Container, Tab, Card, Tabs, Nav, Table } from "react-bootstrap";
import styled, { keyframes } from "styled-components";
import { theme } from "../../../themes/theme";

export const NavContainer = styled(Nav)`
	display: flex;
	width: 100%;
	overflow: clip;
	flex-wrap: nowrap;
	border: none;

	.nav-item {
		.nav-link {
			color: ${theme.light.primColors.darkGray};
			font-family: Lato, sans-serif;
			font-style: normal;
			font-weight: 500;
			font-size: 15px;
		}
		.active {
			font-style: normal;
			font-weight: 700;
			font-size: 15px;
			color: ${theme.light.accColors.orange};
		}
	}
`;

export const NavItem = styled(Nav.Item)`
	display: flex;
	justify-content: flex-start;
`;
export const NavLink = styled(Nav.Link)`
  white-space: nowrap;
  max-width:100%;
  overflow:clip ;
  width:auto;
  display:flex ;
  background-color:${theme.light.primColors.lightGray};
  color:${theme.light.primColors.darkVioletRed};
      &:hover{
        color:${theme.light.accColors.orange};
        cursor: pointer;
      }
    
  justify-content  :flex-start;
`;