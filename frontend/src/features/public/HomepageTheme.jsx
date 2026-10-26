import { useLanguage } from "../../i18n/LanguageContext.js";
import { useTheme } from "../../theme/ThemeContext.js";
import LandingHeader from "../../components/navigation/LandingHeader.jsx";
import "./homepageTheme.css";

export default function HomepageTheme({ accountAction, children }) {
  const { t } = useLanguage();

  const { theme } = useTheme();

  return (
    <div className="homepage-theme" data-theme={theme}>
      <a href="#main-content" className="homepage-skip-link">
        {t("Skip to content")}
      </a>
      <LandingHeader accountAction={accountAction} />
      <main id="main-content" className="miu-public-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
