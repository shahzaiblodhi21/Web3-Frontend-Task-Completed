import bgImg from '../../assets/bgImg.png';
import email_ico from '../../assets/email-ico.PNG';
import React, { useState } from 'react';
import axios from 'axios'; // Axios for making HTTP requests
import logo from '../../assets/logo.svg';
import { Snackbar, Alert } from '@mui/material'; // Material-UI Snackbar and Alert components
import { useNavigate } from 'react-router-dom';

function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send a POST request to your backend's login endpoint
      const response = await axios.post('http://localhost:3003/auth/login', { // Adjust this to your backend URL
        email,
        password,
      });
      const { token, username } = response.data;
      const userData = {
        ...response.data,
        username: username,
        email: email,
        token: token,
      }
      localStorage.setItem('user', JSON.stringify(userData));

      // Show success snackbar
      setSnackbarMessage('Login successful!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      navigate('/dashboard')

    } catch (error) {
      // Handle error and show error snackbar
      console.error('Login failed:', error);
      setSnackbarMessage('Invalid credentials, please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // Close the snackbar after a few seconds
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div className="container-fluid h-100">
      <div className="position-absolute" style={{ top: '35px', left: '50px' }}>
        <img src={logo} alt="" />
      </div>
      <div className="row h-100">
        {/* Left column with image */}
        <div className="col-md-5 d-none d-md-block p-0">
          <img
            src={bgImg}
            alt="Sign-in Background"
            className="img-fluid w-100 h-100"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Right column with login form */}
        <div className="col-md-7 d-flex align-items-center justify-content-end">
          <div className=" text-white">
            <h3 className="mb-5 w-75" style={{ fontFamily: 'Orbitron' }}>Get exclusive <span style={{ color: '#E27625' }}> access </span> to Title Management</h3>
            <form className='login-form' onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '35px' }}>
                <div className="d-flex align-items-center position-relative">
                  <img className='ico' style={{ position: 'absolute', marginBottom: '11px' }} width={20} height={20} src={email_ico} alt="" />
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group mb-3">
                <div className="d-flex align-items-center position-relative">
                  <svg className='ico' style={{ position: 'absolute', marginBottom: '11px' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path className='ico' d="M6.25 7.5C5.91848 7.5 5.60054 7.3683 5.36612 7.13388C5.1317 6.89946 5 6.58152 5 6.25C5 5.91848 5.1317 5.60054 5.36612 5.36612C5.60054 5.1317 5.91848 5 6.25 5C6.58152 5 6.89946 5.1317 7.13388 5.36612C7.3683 5.60054 7.5 5.91848 7.5 6.25C7.5 6.58152 7.3683 6.89946 7.13388 7.13388C6.89946 7.3683 6.58152 7.5 6.25 7.5Z" fill="#6C6C6C" />
                    <path className='ico' d="M10.625 15V14.375H9.375C9.20924 14.375 9.05027 14.3092 8.93306 14.1919C8.81585 14.0747 8.75 13.9158 8.75 13.75V12.5H7.5C6.45008 12.4998 5.42688 12.169 4.57547 11.5547C3.72405 10.9403 3.08763 10.0735 2.75644 9.07722C2.42525 8.08091 2.4161 7.00562 2.73027 6.00381C3.04445 5.002 3.66601 4.12451 4.50684 3.49575C5.34767 2.86699 6.36509 2.51887 7.41485 2.50075C8.46462 2.48262 9.49345 2.79541 10.3555 3.39477C11.2175 3.99413 11.869 4.84965 12.2176 5.84001C12.5661 6.83038 12.5941 7.90535 12.2975 8.9125L17.135 13.75C17.369 13.9846 17.5003 14.3024 17.5 14.6337V16.25C17.5 16.5815 17.3683 16.8995 17.1339 17.1339C16.8995 17.3683 16.5815 17.5 16.25 17.5H13.75C13.4185 17.5 13.1005 17.3683 12.8661 17.1339C12.6317 16.8995 12.5 16.5815 12.5 16.25V15.625H11.25C11.0842 15.625 10.9253 15.5592 10.8081 15.4419C10.6908 15.3247 10.625 15.1658 10.625 15ZM11.25 7.5C11.25 6.75832 11.0301 6.0333 10.618 5.41661C10.206 4.79993 9.62029 4.31928 8.93506 4.03545C8.24984 3.75162 7.49584 3.67736 6.76841 3.82206C6.04098 3.96675 5.3728 4.3239 4.84835 4.84835C4.3239 5.3728 3.96675 6.04098 3.82205 6.76841C3.67736 7.49584 3.75162 8.24984 4.03545 8.93506C4.31928 9.62029 4.79993 10.206 5.41661 10.618C6.0333 11.0301 6.75832 11.25 7.5 11.25H9.375C9.54076 11.25 9.69973 11.3158 9.81694 11.4331C9.93415 11.5503 10 11.7092 10 11.875V13.125H11.25C11.4158 13.125 11.5747 13.1908 11.6919 13.3081C11.8092 13.4253 11.875 13.5842 11.875 13.75V14.375H13.125C13.2908 14.375 13.4497 14.4408 13.5669 14.5581C13.6842 14.6753 13.75 14.8342 13.75 15V16.25H16.25V14.6337L11.1387 9.5225C11.0531 9.43689 10.9941 9.32823 10.969 9.20973C10.9439 9.09122 10.9538 8.96798 10.9975 8.855C11.16 8.435 11.25 7.98 11.25 7.5Z" fill="#6C6C6C" />
                  </svg>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between" style={{ fontSize: '11px' }}>
                <div className="form-check mb-3 mt-2">
                  <input style={{ borderColor: '#6C6C6C' }} type="checkbox" className="form-check-input" id="rememberMe" />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
              </div>
              <button type="submit" className="btn w-100 mb-3 mt-4" style={{ background: '#E27625', color: '#fff', fontWeight: '600', borderRadius: '0', padding: '10px' }}>
                {loading ? 'Logging In...' : 'Log In'}
              </button>
              <div className="mt-3 text-center" style={{ fontSize: '12px' }}>
                <span href="/">
                  Don't have an account?
                </span>
                <a href='/register' style={{ color: '#E27625', textDecoration: 'underline', marginLeft: '5px' }}>Register </a>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Snackbar for Success or Error Message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default SignInPage;
