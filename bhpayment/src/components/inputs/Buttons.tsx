import React from "react";
import { theme } from "../../themes/theme";
import styled from "styled-components"

interface IButtonProps {
	bgColor?: string;
	hoverColor?: string;
}

export const ButtonPrim = styled.button`
	margin-top: 3px;
	background-color: ${(props: IButtonProps) =>
		props.bgColor || theme.light.primColors.darkVioletRed};
	color: #ffffff;
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

interface Iprops {
	disabled?: boolean;
	type?: 'button' | 'submit' | undefined;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	children?: React.ReactNode
}

export const Button = (props: Iprops) => {
	return (
		<>
			{props.disabled ?
				<ButtonPrimDisabled type={props.type}>{props.children}</ButtonPrimDisabled>
				: <ButtonPrim type={props.type} onClick={props.onClick}>{props.children}</ButtonPrim>
			}

		</>
	)

} 