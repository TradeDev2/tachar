export interface IStyledProps {
    background?: string,
    letter?: string,
    item?: string,
    width?: number,
    mgTop?: number,
    mgBottom?: number,
    mgLeft?: number,
    mgRight?: number,
    letterSpace?: number,
    login?:boolean,
    left?: number,
    segments?: number,
}

export const defaultProps = {
    background: "#000000",
    letter: "#FFFFFF",
    item: "#454545",
    mgTop: 0
}