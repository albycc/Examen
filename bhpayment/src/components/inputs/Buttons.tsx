import React from "react";
import { theme } from "../../themes/theme";
import styled from "styled-components";
import Form from "react-bootstrap/Form";

interface IButtonProps {
	bgColor?: string;
	hoverColor?: string;
}

export const ButtonPrim = styled.button`
	margin-top: 3px;
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
	cursor: pointer;

	&:hover {
		background-color: ${(props: IButtonProps) =>
		props.hoverColor || theme.light.accColors.orange};
	}
`;

export const ButtonPrimDisabled = styled(ButtonPrim)`
	margin-top: 3px;
	opacity: 0.5;
	pointer-events: none;
	font-family: ${theme.light.text.font.default};
	height: 32px;
	min-width: 95px;
	border-radius: 5px;
	padding-left: 12px;
	padding-right: 12px;
	&:hover {
		pointer-events: none;
	}
`;

export const ButtonSec = styled.button.attrs({
	type: "button"
})`
	background-color: ${(props: IButtonProps) => props.bgColor || "white"};
	font-family: ${theme.light.text.font.default};
	color: ${theme.light.primColors.darkVioletRed};
	border: 2px solid ${theme.light.primColors.darkVioletRed};
	height: 32px;
	min-width: 95px;
	border-radius: 5px;
	padding-left: 12px;
	padding-right: 12px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 3px;

	&:hover {
		color: ${theme.light.accColors.orange};
		border: 2px solid ${theme.light.accColors.orange};
	}
`;

interface Iprops {
	disabled?: boolean;
	type?: 'button' | 'submit' | undefined;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	children?: React.ReactNode;
}

export const Button = (props: Iprops) => {
	return (
		<>
			{props.disabled ?
				<ButtonPrimDisabled type={props.type}>{props.children}</ButtonPrimDisabled>
				:
				<ButtonPrim
					type={props.type}
					onClick={props.onClick}
				>
					{props.children}
				</ButtonPrim>
			}

		</>
	)

}

const ButtonRadioOptionStyle = styled(Form.Control).attrs({
	type: "radio"
})`
	display:none;
	& + label{
		display:inline;
		background-color: ${(props: IButtonProps) => props.bgColor || "white"};
		font-family: ${theme.light.text.font.default};
		color: ${theme.light.primColors.darkVioletRed};
		border: 2px solid ${theme.light.primColors.darkVioletRed};
		height: 32px;
		min-width: 95px;
		border-radius: 5px;
		padding-left: 12px;
		padding-right: 12px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 3px;
		cursor: pointer;

		&:hover{
			color: ${theme.light.accColors.orange};
			border: 2px solid ${theme.light.accColors.orange};
		}
		
	}
	&:checked + label{
		background-color: ${theme.light.accColors.orange};
		color:white;
		border: 2px solid ${theme.light.accColors.orange};

	} 

`

interface IButtonOption {
	text?: string;
	id?: string;
	name?: string;
	checked?: boolean;
	value?: string;
}

export const ButtonOption = (props: IButtonOption) => {
	return (
		<span className="m-1">
			<ButtonRadioOptionStyle id={props.id} name={props.name} checked={props.checked} value={props.value} />
			<Form.Label htmlFor={props.id}>{props.text}</Form.Label>

		</span>
	)

}