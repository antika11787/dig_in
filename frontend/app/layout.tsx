'use client';

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/redux/store/Store";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer position="bottom-center" />
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <div className="layout">
              <div className="layout__header">
                <Header />
              </div>
              <div className="layout__body">
                {children}
              </div>
              <div className="layout__footer">
                <Footer />
              </div>
            </div>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
