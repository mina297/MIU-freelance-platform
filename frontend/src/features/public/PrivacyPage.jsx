import { useId } from "react";
import Card from "../../components/ui/Card.jsx";
import PublicInfoPage from "./info/PublicInfoPage.jsx";

/** Requirements describe privacy goals, not an approved Privacy Policy. */
export default function PrivacyPage({ destinations = {} }) {
  const titleId = useId();
  return (
    <PublicInfoPage
      title="Privacy"
      introduction="Privacy content is awaiting team approval. This is a Phase 1 page placeholder, not a published Privacy Policy."
      links={[
        { key: "terms", label: "Terms", href: destinations.terms },
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
        <h2 id={titleId}>Placeholder — awaiting team-approved content</h2>
        <p>
          No approved Privacy Policy has been supplied for this preview. This
          page does not describe approved data collection, storage, sharing,
          retention or deletion practices.
        </p>
        <p>
          The project team must supply and approve the final content before
          publication.
        </p>
      </Card>
    </PublicInfoPage>
  );
}
