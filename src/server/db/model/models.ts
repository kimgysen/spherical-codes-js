export interface TestRunDbModel {
	test_run_id?: string;
	nr_points: number;
	max_collisions: number;
	max_radius?: number;
	found_in_ms?: number;
	timeout_ms: number;
	has_timed_out: boolean;
}

export interface PointDbModel {
	point_id?: number;
	x: number;
	y: number;
	test_run_id: string;
}
