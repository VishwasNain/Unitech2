import React, { useState } from 'react';
import {
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
  InputBase,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  useTheme,
  Popover,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  styled,
  CardMedia,
  Rating,
  Chip,
  Avatar,
  ListItemAvatar,
  ListItemIcon
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon,
  PersonOutline as PersonOutlineIcon,
  SearchOutlined as SearchOutlinedIcon,
  Remove as RemoveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ShoppingCartCheckout as ShoppingCartCheckoutIcon,
  ExitToApp as LogoutIcon,
  Login as LoginIcon,
  Person as UserIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import UserMenu from './UserMenu';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Navbar = () => {
  const { cartItems, totalPrice } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchAnchor, setSearchAnchor] = useState(null);
  const [cartAnchor, setCartAnchor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearchClick = (event) => {
    setSearchAnchor(event.currentTarget);
  };

  const handleSearchClose = () => {
    setSearchAnchor(null);
  };

  const handleCartClick = (event) => {
    setCartAnchor(event.currentTarget);
  };

  const handleCartClose = () => {
    setCartAnchor(null);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
    handleSearchClose();
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Products', path: '/products' },
    { text: 'Blog', path: '/blog' },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: theme.zIndex.drawer + 1,
      }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              '& img': {
                height: 40,
                width: 40,
                objectFit: 'contain',
              },
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'none',
              },
            }}
            onClick={() => navigate('/')}
          >
            UNITECH COMPUTERS
          </Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search products..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
            />
          </Search>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleCartClick}
            >
              <Badge badgeContent={cartItems.length} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleSearchClick}
            >
              <SearchIcon />
            </IconButton>

            <UserMenu user={user} isLoggedIn={isLoggedIn} logout={logout} />
          </Box>
        </Toolbar>
      </AppBar>

      <Popover
        open={Boolean(cartAnchor)}
        anchorEl={cartAnchor}
        onClose={handleCartClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ p: 2, width: 300 }}>
          <Typography variant="h6" gutterBottom>
            Shopping Cart
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {cartItems.map((item) => (
            <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1" sx={{ flexGrow: 1 }}>
                {item.name}
              </Typography>
              <Typography variant="body1">
                {item.quantity} x ${item.price}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6">${totalPrice.toFixed(2)}</Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => {
              handleCartClose();
              navigate('/cart');
            }}
          >
            View Cart
          </Button>
        </Paper>
      </Popover>
    </Box>
  );
};

export default Navbar;
