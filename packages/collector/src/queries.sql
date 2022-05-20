CREATE EXTERNAL TABLE IF NOT EXISTS gardner_samples (
    board_id INT,
    sensor_id INT,
    value DOUBLE,
    update_timestamp TIMESTAMP
)
ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
WITH SERDEPROPERTIES('paths'='board_id, sensor_id, value, update_timestamp')
LOCATION 's3://gardner-samples-tests/raw';

SELECT * FROM gardner_samples;
