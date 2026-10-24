# Freelancer Discovery — Phase 1

Related requirements: FR-C07 (marketplace discovery), FR-S03 (profile ownership, deferred), and FR-C06 (proposal-to-profile navigation, deferred). This directory does not complete the full profile or recommendation requirements.

Public route: `/freelancers`. All visitors can browse fictional providers and follow their published service detail links. The page reuses the public shell and marketplace visual language, with named search, category, service skill, package starting-price and sorting controls. Loading, error and empty presentations are available; retry appears only when a retry handler exists.

`features/freelancers/freelancerModel.js` derives providers from the live service snapshot. Only participants owning a published service appear. Search and all filters must match the same published service. Cards contain only matching services, their declared skill tags and the cheapest valid matching package in EGP. Missing packages display an unavailable price; extras do not affect the starting price. No hourly rate, rating, availability, verification badge or reputation score is inferred. Name, starting-price and matching-service-count sorts are browsing tools.

Publishing or pausing services updates discovery through `useServiceData`; refresh resets the demonstration. This adapter does not query session credentials, private messages, identity evidence or reviews, and does not introduce a second editable profile store.

## Profile integration dependency

Member 5's cached `origin/feat/m5-profiles-reviews-support` at `650e06d` is not the merged profile implementation. Its sample identities for `student_001` and `student_002` differ from the canonical marketplace Salma Farid and Omar Nabil records. Resolve this ID/name mapping with Member 5 before linking full profiles or reusing profile metadata. No unregistered `/students/:studentId` links are rendered. FR-C06 remains deferred.

## Validation and remaining checks

Automated model tests cover same-service filtering, publication privacy, package price boundaries, missing prices, deterministic sorting, runtime publication/pausing and source immutability. Static rendering checks cover the public route, one shell, registered service links, escaping and loading/error/empty states. Live browser, responsive, keyboard and assistive-technology acceptance remains deferred at Mina's request. This directory is deterministic browsing; explainable simulated recommendations are a separate task.
