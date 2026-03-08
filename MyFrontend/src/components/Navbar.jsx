import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>

      <Link to="/">Home</Link> |

      <Link to="/predict">Predict</Link>

    </nav>
  );
}

export default Navbar;