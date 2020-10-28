DROP DATABASE IF EXISTS employeeDB;

CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE department (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employees (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_Name VARCHAR(30),
    role_id INT,
    manager_id INT, 
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

USE employeeDB;
INSERT INTO department (name) VALUES
("Sales"),
("IT"),
("Accounting"),
("Legal");

INSERT INTO role (title, salary, department_id) VALUES
("Lead Engineer", 160000, 2),
("Legal Team Lead", 250000, 4),
("Accountant", 120000, 3),
("Sales Lead", 100000, 1),
("Salesperson", 85000, 1),
("Software Engineer", 125000, 2),
("Lawyer", 170000, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id ) VALUES
("Kevin", "Pulley",null,1),
("Chad","Tarpey",null,2),
("Alex", "Andrews",null,3),
("Brett","Heimbach",1,4),
("Kaitlyn","Duke",4,5),
("Kim","Finn",1,6),
("Kayla","Kelley",2,7);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;