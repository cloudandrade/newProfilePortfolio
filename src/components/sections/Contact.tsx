import EmailIcon from '@mui/icons-material/Email'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import { Box, Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { profile } from '../../data/profile'
import { Section } from '../layout/Section'
import './Contact.css'

export function Contact() {
  const { t } = useTranslation()

  return (
    <Section id="contact" title={t('contact.title')} subtitle={t('contact.subtitle')}>
      <Box className="contact-list">
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          className="contact-btn contact-btn-with-gap"
          href={profile.emailHref}
          component="a"
          startIcon={<EmailIcon />}
        >
          {profile.email}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          className="contact-btn"
          href={profile.phoneHref}
          component="a"
          startIcon={<PhoneIcon />}
        >
          {profile.phone}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          className="contact-btn"
          href={profile.linkedinUrl}
          component="a"
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<LinkedInIcon />}
        >
          {t('contact.linkedinLabel')} / {profile.linkedinSlug}
        </Button>
        <Box
          className="contact-address"
          sx={{ borderColor: 'divider' }}
        >
          <LocationOnIcon color="primary" className="contact-address-icon" fontSize="medium" />
          <Typography variant="body2" color="text.secondary" className="contact-address-text">
            {t('profile.address')}
          </Typography>
        </Box>
      </Box>
    </Section>
  )
}
