import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#5865F2",
  "#57F287",
  "#FAA61A",
  "#00A8FC",
  "#EB459E",
  "#FEE75C",
  "#3BA55D",
  "#ED4245",
  "#9B59B6",
  "#95A5A6",
];

function CustomTooltip({
  active,
  payload,
  totalSpending,
}) {
  if (
    active &&
    payload &&
    payload.length
  ) {
    const value = payload[0].value;

    const percent =
      totalSpending > 0
        ? (
            (value / totalSpending) *
            100
          ).toFixed(1)
        : 0;

    return (
      <div
        style={{
          background: "#1d1f24",
          border:
            "1px solid rgba(255,255,255,.08)",
          borderRadius: "12px",
          padding: "12px 16px",
          boxShadow:
            "0 10px 25px rgba(0,0,0,.35)",
        }}
      >
        <strong
          style={{
            display: "block",
            marginBottom: "6px",
          }}
        >
          {payload[0].name}
        </strong>

        <div>
          ${Number(value).toLocaleString("en-US")}
        </div>

        <small
          style={{
            color: "#8b93a7",
          }}
        >
          {percent}% of spending
        </small>
      </div>
    );
  }

  return null;
}

function CategoryPieChart({ bills }) {
  const categoryTotals = {};

  bills.forEach((bill) => {
    const category = bill.category || "Other";

    categoryTotals[category] =
      (categoryTotals[category] || 0) +
      Number(bill.amount || 0);
  });

  const chartData = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const totalSpending = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const largestCategory =
    chartData.length > 0 ? chartData[0] : null;

  function renderCenterLabel({
    viewBox,
  }) {
    if (!viewBox) return null;

    const { cx, cy } = viewBox;

    return (
      <>
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="28"
          fontWeight="700"
        >
          $
          {totalSpending.toLocaleString(
            "en-US"
          )}
        </text>

        <text
          x={cx}
          y={cy + 18}
          textAnchor="middle"
          fill="#8b93a7"
          fontSize="13"
        >
          Monthly Bills
        </text>
      </>
    );
  }

  return (
    <div className="widget">
      <h3>🥧 Spending Breakdown</h3>

      {chartData.length === 0 ? (
        <p
          style={{
            color: "var(--muted)",
            marginTop: "20px",
          }}
        >
          Add some bills to see your
          spending breakdown.
        </p>
      ) : (
        <>
          <ResponsiveContainer
            width="100%"
            height={340}
          >
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={82}
                outerRadius={122}
                paddingAngle={3}
                cornerRadius={10}
                label={renderCenterLabel}
                isAnimationActive
                animationDuration={900}
                              >
                {chartData.map(
                  (entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip
                content={
                  <CustomTooltip
                    totalSpending={totalSpending}
                  />
                }
              />
            </PieChart>
          </ResponsiveContainer>

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {chartData.map(
              (item, index) => {
                const percent =
                  (
                    (item.value /
                      totalSpending) *
                    100
                  ).toFixed(1);

                return (
                  <div
                    key={item.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "space-between",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "14px",
                          height: "14px",
                          borderRadius:
                            "50%",
                          background:
                            COLORS[
                              index %
                                COLORS.length
                            ],
                        }}
                      />

                      <span>
                        {item.name}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        fontWeight: "600",
                      }}
                    >
                      <span
                        style={{
                          color:
                            "#8b93a7",
                        }}
                      >
                        $
                        {item.value.toLocaleString(
                          "en-US"
                        )}
                      </span>

                      <span>
                        {percent}%
                      </span>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {largestCategory && (
            <div
              style={{
                marginTop: "24px",
                padding: "18px",
                borderRadius: "14px",
                background:
                  "rgba(88,101,242,.12)",
                border:
                  "1px solid rgba(88,101,242,.25)",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#8b93a7",
                  marginBottom: "6px",
                }}
              >
                🏆 Largest Category
              </div>

              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                }}
              >
                {largestCategory.name}
              </div>

              <div
                style={{
                  marginTop: "6px",
                  color: "#8b93a7",
                }}
              >
                $
                {largestCategory.value.toLocaleString(
                  "en-US"
                )}{" "}
                •{" "}
                {(
                  (largestCategory.value /
                    totalSpending) *
                  100
                ).toFixed(1)}
                %
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CategoryPieChart;
