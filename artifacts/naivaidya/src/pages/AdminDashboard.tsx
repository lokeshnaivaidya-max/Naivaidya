import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import naivaidyaLogo from "@assets/naivaidya_logo.jpg";

interface Admin {
  username: string;
  password: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [currentAdmin, setCurrentAdmin] = useState("admin");
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "admins">("dashboard");

  // Change Password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changeMsg, setChangeMsg] = useState("");

  // Add New Admin
  const [newUsername, setNewUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [addMsg, setAddMsg] = useState("");

  useEffect(() => {
    const savedAdmins = JSON.parse(localStorage.getItem("admins") || "[]");
    if (savedAdmins.length === 0) {
      const defaultAdmins = [{ username: "admin", password: "admin123" }];
      localStorage.setItem("admins", JSON.stringify(defaultAdmins));
      setAdmins(defaultAdmins);
    } else {
      setAdmins(savedAdmins);
    }
  }, []);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setChangeMsg("New passwords do not match!");
      return;
    }

    const savedAdmins: Admin[] = JSON.parse(localStorage.getItem("admins") || "[]");
    const adminIndex = savedAdmins.findIndex(a => a.username === currentAdmin);

    if (adminIndex !== -1 && savedAdmins[adminIndex].password === oldPassword) {
      savedAdmins[adminIndex].password = newPassword;
      localStorage.setItem("admins", JSON.stringify(savedAdmins));
      setAdmins(savedAdmins);
      setChangeMsg("✅ Password changed successfully!");
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
    } else {
      setChangeMsg("❌ Old password is incorrect!");
    }
  };

  const handleAddNewAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newAdminPassword) {
      setAddMsg("Please fill all fields");
      return;
    }

    const savedAdmins: Admin[] = JSON.parse(localStorage.getItem("admins") ||
