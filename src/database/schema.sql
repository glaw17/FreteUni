CREATE DATABASE IF NOT EXISTS freteuni;
USE freteuni;

-- TABELA USERS --
CREATE TABLE IF NOT EXISTS users (
    id_user INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    cpf VARCHAR(11) UNIQUE NULL,
    cnpj VARCHAR(14) UNIQUE NULL,
    company_name VARCHAR(100) NULL,

    user_type ENUM(
    'BUYER', 
    'DRIVER'
    ) NOT NULL,
    accepted_terms BOOLEAN NOT NULL DEFAULT FALSE,
    terms_accepted_at DATETIME NULL,

    -- Obrigatorio o preenchimento de CPF OU CNPJ, nunca os dois.
    CONSTRAINT check_user_document CHECK (
        (cpf IS NOT NULL AND cnpj IS NULL AND company_name IS NULL)
        OR
        (cpf IS NULL AND cnpj IS NOT NULL AND company_name IS NOT NULL)
    )
);

-- TABELA BUYERS --
CREATE TABLE IF NOT EXISTS buyers (
    id_buyer INT UNSIGNED PRIMARY KEY,
    FOREIGN KEY (id_buyer) REFERENCES users(id_user)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- TABELA DRIVERS --
CREATE TABLE IF NOT EXISTS drivers (
    id_driver INT UNSIGNED PRIMARY KEY,
    cnh_number VARCHAR(11) UNIQUE NOT NULL,
    
    cnh_type ENUM(
        'A', 'B', 'C', 'D', 'E'
    ) NOT NULL,

    cnh_expiration DATE NOT NULL,
    interstate BOOLEAN NOT NULL DEFAULT FALSE,

    FOREIGN KEY (id_driver) REFERENCES users(id_user)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- TABELA CARS --
CREATE TABLE IF NOT EXISTS cars (
	id_car INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_driver INT UNSIGNED NOT NULL,
    
    vehicle_type ENUM(
        'CAR',
        'VAN',
        'TRUCK'
    ) NOT NULL,

    plate VARCHAR(7) UNIQUE NOT NULL,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    color VARCHAR(30) NULL,
    load_capacity DECIMAL(10,2) NULL,

    FOREIGN KEY (id_driver) REFERENCES drivers(id_driver)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR(128) PRIMARY KEY,
    data TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    INDEX (expires_at)
);

CREATE TABLE IF NOT EXISTS reviews (
    id_review INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    rating TINYINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_review_rating CHECK (rating BETWEEN 0 AND 10)
);
