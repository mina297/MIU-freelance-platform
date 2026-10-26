import { useLanguage } from "../../i18n/LanguageContext.js";
import { useId } from "react";
import Card from "../../components/ui/Card.jsx";
import PublicInfoPage from "./info/PublicInfoPage.jsx";

/** Planned journeys from USER_FLOWS sections 4–6; no marketplace operations. */
export default function HowItWorksPage({
  destinations = {},
  howItWorks = null,
}) {
  const { t } = useLanguage();

  const id = useId();
  return (
    <PublicInfoPage
      title={t("How it works")}
      introduction={t(
        "Two ways to work together: client-posted projects and student-published services.",
      )}
      overview={howItWorks}
      links={[
        {
          key: "projects",
          label: "Browse projects",
          href: destinations.projects,
        },
        {
          key: "services",
          label: "Browse services",
          href: destinations.services,
        },
        {
          key: "about",
          label: "About MIU Freelance",
          href: destinations.about,
        },
      ]}
    >
      <Card
        as="article"
        aria-labelledby={`${id}-projects`}
        className="m4-public-info__card"
      >
        <h2 id={`${id}-projects`}>{t("Planned project journey")}</h2>
        <ol>
          <li>
            {t(
              "The client publishes requirements, skills, an EGP budget and a deadline.",
            )}
          </li>
          <li>
            {t(
              "The student browses projects and submits a proposal with an EGP price, delivery time and message.",
            )}
          </li>
          <li>
            {t(
              "The client compares proposals and selects a student. An accepted proposal leads to a project order.",
            )}
          </li>
          <li>
            {t(
              "Participants use the order workspace for communication and delivery. The client reviews the work and accepts it or requests revisions.",
            )}
          </li>
        </ol>
      </Card>
      <Card
        as="article"
        aria-labelledby={`${id}-services`}
        className="m4-public-info__card"
      >
        <h2 id={`${id}-services`}>{t("Planned service journey")}</h2>
        <ol>
          <li>
            {t(
              "The student publishes a service with package details, an EGP price and permitted extras.",
            )}
          </li>
          <li>
            {t(
              "The client reviews the service, selects a package and permitted extras, and checks the total EGP price.",
            )}
          </li>
          <li>
            {t(
              "The client places an order. Phase 1 checkout and escrow are simulated.",
            )}
          </li>
          <li>
            {t(
              "The student delivers through the order workspace. The client reviews delivery and accepts it or requests revisions.",
            )}
          </li>
        </ol>
      </Card>
    </PublicInfoPage>
  );
}
