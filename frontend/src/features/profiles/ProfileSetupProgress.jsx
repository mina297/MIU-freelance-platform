import { useLanguage } from "../../i18n/LanguageContext.js";

const steps = [
  "Get started",
  "Type of work",
  "Profile details",
  "View your profile",
];

export default function ProfileSetupProgress({ currentStep }) {
  const { t } = useLanguage();
  return (
    <nav
      aria-label={t("Profile setup progress")}
      className="profile-setup__progress"
    >
      <ol>
        {steps.map((step, index) => (
          <li
            key={step}
            aria-current={index + 1 === currentStep ? "step" : undefined}
            data-completed={index + 1 < currentStep ? "true" : undefined}
          >
            <span className="profile-setup__step-number">{index + 1}</span>
            <span>{t(step)}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
