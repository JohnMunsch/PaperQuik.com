# Paperquik

I apparently started building the first version of PaperQuik some time around 2013-14! At that time I encountered a lot(!) of problems (SVG wouldn't print properly in any major browser so I had to make a huge image to print instead), I was using AngularJS/jQuery/Paper.js/Underscore.js/etc.

It looked dead for many years, but I kept it running on the server because I actually used myself regularly to print out sheets for whatever project or idea I happened to be working on at the time.

Fast forward to 2021 and the new version of same project uses only lit and page to do all the same work. I still use Bootstrap because I couldn't design my way out of a wet paper bag, but otherwise the code has gotten enormously simpler and should form the basis of something I can build on much more easily. Also, IE is finally dead so I don't have to care about that at all. Yay!

## Deploy to Raspberry Pi

npm run docker-build
npm run docker-push

http://ubuntu/paper

## To-Do

- Create location calculation code
- Build 'Cornell Note-Taking' layout
- Build 'To-Do List' layout
- Create a controls page for the dotted ruled lines renderer
- Add a modal w/ printing instructions for Firefox
- Add a modal w/ printing instructions for Safari
- Allow for double-sided pages
- Create a 'Test Page' layout for printer testing
- i18n and l10n
- Use https://github.com/IjzerenHein/kiwi.js to do layout based upon constraints
