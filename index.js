const inquirer = require("inquirer");
const mysql = require("mysql");
const { start } = require("repl");

const connection = my.sql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "sony1234",
  database: "employeeDB",
});

connection.connect(function (err) {
  if (err) throw err;
  start();
});

function start() {
  inquirer
    .prompt({
      name: "start",
      type: "list",
      message: "Select one option below",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "View Roles",
        "Add Role",
      ],
    })
    .then(function (answer) {
      switch (answer.start) {
        case "View All Employees":
          viewAll();
          break;

        case "View All Employees by Department":
          viewDepartment();
          break;

        case "View All Employees by Manager":
          viewManagers();
          break;

        case "Add Employee":
          addEmployees();
          break;

        case "Remove Employee":
         removeEmployees();
          break;

        case "Update Employee Role":
          updateEmployees();
          break;

        case "Update Employee Manager":
          updateMangers();
          break;

        case "View Roles":
          viewRoles();
          break;

        case "Add Role":
          addRole();
          break;
      }
    });
}

function viewAll() {

}

