const inquirer = require("inquirer");
const mysql = require("mysql");
const db = require("./db")

// Create MySQL Connection
const connection = mysql.createConnection({
    host: "localhost",
    port: 3001,
    user: "root",
    password: "",
    database: "employeeTracker_db"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to database");
    start();
});

// Start function
function start() {
    inquirer
        .prompt({
            type: "list",
            name: "actionChoices",
            message: "What would you like to do? (Use arrow keys)",
            choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department",
                "Quit",
            ],
        })
        .then ((answer) => {
            switch (answer.action) {
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Quit":
                    connection.end();
                    break;
            }
        })
}

// Function to View All Employees
// Function to Add Employee
// Function to Update Employee Role
// Function to View All Roles
// Function to Add Role
// Function to View All Departments
// Function to Add Department