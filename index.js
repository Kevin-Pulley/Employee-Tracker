const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "sony1234",
  database: "employeeDB"
});

connection.connect(function (err) {
  if (err) throw err;
  startPrompt();
});

function startPrompt() {
  inquirer
    .prompt({
      name: "choice",
      type: "list",
      message: "Select one option below",
      choices: [
        "View All Employees",
        "View All Employee's By Roles",
        "View all Employee's By Departments",
        "Update Employee",
        "Add Employee",
        "Add Role",
        "Add Department",
      ],
    })
    .then(function (val) {
      switch (val.choice) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "View All Employee's By Roles":
          viewAllRoles();
          break;

        case "View all Employee's By Departments":
          viewAllDepartments();
          break;

        case "Update Employee":
          updateEmployee();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Department":
          addDepartment();
          break;
      }
    });
}

//============= View All Employees ==========================//
function viewAllEmployees() {
  connection.query(
    "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
}

//============= View All Roles ==========================//
function viewAllRoles() {
  connection.query(
    "SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
}
//============= View All Employees By Departments ==========================//
function viewAllDepartments() {
  connection.query(
    "SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
}


let roleArr = [];
function selectRole() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }
  });
  return roleArr;
}


let managersArr = [];
function selectManager() {
  connection.query(
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
    function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        managersArr.push(res[i].first_name);
      }
    }
  );
  return managersArr;
}

//============= Update Employee ==========================//
function updateEmployee() {
  connection.query(
    "SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;",
    function (err, res) {
      // console.log(res)
      if (err) throw err;
      console.log(res);
      inquirer
        .prompt([
          {
            name: "lastName",
            type: "rawlist",
            choices: function () {
              let lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "What is the Employee's last name? ",
          },
          {
            name: "role",
            type: "rawlist",
            message: "What is the Employee's new title? ",
            choices: selectRole(),
          },
        ])
        .then(function (val) {
          let roleId = selectRole().indexOf(val.role) + 1;
          connection.query(
            "UPDATE employee SET role_id = ?  WHERE last_name = ?",
            [roleId, val.lastName],

            async function (err, res) {
              if (err) throw err;
              let wait = await res;
              viewAllRoles();
              console.table(val);
              startPrompt();
            }
          );
        });
    }
  );
}
//==================Add Employee========================//

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter new employee's first name",
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter new employee's last name",
      },
      {
        name: "role",
        type: "list",
        message: "What's employee's role",
        choices: selectRole(),
      },
      {
        name: "choice",
        type: "rawlist",
        message: "Who's their manager",
        choices: selectManager(),
      },
    ])
    .then(function (val) {
      let roleId = selectRole().indexOf(val.role) + 1;
      let managerId = selectManager().indexOf(val.choice) + 1;
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: val.firstName,
          last_name: val.lastName,
          manager_id: managerId,
          role_id: roleId,
        },
        function (err) {
          if (err) throw err;
          console.table(val);
          startPrompt();
        }
      );
    });
}

//===================Add Employee Role =========================//

function addRole() {
  connection.query(
    "SELECT role.title AS Title, role.salary AS Salary FROM role",
    function (err, res) {
      inquirer
        .prompt([
          {
            name: "Title",
            type: "input",
            message: "What is the roles Title?",
          },
          {
            name: "Salary",
            type: "input",
            message: "What is the Salary?",
          },
        ])
        .then(function (res) {
          connection.query(
            "INSERT INTO role SET ?",
            {
              title: res.Title,
              salary: res.Salary,
            },
            function (err) {
              if (err) throw err;
              console.table(res);
              startPrompt();
            }
          );
        });
    }
  );
}

//==================Add Department==========================//

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What Department would you like to add?",
      },
    ])
    .then(function (res) {
      connection.query(
        "INSERT INTO department SET ? ",
        {
          name: res.name,
        },
        function (err) {
          if (err) throw err;
          console.table(res);
          startPrompt();
        }
      );
    });
}
