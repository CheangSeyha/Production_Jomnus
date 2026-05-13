import type { ReactNode } from "react";
import Navbar from "@/components/homepage/header";
import Footer from "@/components/homepage/footer";

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}