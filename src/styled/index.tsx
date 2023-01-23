import { SafeAreaView, Dimensions, View, Image, TextInput, TouchableOpacity, Text, Animated, ScrollView } from 'react-native';
import styled from 'styled-components';
import { IStyledProps, defaultProps } from './IStyled';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const Page = styled(View) <IStyledProps>`
    background-color: ${props => props.background ? props.background : defaultProps.background};
    min-height: ${windowHeight}px;
`;

export const FloatPage = styled(Animated.ScrollView) <IStyledProps>`
    flex: 1;
    position: absolute;
    width: ${windowWidth}px;
    min-height: ${windowHeight / (4 / 3)}px;
    top: ${windowHeight / 4}px;
    bottom: 0;
`;

export const PageTitleView = styled(View) <IStyledProps>`
    width: 100%;
    padding: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

export const PageTitle = styled(Text) <IStyledProps>`
    font-size: 15px;
    color: white;
    font-weight: bold;
`

export const FlipPageButton = styled(TouchableOpacity) <IStyledProps>`
    width: 65px;
    height: 65px;
    background-color: #232323;
    border-radius: 100px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export const Scrollable = styled(ScrollView)<IStyledProps>`
    flex: 1;
`;

//login
export const LoginTopHalf = styled(View) <IStyledProps>`
    background-color: ${props => props.background ? props.background : defaultProps.item};
    height: ${windowHeight / 2.5}px;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

export const LoginLogo = styled(Image) <IStyledProps>`
    margin-top: ${windowHeight / 8}px;
    height: ${windowHeight / 6}px;
    width: ${windowWidth / 2}px;
`;


export const LoginBottomHalf = styled(View) <IStyledProps>`
    background-color: ${props => props.background ? props.background : defaultProps.background};
    height: ${windowHeight / 1.25}px;
    width: ${windowWidth}px;
    margin-top: -${windowWidth / 8}px;
    border-radius: 50px;
`;

//

//form
export const FormMain = styled(View) <IStyledProps>`
    width: ${windowWidth}px;
    margin-top: ${props => props.mgTop ? props.mgTop : defaultProps.mgTop}px;
    ${props => !props.login ? `
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    `  : `
    `}
`;

export const Field = styled(View) <IStyledProps>`
${props => props.login ? `
    width: 80%;
    height: 40px;
    margin-left: 10%;
    border: 1px solid ${props.letter ? props.letter : defaultProps.letter};
    border-radius: 20px;
    background-color: ${props.background ? props.background : defaultProps.item};
    color: ${props.letter ? props.letter : "gold"};
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;

    ` : `

    width: ${props.segments ? `${(100 / props.segments) - 15}` : "80"}%;
    height: 40px;
    margin-left: 10%;
    color: ${props.letter ? props.letter : "gold"};
    display: flex;
    flex-direction: column;
    margin-bottom: 50px;`
    }
`;

export const Label = styled(View) <IStyledProps>`
${props => props.login ? `
    width: 20%;
    height: 100%;
    color: white;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;

    ` : `
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
    `

    }
`;

export const LabelText = styled(Text) <IStyledProps>`
    color: white;
    font-size: 12px;
`;

export const Input = styled(TextInput) <IStyledProps>`
${props => props.login ? `
    width: 80%;
    height: 100%
    border: none;
    background-color: inherit;
    color: gold;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    ` : `
    border: 1px solid ${props.letter ? props.letter : defaultProps.letter};
    border-radius: 10px;
    background-color: ${props.background ? props.background : defaultProps.item};
    color: gold;
    `
    }
`;

export const SubmitField = styled(View) <IStyledProps>`
    width: ${windowWidth}px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: ${props => props.mgBottom ? props.mgBottom : 0}px;
    `;

export const SubmitButton = styled(TouchableOpacity) <IStyledProps>`
    width: ${props => props.width ? props.width : windowWidth / 3}px;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border: 1px solid gold;
    border-radius: 5px;
    background-color: ${props => props.background ? props.background : defaultProps.item};
`;

export const SubmitButtonText = styled(Text) <IStyledProps>`
    color: white;
    letter-spacing: ${props => props.letterSpace ? props.letterSpace : 0}px;
`;

export const LinkRecuperacaoView = styled(View) <IStyledProps>`
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

export const LinkRecuperacao = styled(Text) <IStyledProps>`
    color: white;
    text-decoration: underline;
    text-align: center;
`;

export const SigninButton = styled(TouchableOpacity) <IStyledProps>`
    width: ${windowWidth - 25}px;
    margin-left: 12.5px;
    height: 50px;
    margin-top: ${windowHeight / 20}px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border: 3px solid white;
    border-radius: 5px;
    background-color: ${props => props.background ? props.background : defaultProps.item};
`;

export const SigninButtonText = styled(Text) <IStyledProps>`
    color: white;
    font-size: 16px;
`;
//

//Footer
export const FooterView = styled(View) <IStyledProps>`
    width: 100%;
    height: ${props => props.login ? `${windowHeight / 12}px` : `${windowHeight / 8}px`};
    display: flex;
    flex-direction:row;
    justify-content: center;
    align-items: center;
`;

export const FooterText = styled(Text) <IStyledProps>`
    width: 100%;
    text-align:center;
    color: white;
`;
//

//Header
export const HeaderView = styled(View) <IStyledProps>`
    width: 100%;
    height: ${windowHeight / 4}px;
    
`;

export const HeaderChevron = styled(TouchableOpacity) <IStyledProps>`
    border-radius: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 40px;
    position: absolute;
    left: 10px;
    top: ${(windowHeight / 8) - 20}px;
    background-color: #232323;
`;

export const HeaderLogoView = styled(View) <IStyledProps>`
    width: ${windowWidth - 120}px;
    margin-top: 10px;
    margin-left: 60px;
    height: ${(windowHeight / 6) - 10}px;
`;

export const HeaderLogo = styled(Image) <IStyledProps>`
    width: 100%;
    height: 100%;
`;

export const HeaderTitleView = styled(View) <IStyledProps>`
    width: ${windowWidth - 120}px;
    margin-left: 60px;
    height: ${windowHeight / 10 - 10}px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export const HeaderTitle = styled(Text) <IStyledProps>`
    font-size: 25px;
    font-weight: bolder;
    color: white;
`;
//

//Home
export const ButtonLinks = styled(View) <IStyledProps>`
    width: ${windowWidth}px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: ${props => props.mgBottom ? props.mgBottom : 0}px;
    `;

export const ButtonLink = styled(TouchableOpacity) <IStyledProps>`
    width: ${props => props.width ? props.width : windowWidth / 3}px;
    margin: 15px;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border: 1px solid gold;
    border-radius: 5px;
    background-color: ${props => props.background ? props.background : defaultProps.item};
`;

export const ButtonLinkText = styled(Text) <IStyledProps>`
    width: 80%;
    text-align: center;
    font-size: 15px;
    color: gold;
    letter-spacing: ${props => props.letterSpace ? props.letterSpace : 0}px;
`;

export const ButtonLinkIcon = styled(Text) <IStyledProps>`
    width: 20%;
    text-align: center;
    font-size: 16px;
    font-weight: bolder;
    color: gold;
    letter-spacing: ${props => props.letterSpace ? props.letterSpace : 0}px;
`;
//

//Utils
export const CenterView = styled(View) <IStyledProps>`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;
//
