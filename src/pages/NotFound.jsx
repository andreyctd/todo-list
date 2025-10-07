import React from "react";
import { Link } from "react-router";

function NotFound() {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2>Page Not Found</h2>
        <p>The page you`re looking for doesn`t exist.</p>
        <Link to="/">Go back Home</Link>
      </div>
    );
}

export default NotFound;