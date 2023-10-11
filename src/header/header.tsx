import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import '../css/header.css';
import logo from '../assets/logo-nobg.png';
import { Avatar, Fade, IconButton, InputBase, Menu, MenuItem, alpha, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';
import { logout } from '../service/api';

export default function HeaderBar() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
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
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: '12ch',
                '&:focus': {
                    width: '20ch',
                },
            },
        },
    }));

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const executeMenu = (url: string) => {
        setAnchorEl(null);
        console.log("Executing Menu...");
        if(sessionStorage.getItem("userId") == null) {
            window.location.href = "/login"
        } else {
            window.location.href = url;
        }
    }

    const logOut = (url: string) => {
        setAnchorEl(null);
        console.log("Logging out...");
        logout(sessionStorage.getItem('userId'))
        sessionStorage.clear();
        window.location.href = url;
    }

    const userOrder = (url: string) => {
        setAnchorEl(null);
        window.location.href = url;
    }

    const role = sessionStorage.getItem("role");

    return (
        <div className="header">
            <div className="logo"><Avatar src={logo} sx={{ width: 50, height: 50, marginTop: "22px" }} variant="square" onClick={() => executeMenu(role === "customer" ? "/" : "/inventoryList")} /></div>
            <Search><SearchIconWrapper><SearchIcon /></SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search..."
                    inputProps={{ 'arial-label': 'search' }} /></Search>
            <ul><IconButton aria-label='shoppingCart' onClick={() => executeMenu("/shoppingCart")}><ShoppingCartIcon /></IconButton></ul>
            <ul>
                <IconButton aria-label='userIcon' aria-controls={open ? 'demo-positioned-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}>
                    <PersonIcon />
                </IconButton>
                <Menu
                    id="fade-menu"
                    MenuListProps={{
                        'aria-labelledby': 'fade-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                >
                    {role === "admin" ? <MenuItem onClick={() => executeMenu('/inventoryList')} value='inv'>Inventory Listing</MenuItem> :
                         <MenuItem onClick={() => executeMenu('/userProfile')} value='profile'>Profile</MenuItem>}
                    {role === "admin" ?  <MenuItem onClick={() => userOrder('/transactionLog')} value='trxlog'>Transaction Log</MenuItem> :
                        <MenuItem onClick={() => userOrder('/userOrder')} value='order'>Order History</MenuItem> }
                    {role ==="admin" || role ==="customer"? <MenuItem onClick={() => logOut('/')} value='logout'>Logout</MenuItem>: null}
                </Menu>
            </ul>
        </div>
    );
}

