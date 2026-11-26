import {
  UserRound,
  CodeXml,
  BriefcaseBusiness,
  GraduationCap,
  Globe,
  Star,
  ChartNoAxesColumn,
} from "lucide-react";
import { useLanguage } from "../../../i18n/LanguageContext.js";
import SkillsDisplay from "./SkillsDisplay.jsx";
import PortfolioSection from "./PortfolioSection.jsx";
import LinksCard from "./LinksCard.jsx";
import { getStarDisplay } from "../utils/ratingDisplay.js";

export function ProfileCard({ title, icon: Icon, children, action, id }) {
  return (
    <section className="profile-card" aria-labelledby={id}>
      <div className="profile-card__heading">
        <h2 id={id}>
          <Icon size={18} aria-hidden="true" />
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function EducationCard({ profile }) {
  const { t } = useLanguage();
  return (
    <ProfileCard
      title={t("Education")}
      icon={GraduationCap}
      id="profile-education-heading"
    >
      {profile.fieldOfStudy ? (
        <div className="profile-detail">
          <strong>{profile.fieldOfStudy}</strong>
          {profile.yearLabel && <p>{profile.yearLabel}</p>}
        </div>
      ) : (
        <p className="profile-muted">{t("No education added yet.")}</p>
      )}
    </ProfileCard>
  );
}

export function ExperienceCard() {
  const { t } = useLanguage();
  return (
    <ProfileCard
      title={t("Experience")}
      icon={BriefcaseBusiness}
      id="profile-experience-heading"
    >
      <p className="profile-muted">{t("No experience added yet.")}</p>
    </ProfileCard>
  );
}

export function SkillsCard({ skills }) {
  const { t } = useLanguage();
  return (
    <ProfileCard title={t("Skills")} icon={CodeXml} id="profile-skills-heading">
      <SkillsDisplay skills={skills} />
    </ProfileCard>
  );
}

export default function StudentProfileOverview({
  profile,
  studentId,
  isOwner,
  reviews,
  onSelectTab,
}) {
  const { t } = useLanguage();
  const stars = getStarDisplay(profile.ratingSummary.average);
  return (
    <div className="profile-columns">
      <div className="profile-column">
        <ProfileCard title={t("About Me")} icon={UserRound} id="about-heading">
          {profile.aboutParagraphs.length ? (
            profile.aboutParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))
          ) : (
            <p className="profile-muted">
              {profile.shortBio || t("No introduction added yet.")}
            </p>
          )}
        </ProfileCard>
        <SkillsCard skills={profile.skills} />
        <section
          className="profile-card profile-portfolio"
          aria-label={t("Portfolio")}
        >
          <PortfolioSection
            key={studentId}
            studentId={studentId}
            isOwner={isOwner}
          />
        </section>
        {profile.links.length > 0 && <LinksCard links={profile.links} />}
      </div>
      <aside className="profile-column">
        <ProfileCard
          title={t("Work Stats")}
          icon={ChartNoAxesColumn}
          id="profile-work-stats-heading"
        >
          <dl className="profile-work-stats">
            <div>
              <dt>{t("Projects")}</dt>
              <dd>{profile.completedJobsCount}</dd>
            </div>
            <div>
              <dt>{t("Reviews")}</dt>
              <dd>{profile.ratingSummary.count}</dd>
            </div>
          </dl>
        </ProfileCard>
        <EducationCard profile={profile} />
        <ExperienceCard />
        <ProfileCard
          title={t("Languages")}
          icon={Globe}
          id="profile-languages-heading"
        >
          {profile.languages.length ? (
            <ul className="profile-language-list">
              {profile.languages.map((language) => (
                <li key={language}>{language}</li>
              ))}
            </ul>
          ) : (
            <p className="profile-muted">{t("No languages added yet.")}</p>
          )}
        </ProfileCard>
        <ProfileCard
          title={t("Reviews")}
          icon={Star}
          id="profile-review-preview-heading"
          action={
            <button
              type="button"
              className="profile-text-action"
              onClick={() => onSelectTab("reviews")}
            >
              {t("View all")}
            </button>
          }
        >
          {profile.ratingSummary.count > 0 ? (
            <>
              <div className="profile-review-score">
                <strong>{profile.ratingSummary.average.toFixed(1)}</strong>
                <span className="profile-accent" aria-hidden="true">
                  {"★".repeat(stars.filled)}
                  {"☆".repeat(stars.empty)}
                </span>
              </div>
              <p className="profile-muted">
                {profile.ratingSummary.count} {t("Reviews")}
              </p>
              {reviews[0] && <blockquote>{reviews[0].body}</blockquote>}
            </>
          ) : (
            <p className="profile-muted">
              {t("No reviews yet for this profile.")}
            </p>
          )}
        </ProfileCard>
      </aside>
    </div>
  );
}
