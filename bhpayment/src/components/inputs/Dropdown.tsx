import styled from "styled-components";
import BootstrapDropdown from "react-bootstrap/Dropdown"
import { theme } from "../../themes/theme";

const Dropdown = styled(BootstrapDropdown)`
    background-color: white;
    width:100%;
    max-width: 200px;

    .dropdown-toggle{
        background-color: white;
        border:1px solid ${theme.light.secColors.midGray};
        color: ${theme.light.primColors.darkGray}


    }
`

export default Dropdown