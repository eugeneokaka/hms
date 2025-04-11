"use client";
import React from "react";
import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { imageOptimizer } from "next/dist/server/image-optimizer";
// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];
// const chartConfig = {
//   desktop: {
//     label: "Income",
//     color: "hsl(var(--chart-1))",
//   },
//   mobile: {
//     label: "Expenses",
//     color: "hsl(var(--chart-2))",
//   },
//   mob: {
//     label: "Profit",
//     color: "hsl(var(--chart-3))",
//   },
// } satisfies ChartConfig;

function page() {
  const [finance, setFinance] = useState({
    income: 0,
    expenses: 0,
    netProfit: 0,
  });
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const financeRes = await fetch("http://localhost:4000/finance/finance");
        const transactionsRes = await fetch(
          "http://localhost:4000/finance/transactions"
        );

        if (!financeRes.ok || !transactionsRes.ok)
          throw new Error("Failed to fetch data");

        const financeData = await financeRes.json();
        const transactionsData = await transactionsRes.json();

        setFinance(financeData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
    loadData();
  }, []);

  const chartData = [
    { name: "Income", value: finance.income, fill: "var(--color-chrome)" },
    { name: "Expenses", value: finance.expenses, fill: "var(--color-chrome)" },
    {
      name: "Net Profit",
      value: finance.netProfit,
      fill: "var(--color-chrome)",
    },
  ];
  const chartConfig = {
    Imcome: {
      label: "food",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Expenses",
      color: "hsl(var(--chart-2))",
    },
    mob: {
      label: "Profit",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <div>
      <div className="flex gap-2 flex-wrap w-full justify-between">
        <div className="bg-slate-600 w-44  h-36  rounded-md flex-1">
          <h1 className="text-center pt-2 text-lg text-white">Income</h1>
          <p className="pt-5 pl-2 text-white">{finance.income}</p>
        </div>
        <div className="bg-slate-600 w-44  h-36  rounded-md flex-1">
          <h1 className="text-center pt-2 text-lg text-white">expenses</h1>
          <p className="pt-5 pl-2 text-white">{finance.expenses}</p>
        </div>
        <div className="bg-slate-600 w-44  h-36  rounded-md flex-1">
          <h1 className="text-center pt-2 text-lg text-white">Net profit</h1>
          <p className="pt-5 pl-2 text-white">{finance.expenses}</p>
        </div>
      </div>
      <Card className="w-8/12">
        <CardHeader>
          <CardTitle>Bar Chart - Multiple</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="value" fill="var(--color-desktop)" radius={4} />
              {/* <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              <Bar dataKey="mob" fill="var(--color-mob)" radius={4} /> */}
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default page;
