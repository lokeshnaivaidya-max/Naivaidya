import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import naivaidyaLogo from "@assets/naivaidya_logo.jpg";

interface Admin {
  username: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  message?: string;
  status: "Yet to Contact" | "Contacted" | "Need to Contact Again" | "No Need";
  registeredAt: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [currentAdmin] = useState("admin");
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "admins">("dashboard");

  // Change Password States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changeMsg, setChangeMsg] = useState("");

  // Add New Admin States
  const [newUsername, setNewUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [addMsg, setAddMsg] = useState("");

  useEffect(() => {
    // Load Admins
    const savedAdmins = JSON.parse(localStorage.getItem("admins") || "[]");
    if (savedAdmins.length === 0) {
      const defaultAdmins = [{ username: "admin", password: "admin123" }];
      localStorage.setItem("admins", JSON.stringify(defaultAdmins));
      setAdmins(defaultAdmins);
    } else {
      setAdmins(savedAdmins);
    }

    // Load Users
    const savedUsers = JSON.parse(localStorage.getItem("naivaidya_users") || "[]");
    setUsers(savedUsers);
  }, []);

  const updateUserStatus = (id: string, newStatus: User["status"]) => {
    const updatedUsers = users.map(user =>
      user.id === id ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem("naivaidya_users", JSON.stringify(updatedUsers));
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setChangeMsg("❌ New passwords do not match!");
      return;
    }

    const savedAdmins: Admin[] = JSON.parse(localStorage.getItem("admins") || "[]");
    const adminIndex = savedAdmins.findIndex(a => a.username === currentAdmin);

    if (adminIndex !== -1 && savedAdmins[adminIndex].password === oldPassword) {
      savedAdmins[adminIndex].password = newPassword;
      localStorage.setItem("admins", JSON.stringify(savedAdmins));
      setAdmins(savedAdmins);
      setChangeMsg("✅ Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setChangeMsg("❌ Old password is incorrect!");
    }
  };

  const handleAddNewAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newAdminPassword) {
      setAddMsg("❌ Please fill all fields");
      return;
    }

    const savedAdmins: Admin[] = JSON.parse(localStorage.getItem("admins") || "[]");
    if (savedAdmins.some(a => a.username === newUsername)) {
      setAddMsg("❌ Username already exists!");
      return;
    }

    const newAdmin = { username: newUsername, password: newAdminPassword };
    savedAdmins.push(newAdmin);
    localStorage.setItem("admins", JSON.stringify(savedAdmins));
    setAdmins(savedAdmins);
    setAddMsg("✅ New Admin created successfully!");
    setNewUsername("");
    setNewAdminPassword("");
  };

  const handleLogout = () => {
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("rememberedUsername");
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src={naivaidyaLogo} alt="NAIVAIDYA" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-purple-700">NAIVAIDYA Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, <b>{currentAdmin}</b></span>
          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] p-6">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-left px-4 py-3 rounded-xl mb-2 ${activeTab === "dashboard" ? "bg-purple-100 text-purple-700 font-medium" : "hover:bg-gray-100"}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full text-left px-4 py-3 rounded-xl mb-2 ${activeTab === "users" ? "bg-purple-100 text-purple-700 font-medium" : "hover:bg-gray-100"}`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("admins")}
            className={`w-full text-left px-4 py-3 rounded-xl ${activeTab === "admins" ? "bg-purple-100 text-purple-700 font-medium" : "hover:bg-gray-100"}`}
          >
            Manage Admins
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div>
              <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
              <p className="text-gray-600 text-lg">Total Registered Users: <b className="text-purple-600">{users.length}</b></p>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Registered Users</h2>
              <div className="bg-white rounded-3xl shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left">Name</th>
                      <th className="px-6 py-4 text-left">Phone</th>
                      <th className="px-6 py-4 text-left">Email</th>
                      <th className="px-6 py-4 text-left">Message</th>
                      <th className="px-6 py-4 text-left">Status</th>
                      <th className="px-6 py-4 text-left">Registered At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-16 text-gray-500">
                          No users registered yet.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="border-t hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium">{user.name}</td>
                          <td className="px-6 py-4">{user.phone}</td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{user.message || "-"}</td>
                          <td className="px-6 py-4">
                            <select
                              value={user.status}
                              onChange={(e) => updateUserStatus(user.id, e.target.value as User["status"])}
                              className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-purple-500"
                            >
                              <option value="Yet to Contact">Yet to Contact</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Need to Contact Again">Need to Contact Again</option>
                              <option value="No Need">No Need</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{user.registeredAt}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Manage Admins Tab */}
          {activeTab === "admins" && (
            <div className="space-y-10">
              {/* Change Password */}
              <div className="bg-white p-8 rounded-3xl shadow">
                <h3 className="text-2xl font-bold mb-6">Change Password</h3>
                <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-3 border rounded-2xl"
                    required
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border rounded-2xl"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border rounded-2xl"
                    required
                  />
                  <button type="submit" className="w-full py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700">
                    Update Password
                  </button>
                </form>
                {changeMsg && <p className="mt-4 text-lg font-medium">{changeMsg}</p>}
              </div>

              {/* Add New Admin */}
              <div className="bg-white p-8 rounded-3xl shadow">
                <h3 className="text-2xl font-bold mb-6">Add New Admin</h3>
                <form onSubmit={handleAddNewAdmin} className="max-w-md space-y-4">
                  <input
                    type="text"
                    placeholder="New Username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-4 py-3 border rounded-2xl"
                    required
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    className="w-full px-4 py-3 border rounded-2xl"
                    required
                  />
                  <button type="submit" className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700">
                    Create New Admin
                  </button>
                </form>
                {addMsg && <p className="mt-4 text-lg font-medium">{addMsg}</p>}
              </div>

              {/* Admins List */}
              <div className="bg-white p-8 rounded-3xl shadow">
                <h3 className="text-2xl font-bold mb-6">All Admins ({admins.length})</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-6">Username</th>
                      <th className="text-left py-4 px-6">Password</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium">{admin.username}</td>
                        <td className="py-4 px-6 text-gray-500">••••••••</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
