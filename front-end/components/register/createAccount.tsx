import React, { useState } from "react";
import { User } from "../../types";
import { createAccount } from "../../service/UserService";

const CreateAccount: React.FC = () => {
  const [user, setUser] = useState<User>({ username: "", password: "", email: "" });
  const [error, setError] = useState<{ username?: string; password?: string; email?: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
    setError((prevError) => ({ ...prevError, [name]: "" })); // Clear error when input is changed
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    // Basic validation
    const newError: { username?: string; password?: string; email?: string } = {};
    if (!user.username) newError.username = "Username is required";
    if (!user.password) newError.password = "Password is required";
    if (!user.email) newError.email = "Email is required";

    setError(newError);

    // Stop form submission if there are validation errors
    if (Object.keys(newError).length > 0) return;

    const result = await createAccount(user);

    if (result.success) {
      setSuccessMessage("Account created successfully!");
      setUser({ username: "", password: "", email: "" });
      setError({}); // Clear any previous errors on successful submission
    } else {
      setError({ email: result.error || "Failed to create account" });
    }
  };

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      minHeight: "100vh", backgroundColor: "#f0f0f0", padding: "20px"
    }}>
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "30px", border: "2px solid black", maxWidth: "600px", width: "100%",
        backgroundColor: "#f8eaea", borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
      }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Create Account</h2>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px", width: "100%" }}>Username</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              style={{
                width: "100%", padding: "10px", border: "2px solid black", borderRadius: "4px"
              }}
            />
            {error.username && <div style={{ color: "black", marginTop: "5px" }}>{error.username}</div>}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px", width: "100%" }}>Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              style={{
                width: "100%", padding: "10px", border: "2px solid black", borderRadius: "4px"
              }}
            />
            {error.password && <div style={{ color: "black", marginTop: "5px" }}>{error.password}</div>}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px", width: "100%" }}>Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              style={{
                width: "100%", padding: "10px", border: "2px solid black", borderRadius: "4px"
              }}
            />
            {error.email && <div style={{ color: "black", marginTop: "5px" }}>{error.email}</div>}
          </div>

          <button type="submit" style={{
            padding: "12px", backgroundColor: "#cccccc", border: "2px solid black",
            cursor: "pointer", width: "100%", fontWeight: "bold", borderRadius: "4px"
          }}>
            Register
          </button>
        </form>
        {successMessage && <div style={{ color: "green", marginTop: "10px" }}>{successMessage}</div>}
      </div>
    </div>
  );
};

export default CreateAccount;
