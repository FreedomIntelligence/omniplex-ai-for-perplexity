"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const Dictionary = dynamic(() => import("@/components/Dictionary/Dictionary"), {
  loading: () => <div style={{ padding: "20px", opacity: 0.5 }}>加载中...</div>,
  ssr: false
});

const DictionaryPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Suspense fallback={<div style={{ padding: "20px", opacity: 0.5 }}>加载中...</div>}>
        <Dictionary />
      </Suspense>
    </div>
  );
};

export default DictionaryPage;