import React, { useEffect, useState } from 'react';
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Web3 from 'web3';
import { IoIosLogOut } from "react-icons/io";
import logo from '../../assets/logo.svg';
import { Snackbar, Alert } from '@mui/material'; // Material-UI Snackbar and Alert components
import MetaMaskLogo from '../../assets/metaLogo.svg';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const Navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [data3, setData3] = useState('');
  const [description, setDescription] = useState('');
  const [titles, setTitles] = useState([]);
  const [editingTitle, setEditingTitle] = useState(null); // Track the title being edited
  const [showModal, setShowModal] = useState(false); // Modal state

  // Snackbar states
  const [openSnackbar, setOpenSnackbar] = useState(false); // Control snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Snackbar severity ('success' or 'error')

  // Fetch username and email from localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);  // Parse the string back to an object
      if (parsedUser.username) {
        setUsername(parsedUser.username);
      }
      if (parsedUser.email) {
        setEmail(parsedUser.email);
      }
    }
  }, []);

  // Fetch titles on component load
  useEffect(() => {
    fetchTitles();
  }, []);

  const fetchTitles = async () => {
    const user = localStorage.getItem('user');
    const parsedUser = JSON.parse(user);  // Parse the string back to an object
    const token = parsedUser.token;
    if (!token) {
      setSnackbarMessage('No token found. Please log in.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    try {
      const response = await fetch('http://localhost:3003/api/get-titles', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Send token in Bearer format
        },
      });
      const result = await response.json();
      if (response.ok) {
        setTitles(result.data);
      } else {
        setSnackbarMessage('Failed to fetch titles: ' + result.message);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage('Error fetching titles: ' + error.message);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };


  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      setLoading(true);
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // Prompt user to connect MetaMask
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        const balanceWei = await web3.eth.getBalance(account); // Get balance in Wei
        const balanceEth = web3.utils.fromWei(balanceWei, 'ether'); // Convert balance to ETH
        setSnackbarMessage('MetaMask connected!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        // Set balance and format to 2 decimal places
        setWalletAddress(account);
        setBalance(parseFloat(balanceEth).toFixed(2)); // Format to 2 decimal places
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
      setLoading(false);
    } else {
      alert('Please install MetaMask!');
    }
  };


  // Add or Update Title
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem('user');
    const parsedUser = JSON.parse(user);  // Parse the string back to an object
    const token = parsedUser.token;
    if (!token) {
      setSnackbarMessage('User is not authenticated.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    const formData = {
      name: name,
      data3: data3,
      description: description,
    };
    const url = editingTitle ? `http://localhost:3003/api/edit-title/${editingTitle.id}` : 'http://localhost:3003/api/add-title';
    try {
      const response = await fetch(url, {
        method: editingTitle ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send token in Bearer format
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setSnackbarMessage(editingTitle ? 'Title updated successfully!' : 'Title added successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        fetchTitles(); // Refresh titles
        clearForm();
      } else {
        setSnackbarMessage('Error adding/updating title: ' + result.message);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage('Error: ' + error.message);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Delete Title
  const handleDelete = async (id) => {
    const user = localStorage.getItem('user');
    if (!user) {
      setSnackbarMessage('User is not authenticated.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    const parsedUser = JSON.parse(user);  // Parse the string back to an object
    const token = parsedUser.token;
    try {
      const response = await fetch(`http://localhost:3003/api/delete-title/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,  // Add 'Bearer' before the token
        },
      });
      if (response.ok) {
        setSnackbarMessage('Title deleted successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        fetchTitles();
      } else {
        const result = await response.json();
        setSnackbarMessage(`Error deleting title: ${result.message}`);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage('Error deleting title: ' + error.message);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Snackbar close handler
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Open modal to edit a title
  const handleEdit = (title) => {
    setEditingTitle(title);
    setName(title.name);
    setData3(title.data3);
    setDescription(title.description);
    setShowModal(true);
  };

  // Close modal and reset form
  const clearForm = () => {
    setEditingTitle(null);
    setName('');
    setData3('');
    setDescription('');
    setShowModal(false);
  };

  const func = () => {
    localStorage.clear();
    setTimeout(() => {
      Navigate('/');
    }, 500);
    setSnackbarMessage('LogOut successfully!');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  return (
    <div className="dashboard-container">
      <div className="row">
        <div className="col-12 header">
          <div className="logo">
            <img src={logo} alt="" />
          </div>
          <div className="user-info">
            <span className="user-icon">{username.charAt(0).toUpperCase()}</span>
            <div className="user-details">
              <p>{username}</p>
              <p>{email}</p>
            </div>
            <button style={{ background: '#BC2222', border: '0', color: '#fff', fontSize: '12px', padding: '6px 14px', borderRadius: '5px', marginLeft: '26px', cursor: 'pointer' }} onClick={func}>Log out <IoIosLogOut fontSize={15} /></button>
          </div>
        </div>

        <div className="col-12">
          {walletAddress === '' ? (
            <div className="wallet-connection">
              <div className="text-center">
                <h1>Welcome to Web3</h1>
                <img src={MetaMaskLogo} style={{ marginTop: '35px' }} alt="" />
              </div>
              <button onClick={connectWallet} disabled={loading}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <g clip-path="url(#clip0_20_46)">
                    <path d="M-2.89648 4.4687H10.8535C11.0141 4.46865 11.1746 4.47884 11.3339 4.4992C11.2799 4.12012 11.1497 3.7559 10.9511 3.4285C10.7526 3.10111 10.4897 2.81731 10.1785 2.59423C9.86731 2.37115 9.51414 2.2134 9.14031 2.1305C8.76649 2.0476 8.37974 2.04126 8.0034 2.11186L-3.30469 4.04245H-3.31758C-4.02739 4.17818 -4.65861 4.57978 -5.0823 5.16522C-4.44396 4.71118 -3.67983 4.46768 -2.89648 4.4687ZM10.8535 5.49994H-2.89648C-3.62559 5.50074 -4.3246 5.79073 -4.84015 6.30628C-5.3557 6.82183 -5.64569 7.52084 -5.64648 8.24995V16.4999C-5.64569 17.229 -5.3557 17.9281 -4.84015 18.4436C-4.3246 18.9592 -3.62559 19.2491 -2.89648 19.2499H10.8535C11.5826 19.2491 12.2816 18.9592 12.7972 18.4436C13.3127 17.9281 13.6027 17.229 13.6035 16.4999V8.24995C13.6027 7.52084 13.3127 6.82183 12.7972 6.30628C12.2816 5.79073 11.5826 5.50074 10.8535 5.49994ZM8.8125 13.7499C8.54055 13.7499 8.27471 13.6693 8.04859 13.5182C7.82247 13.3671 7.64624 13.1524 7.54217 12.9011C7.4381 12.6499 7.41087 12.3734 7.46392 12.1067C7.51697 11.84 7.64793 11.595 7.84023 11.4027C8.03253 11.2104 8.27753 11.0794 8.54425 11.0264C8.81098 10.9733 9.08744 11.0005 9.33869 11.1046C9.58994 11.2087 9.80468 11.3849 9.95577 11.611C10.1069 11.8372 10.1875 12.103 10.1875 12.3749C10.1875 12.7396 10.0426 13.0894 9.78477 13.3472C9.52691 13.6051 9.17717 13.7499 8.8125 13.7499Z" fill="#DDDDDD" />
                    <path d="M1.375 11.1504V6.875C1.375 5.94387 1.89062 4.38281 3.68027 4.04465C5.19922 3.75977 6.70312 3.75977 6.70312 3.75977C6.70312 3.75977 7.69141 4.44727 6.875 4.44727C6.05859 4.44727 6.08008 5.5 6.875 5.5C7.66992 5.5 6.875 6.50977 6.875 6.50977L3.67383 10.1406L1.375 11.1504Z" fill="#DDDDDD" />
                  </g>
                  <defs>
                    <clipPath id="clip0_20_46">
                      <rect width="22" height="22" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                {loading ? 'Connecting...' : 'Connect Your Wallet'}
              </button>
            </div>
          ) : (
            <div className="dashboard">
              <h2>DashBoard</h2>
              <div className="row justify-content-between">
                <div className="col-4" style={{ maxWidth: '390px' }}>
                  <div className="balance">
                    {walletAddress && (
                      <>
                        <div className="d-flex align-items-end" style={{ gap: '10px' }}>
                          <svg className="mb-2" xmlns="http://www.w3.org/2000/svg" width="23" height="32" viewBox="0 0 17 26" fill="none">
                            <path d="M8.80757 0.0918579C11.4861 4.26428 14.1043 8.34306 16.773 12.4997C16.5755 12.4445 16.4594 12.4241 16.3541 12.3809C13.9597 11.4004 11.5675 10.4158 9.17254 9.43671C8.92882 9.33705 8.75062 9.25372 8.75246 8.93614C8.76868 6.06584 8.76195 3.19526 8.76317 0.324677C8.76256 0.284872 8.77756 0.24478 8.80757 0.0918579Z" fill="white" />
                            <path d="M0.288574 12.5172C2.95055 8.33194 5.53934 4.26175 8.20407 0.0721436C8.21784 0.318423 8.22917 0.427816 8.22948 0.537496C8.2304 3.31873 8.22825 6.09968 8.23377 8.88091C8.23438 9.12175 8.20437 9.28756 7.92176 9.40182C5.41962 10.4118 2.92483 11.4385 0.288574 12.5172Z" fill="white" />
                            <path d="M0.0244141 13.1799C2.78253 12.0493 5.46012 10.9519 8.19435 9.83136C8.19435 12.4614 8.19435 15.023 8.19435 17.6627C5.46808 16.1665 2.78038 14.6919 0.0244141 13.1799Z" fill="white" />
                            <path d="M16.9772 13.1843C14.2105 14.6995 11.5234 16.1714 8.78369 17.6717C8.78369 15.0328 8.78369 12.4712 8.78369 9.82428C11.5179 10.9454 14.2029 12.0465 16.9772 13.1843Z" fill="white" />
                            <path d="M0.265977 14.9113C1.48704 15.5783 2.70841 16.2444 3.92856 16.9128C5.22281 17.6218 6.51001 18.3426 7.81405 19.0356C8.13554 19.2066 8.24301 19.4002 8.23903 19.7438C8.21882 21.4933 8.22985 23.243 8.22985 24.9924C8.22985 25.1362 8.22985 25.2799 8.22985 25.424C8.19525 25.4352 8.16065 25.446 8.12574 25.4572C5.48857 21.9646 2.85171 18.4721 0.214844 14.9795C0.231684 14.9568 0.24883 14.9342 0.265977 14.9113Z" fill="white" />
                            <path d="M16.8336 14.9059C14.1472 18.4646 11.5057 21.9638 8.7874 25.5643C8.77301 25.3441 8.76107 25.2485 8.76107 25.1525C8.76015 23.326 8.75219 21.4996 8.77271 19.6731C8.77485 19.4898 8.89549 19.2249 9.05072 19.1384C11.5746 17.7295 14.1129 16.3435 16.6487 14.9528C16.6741 14.9388 16.7072 14.9374 16.8336 14.9059Z" fill="white" />
                          </svg>
                          <div className="info">
                            <p className="eth">Total Balance</p>
                            <span className="mb-0 fw-bold">{balance} ETH</span>
                          </div>
                        </div>
                        <div className="d-flex align-items-center mt-1">
                          <p style={{ fontSize: '10px', color: '#fff', fontWeight: '600', marginLeft: '5px' }}>Id:</p>
                          <span className="wallet-id">{walletAddress}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="add-titles">
                    <h3>{editingTitle ? 'Edit Title' : 'Add Title'}</h3>
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-12 mb-3">
                          <label>Name <span style={{ color: '#fff' }}>*</span></label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)} // Update state on input change
                          />
                        </div>
                        <div className="col-md-12 mb-3">
                          <label>Data 3 <span style={{ color: '#fff' }}>*</span></label>
                          <input
                            type="text"
                            value={data3}
                            onChange={(e) => setData3(e.target.value)} // Update state on input change
                          />
                        </div>
                        <div className="col-md-12 mb-3">
                          <label>Description <span style={{ color: '#fff' }}>*</span></label>
                          <textarea
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)} // Update state on input change
                          ></textarea>
                        </div>
                        <div className="col-12">
                          <button type="submit">{editingTitle ? 'Update Title' : 'Add Title'}</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="col-8">
                  <div className="title-management">
                    <h3>Title Management</h3>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Title Name</th>
                          <th>Title Description</th>
                          <th>Data 3</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {titles.length > 0 ? (
                          titles.map((title) => (
                            <tr key={title.id}>
                              <td style={{ width: '250px' }}>{title.name}</td>
                              <td style={{ width: '400px' }}>{title.description}</td>
                              <td style={{ width: '250px' }}>{title.data3}</td>
                              <td style={{ width: '250px' }}>
                                <button className='edit' onClick={() => handleEdit(title)}><MdEdit className='ico-edit' /></button>
                                <button className='del' onClick={() => handleDelete(title.id)}><MdDelete className='ico-del' /></button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5">There is no data added yet</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
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

      {/* Modal for Editing */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Title</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Data 3 *</label>
                <input
                  type="text"
                  value={data3}
                  onChange={(e) => setData3(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <button type="submit">Update Title</button>
              <button type="button" onClick={clearForm}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
