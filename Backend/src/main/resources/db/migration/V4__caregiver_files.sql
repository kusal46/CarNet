-- caregivers table keeps file path to avatar
ALTER TABLE users MODIFY COLUMN role VARCHAR(32); -- if needed

CREATE TABLE IF NOT EXISTS caregivers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    location VARCHAR(200) NOT NULL,
    summary TEXT NOT NULL,
    available BOOLEAN NOT NULL,
    rate DECIMAL(10,2) NOT NULL,
    languages JSON NOT NULL,
    skills JSON NOT NULL,
    services JSON NOT NULL,
    avatar_path VARCHAR(512) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS caregiver_certifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    caregiver_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    issuer VARCHAR(200) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    FOREIGN KEY (caregiver_id) REFERENCES caregivers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS caregiver_work_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    caregiver_id BIGINT NOT NULL,
    descr TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date   DATE NOT NULL,
    FOREIGN KEY (caregiver_id) REFERENCES caregivers(id) ON DELETE CASCADE
);
