DROP DATABASE IF EXISTS Freteuni;
CREATE DATABASE IF NOT EXISTS  Freteuni;
USE  Freteuni;

-- TABELA USERS --
CREATE TABLE IF NOT EXISTS users (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    cpf CHAR(11) UNIQUE NULL,
    cnpj CHAR(14) UNIQUE NULL,
    company_name VARCHAR(100) NULL,

    user_type ENUM(
    'BUYER', 
    'DRIVER'
    ) NOT NULL,

    -- Obrigatorio o preenchimento de CPF OU CNPJ, nunca os dois.
    CHECK (
        (cpf IS NOT NULL AND cnpj IS NULL AND company_name IS NULL)
        OR
        (cpf IS NULL AND cnpj IS NOT NULL AND company_name IS NOT NULL)
    )
);

-- TABELA BUYERS --
CREATE TABLE IF NOT EXISTS buyers (
    id_user INT PRIMARY KEY,
    FOREIGN KEY (id_user) REFERENCES users(id_user)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- TABELA DRIVERS --
CREATE TABLE IF NOT EXISTS drivers (
    id_user INT PRIMARY KEY,
    cnh_number CHAR(11) UNIQUE NOT NULL,
    
    cnh_category ENUM(
        'A', 'B', 'C', 'D', 'E',
        'AB', 'AC', 'AD', 'AE',
        'BC', 'BD', 'BE',
        'CD', 'CE', 'DE'
    ) NOT NULL,

    cnh_expiration DATE NOT NULL,

    FOREIGN KEY (id_user) REFERENCES users(id_user)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- TABELA CARS --
CREATE TABLE IF NOT EXISTS cars (
	id_car INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL,
    
    vehicle_type ENUM(
        'MOTORCYCLE',
        'CAR',
        'VAN',
        'TRUCK',
        'SEMI_TRAILER',
        'BITRAIN',
        'ROAD_TRAIN',
        'OTHER'
    ) NOT NULL,

    plate CHAR(7) UNIQUE NOT NULL,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year YEAR NOT NULL,
    color VARCHAR(30) NULL,
    load_capacity DECIMAL(10,2) NULL,

    FOREIGN KEY (driver_id) REFERENCES drivers(id_user)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
