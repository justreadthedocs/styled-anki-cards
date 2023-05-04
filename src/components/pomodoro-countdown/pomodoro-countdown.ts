import { WebComponent, css } from 'cwco';

class PomodoroCountdown extends WebComponent {
  static observedAttributes = ['time-in-seconds'];
  timeInSeconds: number;
  timeLeftInSeconds: number;
  countdownIntervalId: number;

  startCountdown() {
    const everySecond = 1000;
    this.countdownIntervalId = setInterval(
      this.updateCountdown.bind(this),
      everySecond
    );

    return () => {
      clearInterval(this.countdownIntervalId);
    };
  }

  updateCountdown() {
    if (this.timeLeftInSeconds === 0) {
      clearInterval(this.countdownIntervalId);
      return;
    }

    this.timeLeftInSeconds -= 1;
  }

  onMount() {
    this.timeLeftInSeconds = this.timeInSeconds || 25 * 60;

    this.startCountdown();
  }

  get stylesheet() {
    return css`
      .pomodoro-countdown {
        font-family: var(--font-family-sans-serif);
        font-size: 0.8em;
        color: var(--markdown-color-fg-subtle);
        text-shadow: var(--card-box-shadow);
        text-align: center;
        position: fixed;
        left: 0;
        bottom: 8px;
        right: 0;
        margin: 0 auto;
        width: min-content;
        padding: 0px 6px;
        border-radius: 8px;
        background-color: var(--markdown-color-border-muted);
      }
    `;
  }

  formatCountdown(timeLeftInSeconds: number) {
    const minutes: number = Math.floor(timeLeftInSeconds / 60);
    const seconds: number = timeLeftInSeconds % 60;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  get template() {
    return `
      <div class="pomodoro-countdown">
        {this.formatCountdown(timeLeftInSeconds)}
      </div>
    `;
  }
}

PomodoroCountdown.register();

export default PomodoroCountdown;
