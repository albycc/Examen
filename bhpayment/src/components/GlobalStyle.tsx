import { createGlobalStyle } from "styled-components";
import { theme } from "../themes/theme";

export const GlobalStyle = createGlobalStyle`
    html,body,#root{
        background-color:${theme.light.primColors.lightGray};  
    }
    html {
        scrollbar-color: ${theme.light.accColors.orange} ${theme.light.primColors.lightGray};
        scrollbar-width: thin;
        
    }
    ::-webkit-scrollbar-thumb {
              background-color: ${theme.light.accColors.orange};
              border-radius: 5px;
            }

    ::-webkit-scrollbar-track {
              background: ${theme.light.primColors.lightGray};
              border-radius: 5px;
            }
    ::-webkit-scrollbar {
              width: 10px;
              margin-left:10px;
            }
    *{
        margin: 0;
        padding: 0;
    }
`;
