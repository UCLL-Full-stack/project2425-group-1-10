import React from "react";
import CreateAccount from "@components/register/createAccount";

const RegisterPage: React.FC = () => {
  return (
    <div>
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>Register</h2>
      <CreateAccount />
    </div>
  );
};

export default RegisterPage;
