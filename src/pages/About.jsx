import React from "react";

function About() {
  return (
    <div>
      <h2>About This App</h2>
      <p>
        This is a simple Todo List application built with React and Airtable. It
        allows users to add, complete, and update tasks, as well as filter and
        sort them based on various criteria.
      </p>
      <p>
        The App demonstrates the use of React hooks (like{' '}
        <code>useReducer</code>,<code> useEffect</code>), context, routing to
        create a dynamic and responsive user interface and integration with
        external APIs.
      </p>

      <h3>Technologies Used</h3>
      <ul>
        <li>React + Vite</li>
        <li>React Router</li>
        <li>Airtable API (as a backend)</li>
        <li>CSS Modules</li>
        <li>useReducer and useEffect hooks</li>
      </ul>

      <h3>Author</h3>
      <p>
        Created by <strong>Andrey Gnusarev</strong>
      </p>
      <p>
        GitHub:{' '}
        <a
          href="https://github.com/andreyctd"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/andreyctd
        </a>
      </p>
      <p>
        Thanks to <strong>Code the Dream</strong> for the learning support and
        guidance!
      </p>
    </div>
  );
}

export default About;