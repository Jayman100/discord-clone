import NavigationSidebar from "@/components/navigation/navigation-sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="h-full">
      <div className="max-md:hidden md:flex flex-col h-full w-[72px] z-30 fixed inset-y-0 border-r-2 border-r-black/10">
        <NavigationSidebar />
      </div>

      <main className=" max-md:pl-0 md:pl-[72px] h-full">{children}</main>
    </div>
  );
};

export default MainLayout;
