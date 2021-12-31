import cx from 'classnames';

import styles from './LoadingScreen.module.scss';

const ball = 'h-20 w-20 rounded-full bg-blue-800 mr-[6px]';

export const LoadingScreen = () => {
  return (
    <div
      className={cx(styles.LoadingScreen, 'relative h-screen w-screen opacity-0 bg-slate-200')}
    >
      <div className="flex absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2">
        <span className={cx(styles.Ball, ball)} />
        <span className={cx(styles.Ball, ball)} />
        <span className={cx(styles.Ball, ball)} />
      </div>
    </div>
  );
};
