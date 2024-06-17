# 012 Folder Structure of Frontend

## Context

It was hard to find a suitable time to clear up the frontend, that is, until we had added most features and were waiting until we could discuss Chantal's feedback. At that point, it turned out that we had only 6 or such different pages, with barely any shared components (though definitely some shared interfaces).

## Decision

Having a separate folder for all 'components' seemed a waste, so Wubbo implemented a variation on the "large project" file structure in www.youtube.com/watch?v=QhSXNY8sy_0, with the difference that each page got its own folder.

Main folders (in src)
- -shared // has prefix '-'' to make it appear at the top
- attendance-management-page
- class-management-page
- group-management-page
- history-page
- login-page
- registration-page
- worker-management-page


## Status [Proposed, Accepted, Deprecated, Superseded]

Proposed

## Consequences

This structure may break down if we would add many hooks, contexts, services or utils; but for now it seems fine, and makes pages easy to find. We may still want to rename some components, though, currently we have a ScheduleView.tsx in the class-management-page; presumably LessonManagement.tsx in lesson-management-page (or SessionManagement in session-management-page) would be less confusing. 
