"use client";
import { useTranslation } from "react-i18next";

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="grid gap-4 place-content-center h-screen w-full">
      ({i18n.language}) {t("home.loading")}
      <ul className="flex flex-col gap-4 list-none underline cursor-pointer">
        <li>
          <a href="/en">English</a>
        </li>
        <li>
          <a href="/fr">Français</a>
        </li>
        <li>
          <a href="/pt">Português</a>
        </li>
        <li>
          <a href="/es">Español</a>
        </li>
        <li>
          <a href="/it">Italiano</a>
        </li>
      </ul>
    </div>
  );
};

export default Home;
