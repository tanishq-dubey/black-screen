export default class Cursor {
    private _show = false;
    private _blink = false;

    constructor(private position: RowColumn = { row: 0, column: 0 }) {
    }

    moveAbsolute(position: PartialRowColumn, homePosition: PartialRowColumn): this {
        if (typeof position.column === "number") {
            this.position.column = position.column + homePosition.column;
        }

        if (typeof position.row === "number") {
            this.position.row = position.row + homePosition.row;
        }

        return this;
    }

    moveRelative(advancement: Advancement): this {
        const row = Math.max(0, this.row + (advancement.vertical || 0));
        const column = Math.max(0, this.column + (advancement.horizontal || 0));

        this.moveAbsolute({ row: row, column: column }, { column: 0, row: 0 });

        return this;
    }

    getPosition(): RowColumn {
        return this.position;
    }

    get column(): number {
        return this.position.column;
    }

    get row(): number {
        return this.position.row;
    }

    get blink(): boolean {
        return this._blink;
    }

    set blink(value: boolean) {
        this._blink = value;
    }

    get show(): boolean {
        return this._show;
    }

    set show(value: boolean) {
        this._show = value;
    }
}
