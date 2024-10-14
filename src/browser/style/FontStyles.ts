import {createGlobalStyle} from "styled-components";
import ComputerTtf from "../../assets/fonts/8bitOperatorPlus8-Bold.ttf";


export default createGlobalStyle`

@font-face {
  font-family: 'Computer';
  src: url("${ComputerTtf}") format('truetype');
}

`;
