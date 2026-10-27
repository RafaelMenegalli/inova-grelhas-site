import { ForceLight } from "@/components/admin/force-light";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ForceLight />
      {children}
    </>
  );
}
