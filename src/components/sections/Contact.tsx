import EmailIcon from '@mui/icons-material/Email'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import { Box, Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { profile } from '../../data/profile'
import { Section } from '../layout/Section'

export function Contact() {
  const { t } = useTranslation()

  return (
    <Section id="contact" title={t('contact.title')} subtitle={t('contact.subtitle')}>
      <Box className="flex max-w-xl flex-col gap-3">
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          className="justify-start gap-2 py-3"
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
          className="justify-start py-3"
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
          className="justify-start py-3"
          href={profile.linkedinUrl}
          component="a"
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<LinkedInIcon />}
        >
          {t('contact.linkedinLabel')} / {profile.linkedinSlug}
        </Button>
        <Box
          className="flex items-start gap-2 rounded-xl border px-4 py-3"
          sx={{ borderColor: 'divider' }}
        >
          <LocationOnIcon color="primary" className="mt-0.5 shrink-0" fontSize="small" />
          <Typography variant="body2" color="text.secondary" className="text-left leading-relaxed">
            {t('profile.address')}
          </Typography>
        </Box>
      </Box>
    </Section>
  )
}
