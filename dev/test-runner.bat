@echo off

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: jshint settings
::

:: product's code
call jshint "app/plugins" "app/lib/scripts" "app/scripts" -c "tests/jshint/jshintrc.json"

:: test's code
rem call jshint "tests/jasmine" -c "tests/jshint/jshintrc.json"

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: testtem settings
::

:: standard test
rem testem -f "tests/jasmine/testem.json"

:: with ci command
rem testem ci -f "tests/jasmine/testem.json"
