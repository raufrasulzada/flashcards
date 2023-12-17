import React, { useState } from "react";
import "./style/Contact.css";

const Contact = () => {
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject || !email || !content) {
      alert("Please fill all the blank boxes with the required information.");
      return;
    }

    const message = {
      subject,
      email,
      content,
    };

    try {
      const response = await fetch("http://localhost:3000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        alert("Your message has been sent successfully!");
      } else {
        alert("Error submitting the message. Please try again later.");
        console.error("Error occurred while submitting the message.");
      }
    } catch (error) {
      alert("Error submitting the message. Please try again later.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="contact-container">
      <h2>Contact Me</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <label>
          Subject:
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Message:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>
        <br />
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};
export default Contact;
