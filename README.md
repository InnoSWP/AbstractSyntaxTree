# Abstract Syntax Tree
[![pages-build-deployment](https://github.com/InnoSWP/AbstractSyntaxTree/actions/workflows/pages/pages-build-deployment/badge.svg?branch=gh-pages)](https://github.com/InnoSWP/AbstractSyntaxTree/actions/workflows/pages/pages-build-deployment)
[![Svelte test build](https://github.com/InnoSWP/AbstractSyntaxTree/actions/workflows/svelte-build.yml/badge.svg?branch=main)](https://github.com/InnoSWP/AbstractSyntaxTree/actions/workflows/svelte-build.yml)
[![Svelte linter](https://github.com/InnoSWP/AbstractSyntaxTree/actions/workflows/svelte-linter.yml/badge.svg?branch=main)](https://github.com/InnoSWP/AbstractSyntaxTree/actions/workflows/svelte-linter.yml)
[![Lint codebase (w/o svelte)](https://github.com/InnoSWP/AbstractSyntaxTree/actions/workflows/linter.yml/badge.svg?branch=main)](https://github.com/InnoSWP/AbstractSyntaxTree/actions/workflows/linter.yml)
[![SonarCloud build](https://github.com/InnoSWP/AbstractSyntaxTree/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/InnoSWP/AbstractSyntaxTree/actions/workflows/build.yml)


Abstract Syntax Tree - is the web application that visualize your JavaScript code as the Abstract Syntax Tree(AST) and its Parallel Data Representation(PDR).

## Description

The application helps interested people delve into the parallel compilation (where PDR is involved).
We suggested the one-page web application that builds required representations of JavaScript code.
It has three blocks: code editor, AST, and Parallel Array Representation. The blocks will synchronize,
and with the mutations of the code, the other representations will change too.

## How to use it

To use this web application just go to the following [link](https://innoswp.github.io/AbstractSyntaxTree/) and paste your JavaScript code.

## List of features

- Immediate result when typing code without pressing any buttons
- Synchronous highlighting part of code and corresponding nodes in AST and lines in PDR
- Error message for user when code is not valid
- Possibility to share your code with corresponding AST and PDR via link by pressing button "Share"
- Export AST to graphviz format file by pressing button "Export"
- Constant folding

## Demonstration

<p>Main page</p>
<img src="./screens/starting-page-2.png">

<p>Share</p>
<img src="./screens/share.png">

<p>Exaple of graphviz</p>
<img src="./screens/graphviz.png">

## Technologies used

The application was build using [Svelte](https://svelte.dev/) framework. As a code editor we used [CodeMirror](https://codemirror.net/).
To parse the source code we used [Esprima API](https://esprima.org/).

## Project installation for modifications

Before project installation be sure that you have installed [npm tools](https://www.npmjs.com/) and [Svelte](https://svelte.dev/) framework

1. Clone the repository
```console
git clone https://github.com/InnoSWP/AbstractSyntaxTree
```

2. Go to the root of the project
```console
cd <PATH>/AbstractSyntaxTree
```

3. Run
```console
npm install
```

4. Now you can do any changes and modification in project.

5. To run this project on your computer use following command
```console
npm run dev
```
