import {Matrix} from "./matrix.ts";
import {SpiralWalker, ZigzagWalker} from "./concrete.ts";

export class MatrixTurtleSolver {
    private readonly matrix: Matrix;

    constructor(matrixData: number[][]) {
        this.matrix = new Matrix(matrixData);
    }

    public processZigzagWalk(): string {
        const walker = new ZigzagWalker(this.matrix);
        walker.walk();
        return walker.getPathAsString();
    }

    public processSpiralWalk(start:number[]): string {
        const walker = new SpiralWalker(this.matrix);
        walker.walk(start[0] ,start[1]);
        return walker.getPathAsString();
    }
}