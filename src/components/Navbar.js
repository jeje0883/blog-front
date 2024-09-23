// // src/components/Navbar.js
// import React, { useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { UserContext } from '../context/UserContext';





// const Navbar = () => {
//   const { user, logoutUser } = useContext(UserContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logoutUser(); // Clear the user context
//     navigate('/'); // Redirect to login page after logout
//   };

//   return (
//     <nav className="navbar" sticky="top">
//       <ul>
//         <li>
//           <Link to="/posts">The Exciting Blog</Link>
//         </li>
//         <li className='ms-auto'>

//         </li>
//         {user ? (
//           <>
//           <li >
//               <span>Welcome, {user.username}</span>
//             </li>
//             <li>
//               <Link to="/profile">Profile</Link> {/* Added Profile Link */}
//             </li>
            
//             <li>
//               <button onClick={handleLogout} className="logout-button">
//                 Logout
//               </button>
//             </li>
//           </>
//         ) : (
//           <>
//             <li>
//               <Link to="/login">Login</Link>
//             </li>
//             <li>
//               <Link to="/register">Register</Link>
//             </li>
//           </>
//         )}
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Navbar, Nav, Container, Button } from 'react-bootstrap'; // Importing React-Bootstrap components

const MyNavbar = () => {
  const { user, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(); // Clear the user context
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top" className="" style={{
      padding: '0.3rem 1rem', // Reduced padding to make the navbar thinner
      height: '50px', // Set specific height
    }}> {/* Reduce vertical padding */}
      <Container>
        <Navbar.Brand as={Link} to="/posts">The Exciting Blog</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center"> {/* Align items vertically center */}
            {user ? (
              <>
                <Nav.Item className="me-3">
                  <span>Welcome, {user.username}</span>
                </Nav.Item>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <Button variant="outline-danger" size="sm" onClick={handleLogout}> {/* Make button smaller */}
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
