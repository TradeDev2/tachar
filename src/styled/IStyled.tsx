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
    type?: string,
    padding?: number,
    colSpan?: number,
    disabled?: boolean,
}

export const defaultProps = {
    background: "#111111",
    letter: "#FFFFFF",
    item: "#232323",
    blackItem: "#000000",
    mgTop: 0
}