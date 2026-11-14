# Image assets for the 48-question A/B study

This repository contains the 48 compressed figure images used in the existing
Google Form. The files are numbered in the form's question order. The private
answer key, model labels, and response data are intentionally absent.

## Push from the VS Code terminal

The files are already prepared and committed locally. Run:

```bash
cd /mnt/scratch/vaibhav/spatiallang/cvpr-27-user-study
git push -u origin main
```

If VS Code prompts you to sign in to GitHub, complete its sign-in flow. This
repository must be **public** for an unauthenticated Google Apps Script fetch.
After pushing, confirm that this example displays an image in a private browser
window:

https://raw.githubusercontent.com/va1bhavagrawal/cvpr-27-user-study/main/images/01_vi_043.jpg

## Update the existing Google Form

Open [Google Apps Script](https://script.google.com/home/projects/create),
create a blank project, and paste `update_existing_form_from_github.gs` into
`Code.gs`. Replace `PASTE_FORM_EDIT_URL_HERE` with your existing form's URL
ending in `/edit`. The GitHub raw base URL is already filled in.

Run `updateBatch1`, then `updateBatch2` through `updateBatch6`, authorizing
Forms and external-request permissions when asked. Each batch fetches eight
images and replaces eight image items in the existing form. It checks the form
has 48 image items and 48 multiple-choice questions, and that the image titles
are in the expected order. It does not change questions or existing responses.

Google Forms stores a copy of each fetched image. If you change a GitHub image
later, rerun the corresponding batch to refresh the form.
