import styled from "styled-components"
import { theme } from "../../../themes/theme";


export const ButtonIconRound = styled.button`
	background-color: white;
    border:1px solid ${theme.light.primColors.darkVioletRed};
	border-radius: 15px;
	
	margin:11px;
	padding:10px;

    width: 100px;
    height: 100px;
    background-size: "contain";
	background-repeat: no-repeat;
   

	&.active{
		background-color: white;
		background-color:${theme.light.primColors.lightGray};

	}

`

const FormMessage = styled.div`
	text-align: center;
	padding:10px;
	margin-top: 10px;
	margin-bottom: 10px;


`

export const FormMessageSuccess = styled(FormMessage)`
	background-color: lightgreen;
`