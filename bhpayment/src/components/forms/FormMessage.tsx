import styled from "styled-components"

const FormMessage = styled.div`
	text-align: center;
	padding:10px;
	margin-top: 10px;
	margin-bottom: 10px;


`

export const FormMessageSuccess = styled(FormMessage)`
	background-color: lightgreen;
`

export const FormMessageError = styled(FormMessage)`
	background-color: #f58c8c;
`