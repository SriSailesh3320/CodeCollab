import React from 'react';
import '../App.css';

const Navbar = () => {
  return (
    <>
    <header className="header">
      <a className="name" href="/">CodeCollab</a>

      <nav className="navbar">
        <a className="Home" href="/">Home</a>
        <a className="CreateNewRoom" href="/">Create Room</a>
        <a className="About" href="/">About</a>
        <a className="ContactUs">Contact Us</a>
      </nav>
    </header>
    <main className="main-content">
      <section className="description">
        <h1>Welcome to CodeCollab</h1>
        <p>
          CodeCollab is a platform designed to bring developers together to collaborate on coding projects,
          share knowledge, and grow together. Whether you're a beginner or an experienced coder, there's
          something here for everyone.
        </p>
        <p>
          Explore our features:
        </p>
        <ul>
          <li>Collaborative coding environment</li>
          <li>Community forums and discussions</li>
          <li>Project showcases</li>
        </ul>
        <p>
          Join us today and be a part of our vibrant community!
        </p>
      </section>
    </main>
    </>
  );
};

export default Navbar;
