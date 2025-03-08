"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  LineChartIcon,
  PieChartIcon,
  RefreshCwIcon,
  SearchIcon,
  Settings2Icon,
  WalletIcon,
} from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Chart,
  ChartContainer,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart";

// Types
interface FinanceData {
  income: number;
  expenses: number;
  netProfit: number;
  savingsRate?: number;
  monthlyGrowth?: number;
}

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  amount: number;
  date: string;
  description?: string;
}

// Navigation items
const navItems = [
  { name: "Dashboard", icon: HomeIcon, href: "#" },
  { name: "Finances", icon: WalletIcon, href: "#", active: true },
  { name: "Analytics", icon: LineChartIcon, href: "#" },
  { name: "Settings", icon: Settings2Icon, href: "#" },
];

export default function FinanceDashboard() {
  const [finance, setFinance] = useState<FinanceData>({
    income: 0,
    expenses: 0,
    netProfit: 0,
    savingsRate: 0,
    monthlyGrowth: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [transactionType, setTransactionType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  // Fetch data function
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const financeRes = await fetch("http://localhost:4000/finance/finance");
      const transactionsRes = await fetch(
        "http://localhost:4000/finance/transactions"
      );

      if (!financeRes.ok || !transactionsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const financeData = await financeRes.json();
      const transactionsData = await transactionsRes.json();

      // Add calculated metrics
      const enhancedFinanceData = {
        ...financeData,
        savingsRate: Math.round(
          (financeData.netProfit / financeData.income) * 100
        ),
        monthlyGrowth: 5.2, // This would come from the API in a real app
      };

      setFinance(enhancedFinanceData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load financial data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter transactions based on search and type
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
    const matchesType =
      transactionType === "all" ||
      tx.type.toLowerCase() === transactionType.toLowerCase();
    return matchesSearch && matchesType;
  });

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  // Chart data
  const barChartData = [
    { name: "Income", value: finance.income, color: "#22c55e" },
    { name: "Expenses", value: finance.expenses, color: "#ef4444" },
    { name: "Net Profit", value: finance.netProfit, color: "#3b82f6" },
  ];

  const pieChartData = [
    { name: "Income", value: finance.income, color: "#22c55e" },
    { name: "Expenses", value: finance.expenses, color: "#ef4444" },
  ];

  // Monthly trend data (mock data - would come from API in real app)
  const trendData = [
    { month: "Jan", income: 4500, expenses: 3200 },
    { month: "Feb", income: 5200, expenses: 3800 },
    { month: "Mar", income: 4800, expenses: 3500 },
    { month: "Apr", income: 6000, expenses: 4200 },
    { month: "May", income: 5500, expenses: 3900 },
    { month: "Jun", income: 6500, expenses: 4500 },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-2 py-4">
              <WalletIcon className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">FinTrack</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.active}
                    tooltip={item.name}
                  >
                    <a href={item.href} className="flex items-center">
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">JD</span>
              </div>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">
                  john@example.com
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Finance Dashboard</h1>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "MMMM yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchData}
                disabled={loading}
              >
                <RefreshCwIcon
                  className={cn("h-4 w-4", loading && "animate-spin")}
                />
                <span className="sr-only">Refresh data</span>
              </Button>
            </div>
          </header>

          <main className="p-6 space-y-6">
            {error ? (
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{error}</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={fetchData}
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Finance Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FinanceCard
                    title="Income"
                    value={finance.income}
                    loading={loading}
                    icon={<ArrowUpIcon className="h-4 w-4 text-green-500" />}
                    trend={+8.2}
                    color="green"
                  />
                  <FinanceCard
                    title="Expenses"
                    value={finance.expenses}
                    loading={loading}
                    icon={<ArrowDownIcon className="h-4 w-4 text-red-500" />}
                    trend={-3.1}
                    color="red"
                  />
                  <FinanceCard
                    title="Net Profit"
                    value={finance.netProfit}
                    loading={loading}
                    icon={<LineChartIcon className="h-4 w-4 text-blue-500" />}
                    trend={+12.5}
                    color="blue"
                  />
                  <FinanceCard
                    title="Savings Rate"
                    value={finance.savingsRate || 0}
                    loading={loading}
                    icon={<PieChartIcon className="h-4 w-4 text-purple-500" />}
                    trend={+2.3}
                    color="purple"
                    isPercentage
                  />
                </div>

                {/* Charts Section */}
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Bar Chart */}
                      <Card className="shadow-sm">
                        <CardHeader>
                          <CardTitle>Financial Overview</CardTitle>
                          <CardDescription>
                            Summary of your financial activity for{" "}
                            {format(date, "MMMM yyyy")}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                          {loading ? (
                            <div className="flex items-center justify-center h-full">
                              <Skeleton className="h-full w-full" />
                            </div>
                          ) : (
                            <Chart
                              type="bar"
                              data={barChartData}
                              categories={["value"]}
                              index="name"
                              colors={barChartData.map((d) => d.color)}
                              valueFormatter={(value) =>
                                `$${value.toLocaleString()}`
                              }
                              showLegend={false}
                              showXAxis
                              showYAxis
                              showTooltip
                              showGridLines
                            />
                          )}
                        </CardContent>
                      </Card>

                      {/* Pie Chart */}
                      <Card className="shadow-sm">
                        <CardHeader>
                          <CardTitle>Income vs Expenses</CardTitle>
                          <CardDescription>
                            Distribution of your finances for{" "}
                            {format(date, "MMMM yyyy")}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                          {loading ? (
                            <div className="flex items-center justify-center h-full">
                              <Skeleton className="h-full w-full" />
                            </div>
                          ) : (
                            <ChartContainer className="h-full">
                              <Chart
                                type="pie"
                                data={pieChartData}
                                category="value"
                                index="name"
                                colors={pieChartData.map((d) => d.color)}
                                valueFormatter={(value) =>
                                  `$${value.toLocaleString()}`
                                }
                                showTooltip
                              />
                              <ChartLegend className="mt-4">
                                {pieChartData.map((item) => (
                                  <ChartLegendItem
                                    key={item.name}
                                    name={item.name}
                                    color={item.color}
                                    className="capitalize"
                                  />
                                ))}
                              </ChartLegend>
                            </ChartContainer>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  <TabsContent value="trends">
                    <Card className="shadow-sm">
                      <CardHeader>
                        <CardTitle>Monthly Trends</CardTitle>
                        <CardDescription>
                          Your income and expenses over the last 6 months
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[400px]">
                        {loading ? (
                          <div className="flex items-center justify-center h-full">
                            <Skeleton className="h-full w-full" />
                          </div>
                        ) : (
                          <Chart
                            type="line"
                            data={trendData}
                            categories={["income", "expenses"]}
                            index="month"
                            colors={["#22c55e", "#ef4444"]}
                            valueFormatter={(value) =>
                              `$${value.toLocaleString()}`
                            }
                            showLegend
                            showXAxis
                            showYAxis
                            showTooltip
                            showGridLines
                          />
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Recent Transactions Table */}
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div>
                      <CardTitle>Recent Transactions</CardTitle>
                      <CardDescription>
                        Your latest financial activities
                      </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative">
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search transactions..."
                          className="pl-8 w-full sm:w-[200px]"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                          }}
                        />
                      </div>
                      <Select
                        value={transactionType}
                        onValueChange={(value) => {
                          setTransactionType(value);
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="w-full sm:w-[150px]">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-2">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                          ))}
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentTransactions.length > 0 ? (
                            currentTransactions.map((tx) => (
                              <TableRow key={tx.id}>
                                <TableCell>
                                  <Badge
                                    variant={
                                      tx.type === "INCOME"
                                        ? "success"
                                        : "destructive"
                                    }
                                    className="capitalize"
                                  >
                                    {tx.type.toLowerCase()}
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-medium">
                                  {tx.category}
                                </TableCell>
                                <TableCell>
                                  {tx.date
                                    ? new Date(tx.date).toLocaleDateString()
                                    : "N/A"}
                                </TableCell>
                                <TableCell>{tx.description || "—"}</TableCell>
                                <TableCell
                                  className={cn(
                                    "text-right font-medium",
                                    tx.type === "INCOME"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  )}
                                >
                                  {tx.type === "INCOME" ? "+" : "-"}$
                                  {tx.amount.toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="text-center py-6 text-muted-foreground"
                              >
                                {filteredTransactions.length === 0 &&
                                transactions.length > 0
                                  ? "No matching transactions found"
                                  : "No transactions found"}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                  {filteredTransactions.length > transactionsPerPage && (
                    <CardFooter className="flex items-center justify-between border-t px-6 py-4">
                      <div className="text-sm text-muted-foreground">
                        Showing{" "}
                        <span className="font-medium">
                          {indexOfFirstTransaction + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(
                            indexOfLastTransaction,
                            filteredTransactions.length
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {filteredTransactions.length}
                        </span>{" "}
                        transactions
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                        >
                          <ChevronLeftIcon className="h-4 w-4" />
                          <span className="sr-only">Previous page</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRightIcon className="h-4 w-4" />
                          <span className="sr-only">Next page</span>
                        </Button>
                      </div>
                    </CardFooter>
                  )}
                </Card>
              </>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

// Finance Card Component
interface FinanceCardProps {
  title: string;
  value: number;
  loading: boolean;
  icon: React.ReactNode;
  trend: number;
  color: "green" | "red" | "blue" | "purple";
  isPercentage?: boolean;
}

function FinanceCard({
  title,
  value,
  loading,
  icon,
  trend,
  color,
  isPercentage = false,
}: FinanceCardProps) {
  const colorMap = {
    green: "border-green-500 bg-green-50 dark:bg-green-950/20",
    red: "border-red-500 bg-red-50 dark:bg-red-950/20",
    blue: "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
    purple: "border-purple-500 bg-purple-50 dark:bg-purple-950/20",
  };

  const textColorMap = {
    green: "text-green-600",
    red: "text-red-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
  };

  return (
    <Card className={cn("border-l-4", colorMap[color])}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="rounded-full p-1">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-7 w-24" />
        ) : (
          <div className="text-2xl font-bold">
            {isPercentage ? `${value}%` : `$${value.toLocaleString()}`}
          </div>
        )}
        <div className="mt-2 flex items-center text-xs">
          <span
            className={cn(
              "flex items-center",
              trend > 0 ? "text-green-600" : "text-red-600"
            )}
          >
            {trend > 0 ? (
              <ArrowUpIcon className="mr-1 h-3 w-3" />
            ) : (
              <ArrowDownIcon className="mr-1 h-3 w-3" />
            )}
            {Math.abs(trend)}%
          </span>
          <span className="ml-1 text-muted-foreground">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
}
