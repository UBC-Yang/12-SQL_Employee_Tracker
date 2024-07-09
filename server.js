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
function viewAllEmployees() {
    const query = "SELECT * FROM employee";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}
// Function to Add Employee
    // What is the employee's first name?
    // What is the employee's last name?
    // What is the employee's role? (Use arrow keys)
    // Who is the employee's manager? (Use arrow keys)
function addEmployee() {
    // connect to database
    connection.query("SELECT id, title FROM roles", (error, results) => {
        if (error) {
            console.error(error);
            return;
        }
        const roles = results.map(({id, title}) => ({
            name: title,
            value: id,
        }));

        connection.query(
            "SELECT id, CONCAT(first_name, last_name) AS name FROM employee",
            (error, results) => {
                if (error) {
                    console.error(error);
                    return;
                }
                
                const managers = results.map(({id, name}) => ({
                    name,
                    value: id,
                }));

                // prompt user input
                inquirer
                    .prompt([
                        {
                            type: "input",
                            name: "firstName",
                            message: "What is the employee's first name?"
                        },
                        {
                            type: "input",
                            name: "lastName",
                            message: "What is the employee's last name?"
                        },
                        {
                            type: "list",
                            name: "roleID",
                            message: "What is the employee's role? (Use arrow keys)",
                            choices: roles,
                        },
                        {
                            type: "list",
                            name: "managerID",
                            message: "Who is the employee's manager? (Use arrow keys)",
                            choices: [
                                {name: "None", value: null},
                                managers,
                            ],
                        },
                    ])
                    .then ((answers) => {
                        const sql = 
                            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                        const values = [
                            answers.firstName,
                            answers.lastName,
                            answers.roleID,
                            answers.managerID,
                        ];
                        connection.query(sql, values, (error) => {
                            if (error) {
                                console.error(error);
                                return;
                            }
                            console.log("Employee added");
                            start();
                        });
                    })
                    .catch((error) => {
                        console.error(error)
                    });
            }
        );   
    });
}
// Function to Update Employee Role
    // Which employee's role do you want to update? (Use arrow keys)
    // Which role do you want to assign the selected employee? (Use arrow keys)
    // console.log("Updated employee's role")
function updateEmployeeRole() {
    const queryEmployees =
        "SELECT employee.id, employee.first_name, employee.last_name, roles.title FROM employee LEFT JOIN roles ON employee.role_id = roles.id";
    const queryRoles = "SELECT * FROM roles";
    connection.query(queryEmployees, (err, resEmployees) => {
        if (err) throw err;
        connection.query(queryRoles, (err, resRoles) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employee",
                        message: "Which employee's role do you want to update? (Use arrow keys)",
                        choices: resEmployees.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "// Which role do you want to assign the selected employee? (Use arrow keys)",
                        choices: resRoles.map((role) => role.title),
                    },
                ])
                .then((answers) => {
                    const employee = resEmployees.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` ===
                            answers.employee
                    );
                    const role = resRoles.find(
                        (role) => role.title === answers.role
                    );
                    const query =
                        "UPDATE employee SET role_id = ? WHERE id = ?";
                    connection.query(
                        query,
                        [role.id, employee.id],
                        (err, res) => {
                            if (err) throw err;
                            console.log("Updated employee's role");
                            start();
                        }
                    );
                });
        });
    });
}
// Function to View All Roles
function viewAllRoles() {
    const query = "SELECT * FROM roles";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}
// Function to Add Role
    // What is the name of the role?
    // What is the salary of the role?
    // Which department does role belong to? (Use arrow keys)
function addRole() {
    const query = "SELECT * FROM departments";
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "What is the name of the role?",
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the salary of the role?",
                },
                {
                    type: "list",
                    name: "department",
                    message: "Which department does role belong to? (Use arrow keys)",
                    choices: res.map(
                        (department) => department. department_name
                    ),
                },
            ])
            .then ((answers) => {
                const department = res.find (
                    (department) => department.name === answers.department
                );
                const query = "INSERT INTO roles SET ?";
                connection.query(
                    query,
                    {
                        title: answers.title,
                        salary: answers.salary,
                        department_id: department,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log(`${answers.roleName} added`);
                        start();
                    }
                );
            });
    });
}
// Function to View All Departments
function viewAllDepartments() {
    const query = "SELECT * FROM departments";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}
// Function to Add Department
    // What is the name of the department?
function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            name: "name",
            message: "What is the name of the department?",
        })
        .then ((answer) => {
            console.log(answer.name);
            const query = ` INSERT INTO departments (department_name) VALUES ("${answer.name}")`;
            connection.query(query, (err, res) => {
                if (err) throw err;
                console.log(`Added ${answer.name} department to the database`);
                start();
            });
        });
}