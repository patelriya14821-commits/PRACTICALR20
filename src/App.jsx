import React, { useEffect, useState } from "react";

function EmployeeForm({ onSave, editing, onCancel }) {
  const [name, setName] = useState(editing?.name || "");
  const [salary, setSalary] = useState(editing?.salary || "");

  useEffect(() => {
    setName(editing?.name || "");
    setSalary(editing?.salary || "");
  }, [editing]);

  function handleSubmit(e) {
    e.preventDefault();

    onSave({
      name: name,
      salary: Number(salary)
    });

    setName("");
    setSalary("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editing ? "Update Employee" : "Add Employee"}</h2>

      <input
        placeholder="Employee Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Salary"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        required
      />

      <button type="submit">
        {editing ? "Update" : "Add Employee"}
      </button>

      {editing && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}

function EmployeeList({ employees, onEdit, onDelete }) {
  return (
    <div>
      <h2>Employee List</h2>

      {employees.length === 0 && <p>No employees found.</p>}

      {employees.map((emp) => (
        <div key={emp.id}>
          <h3>{emp.name}</h3>
          <p>Salary: ₹{emp.salary}</p>

          <button onClick={() => onEdit(emp)}>
            Edit
          </button>

          <button onClick={() => onDelete(emp.id)}>
            Delete
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

 function App() {
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(
          data.slice(0, 3).map((user) => ({
            id: user.id,
            name: user.name,
            salary: 20000
          }))
        );
      })
      .catch(() => console.log("API loading failed"));
  }, []);

  function saveEmployee(data) {
    if (editing) {
      setEmployees(
        employees.map((emp) =>
          emp.id === editing.id
            ? { ...emp, ...data }
            : emp
        )
      );
      setEditing(null);
    } else {
      setEmployees([
        ...employees,
        { id: Date.now(), ...data }
      ]);
    }
  }

  function deleteEmployee(id) {
    setEmployees(
      employees.filter((emp) => emp.id !== id)
    );

    if (editing?.id === id) {
      setEditing(null);
    }
  }

  return (
    <div>
      <h1>Employee Management System</h1>

      <EmployeeForm
        onSave={saveEmployee}
        editing={editing}
        onCancel={() => setEditing(null)}
      />

      <EmployeeList
        employees={employees}
        onEdit={setEditing}
        onDelete={deleteEmployee}
      />
    </div>
  );
}
export default App;