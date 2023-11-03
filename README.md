# Anki Cards with Style

## Why?

In short, to create beautiful and feature-rich [Anki](https://apps.ankiweb.net/) card components easily, which in turn improves learning experience. I believe customisation and putting your personal touch to the learning process is important.

## How?

By default, when Anki displays a question or an answer (Q/A) it simply `.innerHTML`s the container with the HTML template defined for the note type (see [source](https://github.com/ankitects/anki/blob/2bf134dc7286d4ba79c3e6042ca7b560cba67762/ts/reviewer/index.ts#L143)). Each `.innerHTML` completely destroys previous Q/A presentation and there is no way to establish a link in-between. Also, writing those templates is a horrible developer experience.

The idea behind this little project is to not pass presentation through the templates, but only data. For instance, instead of:

```
<div class=“front”>
  {{Front}}
</div>
<div class=“tags”>
  {{Tags}}
</div>
```

... the templates are written as:

```
<script type="text/javascript" src="__bootstrap-49f88746.js"></script>

note-type     @@@ Basic
~~~
template-side @@@ front
~~~
field-front   @@@ {{Front}}
~~~
field-tags    @@@ {{Tags}}
```

When Anki review session starts, the template above is rendered as it is, meaning the bootstrap script is executed. The script overwrites Anki's `.innerHTML`’s setter so that the above template can be intercepted, parsed into a data object, and then supplied as a set of attributes to some kind of a card component. As a result, when Q/As come and go, now it’s only the data which changes, but the card component instance stays the same and re-renders through the whole review session. This opens up an opportunity to integrate a wider range of interactive features, which works on both desktop and mobile.

In this project, as an example, the card component is a Web Component built with [CWCO](https://cwco.beforesemicolon.com/) just for fun. And it is programmed to render Markdown and KaTex.

## Getting started

Install NPM packages:

```sh
npm install
```

Run Anki review imitating web page for the component development purposes:

```sh
npm run dev
```

Build and deploy components to local Anki (requires [AnkiConnect](https://ankiweb.net/shared/info/2055492159) add-on):

```sh
npm run build
```

The command puts built scripts and assets into Anki's media collection directory, and modifies _all_ note types by updating the source of the bootstrap script.

## Demo

![demo-screenshot-1](https://github.com/justreadthedocs/styled-anki-cards/assets/110410228/65d1a972-99f5-4dae-8906-224699c53170)
![demo-screenshot-2](https://github.com/justreadthedocs/styled-anki-cards/assets/110410228/4727739a-b25d-4736-90cf-e68499530ef2)

### Animated

![demo-animation-looped](https://github.com/justreadthedocs/styled-anki-cards/assets/110410228/c592c805-ac2d-49f5-9146-7c4419830b4a)
