import {Direction} from "./direction.ts";

export class Matrix {
    private readonly data: number[][];
    public rows: number;
    public cols: number;

    constructor(data: number[][]) {
        this.data = data;
        this.rows = data.length;
        this.cols = this.rows > 0 ? data[0].length : 0;
    }

    public isValidPosition(row: number, col: number): boolean {
        const isRowValid = 0 <= row && row < this.rows;
        const isColValid = 0 <= col && col < this.cols;
        return isRowValid && isColValid;
    }
    public getValue(row: number, col: number): number | null {
        if (this.isValidPosition(row, col)) {
            return this.data[row][col];
        }
        return null;
    }

    public getCenterPosition(): [number, number] {
        return [Math.floor(this.rows / 2), Math.floor(this.cols / 2)];
    }
}

export abstract class MatrixWalker {
    protected matrix: Matrix;
    protected visited: boolean[][];
    protected path: number[];

    constructor(matrix: Matrix) {
        this.matrix = matrix;
        // สร้างตารางบันทึกการเยี่ยมแต่ละช่อง เริ่มต้นทุกช่องเป็น false (ยังไม่เคยเยี่ยม)
        this.visited = Array(matrix.rows).fill(null).map(() => Array(matrix.cols).fill(false));
        this.path = [];
    }

    public abstract walk(...args: any[]): number[];

    protected markVisited(row: number, col: number): void {
        this.visited[row][col] = true;
        const value = this.matrix.getValue(row, col);
        if (value !== null) {
            this.path.push(value);
        }
    }


    protected canMoveTo(row: number, col: number): boolean {
        return this.matrix.isValidPosition(row, col) && !this.visited[row][col];
    }

    public getPathAsString(): string {
        return this.path.join(',');
    }
}



