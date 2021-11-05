#!/bin/sh

# basic validity checks
echo "checking JSON validity"
find . -not -path './node_modules/*' -not  -path './package*' -type f -name '*.json' | while read json; do echo $json ; jq --exit-status . $json > /dev/null || exit 1; done

# check for HTML entities
echo "checking for HTML entities"
grep -F '&#' *.json && exit 1

# key mismatch checks
echo "checking for mismatched keysets, i.e. missing or superfluous keys"
find . -type f  -iname "main.json" -path './locales/*' | while read json; do echo $json ; python3 bin/check_expected_keys.py $json "main" || exit 1; done
find . -type f  -iname "enterprise.json" -path './locales/*' | while read json; do echo $json ; python3 bin/check_expected_keys.py $json "enterprise" || exit 1; done
