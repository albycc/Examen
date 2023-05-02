import React from "react";
import styled from "styled-components";

const LayoutRow = styled.div`
 display: flex;
 justify-content: center;
 position: relative;
 top:120px;
`

const ContentGroup = styled.main`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;

    @media screen and (min-width:768px){
        width:80%;
    }

    @media screen and (min-width:992px) {
        max-width: 1000px;
    }
`

interface Iprops {
    children: React.ReactNode;
}

const MainCenterLayout = ({ children }: Iprops) => {
    return (
        <LayoutRow>
            <ContentGroup>
                {children}
            </ContentGroup>
        </LayoutRow>
    )
}

export default MainCenterLayout
