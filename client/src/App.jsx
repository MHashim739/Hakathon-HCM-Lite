import { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  RefreshCw,
  BriefcaseBusiness,
  LayoutDashboard,
  Menu,
  X,
  Trash2,
  Pencil,
} from "lucide-react";
import "./App.css";
import Login from "./Login.jsx";

const API = "http://localhost:5000/api/employees";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    department: "IT",
    designation: "",
    status: "Active",
  });

  async function loadEmployees() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load employees");
      }

      setEmployees(result.data || []);
    } catch (err) {
      setError("Employees load nahi huay. Backend check karo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setForm({
      employeeId: "",
      firstName: "",
      lastName: "",
      email: "",
      department: "IT",
      designation: "",
      status: "Active",
    });
    setShowForm(true);
  }

  function openEditForm(employee) {
    setEditingId(employee._id);
    setForm({
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      department: employee.department,
      designation: employee.designation,
      status: employee.status,
    });
    setShowForm(true);
  }

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submitForm(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not save employee");
      }

      setShowForm(false);
      setEditingId(null);
      await loadEmployees();
    } catch (err) {
      setError(err.message || "Employee save nahi hua.");
    }
  }

  async function deleteEmployee(id) {
    if (!window.confirm("Kya tum is employee ko delete karna chahte ho?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, { method: "DELETE" });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Delete failed");
      }

      await loadEmployees();
    } catch (err) {
      setError(err.message || "Employee delete nahi hua.");
    }
  }

  const filteredEmployees = employees.filter((employee) =>
    `${employee.firstName} ${employee.lastName} ${employee.employeeId} ${employee.email} ${employee.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const activeCount = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  const departments = new Set(
    employees.map((employee) => employee.department)
  ).size;

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><Users size={23} /></div>
          <div>
            <h2>HCM Lite</h2>
            <span>Human Capital Management</span>
          </div>
          <button
            className="icon-button mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <p className="nav-label">WORKSPACE</p>
        <div className="nav-item active">
          <LayoutDashboard size={19} /> Dashboard
        </div>
        <div className="nav-item">
          <Users size={19} /> Employees
        </div>
        <div className="sidebar-bottom">
          <div className="profile-avatar">H</div>
          <div>
            <strong>HCM Admin</strong>
            <span>Administrator</span>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={21} />
          </button>
          <div>
            <p className="breadcrumb">Workspace / Dashboard</p>
            <h1>Employee Dashboard</h1>
          </div>
          <div className="topbar-right">
            <span className="online-dot" /> System Online
          </div>
        </header>

        <section className="page-content">
          <div className="welcome-row">
            <div>
              <h2>Welcome back, Admin 👋</h2>
              <p>Manage your people and employee records in one place.</p>
            </div>
            <button className="primary-button" onClick={openAddForm}>
              <UserPlus size={18} /> Add Employee
            </button>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple"><Users size={22} /></div>
              <span>Total Employees</span>
              <strong>{employees.length}</strong>
              <small>Registered employee records</small>
            </div>
            <div className="stat-card">
              <div className="stat-icon green"><UserPlus size={22} /></div>
              <span>Active Employees</span>
              <strong>{activeCount}</strong>
              <small>Currently marked active</small>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange"><BriefcaseBusiness size={22} /></div>
              <span>Departments</span>
              <strong>{departments}</strong>
              <small>Departments represented</small>
            </div>
          </div>

          <section className="table-card">
            <div className="table-heading">
              <div>
                <h2>Employee Directory</h2>
                <p>View and manage your employee records.</p>
              </div>
              <button className="secondary-button" onClick={loadEmployees}>
                <RefreshCw size={16} /> Refresh
              </button>
            </div>

            <div className="table-toolbar">
              <div className="search-box">
                <Search size={18} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, ID, email or department..."
                />
              </div>
              <span className="record-count">
                {filteredEmployees.length} records
              </span>
            </div>

            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>EMPLOYEE</th>
                    <th>EMPLOYEE ID</th>
                    <th>DEPARTMENT</th>
                    <th>DESIGNATION</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" className="empty-state">Loading employees...</td></tr>
                  ) : filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        No employees found. Add your first employee.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <tr key={employee._id}>
                        <td>
                          <div className="employee-cell">
                            <div className="employee-avatar">
                              {employee.firstName?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <strong>{employee.firstName} {employee.lastName}</strong>
                              <span>{employee.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>{employee.employeeId}</td>
                        <td>{employee.department}</td>
                        <td>{employee.designation}</td>
                        <td>
                          <span className={`status-badge ${employee.status === "Active" ? "status-active" : employee.status === "Inactive" ? "status-inactive" : "status-leave"}`}>
                            {employee.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="icon-button edit-button"
                              title="Edit employee"
                              onClick={() => openEditForm(employee)}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="icon-button delete-button"
                              title="Delete employee"
                              onClick={() => deleteEmployee(employee._id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
          <footer>HCM Lite · Employee Management System</footer>
        </section>
      </main>

      {showForm && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowForm(false);
        }}>
          <section className="employee-modal">
            <div className="modal-heading">
              <div>
                <h2>{editingId ? "Edit Employee" : "Add Employee"}</h2>
                <p>Enter the employee details below.</p>
              </div>
              <button className="icon-button" onClick={() => setShowForm(false)} aria-label="Close form">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submitForm}>
              <div className="form-grid">
                <label>
                  Employee ID
                  <input name="employeeId" value={form.employeeId} onChange={updateField} required />
                </label>
                <label>
                  Email
                  <input name="email" type="email" value={form.email} onChange={updateField} required />
                </label>
                <label>
                  First Name
                  <input name="firstName" value={form.firstName} onChange={updateField} required />
                </label>
                <label>
                  Last Name
                  <input name="lastName" value={form.lastName} onChange={updateField} required />
                </label>
                <label>
                  Department
                  <select name="department" value={form.department} onChange={updateField} required>
                    <option>IT</option>
                    <option>Human Resources</option>
                    <option>Finance</option>
                    <option>Marketing</option>
                    <option>Operations</option>
                    <option>Sales</option>
                  </select>
                </label>
                <label>
                  Designation
                  <input name="designation" value={form.designation} onChange={updateField} required />
                </label>
                <label>
                  Status
                  <select name="status" value={form.status} onChange={updateField}>
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>On Leave</option>
                  </select>
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {editingId ? "Save Changes" : "Create Employee"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
