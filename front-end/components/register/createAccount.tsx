
import React, { useState } from "react";
import { User } from "../../types/index";
import { createAccount } from "../../service/UserService";

const CreateAccount: React.FC = () => {
  const [user, setUser] = useState<User>({ username: "", password: "", email: "" });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser: any) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const result = await createAccount(user);

    if (result.success) {
      setSuccessMessage("Account created successfully!");
      setUser({ username: "", password: "", email: "" });
    } else {
      setError(result.error || "Failed to create account");
    }
  };

  return (
    <div className="create-account-container">
      <h2 className="title">Create Account</h2>
      <form onSubmit={handleSubmit}>
        <label className="label">User</label>
        <input
          className="input"
          type="text"
          name="username"
          value={user.username}
          onChange={handleChange}
          required
        />
        
        <label className="label">Password</label>
        <input
          className="input"
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          required
        />
        
        <label className="label">Email</label>
        <input
          className="input"
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />
        
        <button type="submit" className="button">Register</button>
      </form>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default CreateAccount;
