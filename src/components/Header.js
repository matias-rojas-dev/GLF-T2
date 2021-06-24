import React from 'react';
import { AppBar, Toolbar } from '@material-ui/core'

const Header = () => (
    <AppBar position='static'>
        <Toolbar className='header_header'>
                <h3 className='header_title'>App Automata</h3>
        </Toolbar>
    </AppBar>

)

export default Header;
