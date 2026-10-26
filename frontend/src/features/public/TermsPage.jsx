import { useLanguage } from "../../i18n/LanguageContext.js";
import { useId } from "react";
import Card from "../../components/ui/Card.jsx";
import PublicInfoPage from "./info/PublicInfoPage.jsx";

/** Deliberately no policy clauses: approved Terms content has not been supplied. */
export default function TermsPage({ destinations = {} }) {
  const { t } = useLanguage();

  const titleId = useId();
  return (
    <PublicInfoPage
      title={t("Terms")}
      introduction={t(
        "Terms content is awaiting team approval. This is a Phase 1 page placeholder, not published Terms of Use.",
      )}
      links={[
        { key: "privacy", label: "Privacy", href: destinations.privacy },
        {
          key: "about",
          label: "About MIU Freelance",
          href: destinations.about,
        },
      ]}
    >
      <Card
        as="article"
        aria-labelledby={titleId}
        className="m4-public-info__card m4-public-info__card--wide"
      >
        <h2 id={titleId}>
          {t("Placeholder — awaiting team-approved content")}
        </h2>
        <p>
          {t(
            "No approved Terms of Use have been supplied for this preview. This page does not establish conditions for using the platform.",
          )}
        </p>
        <p>
          {t(
            "The project team must supply and approve the final content before publication.",
          )}
        </p>
      </Card>
    </PublicInfoPage>
  );
}
