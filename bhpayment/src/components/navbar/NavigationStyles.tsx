import styled from "styled-components";

export const NavigationBarStyled = styled.div`
    background-color: white;
    height:40px;

    .container {
		display: flex;
		justify-content: center;
	}

    .navbar {
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		display: flex;
		flex-direction: row;
		background-color: white;
		min-width: 100vw;
		padding-left: 5%;
		padding-right: 5%;
	}
`