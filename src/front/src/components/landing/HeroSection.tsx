import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  Speed,
  Security,
  Code,
  Business,
  HandshakeOutlined,
} from '@mui/icons-material';

const HeroSection: React.FC = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <Speed />,
      title: 'Matching Rápido',
      description: 'Seja conectado com oportunidades relevantes em minutos, não semanas.',
    },
    {
      icon: <Security />,
      title: 'Seguro e Transparente',
      description: 'Construído com transparência e segurança como base.',
    },
    {
      icon: <HandshakeOutlined />,
      title: 'Matches Perfeitos',
      description: 'Matching com IA baseado em habilidades, experiência e preferências.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Desenvolvedores' },
    { value: '2K+', label: 'Empresas' },
    { value: '15K+', label: 'Matches Feitos' },
    { value: '95%', label: 'Taxa de Sucesso' },
  ];

  return (
    <Box sx={{ mt: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 3,
                  background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Conecte. Combine. Cresça.
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.6 }}
              >
                A plataforma inteligente que conecta desenvolvedores talentosos com empresas
                em busca do talento tech perfeito. Rápido, transparente e eficiente.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Code />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                  }}
                >
                  Sou Desenvolvedor
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Business />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                  }}
                >
                  Sou uma Empresa
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: { xs: 300, md: 400 },
                    background: 'linear-gradient(135deg, #590368ff 0%, #1366b9ff 100%)',
                  borderRadius: 4,
                  position: 'relative',
                }}
              >
                <Typography
                  variant="h2"
                  component="div"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  DevMatch
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color="primary.main"
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            textAlign="center"
            sx={{ mb: 2 }}
          >
            Por que Escolher o DevMatch?
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            Construído para o cenário moderno de contratação tech
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    borderRadius: 3,
                    border: "3px solid lightgray",
                    p: 3,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HeroSection;