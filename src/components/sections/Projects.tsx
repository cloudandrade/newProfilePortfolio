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

export function Projects() {
  const { t } = useTranslation()

  return (
    <Section
      id="projects"
      title={t('projects.title')}
      subtitle={t('projects.subtitle')}
    >
      {projects.length === 0 ? (
        <Card className="max-w-xl" sx={{ bgcolor: 'background.paper', borderColor: 'divider' }}>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <ConstructionOutlinedIcon color="primary" sx={{ fontSize: 52 }} />
            <Typography variant="h6">{t('projects.emptyTitle')}</Typography>
            <Typography variant="body2" color="text.secondary" className="max-w-sm">
              {t('projects.emptyBody')}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box className="grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <Card key={p.id} sx={{ bgcolor: 'background.paper' }}>
              {p.imageUrl && (
                <CardMedia component="img" height="180" image={p.imageUrl} alt="" />
              )}
              <CardContent>
                <Typography variant="h6" component="h3">
                  {p.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mt-1">
                  {p.description}
                </Typography>
                <Box className="mt-3 flex flex-wrap gap-1">
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
              <CardActions className="px-4 pb-4">
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
