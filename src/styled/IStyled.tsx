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
    align?: string
}

export const defaultProps = {
    background: "#222222",
    letter: "#FFFFFF",
    item: "#323232",
    blackItem: "#000000",
    mgTop: 0
}