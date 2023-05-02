import { WebComponent, html } from 'cwco';

import { TemplateSide } from '../../adapters/template';
import styles from './basic-card.css?inline';

class BasicCard extends WebComponent {
  static observedAttributes = [
    'template-side',
    'field-front',
    'field-back',
    'field-tags',
    'field-source',
  ];
  templateSide: TemplateSide;
  fieldFront: string;
  fieldBack: string;
  fieldSource: string;
  fieldTags: string;
  animatedExitBackSideCard: HTMLElement | null;

  get stylesheet() {
    return styles;
  }

  createAnimatedExitCard() {
    const cardRef = this.$refs.cardRef as HTMLElement;
    const cardRect = cardRef.getBoundingClientRect();

    const clonedCard = cardRef.cloneNode(true) as HTMLElement;
    clonedCard.classList.add('card--exits');
    clonedCard.style.setProperty('--exit-top', cardRect.top + 'px');
    clonedCard.style.setProperty('--exit-left', cardRect.left + 'px');
    clonedCard.style.setProperty('--exit-width', cardRect.width + 'px');
    clonedCard.style.setProperty('--exit-height', cardRect.height + 'px');
    cardRef.parentNode?.prepend(clonedCard);

    return clonedCard;
  }

  onUpdate(name: string, _oldValue: any, newValue: any): void {
    const frontSideDisplayed = name == 'templateSide' && newValue == 'front';
    const backSideDisplayed = name == 'templateSide' && newValue == 'back';

    if (frontSideDisplayed) {
      if (this.animatedExitBackSideCard) {
        const previousBackSideCard = this.animatedExitBackSideCard;
        previousBackSideCard.style.setProperty('opacity', '1');
        previousBackSideCard.classList.add('animate__scale-out-bottom');

        setTimeout(() => {
          previousBackSideCard.remove();
        }, 1000);

        this.animatedExitBackSideCard = null;
      }
    }

    if (backSideDisplayed) {
      this.animatedExitBackSideCard = this.createAnimatedExitCard();
    }
  }

  get template() {
    return html`
      <article
        ref="cardRef"
        class="card
          card--{templateSide}
          {templateSide === 'front' ? 'animate__scale-in-center' : ''}
          markdown-body"
      >
        <section
          if="fieldTags"
          class="field field--tags"
        >
          <span
            repeat="fieldTags.split(' ') as $tag; $key"
            class="tag
              {templateSide === 'front' ? 'animate__slide-in-top animate__delay-' + $key * 200 : ''}"
          >
            {$tag}
          </span>
        </section>
        <section
          markdown="fieldFront"
          class="field field--front {templateSide === 'back' ? 'animate__fade-out-03' : ''}"
        ></section>
        <section
          if="templateSide === 'back' && fieldBack"
          markdown="fieldBack"
          class="field field--back animate__puff-in-center"
        ></section>
        <section
          if="templateSide === 'back' && fieldSource"
          markdown="fieldSource"
          class="field field--source animate__slide-in-bottom"
        ></section>
      </article>
    `;
  }
}

const componentName = 'basic-card';
BasicCard.register(componentName);

export default BasicCard;
export type ComponentName = typeof componentName;
