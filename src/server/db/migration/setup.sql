
CREATE TABLE test_run
(
    test_run_id   UUID,
    nr_circles    INT     NOT NULL,
    nr_collisions INT     NOT NULL,
    max_radius    NUMERIC(15, 14),
    found_in_ms   INT,
    timeout_ms    INT,
    has_timed_out BOOLEAN NOT NULL,
    PRIMARY KEY (test_run_id)
);

CREATE TABLE points_before
(
    circle_id   INT GENERATED ALWAYS AS IDENTITY,
    x           NUMERIC(17, 16) NOT NULL,
    y           NUMERIC(17, 16) NOT NULL,
    test_run_id UUID,
    PRIMARY KEY (circle_id),
    CONSTRAINT fk_test_run
        FOREIGN KEY (test_run_id)
            REFERENCES test_run (test_run_id)
);

CREATE INDEX on points_before(test_run_id);

CREATE TABLE points_after
(
    circle_id   INT GENERATED ALWAYS AS IDENTITY,
    x           NUMERIC(17, 16) NOT NULL,
    y           NUMERIC(17, 16) NOT NULL,
    test_run_id UUID,
    PRIMARY KEY (circle_id),
    CONSTRAINT fk_test_run
        FOREIGN KEY (test_run_id)
            REFERENCES test_run (test_run_id)
);

CREATE INDEX on points_before(test_run_id);

CREATE TABLE geometry_index
(
    geometry_idx_id INT GENERATED ALWAYS AS IDENTITY,
    test_run_id UUID,
    geometry_idx NUMERIC,
    PRIMARY KEY (geometry_idx_id),
    CONSTRAINT fk_test_run
        FOREIGN KEY (test_run_id)
            REFERENCES test_run (test_run_id)
);

CREATE INDEX on geometry_index(test_run_id);
