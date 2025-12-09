import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip as MuiTooltip,
  Typography,
} from "@mui/material";
import {
  AccessTime,
  EmojiEvents,
  Groups,
  InfoOutlined,
  Refresh,
  TrendingUp,
  Edit,
} from "@mui/icons-material";
import Header from "./components/Header";
import StatsGrid from "./components/StatsGrid";
import AdminDisputesPanel from "./components/AdminDisputesPanel";
import { useAuth } from "../../contexts/AuthContext";
import {
  AdminIndicatorsResponse,
  PerformanceIndicator,
  getAdminIndicators,
  saveIndicatorTarget,
} from "../../service/adminIndicatorsService";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  ComposedChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const indicatorIcons: Record<string, React.ReactNode> = {
  "match-success-rate": <TrendingUp />,
  "average-hiring-time": <AccessTime />,
  "developer-engagement-rate": <Groups />,
  "post-hiring-satisfaction": <EmojiEvents />,
};

const indicatorColors: Record<string, string> = {
  "match-success-rate": "primary.main",
  "average-hiring-time": "warning.main",
  "developer-engagement-rate": "info.main",
  "post-hiring-satisfaction": "success.main",
};

const periodOptions = [7, 30, 90, 180];
const chartPalette = ["#1976d2", "#9c27b0", "#2e7d32", "#ff9800", "#00acc1"];
const metaBarFill = "#cfd8dc";

const formatValueWithUnit = (value: number, unidade: string) => {
  switch (unidade) {
    case "%":
      return `${value.toFixed(1)}%`;
    case "dias":
      return `${value.toFixed(1)} dias`;
    case "pt":
      return `${value.toFixed(2)} pts`;
    default:
      return value.toFixed(2);
  }
};

const formatIndicatorValue = (indicator: PerformanceIndicator) => {
  const value = Number(indicator.valor ?? 0);
  return formatValueWithUnit(value, indicator.unidade);
};

const humanizeKey = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .replace(/_/g, " ");

const formatDetailValue = (value: unknown) => {
  if (typeof value === "number") {
    return value.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
  }
  return String(value);
};

const STATUS_TOLERANCE_PERCENT = 2;

type IndicatorStatusKey = "above" | "onTarget" | "below" | "noMeta";

const formatDelta = (deltaPercent: number = 0) => {
  const signal = deltaPercent >= 0 ? "+" : "-";
  return `${signal}${Math.abs(deltaPercent).toFixed(1)}%`;
};

const indicatorStatusCopy: Record<
  IndicatorStatusKey,
  {
    color: "default" | "success" | "info" | "warning";
    label: (deltaPercent?: number) => string;
  }
> = {
  above: {
    color: "success",
    label: (deltaPercent) => `Acima da meta (${formatDelta(deltaPercent)})`,
  },
  onTarget: {
    color: "info",
    label: (deltaPercent) => `No alvo (${formatDelta(deltaPercent)})`,
  },
  below: {
    color: "warning",
    label: (deltaPercent) => `Abaixo da meta (${formatDelta(deltaPercent)})`,
  },
  noMeta: {
    color: "default",
    label: () => "Sem meta cadastrada",
  },
};

const getIndicatorStatus = (
  indicator: PerformanceIndicator
): { key: IndicatorStatusKey; deltaPercent?: number } => {
  if (typeof indicator.meta !== "number") {
    return { key: "noMeta" };
  }

  const current = Number(indicator.valor ?? 0);
  const meta = Number(indicator.meta);

  if (meta === 0) {
    if (current === 0) {
      return { key: "onTarget", deltaPercent: 0 };
    }
    return { key: current > meta ? "above" : "below" };
  }

  const deltaPercent = ((current - meta) / Math.abs(meta)) * 100;

  if (deltaPercent >= STATUS_TOLERANCE_PERCENT) {
    return { key: "above", deltaPercent };
  }
  if (deltaPercent <= -STATUS_TOLERANCE_PERCENT) {
    return { key: "below", deltaPercent };
  }

  return { key: "onTarget", deltaPercent };
};

