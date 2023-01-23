export interface IStyledProps {
    background?: string,
    letter?: string,
    item?: string,
    width?: number,
    mgTop?: number,
    mgBottom?: number,
    letterSpace?: number,
    login?:boolean,
    left?: number,
    segments?: number,
}

export const defaultProps = {
    background: "#000000",
    letter: "#FFFFFF",
    item: "#212121",
    mgTop: 0
}