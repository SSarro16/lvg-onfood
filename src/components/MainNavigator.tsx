import { NavLink } from "react-router-dom";

function MainNavigator() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/login">Log In</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigator