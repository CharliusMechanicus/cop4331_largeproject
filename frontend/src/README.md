# Workflow
- The purpose of this workflow is to enhance collaboration and reduce conflicts. 
- Please follow the following instructions before starting work.

1. Go to the master branch and feetch upstream.
2. In your local repo, run `git fetch` and `git pull` if there are any new changes.
  + There should be no conflicts, if there are resolve it appropriately or let me know.
3. Your local repo is now up to date.
4. Create a new branch whenever working on a new feature, component, or task.
  + `git checkout -b example-feature`
5. As you work in this branch, stage and push commits as you feel appropriate.
6. Test in your local environment to see if it works. Use `npm start` in the frontend folder.
7. Whenever you feel like you're at a good place or need help. Push the branch to the repo using: `git push -u origin branchname`
8. Once you are done working on the branch. Create a pull request to the master branch. For example: `git request-pull branchname https://github.com/rna-devknight/cop4331_largeproject master`
  + Or using the github interface.

## Looking for stuff to do? 
- Checkout the issues page and work through them.
- When fixed, comment that the issue is resolved and reference the commit that did so. 
