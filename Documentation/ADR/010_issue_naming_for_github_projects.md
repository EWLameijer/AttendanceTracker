# 010_issue_naming_for_github_projects

## Context
The last few issues I (WL) made (240322) I often put the entire description of the issue in the white input field at the bottom. However, this has led to some very long branch names, messing up (for example) the Git Extensions GUI. 

## Decision
Next time, after we write down a PBI, when we convert it to an issue we will copy-paste the text of the current title to the body, and make up a short title (not more than one line in the PBI card) as title of the issue.

## Status [Proposed, Accepted, Deprecated, Superseded]

Proposed

## Consequences
- We will need to do a bit of extra editing on the branch names, costing a bit of time.
- We will save time by puzzling less over branch-names extending beyond our screen width, or trying to easily get the gist of each task when deciding which to pick up when.