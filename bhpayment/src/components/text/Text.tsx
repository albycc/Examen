import React from "react";
import { theme } from "../../themes/theme";
import styled from "styled-components"

//Used for main headings
interface IHeadingProps {
	marginBottom?: string;
}

export const HeadingL = styled.h1`
	margin: 0;
	font-family: Lato;
	font-weight: 400;
	font-size: 24px;
	margin-bottom: ${(props: IHeadingProps) => props.marginBottom || "10px"};
	color: ${theme.light.primColors.darkVioletRed};
`;

export const HeadingM = styled.h2`
	margin: 0;
	font-family: Lato;
	font-weight: 400;
	font-size: 24px;
	color: ${theme.light.primColors.darkVioletRed};
	margin-bottom: ${(props: IHeadingProps) => props.marginBottom || "0px"};
`;

export const HeadingS = styled.h3`
	margin: 0;
	font-family: Lato;
	font-weight: 400;
	font-size: 18px;
	margin-bottom: 1.5rem;
	color: ${theme.light.primColors.darkVioletRed};
	margin-bottom: ${(props: IHeadingProps) => props.marginBottom || "0px"};
`;


//Used for regular text on the page. Customize size/color via props
interface IPProps {
	color?: string;
	fontSize?: string;
}

export const P = styled.p`
	font-family: Lato;
	font-weight: 400;
	font-size: ${(props: IPProps) => props.fontSize || "15px"};
	color: ${(props: IPProps) =>
		props.color || theme.light.primColors.darkVioletRed};
	margin: 0;
`;

export const Span = styled.span`
	font-family: Lato;
	font-weight: 400;
	font-size: ${(props: IPProps) => props.fontSize || "15px"};
	color: ${(props: IPProps) =>
		props.color || theme.light.primColors.darkVioletRed};
	margin: 0;
`;

export const SpanBold = styled.span`
	font-family: Lato;
	font-weight: 600;
	font-size: ${(props: IPProps) => props.fontSize || "15px"};
	color: ${(props: IPProps) =>
		props.color || theme.light.primColors.darkVioletRed};
	margin: 0;
`;

//Used for links. Customize size and text-decoration via props.
interface ILinkProps {
	textDeco?: string;
	color?: string;
	fontSize?: string;
}

export const LinkStyled = styled.a`
	font-family: Lato;
	font-weight: 400;
	font-size: ${(props: ILinkProps) => props.fontSize || "15px"};
	text-decoration: ${(props: ILinkProps) => props.textDeco || "underline"};
	color: ${theme.light.accColors.link};
	cursor: pointer;

	&:hover {
		color: #62a6ff;
	}
`;