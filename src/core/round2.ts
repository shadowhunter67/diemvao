/** Làm tròn 2 chữ số thập phân, tránh sai số dấu phẩy động (0.1 + 0.2 kiểu). */
export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
