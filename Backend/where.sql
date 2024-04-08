-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS GestionRH;
USE GestionRH;

-- Crear la tabla de departamentos
CREATE TABLE departamentos (
    departamento_id INT PRIMARY KEY,
    nombre VARCHAR(50),
    ubicacion VARCHAR(100),
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    change_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE current_timestamp(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'unknown',
    changed_by VARCHAR(255) NOT NULL DEFAULT 'unknown'
);

-- Crear la tabla de empleados
CREATE TABLE empleados (
    empleado_id INT PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    fecha_nacimiento DATE,
    salario INT,
    departamento_id INT,
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    change_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE current_timestamp(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'unknown',
    changed_by VARCHAR(255) NOT NULL DEFAULT 'unknown',
    INDEX idx_departamento_id (departamento_id),
    FOREIGN KEY (departamento_id) REFERENCES departamentos(departamento_id)
);

-- Eliminar la base de datos (descomenta para ejecutar)
-- DROP DATABASE IF EXISTS GestionRH;

-- Crear los triggers para las tablas
CREATE TRIGGER before_insert_empleados_createdby
BEFORE INSERT ON empleados
FOR EACH ROW
SET NEW.created_by = SUBSTRING_INDEX(USER(), '@', 1);

CREATE TRIGGER before_insert_empleados_changedby
BEFORE INSERT ON empleados
FOR EACH ROW
SET NEW.changed_by = SUBSTRING_INDEX(USER(), '@', 1);

CREATE TRIGGER before_update_empleados_changedby
BEFORE UPDATE ON empleados
FOR EACH ROW
SET NEW.changed_by = SUBSTRING_INDEX(USER(), '@', 1);

-- Insertar 10 registros en la tabla de departamentos
-- Insertar datos en la tabla de departamentos
INSERT INTO departamentos (departamento_id, nombre, ubicacion)
VALUES 
    (1, 'Ventas', 'Ciudad A'),
    (2, 'Marketing', 'Ciudad B'),
    (3, 'Recursos Humanos', 'Ciudad C');

-- Insertar datos en la tabla de empleados
INSERT INTO empleados (empleado_id, nombre, apellido, fecha_nacimiento, salario, departamento_id)
VALUES
    (1, 'Juan', 'Pérez', '1990-05-15', 35000, 1),
    (2, 'María', 'Gómez', '1985-08-20', 40000, 2),
    (3, 'Carlos', 'López', '1992-02-10', 32000, 3),
    (4, 'Ana', 'Martínez', '1988-11-25', 38000, 1),
    (5, 'Pedro', 'Sánchez', '1995-04-30', 42000, 2),
    (6, 'Laura', 'Díaz', '1993-09-05', 30000, 3),
    (7, 'Luis', 'Fernández', '1987-07-12', 35000, 1),
    (8, 'Elena', 'Ruiz', '1991-03-18', 39000, 2),
    (9, 'Miguel', 'Hernández', '1994-06-22', 33000, 3),
    (10, 'Sara', 'García', '1989-12-08', 37000, 1);


CREATE VIEW vista_empleados_filtrados AS
SELECT e.*, d.nombre AS nombre_departamento
FROM empleados e
INNER JOIN departamentos d ON e.departamento_id = d.departamento_id
WHERE e.salario > 30000 
    AND e.nombre LIKE 'J%' 
    AND d.nombre IN ('Ventas', 'Marketing')
    AND e.fecha_nacimiento BETWEEN '1990-01-01' AND '2000-12-31';


SELECT * FROM vista_empleados_filtrados;

UPDATE empleados
SET salario = 40000
WHERE empleado_id = 1;

select * from empleados;
