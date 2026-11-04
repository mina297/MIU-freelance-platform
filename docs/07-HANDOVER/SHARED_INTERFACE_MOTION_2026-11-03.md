# Shared interface motion

Scope: non-homepage consumers of shared Button, Modal, Dropdown, Tabs, Pagination, plus dashboard sd-button controls. Existing themes, localization, data and route permissions remain unchanged.

Implementation: interface-motion.css imports through ThemeProvider. Capture listeners record pointer versus keyboard input on the document root and clean up on unmount. This supports native top-layer dialogs without adding wrapper layout. Entrances are progressive CSS starting-style transitions; unsupported browsers retain immediate rendering. Press feedback uses transform, and exits do not delay dismissal or focus restoration. Reduced motion and keyboard actions are immediate. No dependencies or continuous animations added.

Validation: 32 focused foundation/modal/navigation/theme tests passed; lint passed. Production build checked separately. Browser/mobile/RTL interaction and performance verification was not performed for this change. Existing homepage RTL verification and unrelated chatbot-test issue remain separate. Custom controls outside the listed classes need individual review rather than blanket animation.

Preview: http://localhost:5173/projects, /services, /login; dashboard routes require the existing demo session.
Changes left uncommitted.

Mina requested more visible motion: non-homepage menus/dialogs now enter over 240ms from 16px/0.96 scale. Eligible fine-pointer buttons lift 3px on hover and compress to 0.96 on press, with a subtle shadow. Service detail-link arrows move toward the reading direction. Reduced-motion, disabled/busy exclusions and immediate keyboard behavior remain. These values supersede the earlier subtle settings. Browser visual validation remains pending.

Visual correction - 4 November 2026: removed button lift, added shadows, press compression and diagonal arrow movement at Mina's request. Controls keep their original geometry with brief color transitions. Menus and dialogs use a restrained 6px/180ms entrance without scaling. These values supersede the stronger settings above. Keyboard and reduced-motion transitions remain disabled.
