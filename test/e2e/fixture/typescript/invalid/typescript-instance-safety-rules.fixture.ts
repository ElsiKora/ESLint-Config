enum Level {
	Low = 0,
	High = 1,
}

class Point {
	public x: number = 0;
}

interface Named {
	name: string;
}

export type Unnamed = Omit<Named, "name">;

export const level: Level = 5;

export const point: Point = { x: 1 };
