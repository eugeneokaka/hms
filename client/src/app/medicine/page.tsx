"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ExpiringBanner from "../components/ExpiringBanner";

type Medicine = {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  description: string;
  quantity: number;
  price: number;
  expiryDate: string;
  createdAt: string;
  order?: {
    supplier: string;
    orderNumber: string;
  };
};

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const [searchName, setSearchName] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchName) params.append("name", searchName);
      if (filterCategory) params.append("category", filterCategory);
      if (filterDate) params.append("startDate", filterDate);

      const query = params.toString();
      const endpoint =
        query.length > 0
          ? `http://localhost:4000/med/medicines/search?${query}`
          : `http://localhost:4000/med/medicines`;

      const res = await fetch(endpoint);
      const data = await res.json();
      setMedicines(data.data || data || []);
    } catch (err) {
      console.error("Error fetching medicines:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchMedicines();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchName, filterCategory, filterDate]);

  const toggleExpand = (id: string) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Medicine Inventory</h1>

      <ExpiringBanner />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <Label htmlFor="name">Search by name</Label>
          <Input
            id="name"
            placeholder="Paracetamol..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="category">Filter by category</Label>
          <Input
            id="category"
            placeholder="Antibiotic..."
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="startDate">Filter by created date</Label>
          <Input
            id="startDate"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>

        <Button
          type="button"
          onClick={() => {
            setSearchName("");
            setFilterCategory("");
            setFilterDate("");
          }}
          className="w-full"
          variant="secondary"
        >
          Reset
        </Button>
      </div>

      {/* Medicine Grid */}
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
        </div>
      ) : medicines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medicines.map((medicine) => (
            <Card
              key={medicine.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => toggleExpand(medicine.id)}
            >
              <CardHeader>
                <CardTitle>{medicine.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Quantity: {medicine.quantity}
                </p>
                <p className="text-sm text-muted-foreground">
                  Price: ${medicine.price.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Expires: {new Date(medicine.expiryDate).toLocaleDateString()}
                </p>

                {expandedCard === medicine.id && (
                  <div className="pt-2 border-t mt-2 space-y-1 text-sm text-gray-700">
                    <p>
                      <strong>Description:</strong> {medicine.description}
                    </p>
                    <p>
                      <strong>Category:</strong> {medicine.category}
                    </p>
                    <p>
                      <strong>Manufacturer:</strong> {medicine.manufacturer}
                    </p>
                    <p>
                      <strong>Added on:</strong>{" "}
                      {new Date(medicine.createdAt).toLocaleDateString()}
                    </p>
                    {medicine.order && (
                      <>
                        <p>
                          <strong>Supplier:</strong> {medicine.order.supplier}
                        </p>
                        <p>
                          <strong>Order #:</strong> {medicine.order.orderNumber}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No medicines found.</p>
      )}
    </div>
  );
}
