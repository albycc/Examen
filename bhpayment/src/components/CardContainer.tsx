import Container from "react-bootstrap/Container";
import { theme } from "../themes/theme";
import styled from "styled-components"

export const CardContainer = styled(Container).attrs({
	fluid: true,
})`
	font-family: ${theme.light.text.font.default};
	color: ${theme.light.primColors.darkVioletRed};
	border: 1px solid #dee2e6;
	border-radius: 5px;
	box-shadow: 8px 10px 8px -4px rgba(0, 0, 0, 0.07);
	background-color: white;
	padding: 20px;
	margin-top:20px;
	margin-bottom:20px;

	
`;
