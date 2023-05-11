import styled from "styled-components"
import { theme } from "../../../themes/theme";


export const ButtonIconRound = styled.button`
	background-color: white;
    border:2px solid ${theme.light.primColors.darkVioletRed};
	border-radius: 15px;
	
	margin:11px;
	padding:10px;

    width: 100px;
    height: 100px;
    background-size: 100px 100px;
	background-repeat: no-repeat;

	&:first-of-type{
		margin-left:0
	}
   

	&.active{
		background-color: white;
		background-color:${theme.light.primColors.lightGray};
		border-color: ${theme.light.accColors.orange};
	}


`