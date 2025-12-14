"use client";

import { formatDate } from "@/lib/common";
import { useEffect, useState } from "react";

export default function ClientDate({ value }: { value: string }) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    const formattedDate = formatDate(value);
    setFormatted(formattedDate);
  }, [value]);

  return <span className="text-gray-700">{formatted}</span>;
}
