import { useLanguage } from "../../i18n/LanguageContext.js";
import logo from "../../assets/figma/miu-anniversary-logo.png";
import "./page-loading.css";

/** Real pending-work fallback. Use embedded only for a labeled preview. */
export default function PageLoadingScreen({ embedded = false }) {
  const { t } = useLanguage();
  return (
    <section
      className={`miu-page-loading${embedded ? "" : " miu-page-loading--page"}`}
    >
      <div className="miu-page-loading__content">
        <div className="miu-page-loading__identity" aria-hidden="true">
          <img
            className="miu-page-loading__logo"
            src={logo}
            alt=""
            width="152"
            height="83"
          />
        </div>
        <p className="miu-page-loading__eyebrow">
          {t("A world of opportunity")}
        </p>
        <p className="miu-page-loading__brand" dir="ltr">
          MIU Freelance<span className="miu-page-loading__brand-dot">.</span>
        </p>
        <p
          className="miu-page-loading__status"
          role="status"
          aria-atomic="true"
        >
          {t("Preparing your next chapter…")}
        </p>
        <div className="miu-page-loading__track" aria-hidden="true" />
        <p className="miu-page-loading__signature">
          {t("Student talent. Real opportunities.")}
        </p>
      </div>
    </section>
  );
}
