import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

export default function PredictionChart({
  predictions = [],
  data = [],
  type = "area",
  height = 300,
  title = "Overflow Prediction Trend",
  loading = false,
}) {
  const sourceData = Array.isArray(data) && data.length > 0
    ? data
    : predictions;

  const chartData = sourceData.map((item, index) => {
    const rawFill =
      item.fill_level ??
      item.fill_percentage ??
      item.current_fill ??
      0;

    const rawPrediction =
      item.predicted_fill ??
      item.predicted_fill_level ??
      item.predicted_percentage ??
      item.overflow_probability ??
      item.probability ??
      0;

    const predictionNumber = Number(rawPrediction);

    return {
      name:
        item.label ||
        item.bin_name ||
        item.name ||
        item.date ||
        item.timestamp ||
        `Bin ${item.bin_id ?? item.id ?? index + 1}`,
      currentFill: Number(rawFill) || 0,
      predictedFill:
        Number.isFinite(predictionNumber)
          ? predictionNumber <= 1 && predictionNumber >= 0 &&
            (item.overflow_probability != null ||
              item.probability != null)
            ? predictionNumber * 100
            : predictionNumber
          : 0,
    };
  });

  const chartTitle = title || "Overflow Prediction Trend";

  return (
    <section
      className="prediction-chart"
      style={{
        padding: 18,
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        background: "#ffffff",
        minWidth: 0,
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 17,
            color: "#0f172a",
          }}
        >
          {chartTitle}
        </h3>
        <p
          style={{
            margin: "5px 0 0",
            fontSize: 12,
            color: "#64748b",
          }}
        >
          Current fill levels compared with predicted values
        </p>
      </div>

      {loading ? (
        <div
          style={{
            height,
            display: "grid",
            placeItems: "center",
            color: "#64748b",
          }}
        >
          Loading prediction data...
        </div>
      ) : chartData.length === 0 ? (
        <div
          style={{
            height,
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            color: "#64748b",
            background: "#f8fafc",
            borderRadius: 10,
            padding: 16,
          }}
        >
          No prediction data available yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          {type === "bar" ? (
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 35 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#64748b" }}
                angle={-20}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#64748b" }}
                unit="%"
              />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Bar
                dataKey="currentFill"
                name="Current Fill"
                fill="#16a34a"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="predictedFill"
                name="Predicted Fill"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 35 }}
            >
              <defs>
                <linearGradient
                  id="currentFillGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#16a34a"
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="95%"
                    stopColor="#16a34a"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="predictedFillGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#2563eb"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="#2563eb"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#64748b" }}
                angle={-20}
                textAnchor="end"
                interval="preserveStartEnd"
              />

              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#64748b" }}
                unit="%"
              />

              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />

              <Area
                type="monotone"
                dataKey="currentFill"
                name="Current Fill"
                stroke="#16a34a"
                strokeWidth={2}
                fill="url(#currentFillGradient)"
              />

              <Area
                type="monotone"
                dataKey="predictedFill"
                name="Predicted Fill"
                stroke="#2563eb"
                strokeWidth={2}
                strokeDasharray="5 4"
                fill="url(#predictedFillGradient)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      )}

      <p
        style={{
          margin: "10px 0 0",
          fontSize: 11,
          color: "#94a3b8",
        }}
      >
        Predictions are based on the data supplied by your application.
      </p>
    </section>
  );
}
