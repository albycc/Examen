import styled from "styled-components";
import { Link } from "react-router-dom";
import { theme } from "../../themes/theme";

export const LinkButton = styled(Link)`
	background-color: ${theme.light.primColors.darkVioletRed};
	color:#ffffff;
	font-family: ${theme.light.text.font.default};
	border: none;
	min-height: 32px;
	min-width: 95px;
    max-width: fit-content;
	border-radius: 5px;
	padding-left: 12px;
	padding-right: 12px;
    padding-top: 3px;
    padding-bottom: 3px;
	cursor: pointer;
    text-decoration: none;

	&:hover {
        color:#ffffff;
		background-color: ${theme.light.accColors.orange};
	}
`

export const ButtonLink = styled.button`
    background-color: white;
    border: none;
    color:blue;
    text-decoration: underline;

`