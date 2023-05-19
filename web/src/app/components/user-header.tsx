export interface UserHeaderProps {
  pageTitle: string;
  name: string;
  profilePicture?: string;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ pageTitle, name, profilePicture }) => {
  return (
    <header className="sticky top-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white text-sm py-4 border-b-2">
      <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
        <a className="max-md:hidden  flex-none text-xl font-semibold " href="#">
          Product Name
        </a>
        <div className="flex flex-row items-center gap-5 mt-5 sm:justify-end sm:mt-0 sm:pl-5">
          <a className="font-medium text-blue-500" href="#" aria-current="page">
            Your Stories
          </a>
          <a className="font-medium text-blue-500" href="/new" aria-current="page">
            New Story
          </a>
          <a className="font-medium text-blue-500" href="#" aria-current="page">
            <img
              className="inline-block h-[2.375rem] w-[2.375rem] rounded-full ring-2 ring-white"
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
              alt="Image Description"
            />
          </a>
        </div>
      </nav>
    </header>
  );
};
