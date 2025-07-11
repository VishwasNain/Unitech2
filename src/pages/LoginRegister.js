import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  styled,
  useTheme,
  InputAdornment,
  IconButton,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Lock as LockIcon,
  Mail as MailIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { useAuth } from '../context/UserContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '20px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  maxWidth: '500px',
  margin: '0 auto',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  '& .MuiPaper-root': {
    backgroundColor: 'transparent',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minWidth: '120px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: 700,
  },
  '&.MuiTab-root': {
    transition: 'color 0.3s ease',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.12)',
      borderRadius: '12px',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(1.5, 3),
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)',
  },
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 0, 0, 0.1)',
  '& .MuiAlert-message': {
    fontSize: '0.9rem',
  },
}));

const LoginRegister = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [resetPasswordStep, setResetPasswordStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    mobile: '',
    otp: '',
    newPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { 
    login, 
    register, 
    requestPasswordReset, 
    verifyOTP, 
    resetPassword,
    resetError
  } = useAuth();
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setResetPasswordStep(0);
    setError('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      mobile: '',
      otp: '',
      newPassword: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const validateForm = () => {
    if (resetPasswordStep === 0) {
      if (activeTab === 0) { // Login
        if (!formData.email || !formData.password) {
          setError('Please fill in all fields');
          return false;
        }
        return true;
      } else { // Register
        if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name || !formData.mobile) {
          setError('Please fill in all fields');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        if (formData.mobile.length < 10) {
          setError('Please enter a valid mobile number');
          return false;
        }
        return true;
      }
    } else if (resetPasswordStep === 1) { // Enter mobile
      if (!formData.mobile || formData.mobile.length < 10) {
        setError('Please enter a valid mobile number');
        return false;
      }
      return true;
    } else if (resetPasswordStep === 2) { // Enter OTP
      if (!formData.otp) {
        setError('Please enter the OTP');
        return false;
      }
      return true;
    } else { // Reset password
      if (!formData.newPassword) {
        setError('Please enter your new password');
        return false;
      }
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      if (resetPasswordStep === 0) {
        if (activeTab === 0) { // Login
          const result = await login(formData.email, formData.password);
          if (result.success) {
            navigate('/');
          } else {
            setError(result.message);
          }
        } else { // Register
          const result = await register(formData.name, formData.email, formData.password, formData.mobile);
          if (result.success) {
            navigate('/');
          } else {
            setError(result.message);
          }
        }
      } else if (resetPasswordStep === 1) { // Request OTP
        const result = await requestPasswordReset(formData.mobile);
        if (!result.success) {
          setError(result.message);
        }
      } else if (resetPasswordStep === 2) { // Verify OTP
        const result = await verifyOTP(formData.otp);
        if (!result.success) {
          setError(result.message);
        }
      } else { // Reset password
        const result = await resetPassword(formData.newPassword);
        if (result.success) {
          setResetPasswordStep(0);
          setActiveTab(0);
        } else {
          setError(result.message);
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setResetPasswordStep(1);
    setActiveTab(0);
  };

  const handleBackToLogin = () => {
    setResetPasswordStep(0);
    setActiveTab(0);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <StyledPaper>
          <Box sx={{ mb: 4 }}>
            {resetPasswordStep === 0 && (
              <>
                <Typography
                  variant="h3"
                  component="h1"
                  gutterBottom
                  align="center"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    background: 'linear-gradient(45deg, #2563eb, #10b981)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {activeTab === 0 ? 'Welcome Back' : 'Create Account'}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 4 }}
                >
                  {activeTab === 0 ? 'Sign in to your account' : 'Join our community'}
                </Typography>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{
                    mb: 4,
                    '& .MuiTabs-indicator': {
                      backgroundColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <StyledTab label="Sign In" />
                  <StyledTab label="Sign Up" />
                </Tabs>
              </>
            )}

            {resetPasswordStep === 1 && (
              <>
                <Typography
                  variant="h3"
                  component="h1"
                  gutterBottom
                  align="center"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    background: 'linear-gradient(45deg, #2563eb, #10b981)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Reset Password
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 4 }}
                >
                  Enter your mobile number to receive OTP
                </Typography>
              </>
            )}

            {resetPasswordStep === 2 && (
              <>
                <Typography
                  variant="h3"
                  component="h1"
                  gutterBottom
                  align="center"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    background: 'linear-gradient(45deg, #2563eb, #10b981)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Verify OTP
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 4 }}
                >
                  Enter the OTP sent to {formData.mobile}
                </Typography>
              </>
            )}

            {resetPasswordStep === 3 && (
              <>
                <Typography
                  variant="h3"
                  component="h1"
                  gutterBottom
                  align="center"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    background: 'linear-gradient(45deg, #2563eb, #10b981)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Set New Password
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 4 }}
                >
                  Enter your new password
                </Typography>
              </>
            )}

            {error && (
              <StyledAlert severity="error" sx={{ mb: 2, width: '100%' }}>
                {error}
              </StyledAlert>
            )}

            {resetError && (
              <StyledAlert severity="error" sx={{ mb: 2, width: '100%' }}>
                {resetError}
              </StyledAlert>
            )}

            <form onSubmit={handleSubmit}>
              {resetPasswordStep === 0 && (
                <>
                  {activeTab === 1 && (
                    <>
                      <StyledTextField
                        fullWidth
                        margin="normal"
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      
                      <StyledTextField
                        fullWidth
                        margin="normal"
                        label="Mobile Number"
                        name="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </>
                  )}

                  <StyledTextField
                    fullWidth
                    margin="normal"
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <StyledTextField
                    fullWidth
                    margin="normal"
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: 'text.secondary' }}
                          >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {activeTab === 1 && (
                    <StyledTextField
                      fullWidth
                      margin="normal"
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                              sx={{ color: 'text.secondary' }}
                            >
                              {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}

                  <StyledButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      backgroundColor: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
                  >
                    {activeTab === 0 ? 'Sign In' : 'Sign Up'}
                  </StyledButton>

                  {activeTab === 0 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                      sx={{ mt: 2 }}
                    >
                      <Link
                        component="button"
                        variant="body2"
                        onClick={handleForgotPassword}
                        sx={{
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Forgot password?
                      </Link>
                    </Typography>
                  )}
                </>
              )}

              {resetPasswordStep === 1 && (
                <>
                  <StyledTextField
                    fullWidth
                    margin="normal"
                    label="Mobile Number"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.12)',
                            borderRadius: '12px',
                          },
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: 2,
                          },
                        },
                      },
                    }}
                    sx={{
                      '& .MuiInputLabel-root': {
                        color: theme.palette.text.secondary,
                        '&.Mui-focused': {
                          color: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                  <StyledButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      backgroundColor: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                    disabled={loading || !formData.mobile || formData.mobile.length < 10}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
                  >
                    Send OTP
                  </StyledButton>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mt: 2 }}
                  >
                    <Link
                      component="button"
                      variant="body2"
                      onClick={handleBackToLogin}
                      sx={{
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Back to Login
                    </Link>
                  </Typography>
                </>
              )}

              {resetPasswordStep === 2 && (
                <>
                  <StyledTextField
                    fullWidth
                    margin="normal"
                    label="Enter OTP"
                    name="otp"
                    type="text"
                    value={formData.otp}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <StyledButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      backgroundColor: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
                  >
                    Verify OTP
                  </StyledButton>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mt: 2 }}
                  >
                    <Link
                      component="button"
                      variant="body2"
                      onClick={handleBackToLogin}
                      sx={{
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Back to Login
                    </Link>
                  </Typography>
                </>
              )}

              {resetPasswordStep === 3 && (
                <>
                  <StyledTextField
                    fullWidth
                    margin="normal"
                    label="New Password"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: 'text.secondary' }}
                          >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <StyledButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      backgroundColor: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
                  >
                    Reset Password
                  </StyledButton>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mt: 2 }}
                  >
                    <Link
                      component="button"
                      variant="body2"
                      onClick={handleBackToLogin}
                      sx={{
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Back to Login
                    </Link>
                  </Typography>
                </>
              )}
            </form>
          </Box>

          {resetPasswordStep === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 4 }}
            >
              {activeTab === 0
                ? "Don't have an account?"
                : 'Already have an account?'}{' '}
              <Button
                color="primary"
                size="small"
                onClick={() => handleTabChange(null, activeTab === 0 ? 1 : 0)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {activeTab === 0 ? 'Sign Up' : 'Sign In'}
              </Button>
            </Typography>
          )}
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default LoginRegister;
