export const metadata = {
  title: "Authentication | Jubo Tara News",
  description: "Login or Register to Jubo Tara News",
};

export default function AuthLayout({ children }) {
  return (
    <div className="bg-white dark:bg-[#121212] min-h-screen">
      {children}
    </div>
  );
}
