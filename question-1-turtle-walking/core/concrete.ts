import {MatrixWalker} from "./matrix.ts";
import {Direction} from "./direction.ts";

export class ZigzagWalker extends MatrixWalker {

    public walk(startRow: number = 0, startCol: number = 0): number[] {
        this.path = [];

        // ขยับทีละ column
        for (let col = 0; col < this.matrix.cols; col++) {
            // เป็น column คู่หรือเปล่า
            const isEvenColumn = col % 2 === 0

            // ถ้าเป็น column คู่ให้ iter ลงไปในแต่ละ row ของ column นั้น (row 0 to n-1)
            if (isEvenColumn) {
                for (let row = 0; row < this.matrix.rows; row++) {
                    const value = this.matrix.getValue(row, col);
                    if (value !== null) {
                        this.path.push(value);
                    }
                }
            }
            // ถ้าเป็น column คี่ iter ขึ้นไปไปในแต่ละ row ของ column นั้น (row n-1 to 0)
            else {
                for (let row = this.matrix.rows - 1; row >= 0; row--) {
                    const value = this.matrix.getValue(row, col);
                    if (value !== null) {
                        this.path.push(value);
                    }
                }
            }
        }

        return this.path;
    }
}

export class SpiralWalker extends MatrixWalker {
    private startRow: number = 0;

    public walk(startRow: number, startCol: number): number[] {
        this.path = [];
        this.visited = Array(this.matrix.rows).fill(null).map(() => Array(this.matrix.cols).fill(false));

        // บันทึกตำแหน่งแถวเริ่มต้น
        this.startRow = startRow;

        let row = startRow;
        let col = startCol;
        this.markVisited(row, col);

        // เริ่มด้วยทิศทางขวา
        let direction = Direction.RIGHT;

        while (true) {
            let moved = false;

            // ลองทุกทิศทาง เริ่มจากทิศทางปัจจุบัน
            for (let i = 0; i < 4; i++) {
                const currDirection = (direction + i) % 4;
                const [dr, dc] = Direction.getVector(currDirection);
                const nextRow = row + dr;
                const nextCol = col + dc;

                if (this.canMoveToWithConstraint(nextRow, nextCol, row, currDirection)) {
                    direction = currDirection;
                    row = nextRow;
                    col = nextCol;
                    this.markVisited(row, col);
                    moved = true;
                    break;
                }
            }

            if (!moved) break;
        }

        return this.path;
    }

    private canMoveToWithConstraint(nextRow: number, nextCol: number, currentRow: number, direction: number): boolean {
        // เงื่อนไขพื้นฐาน: ต้องอยู่ในขอบเขตและยังไม่เคยเดินผ่าน
        const basicCondition = this.canMoveTo(nextRow, nextCol);

        if (!basicCondition) return false;

        // เงื่อนไขพิเศษ: ถ้ากำลังเดินขึ้น (UP) และจะทำให้กลับไปที่แถวที่อยู่เหนือจุดเริ่มต้น
        // หรือเดินมาถึงแถวเดียวกับจุดเริ่มต้นแล้ว ห้ามเดินขึ้นต่อ
        if (direction === Direction.UP && nextRow <= this.startRow && currentRow <= this.startRow + 1) {
            return false;
        }

        return true;
    }
}

