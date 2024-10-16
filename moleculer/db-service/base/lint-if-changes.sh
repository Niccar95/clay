#!/bin/bash

# Get the absolute directory of the script
full_dir="$(cd "$(dirname "$0")"; pwd)"
dir=$(basename "$full_dir")


# Get the list of unstaged files and untracked files
files=$(git diff --name-only --diff-filter=d)
untracked_files=$(git ls-files --others --exclude-standard)

# Check if any of the files are in the current directory or its subdirectories
for file in $files $untracked_files
do
  # Check if the file is in the script's directory or a subdirectory
  if echo "$file" | grep -q "$dir/" && [[ $file == *".ts"* || $file == *".js"* || $file == *".tsx"* || $file == *".jsx"* ]]; then
    echo "Linting because of changes in $file"
    cd "$full_dir" && npm run lint
    exit $?
  fi
done

# If no relevant changes, exit with success
echo "No changes to lint for: $dir"
exit 0