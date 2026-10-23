import { useId } from "react";
import Card from "../../components/ui/Card.jsx";
import PublicInfoPage from "./info/PublicInfoPage.jsx";

/** Copy derives from Project Overview sections 1–4 and Project Scope sections 2/4. */
export default function AboutPage({ destinations = {} }) {
  const id = useId();
  return (
    <PublicInfoPage
      title="About MIU Freelance"
      introduction="A university-focused freelancing marketplace connecting MIU student freelancers with clients."
      links={[
        {
          key: "howItWorks",
          label: "How it works",
          href: destinations.howItWorks,
        },
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
      ]}
    >
      <Card
        as="article"
        aria-labelledby={`${id}-purpose`}
        className="m4-public-info__card m4-public-info__card--wide"
      >
        <h2 id={`${id}-purpose`}>
          From university learning to practical experience
        </h2>
        <p>
          MIU Freelance Platform is a university Software Engineering project.
          The project aims to bridge the gap between university learning and
          professional work, helping students demonstrate their skills and
          clients discover student talent.
        </p>
      </Card>
      <Card
        as="article"
        aria-labelledby={`${id}-projects`}
        className="m4-public-info__card"
      >
        <h2 id={`${id}-projects`}>Projects and proposals</h2>
        <p>
          Clients create projects with requirements, budgets and deadlines.
          Students submit proposals with a price in EGP, delivery time and a
          message. Clients compare proposals and select a suitable freelancer.
        </p>
      </Card>
      <Card
        as="article"
        aria-labelledby={`${id}-services`}
        className="m4-public-info__card"
      >
        <h2 id={`${id}-services`}>Services and packages</h2>
        <p>
          Students publish predefined services with descriptions, delivery times
          and EGP prices. Clients review the available packages and permitted
          extras before placing a service order.
        </p>
      </Card>
    </PublicInfoPage>
  );
}
