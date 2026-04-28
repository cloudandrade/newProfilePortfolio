import { Box, Container, Typography } from '@mui/material'
import { profile } from '../../data/profile'
import './Footer.css'

export function Footer() {
  return (
    <Box
      component="footer"
      className="footer-root"
      sx={{ borderColor: 'divider' }}
    >
      <Container maxWidth="lg" className="footer-container">
        <Typography
          variant="body2"
          color="text.secondary"
          className="footer-text"
        >
          © {new Date().getFullYear()} {profile.name}. 
        </Typography>
      </Container>
    </Box>
  )
}
