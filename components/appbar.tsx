import * as React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Home from '@mui/icons-material/Home';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';

export const ResponsiveAppBar = ({ repo }: { repo: string }) => {
    return (
        <AppBar position="static" style={{ textDecoration: 'none' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Home sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Home
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Link href={repo}>
                            <IconButton>
                                <GitHubIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                            </IconButton>
                        </Link>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
