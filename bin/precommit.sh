#!/bin/sh
# husky

COLOR='\033[0;33m'
NC='\033[0m' # No Color

for FILE in `git diff HEAD --name-only --cached`; do
  result=$(grep -n --color=always 'TODO' ${FILE} 2>&1)
  if [[ $? -eq 0 ]]; then
    echo ${COLOR}${FILE} 'contains TODO:'${NC}
    echo "$result"
    exec </dev/tty
    read -p "Skip? (Y/N) : " skip
    exec <&-
    if [[  "$skip" = 'Y'  ]] || [[  "$skip" = 'y'  ]]; then
      continue
    fi
  exit 1
  fi
done

exit
