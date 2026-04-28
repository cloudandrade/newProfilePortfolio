import EmailIcon from '@mui/icons-material/Email'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import PhoneIcon from '@mui/icons-material/Phone'
import { Box, Container, IconButton, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { profile } from '../../data/profile'
import './Footer.css'

export function Footer() {
  const { t } = useTranslation()

  return (
    <Box
      component="footer"
      className="footer-root"
      sx={{ borderColor: 'divider' }}
    >
      <Container
        maxWidth="lg"
        className="footer-container"
      >
        <Typography
          variant="body2"
          color="text.secondary"
          className="footer-text"
        >
          © {new Date().getFullYear()} {profile.name}. {t('footer.stack')}
        </Typography>
        <Box className="footer-actions">
          <IconButton
            component="a"
            href={profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('footer.linkedinAria')}
            color="primary"
          >
            <LinkedInIcon />
          </IconButton>
          <IconButton
            component="a"
            href={profile.emailHref}
            aria-label={t('footer.emailAria')}
            color="primary"
          >
            <EmailIcon />
          </IconButton>
          <IconButton
            component="a"
            href={profile.phoneHref}
            aria-label={t('footer.phoneAria')}
            color="primary"
          >
            <PhoneIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  )
}
