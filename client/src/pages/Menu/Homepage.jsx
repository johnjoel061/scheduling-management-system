import { Link } from "react-router-dom";
import Logo from "../../assets/logo.jpg";
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';

const Homepage = () => {
  return (
    <div className="homepage-container">
      <div className="logo-container">
        <img src={Logo} alt="Logo" className="logo" />
      </div>

      <div className="header">
        <Link to="/login" className="login-button">
          Go to Login
        </Link>
      </div>
      <div className="content">
        <div className="title-container">
          <h1 className="title">DEBESMSCAT</h1>
          <h3 className="subtitle">Scheduling and Reservation</h3>
          <div className="description">
            <p>
              Discover the convenience of hassle-free scheduling with our new
              booking system! Whether you're planning a organizing a group
              event, our platform makes it simple to book, manage, and confirm
              your schedules in just a few clicks.
            </p>
          </div>
 
          <button className="schedule-button "><BookmarkAddOutlinedIcon/> BOOK SCHEDULE</button>
          <Link to="/scheduled-events" className="event-button"><EventAvailableOutlinedIcon/> SCHEDULED EVENTS</Link>
        
        </div>
      </div>
    </div>
  );
};

export default Homepage;
