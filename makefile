DATE=$(shell date +%I:%M%p)
HR=\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#
CHECK=\033[32m✔\033[39m
BUILDDIR=build


#Make commands (adapted from @arnouges original work)

### Build the This handles building the library without using any of the node tools

full:
	@echo "\n${HR}"
	@echo "Building OOCSS..."
	@echo "${HR}\n"
	@make clean
	@mkdir ${BUILDDIR}
	@echo "\n${HR}"
	@mkdir build/css
	@make css
	@make js
	@make doc
	@echo "OOCSS Build                                 ${CHECK} Done"
	@echo "${HR}"


# compile our sass to css
css:
	@echo "Building CSS Files with Sass..."
	@cd config; bundle exec compass compile
	@echo "\n${HR}"

# collect and concat our js
js:
	@echo "Building Javascript..."
	@rm -rf ${BUILDDIR}/script > /dev/null 2>&1
	@mkdir ${BUILDDIR}/script
	@./config/concatjs.sh
	@cp -r libs build/libs
	@echo "Javascript                                 ${CHECK} Done"
	@echo "\n${HR}"

# build our documentation for oocss
doc:
	@echo "Building Documentation..."
	@bundle exec hologram ./config/hologram_config.yml
	@echo "\n${HR}"

# clean our the build directory and blow away the sass-cache
clean:
	@echo "${HR}"
	@echo "Clean the project"
	@echo "${HR}"
	@echo "Removing the build directory"
	@rm -rf ${BUILDDIR}
	@echo "cleaning compass files..."
	@cd config;bundle exec compass clean
	@echo "${HR}"
	@echo "Clean project                               ${CHECK} Done"
	@echo "${HR}"
