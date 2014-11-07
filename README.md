Browser Support
---------------

All code must be verified in the latest version of Chrome, Firefox, and Safari as well as IE7+ before you submit a pull request. (Feel free to make intermediate commits that haven't been fully cross browser tested in your own fork until you are ready).

Build requirement and preparation
---------------------------------

Refer to [build](https://github.com/stubbornella/oocss/tree/oocss-sass#build) from OOCSS project.

Requirements:

* Ruby 2.0
* gem
* python 2.6 or above
* git

Steps:

####1. cd to the oocss dir
####2. `gem install bundler`
####3. `bundle install`
####4. `make`

Then your artifacts are under ./build/ dir.
For our oocss implementation, the resulting CSS is all included in ./build/css/oocss.css

To see the documentation, open file:///Your local path to/oocss/docs/base_css.html in your browser.

Directory structure
-------------------

The directory structure is based on OOCSS project. Only difference is you don't have `/plugin` folder.
Refer to [directory structure](https://github.com/stubbornella/oocss/tree/oocss-sass#directory-structure) from OOCSS project.

Code Conventions
----------------

Code conventions are important for the long-term maintainability of code.
Refer to [code conventions](https://github.com/stubbornella/oocss-code-standards) from OOCSS project, with the follow exception:
* Use 2 spaces for tab