const formatMetaLabel = (indicator: PerformanceIndicator) => {
  if (typeof indicator.meta !== "number") {
    return null;
  }

  switch (indicator.unidade) {
    case "%":
      return `${indicator.meta.toFixed(0)}%`;
    case "dias":
      return `${indicator.meta.toFixed(1)} dias`;
    case "pt":
      return `${indicator.meta.toFixed(2)} pts`;
    default:
      return indicator.meta.toFixed(2);
  }
};

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [periodDays, setPeriodDays] = useState(30);
  const [data, setData] = useState<AdminIndicatorsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editTargetDialog, setEditTargetDialog] = useState<{
    open: boolean;
    indicator: PerformanceIndicator | null;
    targetValue: string;
  }>({
    open: false,
    indicator: null,
    targetValue: "",
  });
  const [savingTarget, setSavingTarget] = useState(false);

  const fetchIndicators = useCallback(async () => {
    if (!user) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getAdminIndicators(periodDays);
      setData(response);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os indicadores agora.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [periodDays, user]);

  useEffect(() => {
    fetchIndicators();
  }, [fetchIndicators]);

  const stats = useMemo(() => {
    if (!data?.indicators) return [];
    return data.indicators.map((indicator) => ({
      title: indicator.indicador,
      value: formatIndicatorValue(indicator),
      icon: indicatorIcons[indicator.id] ?? <InfoOutlined />,
      avatarBgColor: indicatorColors[indicator.id] ?? "info.main",
    }));
  }, [data]);

  const indicatorCharts = useMemo(
    () =>
      (data?.indicators ?? []).map((indicator, index) => {
        const valor = Number(indicator.valor ?? 0);
        const meta =
          typeof indicator.meta === "number"
            ? Number(indicator.meta)
            : undefined;
        const chartData = [
          {
            name: "Atual",
            value: valor,
            type: "valor" as const,
            fill: chartPalette[index % chartPalette.length],
          },
        ];

        if (typeof meta === "number") {
          chartData.push({
            name: "Meta",
            value: meta,
            type: "meta" as const,
            fill: metaBarFill,
          });
        }

        return {
          id: indicator.id,
          title: indicator.indicador,
          unidade: indicator.unidade,
          formattedValue: formatIndicatorValue(indicator),
          metaLabel: formatMetaLabel(indicator),
          chartData,
          status: getIndicatorStatus(indicator),
        };
      }),
    [data]
  );

  const percentIndicators = useMemo(
    () =>
      (data?.indicators ?? [])
        .filter((indicator) => indicator.unidade === "%")
        .map((indicator) => ({
          name: indicator.indicador,
          valor: Number(indicator.valor ?? 0),
          meta: typeof indicator.meta === "number" ? indicator.meta : undefined,
        })),
    [data]
  );

  const absoluteIndicators = useMemo(
    () =>
      (data?.indicators ?? [])
        .filter((indicator) => indicator.unidade !== "%")
        .map((indicator) => ({
          name: indicator.indicador,
          valor: Number(indicator.valor ?? 0),
          meta: typeof indicator.meta === "number" ? indicator.meta : undefined,
          unidade: indicator.unidade,
        })),
    [data]
  );

  const indicatorSummary = useMemo(() => {
    const indicators = data?.indicators ?? [];

    if (!indicators.length) {
      return {
        total: 0,
        withMeta: 0,
        success: 0,
        successRate: 0,
        coverageRate: 0,
        alerts: 0,
      };
    }

    const indicatorsWithMeta = indicators.filter(
      (indicator) => typeof indicator.meta === "number"
    );

    const indicatorsOnTarget = indicatorsWithMeta.filter((indicator) => {
      const status = getIndicatorStatus(indicator);
      return status.key === "above" || status.key === "onTarget";
    });

    const alerts = indicators.filter((indicator) =>
      Boolean(indicator.observacoes)
    ).length;

    return {
      total: indicators.length,
      withMeta: indicatorsWithMeta.length,
      success: indicatorsOnTarget.length,
      successRate: indicatorsWithMeta.length
        ? Math.round(
            (indicatorsOnTarget.length / indicatorsWithMeta.length) * 100
          )
        : 0,
      coverageRate: Math.round(
        (indicatorsWithMeta.length / indicators.length) * 100
      ),
      alerts,
    };
  }, [data]);

  const indicatorsWithAlerts = useMemo(
    () =>
      (data?.indicators ?? []).filter((indicator) =>
        Boolean(indicator.observacoes)
      ),
    [data]
  );

  const matchBreakdown = useMemo(() => {
    const matchIndicator = data?.indicators.find(
      (indicator) => indicator.id === "match-success-rate"
    );
    if (!matchIndicator?.detalhes) {
      return [];
    }

    const matches = Number(matchIndicator.detalhes.matchesAceitos ?? 0);
    const contratos = Number(matchIndicator.detalhes.contratosGerados ?? 0);

    return [
      { name: "Matches aceitos", value: matches },
      { name: "Contratações", value: contratos },
    ];
  }, [data]);

  const handleQuickPeriodChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => {
    if (newValue !== null) {
      setPeriodDays(newValue);
    }
  };

  const handleEditTarget = (indicator: PerformanceIndicator) => {
    setEditTargetDialog({
      open: true,
      indicator,
      targetValue: indicator.meta?.toString() || "",
    });
  };

  const handleCloseEditTarget = () => {
    setEditTargetDialog({
      open: false,
      indicator: null,
      targetValue: "",
    });
  };

  const handleSaveTarget = async () => {
    if (!editTargetDialog.indicator) return;

    const targetValue = parseFloat(editTargetDialog.targetValue);
    if (isNaN(targetValue) || targetValue < 0) {
      setError("Por favor, insira um valor válido maior ou igual a zero.");
      return;
    }

    setSavingTarget(true);
    try {
      await saveIndicatorTarget(editTargetDialog.indicator.id, targetValue);
      handleCloseEditTarget();
      // Recarregar os indicadores para refletir a nova meta
      await fetchIndicators();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível salvar a meta.";
      setError(message);
    } finally {
      setSavingTarget(false);
    }
  };

  const generatedAtLabel = data
    ? new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(data.generatedAt))
    : "—";

  return (
    <Box sx={{ p: 3 }}>
      <Header
        title="Painel Administrativo"
        subtitle="Indicadores operacionais da plataforma com base no modelo relacional."
      />

      {!user && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Faça login para acessar os indicadores administrativos.
        </Alert>
      )}

      {user && (
        <>
          <Card elevation={4}>
            <CardHeader
              title="Indicadores chave"
              subheader={`Atualizado em ${generatedAtLabel}`}
              action={
                <Stack direction="row" spacing={2} alignItems="center">
                  <ToggleButtonGroup
                    size="small"
                    value={periodDays}
                    exclusive
                    onChange={handleQuickPeriodChange}
                  >
                    {periodOptions.map((option) => (
                      <ToggleButton
                        key={option}
                        value={option}
                        sx={{ textTransform: "none" }}
                      >
                        Últimos {option}d
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                  <MuiTooltip title="Atualizar indicadores">
                    <span>
                      <IconButton onClick={fetchIndicators} disabled={loading}>
                        <Refresh />
                      </IconButton>
                    </span>
                  </MuiTooltip>
                </Stack>
              }
            />
            {loading && <LinearProgress />}
            <CardContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {loading && !stats.length ? (
                <Grid container spacing={3} sx={{ mb: 1 }}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={3} key={`stat-skeleton-${index}`}>
                      <Skeleton
                        variant="rounded"
                        height={120}
                        animation="wave"
                        sx={{ borderRadius: 2 }}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : stats.length > 0 ? (
                <StatsGrid stats={stats} />
              ) : (
                <Typography color="text.secondary">
                  Ainda não há dados suficientes para calcular os indicadores.
                </Typography>
              )}

              {(indicatorCharts.length > 0 || loading) && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Leitura gráfica rápida por indicador
                  </Typography>
                  {loading && !indicatorCharts.length ? (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {Array.from({ length: 4 }).map((_, index) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          key={`chart-skeleton-${index}`}
                        >
                          <Skeleton
                            variant="rounded"
                            height={220}
                            animation="wave"
                            sx={{ borderRadius: 2 }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {indicatorCharts.map((indicator) => {
                        const statusConfig =
                          indicatorStatusCopy[indicator.status.key];
                        return (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                            key={`chart-${indicator.id}`}
                          >
                            <Paper
                              variant="outlined"
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                fontWeight={600}
                                noWrap
                              >
                                {indicator.title}
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mt: 1 }}
                              >
                                <Typography variant="h5">
                                  {indicator.formattedValue}
                                </Typography>
                                {indicator.metaLabel && (
                                  <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      Meta {indicator.metaLabel}
                                    </Typography>
                                    <MuiTooltip title="Editar meta">
                                      <IconButton
                                        size="small"
                                        onClick={() => {
                                          const indicatorData = data?.indicators.find(
                                            (ind) => ind.id === indicator.id
                                          );
                                          if (indicatorData) {
                                            handleEditTarget(indicatorData);
                                          }
                                        }}
                                        sx={{ p: 0.5 }}
                                      >
                                        <Edit fontSize="small" />
                                      </IconButton>
                                    </MuiTooltip>
                                  </Stack>
                                )}
                              </Stack>
                              <Chip
                                size="small"
                                variant="outlined"
                                color={statusConfig.color}
                                label={statusConfig.label(
                                  indicator.status.deltaPercent
                                )}
                                sx={{ mt: 1, alignSelf: "flex-start" }}
                              />
                              <Box sx={{ mt: 2, height: 160 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart
                                    data={indicator.chartData}
                                    margin={{ top: 8, right: 8, left: -10 }}
                                  >
                                    <CartesianGrid
                                      strokeDasharray="3 3"
                                      vertical={false}
                                    />
                                    <XAxis
                                      dataKey="name"
                                      tick={{ fontSize: 12 }}
                                      axisLine={false}
                                      tickLine={false}
                                    />
                                    <YAxis hide />
                                    <RechartsTooltip
                                      formatter={(
                                        value: number,
                                        _name: string,
                                        entry: { payload?: { type?: string } }
                                      ) => [
                                        formatValueWithUnit(
                                          value,
                                          indicator.unidade
                                        ),
                                        entry?.payload?.type === "meta"
                                          ? "Meta"
                                          : "Valor atual",
                                      ]}
                                    />
                                    <Bar
                                      dataKey="value"
                                      radius={[4, 4, 0, 0]}
                                      maxBarSize={36}
                                    >
                                      {indicator.chartData.map((entry) => (
                                        <Cell
                                          key={`${indicator.id}-${entry.name}`}
                                          fill={entry.fill}
                                        />
                                      ))}
                                    </Bar>
                                  </BarChart>
                                </ResponsiveContainer>
                              </Box>
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
          <Card sx={{ mt: 3 }} elevation={4}>
            <CardHeader
              title="Resumo operacional"
              subheader="Status consolidado das metas monitoradas."
            />
            {loading && <LinearProgress />}
            <CardContent>
              {indicatorSummary.total > 0 ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="overline" color="text.secondary">
                        Cobertura de metas
                      </Typography>
                      <Typography variant="h4" sx={{ my: 1 }}>
                        {indicatorSummary.coverageRate}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {indicatorSummary.withMeta} de {indicatorSummary.total}{" "}
                        indicadores com meta definida.
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={indicatorSummary.coverageRate}
                        sx={{ mt: 2, height: 8, borderRadius: 999 }}
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="overline" color="text.secondary">
                        Cumprimento das metas
                      </Typography>
                      <Typography variant="h4" sx={{ my: 1 }}>
                        {indicatorSummary.successRate}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {indicatorSummary.success} indicadores performando no
                        esperado.
                      </Typography>
                      <LinearProgress
                        color="success"
                        variant="determinate"
                        value={indicatorSummary.successRate}
                        sx={{ mt: 2, height: 8, borderRadius: 999 }}
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="overline" color="text.secondary">
                        Alertas ativos
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "baseline", my: 1 }}
                      >
                        <Typography variant="h4">
                          {indicatorSummary.alerts}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          alertas
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {indicatorSummary.alerts
                          ? "Revise as observações em destaque."
                          : "Nenhum alerta registrado para o período."}
                      </Typography>
                      {indicatorSummary.alerts > 0 && (
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          useFlexGap
                          sx={{ mt: 2 }}
                        >
                          {indicatorsWithAlerts.slice(0, 3).map((indicator) => (
                            <Chip
                              key={indicator.id}
                              label={indicator.indicador}
                              size="small"
                              color="warning"
                              variant="outlined"
                            />
                          ))}
                          {indicatorSummary.alerts > 3 && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              +{indicatorSummary.alerts - 3} outros indicadores
                            </Typography>
                          )}
                        </Stack>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              ) : (
                <Typography color="text.secondary">
                  Aguarde o carregamento para visualizar o panorama consolidado.
                </Typography>
              )}
            </CardContent>
          </Card>
          <Card sx={{ mt: 3 }} elevation={4}>
            <CardHeader
              title="Visualizações estratégicas"
              subheader="Compare rapidamente evolução x metas e entenda volumes de conversão."
            />
            {loading && <LinearProgress />}
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Indicadores percentuais
                  </Typography>
                  {loading && !percentIndicators.length ? (
                    <Skeleton
                      variant="rounded"
                      height={320}
                      animation="wave"
                      sx={{ borderRadius: 2 }}
                    />
                  ) : percentIndicators.length > 0 ? (
                    <ResponsiveContainer height={320}>
                      <LineChart data={percentIndicators}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis
                          domain={[0, 100]}
                          tickFormatter={(tick) => `${tick}%`}
                        />
                        <RechartsTooltip
                          formatter={(value: number, name: string) => [
                            `${value.toFixed(1)}%`,
                            name === "valor" ? "Valor atual" : "Meta",
                          ]}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="valor"
                          name="Valor atual"
                          stroke={chartPalette[0]}
                          strokeWidth={3}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="meta"
                          name="Meta"
                          stroke={chartPalette[1]}
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <Typography color="text.secondary">
                      Sem indicadores percentuais para este período.
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Tempo e satisfação
                  </Typography>
                  {loading && !absoluteIndicators.length ? (
                    <Skeleton
                      variant="rounded"
                      height={320}
                      animation="wave"
                      sx={{ borderRadius: 2 }}
                    />
                  ) : absoluteIndicators.length > 0 ? (
                    <ResponsiveContainer height={320}>
                      <ComposedChart data={absoluteIndicators}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(tick) => tick.toFixed(1)} />
                        <RechartsTooltip
                          formatter={(
                            value: number,
                            name: string,
                            props: { payload?: { unidade?: string } }
                          ) => [
                            `${value.toFixed(2)} ${
                              props?.payload?.unidade ?? ""
                            }`.trim(),
                            name === "valor" ? "Valor atual" : "Meta",
                          ]}
                        />
                        <Legend />
                        <Bar
                          dataKey="valor"
                          name="Valor atual"
                          barSize={28}
                          fill={chartPalette[2]}
                          radius={[4, 4, 0, 0]}
                        />
                        <Line
                          type="monotone"
                          dataKey="meta"
                          name="Meta"
                          stroke={chartPalette[3]}
                          strokeDasharray="6 4"
                          dot={{ r: 4 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  ) : (
                    <Typography color="text.secondary">
                      Nenhum indicador absoluto disponível.
                    </Typography>
                  )}
                </Grid>

                {(matchBreakdown.length > 0 || loading) && (
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Conversão de matches em contratos
                    </Typography>
                    {loading && !matchBreakdown.length ? (
                      <Skeleton
                        variant="rounded"
                        height={320}
                        animation="wave"
                        sx={{ borderRadius: 2 }}
                      />
                    ) : (
                      <ResponsiveContainer height={320}>
                        <PieChart>
                          <Pie
                            data={matchBreakdown}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            labelLine={false}
                          label={({ percent = 0, name }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {matchBreakdown.map((entry, index) => (
                              <Cell
                                key={`cell-${entry.name}`}
                                fill={chartPalette[index % chartPalette.length]}
                              />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            formatter={(value: number) => [
                              `${value}`,
                              "Quantidade",
                            ]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
          <Card sx={{ mt: 3 }} elevation={4}>
            <CardHeader
              title="Detalhamento conforme documento de indicadores"
              subheader="Modelo baseado no artefato de Indicadores de Desempenho."
            />
            {loading && <LinearProgress />}
            <CardContent>
              <TableContainer
                component={Paper}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Table size="small">
                  <TableHead sx={{ bgcolor: "action.hover" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Indicador</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Objetivos</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Descrição</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        Fontes de dados
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Fórmula</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        Valor atual
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.indicators?.map((indicator) => {
                      const status = getIndicatorStatus(indicator);
                      const statusConfig = indicatorStatusCopy[status.key];
                      const metaLabel = formatMetaLabel(indicator);

                      return (
                        <TableRow key={indicator.id} hover>
                          <TableCell sx={{ width: 220 }}>
                            <Typography variant="subtitle1" fontWeight={700}>
                              {indicator.indicador}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.primary">
                              {indicator.objetivo}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontStyle: "italic" }}
                            >
                              {indicator.descricao}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ width: 160 }}>
                            <Stack
                              direction="row"
                              spacing={1}
                              flexWrap="wrap"
                              useFlexGap
                            >
                              {indicator.fonteDados.map((fonte) => (
                                <Chip
                                  key={fonte}
                                  label={fonte}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                  sx={{ mb: 0.5 }}
                                />
                              ))}
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ width: 180 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "monospace",
                                bgcolor: "grey.50",
                                p: 0.5,
                                borderRadius: 0.5,
                              }}
                            >
                              {indicator.formula}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ width: 180 }}>
                            <Stack spacing={1} alignItems="flex-end">
                              <Typography
                                variant="h5"
                                fontWeight={700}
                                color="primary.main"
                              >
                                {formatIndicatorValue(indicator)}
                              </Typography>
                              <Chip
                                size="small"
                                color={statusConfig.color}
                                variant={
                                  status.key === "noMeta" ? "outlined" : "filled"
                                }
                                label={statusConfig.label(status.deltaPercent)}
                              />
                              {metaLabel && (
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <Chip
                                    size="small"
                                    color="default"
                                    variant="outlined"
                                    label={`Meta: ${metaLabel}`}
                                  />
                                  <MuiTooltip title="Editar meta">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleEditTarget(indicator)}
                                      sx={{ p: 0.5 }}
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                  </MuiTooltip>
                                </Stack>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {!data?.indicators?.length && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography color="text.secondary">
                            Nenhum indicador disponível neste momento.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
          {indicatorsWithAlerts.length > 0 && (
            <Card sx={{ mt: 3 }} elevation={4}>
              <CardHeader
                title="Alertas e riscos"
                subheader="Observações sinalizadas pelos indicadores monitorados."
              />
              <CardContent>
                <Stack spacing={2}>
                  {indicatorsWithAlerts.map((indicator) => (
                    <Alert
                      key={indicator.id}
                      severity="warning"
                      variant="outlined"
                      sx={{ alignItems: "flex-start" }}
                    >
                      <AlertTitle>{indicator.indicador}</AlertTitle>
                      {indicator.observacoes}
                    </Alert>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}
          <Card sx={{ mt: 3 }} elevation={4}>
            <CardHeader
              title="Insights operacionais"
              subheader="Mostra o que está por trás de cada indicador (volumes e notas auxiliares)."
            />
            {loading && <LinearProgress />}
            <CardContent>
              <Grid container spacing={3}>
                {data?.indicators?.map((indicator) => (
                  <Grid item xs={12} md={6} key={indicator.id}>
                    <Card
                      variant="outlined"
                      elevation={0}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        p: 1.5,
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="flex-start"
                        sx={{ mb: 1 }}
                      >
                        <Box
                          sx={{
                            color:
                              indicatorColors[indicator.id] ?? "action.active",
                            pt: 0.2,
                          }}
                        >
                          {indicatorIcons[indicator.id] ?? <InfoOutlined />}
                        </Box>

                        <Box>
                          <Typography variant="h6" fontWeight={700}>
                            {indicator.indicador}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {indicator.metaDescricao}
                          </Typography>
                        </Box>
                      </Stack>

                      <Divider sx={{ mb: 1.5 }} />

                      {indicator.detalhes &&
                      Object.keys(indicator.detalhes).length > 0 ? (
                        <Stack spacing={1}>
                          {Object.entries(indicator.detalhes).map(
                            ([key, value]) => (
                              <Box
                                key={key}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: 2,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {humanizeKey(key)}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  fontWeight={600}
                                  color="text.primary"
                                >
                                  {formatDetailValue(value)}
                                </Typography>
                              </Box>
                            )
                          )}
                        </Stack>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ flexGrow: 1 }}
                        >
                          Sem detalhes adicionais disponíveis.
                        </Typography>
                      )}

                      {indicator.observacoes && (
                        <Alert
                          severity="info"
                          variant="outlined"
                          sx={{
                            mt: "auto",
                            display: "flex",
                            alignItems: "center",
                            p: 1,
                            "& .MuiAlert-icon": { pt: 0.5 },
                          }}
                        >
                          {indicator.observacoes}
                        </Alert>
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Painel de Contestações */}
          <AdminDisputesPanel onRefresh={fetchIndicators} />
        </>
      )}

      {/* Diálogo para editar meta */}
      <Dialog
        open={editTargetDialog.open}
        onClose={handleCloseEditTarget}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Editar Meta: {editTargetDialog.indicator?.indicador}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {editTargetDialog.indicator?.metaDescricao}
          </Typography>
          <TextField
            fullWidth
            label="Valor da Meta"
            type="number"
            value={editTargetDialog.targetValue}
            onChange={(e) =>
              setEditTargetDialog({
                ...editTargetDialog,
                targetValue: e.target.value,
              })
            }
            helperText={`Unidade: ${editTargetDialog.indicator?.unidade || ""}`}
            inputProps={{
              min: 0,
              step: editTargetDialog.indicator?.unidade === "pt" ? 0.1 : 1,
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditTarget}>Cancelar</Button>
          <Button
            onClick={handleSaveTarget}
            variant="contained"
            disabled={savingTarget}
          >
            {savingTarget ? "Salvando..." : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
