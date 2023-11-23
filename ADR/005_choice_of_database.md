# 005 Choice of database


## Context
Tracking attendance requires a database.

Generally, for smallish projects with traditional data, traditional SQL databases are good enough; we should not need document database, graph databases, column databases, key-value stores or whatever exotic techniques there are.

Of course, using tried and tested techniques also helps greatly when troubleshooting using Stack Overflow.

Looking at the database market in 2023, again with the Stack Overflow Developer Survey (https://survey.stackoverflow.co/2023/#technology-admired-and-desired), the most popular databases are PostgreSQL, MySQL, SQLite and SQL Server; the most loved databases are PostgreSQL, DAtomic and Redis.

As PostgreSQL is popular, loved, free and traditional SQL, this seems a quite good starting basis for our project.


## Decision
PostgreSQL


## Status [Proposed, Accepted, Deprecated, Superseded]
Proposed


## Consequences
- PostgreSQL can be a bit of a memory hog, one student chose H2 over PostgreSQL because of that. That being said, as long as that isn't a problem on our computers, we should not worry about that.
- PostgreSQL has some flexibility, but if the project would grow in unexpected directions, perhaps a document database like MongoDB or a key-value store like Redis may be better. That being said, either case seems unlikely so far.
- PostgreSQL's normal admin environment, pgAdmin, is slow to start and not extremely user-friendly. We may want to invest/spike some time (say one or two hours) checking out alternatives, like listed in https://www.bytebase.com/blog/top-pgadmin-alternative/  or https://stackshare.io/pgadmin-2/alternatives 
