import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function PageContainer({ children }: Props) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-blue-50 p-8 flex flex-col gap-8">
      {children}
    </div>
  );
}
