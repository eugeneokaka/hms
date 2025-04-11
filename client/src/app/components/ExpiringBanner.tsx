"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

type Medicine = {
  id: string;
  name: string;
  expiryDate: string;
};

export default function ExpiringBanner() {
  const [expiringMedicines, setExpiringMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    const fetchExpiring = async () => {
      try {
        const res = await fetch("http://localhost:4000/med/expires");
        const data = await res.json();
        setExpiringMedicines(data?.data || []);
      } catch (err) {
        console.error("Error fetching expiring medicines:", err);
      }
    };

    fetchExpiring();
  }, []);

  if (expiringMedicines.length === 0) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="mb-2">Warning</AlertTitle>
      <AlertDescription>
        {expiringMedicines.length} medicine
        {expiringMedicines.length > 1 ? "s are" : " is"} expiring this month:
        <ul className="list-disc pl-5 mt-2 space-y-1">
          {expiringMedicines.map((med) => (
            <li key={med.id}>
              <span className="font-medium">{med.name}</span> —{" "}
              {new Date(med.expiryDate).toDateString()}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
