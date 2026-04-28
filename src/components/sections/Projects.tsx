import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined'
import LaunchIcon from '@mui/icons-material/Launch'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { projects } from '../../data/projects'
import { Section } from '../layout/Section'
import './Projects.css'

export function Projects() {
  const { t } = useTranslation()

  return (
    <Section
      id="projects"
      title={t('projects.title')}
      subtitle={t('projects.subtitle')}
    >
      {projects.length === 0 ? (
        <Card className="projects-empty-card" sx={{ bgcolor: 'background.paper', borderColor: 'divider' }}>
          <CardContent className="projects-empty-content">
            <ConstructionOutlinedIcon color="primary" sx={{ fontSize: 52 }} />
            <Typography variant="h6">{t('projects.emptyTitle')}</Typography>
            <Typography variant="body2" color="text.secondary" className="projects-empty-body">
              {t('projects.emptyBody')}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box className="projects-grid">
          {projects.map((p) => (
            <Card key={p.id} sx={{ bgcolor: 'background.paper' }}>
              {p.imageUrl && (
                <CardMedia component="img" height="180" image={p.imageUrl} alt="" />
              )}
              <CardContent>
                <Typography variant="h6" component="h3">
                  {p.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="projects-description">
                  {p.description}
                </Typography>
                <Box className="projects-stack">
                  {p.stack.map((item) => (
                    <Chip
                      key={item}
                      label={item}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions className="projects-actions">
                {p.liveUrl && (
                  <Button
                    size="small"
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    endIcon={<LaunchIcon />}
                  >
                    {t('projects.demo')}
                  </Button>
                )}
                {p.repoUrl && (
                  <Button
                    size="small"
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('projects.code')}
                  </Button>
                )}
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Section>
  )
}
