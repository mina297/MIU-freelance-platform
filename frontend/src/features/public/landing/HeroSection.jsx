import { useId } from "react";
import { Search, ChevronDown } from "lucide-react";
import accent from "../../../assets/figma/landing-community-accent.svg";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import Input from "../../../components/ui/Input.jsx";
import Select from "../../../components/ui/Select.jsx";
import PublicLink from "../../../components/navigation/PublicLink.jsx";
import { CATEGORY_CHIPS } from "./discoveryModel.js";

export default function HeroSection({
  query,
  categoryId,
  categories,
  onQueryChange,
  onCategoryChange,
  onSearch,
  inputRef,
  disabled,
  postProjectHref,
  projectAnchor,
  serviceAnchor,
}) {
  const titleId = useId();
  return (
    <section className="m4-landing__hero" aria-labelledby={titleId}>
      <div className="m4-landing__container m4-landing__hero-inner">
        <div className="m4-landing__hero-copy">
          <Badge className="m4-landing__community">
            <img src={accent} alt="" width="8" height="8" />
            Built for the MIU community
          </Badge>
          <h1 id={titleId}>Find real work. Build your reputation.</h1>
          <p>
            Connect with trusted MIU clients, turn your skills into experience,
            and grow a portfolio that opens doors.
          </p>
        </div>
        <p className="m4-landing__notice">
          Phase 1 preview. Listings and participants are fictional. Identity
          verification, ratings, and payments are not live.
        </p>
        <form
          className="m4-landing__search"
          role="search"
          aria-label="Discover projects and services"
          onSubmit={onSearch}
        >
          <div className="m4-landing__keyword">
            <Search size={20} aria-hidden="true" />
            <Input
              label="Search projects and services"
              type="search"
              name="query"
              placeholder="Search by title, skill, or keyword"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              disabled={disabled}
              ref={inputRef}
            />
          </div>
          <div className="m4-landing__category-select">
            <Select
              label="Category"
              name="category"
              value={categoryId}
              onChange={(event) => onCategoryChange(event.target.value)}
              disabled={disabled}
            >
              <option value="">All categories</option>
              {categories.map(({ id, label }) => (
                <option value={id} key={id}>
                  {label}
                </option>
              ))}
            </Select>
            <ChevronDown size={18} aria-hidden="true" />
          </div>
          <Button type="submit" disabled={disabled}>
            Search
          </Button>
        </form>
        <div className="m4-landing__hero-actions">
          <Button onClick={onSearch} disabled={disabled}>
            Find Work
          </Button>
          <PublicLink href={postProjectHref} className="m4-landing__action">
            Post a Job
          </PublicLink>
        </div>
        <nav className="m4-landing__paths" aria-label="Marketplace discovery">
          <PublicLink href={disabled ? undefined : projectAnchor}>
            Projects
          </PublicLink>
          <PublicLink href={disabled ? undefined : serviceAnchor}>
            Services
          </PublicLink>
        </nav>
        <div
          className="m4-landing__categories"
          role="group"
          aria-label="Discover by category"
        >
          {CATEGORY_CHIPS.map((chip) => {
            const available =
              chip.id && categories.some(({ id }) => id === chip.id);
            return (
              <Button
                key={chip.label}
                variant="outline"
                className="m4-landing__chip"
                disabled={disabled || !available}
                aria-pressed={Boolean(available && categoryId === chip.id)}
                onClick={() =>
                  onCategoryChange(categoryId === chip.id ? "" : chip.id)
                }
                title={!available ? "Not available in this preview" : undefined}
              >
                {chip.label}
              </Button>
            );
          })}
        </div>
        <p className="m4-landing__category-note">
          Translation, Marketing, Video, and Tutoring are unavailable in this
          preview.
        </p>
      </div>
    </section>
  );
}
