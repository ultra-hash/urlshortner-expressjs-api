CREATE DATABASE short_url_db;
USE short_url_db;


CREATE TABLE IF NOT EXISTS users (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number BIGINT NOT NULL UNIQUE ,
    email_id VARCHAR(320) NOT NULL UNIQUE,
    username VARCHAR(20) NOT NULL UNIQUE,
    hashed_password varchar(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_phone_number (phone_number),
    INDEX idx_username (username),
    INDEX idx_email_id (email_id)
);


CREATE TABLE IF NOT EXISTS user_details_history (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    user_column_name VARCHAR(20) NOT NULL,
    user_column_type VARCHAR(10) NOT NULL,
    previous_value VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS urls (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    short_url VARCHAR(255) NOT NULL UNIQUE,
    long_url varchar(512) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id_urls FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_short_url (short_url),
    INDEX idx_long_url (long_url),
    UNIQUE (user_id, long_url)
);


CREATE TABLE IF NOT EXISTS user_agents (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_agent VARCHAR(512) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_agent (user_agent)
);

CREATE TABLE IF NOT EXISTS ipaddresses (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    ipaddress VARCHAR(55) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ipaddress (ipaddress)
); 

CREATE TABLE IF NOT EXISTS analytics (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    url_id INT NOT NULL,
    user_agent_id INT NOT NULL,
    ipaddress_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_url_id FOREIGN KEY (url_id) REFERENCES urls(id) ON DELETE CASCADE,
    CONSTRAINT fk_ipaddress_id FOREIGN KEY (ipaddress_id) REFERENCES ipaddresses(id) ON DELETE CASCADE
    CONSTRAINT fk_user_agent_id FOREIGN KEY (user_agent_id) REFERENCES user_agents(id) ON DELETE CASCADE
);