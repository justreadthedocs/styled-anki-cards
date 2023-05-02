const front = `
  <style></style><script type="module" src="/src/bootstrap.ts"></script>

  note-type @@@ quiz-time
  ~~~
  template-side @@@ front
  ~~~
  field-front @@@ ### Hello, world?
  ~~~
  field-back @@@ Hello, \`world\`!<br><br>\`\`\`js<br>console.log('Hello, world!');<br>\`\`\`<br><br>$$V = \\frac{4}{3}\\pi r^3$$
  ~~~
  field-source @@@ [Source](https://www.google.com/)
  ~~~
  field-tags @@@ foo bar
`;

const back = `
  <style></style><script type="module" src="/src/bootstrap.ts"></script>

  note-type @@@ quiz-time
  ~~~
  template-side @@@ back
  ~~~
  field-front @@@ ### Hello, world?
  ~~~
  field-back @@@ Hello, \`world\`!<br><br>\`\`\`js<br>console.log('Hello, world!');<br>\`\`\`<br><br>$$V = \\frac{4}{3}\\pi r^3$$
  ~~~
  field-source @@@ [Source](https://www.google.com/)
  ~~~
  field-tags @@@ foo bar
`;

const templates = [front, back];
const templateContainer = document.querySelector('#qa')!;

let i = 0;
templateContainer.innerHTML = templates[i];

document.addEventListener('keydown', (event) => {
  if (!['ArrowRight', 'ArrowLeft'].includes(event.code)) {
    return;
  }

  if (event.code === 'ArrowRight') {
    i += 1;
  } else if (event.code === 'ArrowLeft') {
    i -= 1;
  }

  templateContainer.innerHTML = templates.at(i % templates.length)!;
});

const theme = sessionStorage.getItem('theme');
if (theme === 'dark') {
  toggleTheme();
}

const themeToggler = document.querySelector('.theme-toggler')!;
themeToggler.addEventListener('click', toggleTheme);

function toggleTheme() {
  const body = document.querySelector('body')!;
  const isCurrentThemeDark = body.classList.contains('nightMode');

  if (isCurrentThemeDark) {
    body.classList.remove('nightMode');
    sessionStorage.setItem('theme', 'light');
  } else {
    body.classList.add('nightMode');
    sessionStorage.setItem('theme', 'dark');
  }
}
