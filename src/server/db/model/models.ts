
export interface TestRunModel {
	test_run_id?: string;
	nr_circles: number;
	nr_collisions: number;
	max_radius?: number;
	found_in_ms?: number;
	timeout_ms: number;
	has_timed_out: boolean;
}

export interface PointModel {
	circle_id?: number;
	x: number;
	y: number;
	test_run_id: string;
}

