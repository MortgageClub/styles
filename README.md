
Finding your way around
-----------------------

* To see what is currently slated to be built, bugs, or outstanding questions, choose the *Issues* tab above. 
* If anything is assigned to you, you can see it by clicking on "assigned to me" in the left column under issues. 
* To see any of the HTML and CSS, click on *code*. 
* Finally, to download the current (hopefully) working directory you can either clone the repository locally (if you think you might also make changes see the developer getting started section), or if you are just watching, you can click on the *Downloads* button above any time you want to preview the latest version of the repository in a browser.

Browser Support
---------------

All code must be verified in the latest version of Chrome, Firefox, and Safari as well as IE7+ before you submit a pull request. (Feel free to make intermediate commits that haven't been fully cross browser tested in your own fork until you are ready).

Developer Getting Started
-------------------------

To modify a repo you will need to:

1. [setup git locally](https://help.github.com/articles/set-up-git) (don't use the native app, it creates major merge conflicts), 
1. [fork this repository](https://help.github.com/articles/fork-a-repo), 
1. and clone the fork locally in order to make changes. We recommend [Git Tower](http://www.git-tower.com/) or the command line.

### Ready for code review

Then, when a change is ready to be code reviewed, you should [submit a pull request](https://help.github.com/articles/using-pull-requests) with that change. This means you will probably need to have one branch per issue you are working on so that the pull requests don't get messy. (If you are a git superstar, ignore me and work git magic as you would like).

We use the fork and pull model even with a shared repository as a way to initiate code review. No work should make it into the main branch that hasn't been seen by at least two pairs of eyes.

You can check [this link] (https://github.com/features/projects/codereview) for more information about how to code review.

Build requirement and preparation
---------------------------------

Refer to [build](https://github.com/stubbornella/oocss/tree/oocss-sass#build) from OOCSS project.

Requirements:

* Ruby 2.0
* gem
* python 2.6 or above
* pip
* git

Steps:

1. cd to the oocss dir
2. `gem install bundler`
3. `bundle install`
4. `make`

Then your artifacts are under ./build/ dir. You can also just build js or css individually by running `make js` or `make css`



Directory structure
-------------------

The directory structure is based on OOCSS project. Only difference is you don't have `/plugin` folder.
Refer to [directory structure](https://github.com/stubbornella/oocss/tree/oocss-sass#directory-structure) from OOCSS project.

Code Conventions
----------------

Code conventions are important for the long-term maintainability of code. 
Refer to [code conventions](https://github.com/stubbornella/oocss-code-standards) from OOCSS project, with the follow exception:
* Use 2 spaces for tab


