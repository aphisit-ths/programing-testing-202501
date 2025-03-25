
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

    public static getVector(direction: number): [number, number] {
        return this.VECTORS[direction];
    }
}

