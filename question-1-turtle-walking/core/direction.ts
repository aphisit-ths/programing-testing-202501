
export class Direction {
    // ค่าคงที่สำหรับทิศทาง
    public static readonly RIGHT = 0;
    public static readonly DOWN = 1;
    public static readonly LEFT = 2;
    public static readonly UP = 3;

    // เวกเตอร์ทิศทาง (การเปลี่ยนแปลงแถว, การเปลี่ยนแปลงคอลัมน์)
    public static readonly VECTORS: [number, number][] = [
        [0, 1],   // RIGHT: ขวา (แถวเท่าเดิม, คอลัมน์ +1)
        [1, 0],   // DOWN: ลง (แถว +1, คอลัมน์เท่าเดิม)
        [0, -1],  // LEFT: ซ้าย (แถวเท่าเดิม, คอลัมน์ -1)
        [-1, 0]   // UP: ขึ้น (แถว -1, คอลัมน์เท่าเดิม)
    ];

    // ชื่อของทิศทางสำหรับแสดงผล
    public static readonly NAMES: string[] = ["RIGHT", "DOWN", "LEFT", "UP"];

    // ชื่อทิศหลักสำหรับแสดงผล (N, E, S, W)
    public static readonly CARDINAL_NAMES: string[] = ["N", "E", "S", "W"];

    /**
     * ดึงเวกเตอร์สำหรับทิศทางที่ระบุ
     */
    public static getVector(direction: number): [number, number] {
        return this.VECTORS[direction];
    }

    /**
     * หมุน 90 องศาตามเข็มนาฬิกา
     */
    public static turnClockwise(direction: number): number {
        return (direction + 1) % 4;
    }

    /**
     * ดึงชื่อของทิศทาง
     */
    public static getName(direction: number): string {
        return this.NAMES[direction];
    }

    /**
     * ดึงชื่อทิศหลักของทิศทาง
     */
    public static getCardinalName(direction: number): string {
        return this.CARDINAL_NAMES[direction];
    }
}

