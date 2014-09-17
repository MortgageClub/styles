#!/bin/bash
if [[ $file == *init* ]]; then
  echo ";;" >> ./build/script/init.js
else
  echo ";;" >> ./build/script/components.js
fi

for file in `find ./components -type f -name "*.js"`;
do
if [[ $file == *init* ]]; then
  cat "$file" >> ./build/script/init.js
else
  cat "$file" >> ./build/script/components.js
fi
done

if [[ $file == *init* ]]; then
  echo ";;" >> ./build/script/init.js
else
  echo ";;" >> ./build/script/components.js
fi
