"use client";
import { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  AlertTriangle,
  PieChartIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";

function Page() {
  const [finance, setFinance] = useState({
    income: 0,
    expenses: 0,
    netProfit: 0,
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [mostExpensive, setMostExpensive] = useState<any>(null);
  const [topCategories, setTopCategories] = useState<any>({
    category: [],
    transactionCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // For demo purposes, let's add a small delay to simulate loading
        await new Promise((resolve) => setTimeout(resolve, 500));

        const financeRes = await fetch("http://localhost:4000/finance/finance");
        const transactionsRes = await fetch(
          "http://localhost:4000/finance/transactions"
        );
        const mostExpensiveRes = await fetch(
          "http://localhost:4000/finance/most-expensive"
        );
        const topCategoriesRes = await fetch(
          "http://localhost:4000/finance/most-category"
        );

        if (!financeRes.ok || !transactionsRes.ok)
          throw new Error("Failed to fetch data");

        const financeData = await financeRes.json();
        const transactionsData = await transactionsRes.json();

        let mostExpensiveData = null;
        if (mostExpensiveRes.ok) {
          mostExpensiveData = await mostExpensiveRes.json();
        }

        let topCategoriesData = { category: [], transactionCount: 0 };
        if (topCategoriesRes.ok) {
          topCategoriesData = await topCategoriesRes.json();
        }

        setFinance(financeData);
        setTransactions(transactionsData);
        setMostExpensive(mostExpensiveData);
        setTopCategories(topCategoriesData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        // For demo purposes, set some sample data if the API fails
        setFinance({
          income: 24500,
          expenses: 18200,
          netProfit: 6300,
        });

        // Sample most expensive transaction
        setMostExpensive({
          id: 9,
          description: "Marketing Campaign",
          category: "Marketing",
          amount: 1200,
          type: "expense",
          date: "2024-02-15",
        });

        // Sample top categories
        setTopCategories({
          category: [
            { category: "Office Supplies", _count: { id: 3 } },
            { category: "Software", _count: { id: 2 } },
            { category: "Utilities", _count: { id: 2 } },
          ],
          transactionCount: 3,
        });

        setLoading(false);
      }
    }
    loadData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Prepare data for category pie chart
  const categoryChartData = topCategories.category.map((cat: any) => ({
    name: cat.category,
    value: cat._count.id,
  }));

  const chartData = [
    { name: "Income", value: finance.income, fill: "#3b82f6" },
    { name: "Expenses", value: finance.expenses, fill: "#60a5fa" },
    { name: "Net Profit", value: finance.netProfit, fill: "#2563eb" },
  ];

  const chartConfig = {
    Income: {
      label: "Income",
      color: "hsl(217, 91%, 60%)",
    },
    Expenses: {
      label: "Expenses",
      color: "hsl(213, 94%, 68%)",
    },
    NetProfit: {
      label: "Net Profit",
      color: "hsl(221, 83%, 53%)",
    },
  } satisfies ChartConfig;

  // Colors for the pie chart
  const COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Financial Dashboard
          </h1>
          <p className="text-slate-500">
            Track your financial performance at a glance
          </p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-blue-400 rounded-full mb-4"></div>
              <div className="h-4 w-32 bg-blue-300 rounded mb-2"></div>
              <div className="h-3 w-24 bg-blue-200 rounded"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mt-10 -mr-10"></div>
                <CardHeader className="pb-2">
                  <CardDescription className="text-blue-600 font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Total Income
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold text-slate-800">
                    {formatCurrency(finance.income)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-green-600 font-medium">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>+12.5% from last month</span>
                  </div>
                </CardContent>
                <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600 w-full"></div>
              </Card>

              <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mt-10 -mr-10"></div>
                <CardHeader className="pb-2">
                  <CardDescription className="text-blue-600 font-medium flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    Total Expenses
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold text-slate-800">
                    {formatCurrency(finance.expenses)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-red-600 font-medium">
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                    <span>+8.2% from last month</span>
                  </div>
                </CardContent>
                <div className="h-1 bg-gradient-to-r from-blue-300 to-blue-500 w-full"></div>
              </Card>

              <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mt-10 -mr-10"></div>
                <CardHeader className="pb-2">
                  <CardDescription className="text-blue-600 font-medium flex items-center">
                    <PiggyBank className="h-4 w-4 mr-1" />
                    Net Profit
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold text-slate-800">
                    {formatCurrency(finance.netProfit)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-green-600 font-medium">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>+5.2% from last month</span>
                  </div>
                </CardContent>
                <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800 w-full"></div>
              </Card>
            </div>

            {/* Most Expensive Transaction Card */}
            <div className="mb-8">
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full -mt-10 -mr-10"></div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                    Most Expensive Transaction
                  </CardTitle>
                  <CardDescription>Your highest expense</CardDescription>
                </CardHeader>
                {mostExpensive ? (
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            mostExpensive.type === "income"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {mostExpensive.type === "income" ? (
                            <ArrowUpRight className="h-6 w-6" />
                          ) : (
                            <ArrowDownRight className="h-6 w-6" />
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="text-lg font-semibold text-slate-800">
                            {mostExpensive.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-slate-500">
                              {mostExpensive.date ||
                                new Date().toLocaleDateString()}
                            </p>
                            {mostExpensive.category && (
                              <Badge variant="secondary" className="text-xs">
                                {mostExpensive.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-xl font-bold ${
                            mostExpensive.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {mostExpensive.type === "income" ? "+" : "-"}
                          {formatCurrency(mostExpensive.amount)}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {mostExpensive.type === "income"
                            ? "Income"
                            : "Expense"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                ) : (
                  <CardContent>
                    <div className="text-center py-6 text-slate-500">
                      No transactions available
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2 border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                        Financial Overview
                      </CardTitle>
                      <CardDescription>
                        Income, Expenses, and Net Profit
                      </CardDescription>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      This Year
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[350px]">
                    <ChartContainer config={chartConfig}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart accessibilityLayer data={chartData}>
                          <CartesianGrid
                            vertical={false}
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                          />
                          <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            stroke="#94a3b8"
                          />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                          />
                          <Bar
                            dataKey="value"
                            fill="url(#blueGradient)"
                            radius={[6, 6, 0, 0]}
                            barSize={60}
                          />
                          <defs>
                            <linearGradient
                              id="blueGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#3b82f6"
                                stopOpacity={1}
                              />
                              <stop
                                offset="100%"
                                stopColor="#60a5fa"
                                stopOpacity={0.8}
                              />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm border-t border-slate-100 pt-4">
                  <div className="flex gap-2 font-medium leading-none text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    Trending up by 5.2% this month
                  </div>
                  <div className="leading-none text-slate-500">
                    Showing financial overview for the current fiscal year
                  </div>
                </CardFooter>
              </Card>

              {/* Top Categories Chart */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                    <PieChartIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Top Transaction Categories
                  </CardTitle>
                  <CardDescription>
                    Most common transaction categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    {categoryChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {categoryChartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name, props) => [
                              `${value} transactions`,
                              props.payload.name,
                            ]}
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "8px",
                              boxShadow:
                                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                              border: "none",
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center text-slate-500">
                        No category data available
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-100 pt-4">
                  <div className="text-sm text-slate-500 w-full">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Top Category:</span>
                      <span>
                        {topCategories.category[0]?.category || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Frequency:</span>
                      <span>
                        {topCategories.category[0]?._count.id || 0} transactions
                      </span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800">
                    Recent Transactions
                  </CardTitle>
                  <CardDescription>
                    Your latest financial activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.length > 0 ? (
                      transactions.slice(0, 5).map((transaction, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:bg-blue-50 transition-colors duration-200"
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                transaction.type === "income"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {transaction.type === "income" ? (
                                <ArrowUpRight className="h-5 w-5" />
                              ) : (
                                <ArrowDownRight className="h-5 w-5" />
                              )}
                            </div>
                            <div className="ml-3">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-slate-800">
                                  {transaction.description || "Transaction"}
                                </p>
                                {transaction.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {transaction.category}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">
                                {transaction.date ||
                                  new Date().toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`font-medium ${
                              transaction.type === "income"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount || 0)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        No transactions found
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-100 pt-4">
                  <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center">
                    View All Transactions
                  </button>
                </CardFooter>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Page;
