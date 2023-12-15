# 003_technology_for_frontend


## Context
Every web application needs a frontend, including ours.
The most important aspects for any frontend framework are:
- the availability of libraries: any coding you can avoid to make and debug since someone else has already made it is advantageous
- general presence of a good ecosystem - lots of answers on Stack Overflow, for example.
- Speed of coding and maintainance
- Enough flexibility for the target usage 

If you want to make a web app, there are quite some options. Looking at the top-10 in Stack overflow in popularity

https://survey.stackoverflow.co/2023/#most-popular-technologies-webframe-prof 

1. React 
2. Node
3. JQuery
4. Angular
5. Express
6. ASP.NET Core
7. Vue 
8. Next.js
9. ASP.NET
10. Spring Boot

However, this does not mean that each of these is a good idea; we cannot use ASP.NET and ASP.NET Core because they belong to .NET, and Node and Express are more backend frameworks. JQuery is quite disliked (https://survey.stackoverflow.co/2023/#technology-admired-and-desired).

Spring Boot is a special case: you can create web pages with Spring, especially with a template language like Thymeleaf or JSP. These will create pages which are then sent by the server. This works differently than React/Angular/Vue, which create SPAs (Single Page Applications). Especially for larger companies, SPAs are useful: much more computation is done by the user's computer, websites are faster, and you pay less for data traffic because the raw data they send is much more compact than entire web pages. Moreover, you can use the entire JavaScript ecosystem this way!

At the moment, it seems that it is better to choose an SPA framework than Thymeleaf or another template engine; SPAs have a much larger community (https://insights.stackoverflow.com/trends?tags=thymeleaf%2Creactjs) and enormous flexibility, without real drawbacks.

But which SPA then? React, Angular, Vue, and Next.js could all be suitable candidates. In terms of popularity (https://insights.stackoverflow.com/trends?tags=angular%2Cvue.js%2Cnext.js%2Creactjs), we basically have the choice between React and Next.js, both in terms of basic popularity and 'admired and desired.'

React vs Next.js

### React:
- much larger community
- much more material (also on Stack Overflow) and libraries
- more flexible: you can choose libraries
- we are teaching it now...

### Next.js:
- may become the frontend framework of the future (possibly!)
- increasing in popularity, unlike React
- basic functionality built-in, no need to search for libraries
- offers optimization strategies like server-side rendering

If I search the internet, the advice seems to be that Next.js is especially useful when you want to work with SEO and want to statically render many pages, and React is more convenient for other cases. Here, we are not making a WebApp for the world but for internal use, so SEO is not relevant here. So the bigger advantage here would be in React's quantity of Stack Overflow answers and its wide variety of libraries.

If we choose React, a related question is how to create the apps with it. The original way, 'create-react-app,' has had security issues for years. Nowadays, you might use Vite or Next.js, possibly Bun. Vite seems very popular at the moment, and we already have experience with it in the Java groups. It also builds very quickly (using the SWC option), so it also saves development time. Competitors like Webpack are slower, Gulp is much less popular - Vite seems like a good choice for now.

I prefer to postpone the choice of CSS frameworks and the like until we have a working 'tracer bullet.'

A significant question, because React offers both possibilities: JavaScript or TypeScript?

Looking at Stack Overflow Trends, TypeScript seems to be the (slowly emerging) trend for the future of JavaScript (https://insights.stackoverflow.com/trends?tags=typescript%2Cjavascript).

On the other hand, there is also a counter-movement. For example, Svelte has gone back to JavaScript with annotations. Some other companies apparently do the same; are the benefits of explicit types worth the extra build time and complexity? https://gomakethings.com/ditching-typescript-for-javascript/

I am also struggling with this: I once tried React with TypeScript, but I found that finding good example code became a lot more difficult; the TypeScript compiler can complain a lot, the extra code can certainly feel like boilerplate, development feels slower because you are forced to think about things that should not be relevant for your app. And the benefits don't always seem clear: the participants I've seen with TypeScript - some were enthusiastic, but it's unclear how many errors were avoided. TypeScript sometimes reminds me a bit of Rust or Haskell, theoretically virtuous, but you spend too much of your time struggling with the compiler and/or borrowchecker...

On the other hand, users generally seem enthusiastic about TypeScript, at least for larger codebases (https://www.reddit.com/r/reactjs/comments/vob28x/react_using_typescript_vs_using_javascript/, https://www.quora.com/Should-I-use-JavaScript-or-TypeScript-with-React. In the Stack Overflow Survey, it is also more admired. From a maintainability perspective, TypeScript could be better, albeit with the disadvantage that our Java developers don't learn it...

A spike/experiment of a few hours of React with JS vs React with TS might be the best here.

A third way would be to try JavaScript, and if it turns out that the lack of types causes problems, use the same solution as the Svelte team: JSDoc (https://www.prisma.io/blog/type-safe-js-with-jsdoc-typeSaf3js / https://dev.to/t7yang/type-safety-in-javascript-with-jsdoc-and-vscode-1a28). JSDoc also provides types, but it has the advantage that you can also use regular JavaScript code.

Finally, there would also be the option to start with JavaScript for quick initial code development, but migrating/converting to TypeScript when functionality stabilizes.

So, to investigate:

- JavaScript
- JavaScript with JSDoc
- TypeScript


## Decision
- React 
- Vite with SWC
- ?TypeScript or JavaScript


## Status [Proposed, Accepted, Deprecated, Superseded]


## Consequences