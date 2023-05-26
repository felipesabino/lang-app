import { AuthContext } from "@/authentication/auth-context";
import { useTranslation } from "react-i18next";
import { useContext } from "react";

export interface UserHeaderProps {
  pageTitle: string;
  name: string;
  profilePicture?: string;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ pageTitle, name, profilePicture }) => {
  const { t, i18n } = useTranslation();
  const authContext = useContext(AuthContext);

  return (
    <header className="sticky top-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white text-sm py-4 border-b-2">
      <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
        <a className="max-md:hidden  flex-none text-xl font-semibold " href={`/${i18n.language}/`}>
          {t("app.name")}
        </a>
        <div className="flex flex-row items-center gap-5 mt-5 sm:justify-end sm:mt-0 sm:pl-5">
          <a className="font-medium text-blue-500" href={`/${i18n.language}/`} aria-current="page">
            {t("header.home")}
          </a>
          {authContext?.state.matches("loggedIn") && (
            <>
              <a className="font-medium text-blue-500" href={`/${i18n.language}/new`} aria-current="page">
                {t("header.newStory")}
              </a>
              <a className="font-medium text-blue-500" href={`/${i18n.language}/`} aria-current="page">
                <img
                  className="inline-block h-[2.375rem] w-[2.375rem] rounded-full ring-2 ring-white"
                  src="https://1.gravatar.com/avatar/bab3aee31aebf9ee9cf0ab89ed513b2f"
                  alt="Image Description"
                />
              </a>
            </>
          )}
          {!authContext?.state.matches("loggedIn") && (
            <a className="font-medium text-blue-500" href={`/${i18n.language}/login`} aria-current="page">
              Login
            </a>
          )}
        </div>
      </nav>
    </header>
  );
};
