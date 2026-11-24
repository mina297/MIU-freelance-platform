import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, Check, Search } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { useLanguage } from "../../i18n/LanguageContext.js";
import Dropdown from "../../components/ui/Dropdown.jsx";
import ProfileSetupProgress from "./ProfileSetupProgress.jsx";
import logo from "../../assets/figma/miu-anniversary-logo.png";
import {
  canContinueProfileSetup,
  getProfileSetupDraft,
  saveProfileSetupDraft,
} from "./profileSetupDraft.js";
import {
  getProfileWorkCategory,
  filterProfileWorkCategories,
} from "./profileWorkCategories.js";
import "./profileSetup.css";
import "./profileWork.css";

function CategoryOptions({ open, categoryId, onSelect }) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const input = useRef(null);
  const options = filterProfileWorkCategories(query, t);

  useEffect(() => {
    if (open) input.current?.focus({ preventScroll: true });
  }, [open]);

  return (
    <>
      <div className="profile-work__search">
        <Search size={18} aria-hidden="true" />
        <input
          ref={input}
          type="search"
          aria-label={t("Search categories")}
          placeholder={t("Search categories")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.preventDefault();
          }}
        />
      </div>
      <div className="profile-work__options">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="disclosure-item"
            aria-pressed={option.id === categoryId}
            onClick={() => onSelect(option.id)}
          >
            {t(option.label)}
            {option.id === categoryId && <Check size={17} aria-hidden="true" />}
          </button>
        ))}
        {options.length === 0 && (
          <p role="status">{t("No categories found. Try another search.")}</p>
        )}
      </div>
    </>
  );
}

export default function ProfileWorkPage() {
  const { session } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [initialDraft] = useState(() => getProfileSetupDraft(session));
  const [categoryId, setCategoryId] = useState(initialDraft?.categoryId ?? "");
  const category = getProfileWorkCategory(categoryId);
  const heading = useRef(null);
  const allowed = canContinueProfileSetup(initialDraft);

  useLayoutEffect(() => {
    if (!allowed) return;
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({
      top: initialDraft?.workScrollY ?? 0,
      behavior: "instant",
    });
    const remember = () =>
      saveProfileSetupDraft(session, { workScrollY: window.scrollY });
    window.addEventListener("scroll", remember, { passive: true });
    return () => {
      remember();
      window.removeEventListener("scroll", remember);
    };
  }, [session, initialDraft, allowed]);

  useEffect(() => {
    if (allowed) saveProfileSetupDraft(session, { categoryId });
  }, [session, categoryId, allowed]);

  if (!allowed) return <Navigate to="/profile/setup" replace />;

  return (
    <div className="profile-setup profile-work">
      <a className="profile-setup__skip" href="#profile-work-main">
        {t("Skip to content")}
      </a>
      <header className="profile-setup__header">
        <Link
          to="/"
          className="profile-setup__home"
          aria-label={t("MIU Freelance home")}
        >
          <img src={logo} alt="" width="112" height="64" />
        </Link>
        <h1>{t("Let's build your profile")}</h1>
        <p className="profile-setup__subtitle">
          {t("Please complete all required fields carefully.")}
        </p>
      </header>
      <main id="profile-work-main" className="profile-work__main" tabIndex={-1}>
        <ProfileSetupProgress currentStep={2} />
        <section
          className="profile-setup__panel profile-work__panel"
          aria-labelledby="profile-work-panel-title"
        >
          <div className="profile-setup__panel-heading">
            <span className="profile-setup__section-icon">
              <BriefcaseBusiness size={23} aria-hidden="true" />
            </span>
            <h2 id="profile-work-panel-title">{t("Type of work you do")}</h2>
            <span className="profile-setup__badge">
              {t("Step {current} of {total}", { current: 2, total: 4 })}
            </span>
          </div>
          <div className="profile-work__body">
            <div className="profile-work__intro">
              <h3 ref={heading} tabIndex={-1}>
                {t("Great! Let's find you the right jobs")}
              </h3>
              <p>
                {t(
                  "Help clients understand your skills by choosing the type of work you do.",
                )}
              </p>
            </div>
            <form
              id="profile-work-form"
              className="profile-work__card"
              onSubmit={(event) => {
                event.preventDefault();
                if (!category) return;
                saveProfileSetupDraft(session, { categoryId: category.id });
                navigate("/profile/edit");
              }}
            >
              <p id="work-category-help">
                {t(
                  "Choose the category that best describes your work. It's OK if it's not a perfect match. You can add more details on the next step.",
                )}
              </p>
              <label id="work-category-label" htmlFor="work-category">
                {t("Category")}
              </label>
              <Dropdown
                openOnHover={false}
                className="profile-work__category"
                label={
                  <span id="work-category-value">
                    {t(category?.label ?? "Select a category")}
                  </span>
                }
                triggerProps={{
                  id: "work-category",
                  "aria-labelledby": "work-category-label work-category-value",
                  "aria-describedby": "work-category-help",
                }}
              >
                {(close, open) => (
                  <CategoryOptions
                    key={String(open)}
                    open={open}
                    categoryId={categoryId}
                    onSelect={(id) => {
                      setCategoryId(id);
                      close();
                    }}
                  />
                )}
              </Dropdown>
            </form>
          </div>
          <footer className="profile-work__footer">
            <div>
              <Link to="/profile/setup">{t("Back")}</Link>
              <button
                type="submit"
                form="profile-work-form"
                disabled={!category}
              >
                {t("Next")}
              </button>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
