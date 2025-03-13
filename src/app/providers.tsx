"use client";

import dynamic from 'next/dynamic';
import Script from "next/script";
import { Suspense } from 'react';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store/store";

const Toaster = dynamic(() => import('react-hot-toast').then(mod => mod.Toaster), {
  ssr: false
});
const NextUIProvider = dynamic(() => import('@nextui-org/react').then(mod => mod.NextUIProvider));
const Analytics = dynamic(() => import('@vercel/analytics/react').then(mod => mod.Analytics));
const SpeedInsights = dynamic(() => import('@vercel/speed-insights/next').then(mod => mod.SpeedInsights));


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NextUIProvider>
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-4L0TGM4R80" strategy="lazyOnload" />
          <Script id="google-analytics" strategy="lazyOnload">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-4L0TGM4R80');
          `}
          </Script>
          <Script id="ms-clarity" strategy="lazyOnload">
            {`(function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "le5rdmmf5h");
          `}
          </Script>
          <Suspense fallback={null}>
            {children}
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </Suspense>
        </NextUIProvider>
      </PersistGate>
    </Provider>
  );
}
