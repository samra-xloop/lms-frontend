import React, { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import finalLogo from '../content/Images/xloop-logo-2.png'
import '../styles/ForgetPassword.css'
import Swal from "sweetalert2";

const ForgetPassword = () => {
    useEffect(() => emailjs.init("739xGz6oDs9E1tq_w"), []);
  const [email, setEmail] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      fetch(`${"http://127.0.0.1:8000/request_password_reset/"}`, {
        method: "POST",
        body: JSON.stringify({email}),
        headers: {
          "Content-type": "application/json",
        },
      }).then((response) => {
        if (response.status === 200) {
            response.json().then(function (result) {
                console.log(result);
                sendEmail(result.token)
              });
     
          
        }
        else {
            console.log(response);
        }
      });
    } else {
      alert("Provide valid Email");
    }
  };

  const sendEmail = async (message) => {
    const serviceId = "service_x39w5wk";
    const templateId = "template_tn75w5s";
    try {
      await emailjs.send(serviceId, templateId, {
        name: `${'LMS'} ${'User'}`,
        recipient: email,
        token: message,
        sender: "LMS",
      });
  Swal.fire({
    icon: "success",
    text: "Reset link sent Successfully!"
  })
      setEmail("")
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="forget-password-main">
      <div className="lms-logo-main-container">
        <div className="lms-log-container">
          <img src={finalLogo} alt="LMS" width={350} />
        </div>
      </div>
      <form className="sign-in-form forget-password">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={handleEmail}
          placeholder="Email"
        />
        <input
          type="submit"
          onClick={(e) => handleSubmit(e)}
          value="Send login Link"
          className="button"
        />
      </form>
    </div>
  );
};

export default ForgetPassword;
